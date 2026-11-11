# 技术栈拆解：GitHub 首页 HeroSection

> 记录时间：2026-11-11
> 目标：`class="HeroSection__R4eqX9"` 这一块
> 拆解方式：抓取 github.com 页面 + 快照 CSS + 无头浏览器钩住 WebGL 与 video

---

## 一、结论

**Hero 的视觉主体是一段被滚动驱动的视频**，不是实时 3D。

- 技术栈：React（服务端渲染）+ CSS Modules + 原生 `<video>`
- 页面其他地方确实有 WebGL 画布（着色器是 Three.js 风格），但**不属于 Hero**
- 所谓"随着滚动演进的 3D 演示"，本质是**预渲染视频 + `currentTime` 映射滚动位置**

---

## 二、证据

| 检查 | 结果 |
|---|---|
| 类名规律 | `HeroSection__R4eqX9`、`HeroSequence__ewvN7g` —— CSS Modules 的 `__hash` 命名 |
| Hero 内媒体 | `<video src="hero-light-*.mp4" muted playsInline preload="metadata">` |
| 视频规格 | 1600×1078，时长 37.7 秒，不循环，初始暂停 |
| 滚动 0px | `currentTime = 0` |
| 滚动 700px | `currentTime = 2.00` |
| 滚动 1400px | `currentTime = 4.01` |
| 页面 WebGL | 2 个小型画布（175×175、300×150），着色器前缀是 Three.js 特征 |

**视频时长与滚动的关系**：约每滚动 **350px 前进 1 秒**视频。

---

## 三、DOM 结构

```html
<div class="HeroSection__R4eqX9">
  <div class="Hero__ZQ19CN">
    <h2 class="visually-hidden">Product walkthrough</h2>

    <div class="HeroSequence__ewvN7g">
      <div class="Product__njOtv1">
        <div class="Wrapper__H1gdC8 Background__x8lac6"></div>

        <div class="Content__TWy-bF" data-media-position="center-left">
          <div class="Product__media__VHmtFH"
               data-animate-in="true"
               data-enter-from="right">
            <div class="ProductUI__DOCoNw ProductUI--green__9X_S5f">
              <div class="ProductUI__surface__5q9O3d">
                <div class="HeroSequence__content___kTisr">
                  <video class="HeroSequence__video__zxC1BE" …></video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="HeroPagination__H5tR7v"></div>
  </div>
</div>
```

关键点：

- `data-enter-from="right"`、`data-animate-in` —— 入场动画靠 data 属性驱动，样式在 CSS 里
- `ProductUI__surface` —— 视频被套进一个"产品界面"外壳里，看起来像在演示软件，而不是播宣传片
- `HeroPagination` —— 底部有章节指示点，说明视频被切成多个段落

---

## 四、滚动驱动是怎么做的

JS 里能直接看到同步逻辑（`landing-pages-*.js`）：

```js
const state = videoRef?.getState();

// 滚动进度 → 视频时间
const t = state.currentTime - offset;
videoEl.currentTime = 1000 * Math.max(0, Math.min(t, duration));

// 播放与暂停
if (!reducedMotion && (state.isPlaying ?? !paused)) videoEl.play();
else videoEl.pause();

// 状态回报
onChange({ currentTime, isPaused, isPlaying, isFinished: video.ended });
```

配合的浏览器 API：

| API | 用途 |
|---|---|
| `IntersectionObserver` | 进入视口才加载/播放，离开暂停 |
| `requestAnimationFrame` | 平滑插值，避免 `scroll` 事件抖动 |
| `seeked` / `waiting` / `stalled` | 判断是否卡顿，防止连续 seek 堆积 |

`seeking` 频繁时浏览器会丢帧，所以这类实现必须**限流 + 等 `seeked`**，不能每个 scroll 事件都写 `currentTime`。

---

## 五、CSS 里值得看的部分

```css
.HeroSequence__ewvN7g{
  --heroMediaWidth: 34rem;
  inline-size: 100%;
  min-block-size: calc(var(--heroMediaWidth) * 1078 / 1600 + var(--base-size-16));
  container-type: inline-size;         /* 容器查询 */
}

.HeroSequence__content___kTisr{
  /* 小屏用固定宽度，大屏用容器宽度的 100cqw */
  inline-size: calc(min(100cqw - var(--base-size-64), 71.25rem) - var(--brand-borderWidth-thin) * 2);
}

.HeroSequence__video__zxC1BE{
  aspect-ratio: 1600 / 1078;           /* 先占位，避免加载时跳动 */
  width: 100%;
  height: auto;
  display: block;
}

.CanvasPosition__hGPSwO{ --reveal-progress: 1; }
```

三个手法：

1. **`aspect-ratio` 预留空间** —— 视频没加载完也不会把页面撑跳
2. **容器查询 `100cqw`** —— 组件自适应父容器，不依赖媒体查询
3. **CSS 变量 `--reveal-progress`** —— 用变量驱动遮罩/位移，JS 只改变量

---

## 六、页面里的 WebGL 是什么

钩住 `canvas.getContext` 后看到：

```
webgl  ✔
webgl2 ✔
画布尺寸：175×175、300×150、300×150
着色器前缀：#version 300 es … #define SHADER_NAME ShaderMaterial …
           #define MONA_COLOR_BLACK …
```

这是 **Three.js 的 WebGLProgram 输出特征**（`ShaderMaterial`、`gl_FragDepthEXT`、`pc_fragColor` 这些宏都是 Three 加的；`MONA_*` 是 GitHub 自己加的宏）。

但没有暴露全局 `THREE`——打进了 bundle 并被 tree-shake。

**它管的是页面上的小型装饰画布（渐变/图形），不是 Hero。** Hero 里没有任何 Three.js。

---

## 七、为什么这么做

| 方案 | 优点 | 缺点 |
|---|---|---|
| 实时 3D（Three.js） | 可交互、任意视角、文件小 | 低端机掉帧、首屏重、跨设备一致性差 |
| **预渲染视频（GitHub 选择）** | 观感稳定、实现简单、可控 | 文件大（几十秒 1080p）、移动端流量高、不能真交互 |
| CSS 动画 / Canvas 2D | 极轻 | 做不出真实 3D 产品演示 |

GitHub 的取舍是对的：他们要的是**精确可控的产品演示**，不是可探索的 3D 场景。视频能保证每个用户在每台设备上看到的画面与设计稿完全一致。

---

## 八、可借鉴的部分

| 点 | 怎么用 |
|---|---|
| `aspect-ratio` 占位 | 任何图片/视频/嵌入内容都值得先占好空间 |
| 滚动映射 `currentTime` | 想做"随滚动演进的演示"时，视频比 3D 便宜一个量级 |
| `--reveal-progress` 变量驱动 | JS 只改变量，动画交给 CSS |
| `IntersectionObserver` 控制播放 | 省流量、省电、避免后台播放 |
| 视频套进"产品界面"外壳 | 比裸播视频更有说服力 |
| `prefers-reduced-motion` 降级 | 这是无障碍要求，不是可选项 |

## 九、不适合搬到本站的部分

- 37 秒 1080p 视频 ≈ 数 MB，对个人博客首屏不划算
- 滚动劫持式体验在小篇幅页面上会让人失去方向感
- 本站的价值在**阅读**，不在演示产品

**如果将来要做**：一条 4~6 秒、500KB 以内的静音循环片段，或者纯 CSS 的入场动画就够。

---

## 十、补充：像素网格背景（2026-11-11 复测）

后续复测时发现 Hero 背景还有一层和视频无关的东西，补记如下。

### 1. Hero 背景是 inline SVG，不是 canvas

对应元素：`class="Wrapper__H1gdC8 Background__x8lac6"`，里面是一个 `<svg>`：

```html
<svg preserveAspectRatio="none" viewBox="0 0 143 84" width="1424" height="836">
  <defs>
    <pattern id="background-grid-pattern-*" width="1" height="1" patternUnits="userSpaceOnUse">
      <path d="M 1 0 H 0 V 1" stroke="var(--brand-color-border-subtle)"/>
    </pattern>
    <linearGradient id="background-grid-gradient-*" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0"   stop-color="var(--brand-color-canvas-subtle)" stop-opacity="1"/>
      <stop offset="0.5" stop-color="var(--brand-color-canvas-subtle)" stop-opacity="0"/>
      <stop offset="1"   stop-color="var(--brand-color-canvas-subtle)" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect fill="var(--brand-color-canvas-subtle)" width="143" height="84"/>
  <rect fill="url(#background-grid-pattern-*)" width="143" height="84"/>
  <path class="GridLine__RRlPv3" d="M 143 0 V 84 H 0" stroke="var(--brand-color-border-subtle)"/>
  <rect fill="url(#background-grid-gradient-*)" width="143" height="84"/>

  <g class="CornerDots___WcNtA" data-animate="true" transform="translate(2 2)">
    <rect class="CornerDot__Za9opk" data-static="true"  width="1" height="1" fill="var(--base-color-scale-green-4)" style="--corner-dot-index: 0;"/>
    <!-- …共 8 个，每个 1×1 单位 -->
  </g>
</svg>
```

**关键点：坐标系只有 143×84，靠 `preserveAspectRatio="none"` 拉伸到 1424×836。**
所以 1 个 SVG 单位 ≈ 屏幕 10px，那个 1×1 的 `pattern` 就变成了 10px 的方格——这就是"像素网格"的来源。

- 网格线是 1 单位的 `path`，用极淡的边框色
- 顶部叠一层从实到透明的渐变，让网格往下淡出
- 角落 8 个 `CornerDot` 是 1×1 的彩色方块，动画 `corner-dot-chase`，1.4s 无限循环

### 2. 页面上另一处：200 格像素网格

`MonaDivider` 区块里有一组 `Grid__6hdsPh`，`--column-count:25; --row-count:8`，共 **200 个 `<span class="Cell__TqfqAY">`**。

每个格子用内联变量声明：

```html
<span class="Cell__TqfqAY" style="
  --default-color:#a7bbad; --default-opacity:0;
  --focus-color:#08872B;   --focus-opacity:0.7;
  --delay-color:1.068s">
```

```css
.Cell__TqfqAY:before{ background-color:var(--default-color); opacity:var(--default-opacity) }
.Cell__TqfqAY:after { background-color:var(--focus-color); opacity:0;
                      transition:opacity var(--duration) var(--base-easing-easeOut);
                      transition-delay:var(--delay-color) }
```

**每个格子有独立的 `--delay-color`（约 1.0–1.3 秒随机分布）**，所以一旦触发，颜色是逐格错峰亮起的——这就是"波"的来源。颜色取自 GitHub 品牌色（绿 `#08872B`、亮绿 `#23EA57`、紫 `#C898FD`）。

### 3. 拖尾像素（已确认）

鼠标划过 Hero 时**追加临时 `<rect>`**，不是 `:hover`，所以只出现一次拖尾、不会持续。

```html
<g class="Trail__w_GPlK">
  <rect class="TrailPixel__sCD4Qw" width="1" height="1" x="102" y="59" fill="#5FED83"/>
  <rect class="TrailPixel__sCD4Qw TrailPixelExiting__g5b0a8" width="1" height="1" x="97" y="61" fill="#…"/>
  …
</g>
```

- 坐标就在上面那个 **143×84 的坐标系**里，所以每颗粒子天然是 10px 的方块
- `width` / `height` 恒为 1，位置靠 `x` / `y` 换格
- 颜色取品牌色板（实测到 `#5FED83` 等绿系）

CSS 只有两条规则：

```css
.TrailPixel__sCD4Qw{
  transform-box: fill-box;
  transform-origin: 50%;
  transform: scale(1);
  transition: transform .5s cubic-bezier(.3, .41, .04, 1.01);
}
.TrailPixelExiting__g5b0a8{
  transform: scale(0);   /* 加上这个类，0.5 秒缩没 */
}
```

生命周期：

1. 指针移动 → 屏幕坐标换算成网格坐标
2. 插入一个 1×1 `<rect>`，随机取品牌色
3. 下一次 tick 给同一元素加 `TrailPixelExiting`
4. `scale(1) → scale(0)` 过渡 0.5s，结束后移除节点

实测鼠标横穿一次时，同时存在的粒子只有 6 个，其中 3 个正在退出——说明**生成是节流的**，不是每个 `pointermove` 都插入。

**为什么用 SVG 而不是 canvas**：每个像素可以交给 CSS transition 补间，浏览器负责调度；换成 canvas 就得手写缓动、清除和 rAF 循环。

### 4. 复现要点（约 40 行）

```
一个 viewBox 143×84、preserveAspectRatio="none" 的 SVG
├─ pointermove：屏幕坐标 → 网格坐标（取整）
│    节流 ~30ms，避免每个事件都生成
├─ 插入 <rect x y width=1 height=1 fill=随机色 class="trail">
└─ 下一帧加 class="exit" → CSS transition scale(1 → 0)，0.5s
      transitionend 时移除节点
```

不需要任何 3D 库，也不需要 canvas。
