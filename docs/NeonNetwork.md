# NeonNetwork 复刻 Prompt

请在 React + TypeScript 项目中实现一个可复用的 `NeonNetwork` 组件（风格接近 shadcn/ui：可直接复制组件文件到任意项目使用），并满足以下完整规格。目标是还原一个深色科技风的“中心节点 + 八方向节点 + 连线流光填充”动效组件。

## 1. 组件结构与视觉布局

- 组件名：`NeonNetwork`，文件拆分为：
  - `src/components/NeonNetwork.tsx`
  - `src/components/NeonNetwork.css`
- 外层容器为一个 2:1 的横向舞台，深色背景，中心有发光卡片，四周分布 8 个小方块节点：
  - 上、下、左、右、左上、右上、左下、右下
- 中心卡片内放一个简洁几何 logo（可用 3 条折线表示堆叠图形）。
- 每个外围节点是圆角方块，内部有一个紫色小圆点，可轻微呼吸。
- 中心与外围节点之间有 8 条连线（SVG 路径），连线终点必须停在中心卡片外缘，不能穿透到中心内部。

## 2. 动画行为（重点）

- 动画不是“单段高亮在循环跑”，而是“从 0 到 100 的填充式流光”：
  - 线条初始未填充（`stroke-dashoffset: 100`）。
  - 启动后从起点到终点逐步被紫色点亮（`stroke-dashoffset: 100 -> 0`）。
  - 填充完成后保持高亮状态。
- 连线方向必须是“外围节点 -> 中心节点”。
- 动画为一次性触发，不依赖 hover。
- 组件下方只有一个按钮：
  - 初始文案 `Start`（可配置）。
  - 播放完成后文案切换为 `Restart`（可配置）。
  - 点击按钮后从头播放一轮动画。

## 3. 可配置 API（必须支持）

为组件提供以下 `props`（含合理默认值）：

- `className?: string`
- `showControls?: boolean`（是否显示按钮）
- `autoStart?: boolean`（挂载后自动播放）
- `startLabel?: string`
- `restartLabel?: string`
- `fillDurationMs?: number`（主线填充时长）
- `glowDurationMs?: number`（外层 glow 填充时长）
- `maxWidth?: number | string`
- `onComplete?: () => void`
- `colors?: Partial<{ ... }>`，至少包含：
  - `lineBase`
  - `lineGlow`
  - `lineCore`
  - `nodeDot`
  - `nodeDotHighlight`
  - `coreBorder`
  - `logo`
  - `buttonBg`
  - `buttonBorder`
  - `buttonText`

要求通过 CSS Variables 将 `props` 注入样式，确保该组件拷贝到其他项目时无需改 CSS 即可换主题、换速度。

## 4. 实现建议（技术细节）

- 使用 React 函数组件 + `useState` + `useEffect`。
- 使用 SVG `path` 渲染连线，并给动画线设置 `pathLength={100}`，便于统一 dash 逻辑。
- 动画线（glow/core）建议使用：
  - `stroke-dasharray: 100`
  - `stroke-dashoffset: 100`
  - `@keyframes line-fill { from {100} to {0} }`
  - `animation-fill-mode: forwards`
- 为避免线帽越界进入中心，动画线建议 `stroke-linecap: butt`。
- 提供 `prefers-reduced-motion` 降级。

## 5. 验收标准

- 视觉上是深色霓虹科技风，中心发光明显，外围节点分布均匀。
- 点击按钮后，8 条线同步执行“从外围到中心”的填充动画。
- 线条不会穿进中心 logo 区域。
- 支持通过 props 改颜色和时长，并即时生效。
- 组件可以复制到另一个 React 项目直接运行（仅依赖 React，无第三方动画库）。

## 6. 示例用法（期望可运行）

```tsx
<NeonNetwork
  startLabel="开始"
  restartLabel="重新开始"
  fillDurationMs={2200}
  glowDurationMs={2400}
  maxWidth={960}
  colors={{
    lineCore: '#c63dff',
    lineGlow: 'rgba(190, 96, 255, 0.42)',
    nodeDotHighlight: '#dd6dff',
    buttonBg: 'rgba(34, 18, 49, 0.88)',
  }}
/>
```

