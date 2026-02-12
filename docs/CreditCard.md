# CreditCard 复刻 Prompt

请在 React + TypeScript 项目中实现一个可复用的 `CreditCard` 组件（风格类似 shadcn/ui，复制组件文件到任意项目即可使用，不依赖第三方动画库），组件需要渲染一张银灰色银行卡并支持完整交互：默认显示正面（卡号、CARDHOLDER、EXPIRES），鼠标移动时整张卡产生 3D 倾斜与视差高光（通过 `requestAnimationFrame` 平滑插值更新 `rotateX/rotateY` 和 glare 光斑坐标），鼠标离开后回弹到初始状态；点击卡片后执行真实 3D 翻面动画（沿 Y 轴翻到薄边再看到背面，不是淡入淡出切换），背面包含顶部黑色磁条和左下 CVV 区块；再次点击翻回正面；需支持键盘可访问性（Enter/Space 触发翻转）；组件 API 至少包含 `className`、`cardNumber`、`cardholder`、`expires`、`cvv`、`maxTilt`、`width`、`flipDurationMs`、`clickToFlip`、`defaultFlipped`、`flipped`、`onFlippedChange`、`colors`（可覆盖正反面渐变、文字、边框、磁条、CVV、高光颜色）；使用 CSS Variables 注入可配置项；实现 `flipped` 受控/非受控双模式；包含 `prefers-reduced-motion` 降级；最终文件拆分为 `src/components/ui/credit-card.tsx` 与 `src/components/ui/credit-card.css`，并导出 `CreditCard` 组件与类型定义，保证复制到其他项目后直接 `import { CreditCard }` 即可运行。

## 像 shadcn 一样复用

- 复制以下文件到你的项目：
  - `src/components/ui/credit-card.tsx`
  - `src/components/ui/credit-card.css`
- 然后在页面中直接使用：

```tsx
import { CreditCard } from '@/components/ui/credit-card'

export default function Demo() {
  return (
    <CreditCard
      cardNumber="1234 5678 9012 3456"
      cardholder="JOHN DOE"
      expires="12/25"
      cvv="123"
      width={480}
      maxTilt={14}
      flipDurationMs={520}
      colors={{
        frontFrom: '#dedede',
        frontMiddle: '#d9d9d9',
        frontTo: '#e8e8e8',
      }}
    />
  )
}
```

## 本项目组件位置

- 主实现：`src/components/ui/credit-card.tsx`
- 样式：`src/components/ui/credit-card.css`
- 兼容导出：`src/components/CreditCard.tsx`
