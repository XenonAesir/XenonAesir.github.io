# 技术栈拆解：innuno.ai 的粒子背景

> 记录时间：2026-11-10
> 拆解方式：抓取页面 + 下载全部 JS chunk + 无头浏览器钩住 `canvas.getContext`

---

## 一、结论

**没有 Three.js，也没有 WebGL。** 是 Next.js（Turbopack 打包）+ React + 一个手写的 **2D canvas 粒子系统**。

"3D"是错觉，靠每颗粒子的尺寸和透明度差异伪装出来的深度。

---

## 二、证据

| 检查 | 结果 |
|---|---|
| 框架标记 | 25 处 `/_next/`，Turbopack chunk 命名 |
| 页面上 canvas 数量 | 1 个：`<canvas id="field" aria-hidden="true">`，1424×805 |
| 请求的上下文类型 | 只有 `2d` |
| JS 中 `WebGLRenderer` / `ShaderMaterial` / `BufferGeometry` | 全部 0 命中 |

---

## 三、实现拆解

### 1. 两层结构

```css
.depth {
  position: fixed; inset: 0;
  pointer-events: none;
  background: radial-gradient(110% 85% at 68% 34%, #141b2b 0%, #0d121d 46%, #090c14 100%);
}
#field {
  position: fixed; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  display: block;
}
```

背景其实是一层**静态径向渐变**，粒子 canvas 叠在上面。所谓"氛围感"有一半来自这个渐变。

### 2. 2600 颗粒子，TypedArray 存储

```js
new Float32Array(2600)  // × 10 组：位置、速度、目标、尺寸、透明度、亮度…
```

结构体数组（SoA）布局，避免每帧分配对象——这是手写粒子系统和大库的关键差距。

### 3. 粒子位置来自图形遮罩，不是随机撒

```js
const off = document.createElement("canvas");
const ctx = off.getContext("2d");
ctx.fill(new Path2D(shape));                       // 把图形画到离屏画布
const data = ctx.getImageData(0, 0, w, h).data;    // 读像素
if (data[i + 3] > 140) points.push(x / w, y / h);  // 只取不透明的点
```

先从遮罩里收集所有不透明像素，再从中随机取 2600 个作为初始位置。所以粒子能组成特定形状，而不是一团噪声。

### 4. 随机数是带种子的

```js
function mulberry32(seed) {
  return () => {
    seed |= 0;
    let t = Math.imul(seed = seed + 0x6d2b79f5 | 0, seed >>> 15 | 1);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(0x134b101);
```

加上 Box-Muller 做高斯分布：

```js
const gauss = () => Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * Math.PI * rnd());
```

种子固定 → 每次刷新画面完全一致，不会"跳一下"。

### 5. 每帧：阻尼缓动 + 鼠标排斥

```js
const k = 1 - Math.pow(1 - a, dt / 16.7);   // dt 归一化到 60fps
x += (targetX - x) * k;
y += (targetY - y) * k;

// 鼠标 92px 半径内推开
if (distSq < 92 * 92) {
  const n = Math.sqrt(distSq) || 1;
  x += (x - mouseX) / n * (1 - n / 92) * strength;
}
```

`dt / 16.7` 让 144Hz 屏幕上的速度和高刷一致。

### 6. 绘制：8 个透明度档位批量画方块

```js
ctx.globalAlpha = (bucket + 0.6) / 8 * 0.92;
ctx.fillRect(x - size / 2, y - size / 2, size, size);
```

- 每颗粒子先算亮度，再分到 8 个桶里批次绘制，减少 `globalAlpha` 切换
- 主色 `#C9D2E1`，少量高亮粒子 `#6E8BFF`
- 画的是**方形**不是圆，`arc` 只在"lattice"模式里用来画连线

### 7. 交互与降级

| 能力 | 实现 |
|---|---|
| 鼠标移动 | `pointermove`，排斥 + 拖尾（最多 9 个拖尾点） |
| 滚动 | 监听 `scroll`，`data-state` 属性驱动粒子形态切换 |
| 减少动态 | `matchMedia("(prefers-reduced-motion: reduce)")` → 冻结 |
| 失焦 | `mouseleave` / `blur` 取消交互状态 |
| 缩放 | `resize` 重建尺寸 |

---

## 四、可借鉴的部分

| 点 | 为什么好 |
|---|---|
| TypedArray + SoA | 2600 颗粒子零 GC 压力 |
|  seeding | 画面稳定，不会每次刷新换一副样子 |
| 遮罩采样 | 用一个图形定义粒子分布，改图形就改效果 |
| 亮度分桶 | 减少 canvas 状态切换，这是 2D 绘制的性能关键 |
| `prefers-reduced-motion` | 无障碍，也是低端设备的保险 |

## 五、不适合直接搬的部分

- 满屏 2600 颗粒子和本站「留白 + 衬线」的语言冲突
- 纯 2D `fillRect` 在大屏上是 CPU 负载，低端机会掉帧
- 这套效果的价值在"密度 + 动态"，稀疏之后就没意义了

**如果要做，最小的版本是**：60~120 个点、单色、无鼠标交互、随滚动缓慢漂移，作为背景层点缀。

---

## 十、滚动驱动的形态切换（2026-11-11 补充）

下滑时粒子会重新组合成不同图形，机制是**内容块声明形态，粒子系统跟着切换**。

### 每个区块带一个 `data-state`

抓取三个页面后统计到的状态名：

| 页面 | data-state |
|---|---|
| `/en` | `logo` `lattice` `venn` `chladni` `stream` `drift` `loop` `signal` |
| `/en/physical` | `chladni` `collapse` `horizon` `real` `search` `stream` `tune` `venn` |
| `/en/digital` | `drift` `lattice` `signal`（带 `data-v="1|2"` 做变体） |

另有 `data-layout="stage|corner"` 控制粒子的整体落位区域。

### 切换方式

代码里可见的两条链路：

```js
// 滚动时选出视口中线所在的区块
onLoopStage: (state, block) => {...}   // 记录当前 stage
setBlock(el) / setState(state, v, layout)

// 粒子每帧向"当前状态对应的目标点"缓动
onPhysStep / onPhysRead / onPhysClear
```

关键实现细节（从压缩代码还原）：

- 目标点由**若干套预计算的坐标集合**给出，切换状态 = 换目标集合
- 每颗粒子有独立的 `delay` 与 `stiffness` 数组，所以换形态是**错峰流动**，不是整体平移
- 缓动公式 `x += (target - x) * (1 - (1 - a)^(dt/16.7))`，与帧率无关
- 形态本身多用数学/遮罩生成：`chladni` 是驻波节线、`lattice` 是网格、`venn` 是两个圆

### 在测试页里的复现

`playground/tech-demos.html` 第三块按同一机制实现：6 个 `data-state` 区块 + sticky canvas + 每颗粒子独立延迟。为了不依赖任何库，形态用文字遮罩和几行数学公式生成。
