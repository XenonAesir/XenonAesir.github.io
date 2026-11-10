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
