# CylindricalTextReveal

一个可复用的滚动触发 3D 文本组件，视觉上让多行大写粗体文字像贴在同一根竖直圆柱表面。页面开始时只显示 `Scroll Down` 提示，向下滚动到阈值后，文字从屏幕下方和镜头前方浮现，随后按圆柱角度连续滚动：每一行都有不同 `angle`，通过 `sin/cos` 计算 `y/z`，并同步 `rotationX`、`scale`、`blur`、`opacity`，形成“前凸 -> 贴面 -> 向上翻远”的透视变化。动画由 `GSAP + ScrollTrigger` 的 `scrub` 驱动，滚动进度直接映射到圆柱滚动角。组件支持自定义行文案、圆柱半径、行间角度步进、出现区间、滚动角区间、透视强度、粘性顶部偏移和区段高度，适合直接拷贝到其他 React + TS 项目中使用。

## 依赖

- `react`
- `gsap`

安装：

```bash
pnpm add gsap
```

## 可复制文件

- `src/components/ui/cylindrical-text-reveal.tsx`
- `src/components/ui/cylindrical-text-reveal.css`

## 使用方式

```tsx
import CylindricalTextReveal from '@/components/ui/cylindrical-text-reveal'

export default function DemoPage() {
  return (
    <CylindricalTextReveal
      lines={['EXPLORE', 'THE', 'FUTURE', 'OF', 'DESIGN']}
      stickyTopOffset="72px"
      sectionMinHeight="240vh"
    />
  )
}
```

## Props

- `lines?: string[]` 文案行数组，默认 `['EXPLORE', 'THE', 'FUTURE', 'OF', 'DESIGN']`
- `hintText?: string` 提示文字，默认 `Scroll Down`
- `hintArrow?: string` 提示箭头，默认 `↓`
- `showHint?: boolean` 是否显示提示
- `className?: string` 根容器额外类名
- `background?: string` 背景色，默认 `#000`
- `stickyTopOffset?: string` sticky 顶部偏移（如 `72px` 或 `var(--header-height)`）
- `sectionMinHeight?: string` 滚动区高度（如 `240vh`）
- `perspective?: number` 透视深度
- `radius?: number` 圆柱半径
- `angleStep?: number` 每行之间角度步进（越小越紧凑）
- `revealStart?: number` 开始出现滚动进度阈值（0~1）
- `revealEnd?: number` 完成出现滚动进度阈值（0~1）
- `rollStartAngle?: number` 滚动起始角（弧度）
- `rollEndAngle?: number` 滚动结束角（弧度）
- `scrub?: number` ScrollTrigger 的 scrub 阻尼

## 给其他 Coding Agent 的 Prompt（可直接复制）

请实现一个 React + TypeScript 的 `CylindricalTextReveal` 组件，并使用 `GSAP + ScrollTrigger` 完成滚动驱动动画。组件是一个全黑背景的长滚动 section，内部是 sticky 全屏舞台。初始只显示 “Scroll Down” 提示；当滚动进度超过阈值后，5 行超大粗体英文文字开始出现。核心视觉是“文字贴在同一个竖直圆柱体表面并随滚动转动”：对每一行计算 `baseAngle = (index - center) * angleStep`，再加上随滚动变化的 `rollAngle`，然后用 `y = sin(angle) * radius`、`z = cos(angle) * radius - depthOffset`、`rotationX = -angle` 驱动 transform；再根据 z 深度推导 `opacity/scale/blur`，让前侧更清晰更大、背侧更淡更小。动画必须由 ScrollTrigger 的 `onUpdate` 使用滚动 progress 实时计算，不要做一次性入场 tween。组件需支持可配置 props：`lines`、`stickyTopOffset`、`sectionMinHeight`、`radius`、`angleStep`、`revealStart/revealEnd`、`rollStartAngle/rollEndAngle`、`perspective`、`scrub`、`hintText`、`showHint`。要求包含 reduced motion 兜底、清理 GSAP 上下文、防止内存泄漏，并拆成 `tsx + css` 两个文件，保证可直接复制到其他项目使用。
