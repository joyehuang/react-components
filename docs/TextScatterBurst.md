# TextScatterBurst 复用说明与生成 Prompt

`TextScatterBurst` 是一个可直接复制到其他 React + TypeScript 项目使用的交互组件：文本默认显示为完整句子，指针扫过某个字母时该字母会按指针方向飞散，停留一段时间后自动回弹复原；每个字母独立触发，支持速度、半径、停留时长、飞散距离与颜色等参数配置。

## 1. 像 shadcn/ui 一样跨项目复用

把以下两个文件复制到目标项目：

- `src/components/TextScatterBurst.tsx`
- `src/components/TextScatterBurst.css`

在目标项目中使用：

```tsx
import TextScatterBurst from '@/components/TextScatterBurst'
import '@/components/TextScatterBurst.css'

export default function DemoPage() {
  return (
    <TextScatterBurst
      text="Bounce Back."
      minHeight="68vh"
      maxWidth={980}
      triggerRadius={84}
      scatterHoldMs={1200}
      targetScatterDistance={320}
      spring={0.06}
      damping={0.86}
      explodeLerp={0.12}
      color="#f7f7f7"
      hoverColor="#ffffff"
    />
  )
}
```

## 2. Props 概览

- `text?: string` 文案，默认 `Bounce Back.`
- `className?: string` 根容器类名
- `stageClassName?: string` 内层舞台类名
- `minHeight?: number | string` 根容器最小高度，默认 `72vh`
- `maxWidth?: number | string` 舞台最大宽度，默认 `1020`
- `color?: string` 字体颜色
- `hoverColor?: string` 悬停时字体颜色
- `triggerRadius?: number` 字母触发半径
- `scatterHoldMs?: number` 飞散后停留时间（毫秒）
- `targetScatterDistance?: number` 飞散目标距离
- `spring?: number` 回弹弹簧强度
- `damping?: number` 阻尼系数
- `explodeLerp?: number` 爆散插值速度
- `stagePadding?: number` 飞散边界安全内边距
- `pointerSpeedFallback?: number` 指针速度方向阈值

## 3. 可直接给其他 Coding Agent 的 Prompt

请在 React + TypeScript 项目中实现一个可复用的 `TextScatterBurst` 组件，风格和交付方式参考 shadcn/ui（可直接复制组件文件到其他项目使用，不依赖第三方动画库）。组件包含两份文件：`TextScatterBurst.tsx` 与 `TextScatterBurst.css`。交互要求：文本默认完整显示；当鼠标/触控指针扫过某个字母时，仅该字母触发飞散动画，飞散方向由“当前指针移动方向”决定；如果当前帧指针速度过小，则回退为“从指针到字母”的方向；字母飞散后保持一小段时间（可配置）再自动回弹复原；所有字母独立触发，互不影响。动画采用 `requestAnimationFrame` 驱动，建议为每个字母维护状态（原始位置、当前位置、速度、飞散向量、触发状态、结束时间），并使用弹簧 + 阻尼实现平滑运动。飞散目标必须限制在组件舞台边界内（带 padding），保证字母不会飞出可视区域。实现 `prefers-reduced-motion` 降级。组件 Props 需至少支持：`text`、`className`、`stageClassName`、`minHeight`、`maxWidth`、`color`、`hoverColor`、`triggerRadius`、`scatterHoldMs`、`targetScatterDistance`、`spring`、`damping`、`explodeLerp`、`stagePadding`、`pointerSpeedFallback`。样式层使用 CSS Variables 接收可配置参数，默认黑色背景、大号粗体白字、逐字 transform 动画。最终需给出可运行的使用示例，并确保组件复制到任意 React + TS 项目后即可工作。
