import CreditCard from '../components/CreditCard'
import NeonNetwork from '../components/NeonNetwork'
import SimpleGraph from '../components/SimpleGraph'
import TextScatter from '../components/TextScatter'
import TextScatterBurst from '../components/TextScatterBurst'
import CylindricalTextReveal from '../components/ui/cylindrical-text-reveal'
import type { ComponentCategory, ComponentMeta } from './types'

const renderCreditCardPreview = () => (
  <CreditCard
    cardNumber="1234 5678 9012 3456"
    cardholder="JOHN DOE"
    expires="12/25"
    cvv="123"
    width={500}
    maxTilt={14}
    flipDurationMs={520}
  />
)

const renderNeonNetworkPreview = () => (
  <NeonNetwork
    startLabel="Start"
    restartLabel="Restart"
    fillDurationMs={2100}
    colors={{
      lineCore: '#ca47ff',
      lineGlow: 'rgba(196, 94, 255, 0.42)',
      nodeDotHighlight: '#dc6bff',
    }}
  />
)

const renderSimpleGraphPreview = () => (
  <SimpleGraph
    points={[
      { id: 'jan', label: 'Jan', value: 48.5 },
      { id: 'feb', label: 'Feb', value: -42.8, displayValue: '-42.8%' },
      { id: 'mar', label: 'Mar', value: 67.2 },
      { id: 'apr', label: 'Apr', value: 29.6 },
      { id: 'may', label: 'May', value: 73.4 },
      { id: 'jun', label: 'Jun', value: 90.1 },
    ]}
    maxWidth={860}
    height={392}
    animationDurationMs={1550}
    colors={{
      line: '#b49fff',
      lineGlow: 'rgba(180, 159, 255, 0.44)',
      pointActive: '#bcaeff',
      tooltipNegative: '#ff6a6a',
    }}
  />
)

const renderCylindricalTextPreview = () => (
  <CylindricalTextReveal
    lines={['EXPLORE', 'THE', 'FUTURE', 'OF', 'DESIGN']}
    hintArrow="v"
    stickyTopOffset="var(--app-header-height, 64px)"
    sectionMinHeight="200vh"
  />
)

const renderTextScatterPreview = () => <TextScatter />

const renderTextScatterBurstPreview = () => (
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

export const componentRegistry: ComponentMeta[] = [
  {
    slug: 'credit-card',
    name: 'Credit Card',
    summary: 'Interactive 3D bank card with tilt, glare, keyboard support, and controlled flip mode.',
    category: 'Cards',
    status: 'stable',
    tags: ['3d', 'card', 'interactive'],
    previewTheme: 'dark',
    renderPreview: renderCreditCardPreview,
    importStatement: "import { CreditCard } from '@/components/ui/credit-card'",
    exampleCode: `<CreditCard
  cardNumber="1234 5678 9012 3456"
  cardholder="JOHN DOE"
  expires="12/25"
  cvv="123"
  width={480}
/>`,
    files: ['src/components/ui/credit-card.tsx', 'src/components/ui/credit-card.css'],
    installNotes: [
      'Copy both files into your project under src/components/ui.',
      'Use the named export CreditCard for direct reuse.',
    ],
    props: [
      { name: 'cardNumber', type: 'string', defaultValue: '1234 5678 9012 3456', description: 'Card number text.' },
      { name: 'cardholder', type: 'string', defaultValue: 'JOHN DOE', description: 'Cardholder text on the front face.' },
      { name: 'expires', type: 'string', defaultValue: '12/25', description: 'Expiration date label.' },
      { name: 'cvv', type: 'string', defaultValue: '123', description: 'CVV number on the back face.' },
      { name: 'maxTilt', type: 'number', defaultValue: '14', description: 'Maximum pointer tilt amount in degrees.' },
      { name: 'width', type: 'number | string', defaultValue: '480', description: 'Card width via CSS size token.' },
      { name: 'clickToFlip', type: 'boolean', defaultValue: 'true', description: 'Enables click and keyboard flip interaction.' },
      { name: 'flipped', type: 'boolean', description: 'Controlled flipped state when provided.' },
    ],
    sourceDoc: 'docs/CreditCard.md',
  },
  {
    slug: 'simple-graph',
    name: 'Simple Graph',
    summary: 'Animated line graph with smooth path drawing, hover tooltip, and configurable visual tokens.',
    category: 'Data Visualization',
    status: 'stable',
    tags: ['chart', 'svg', 'line'],
    previewTheme: 'dark',
    renderPreview: renderSimpleGraphPreview,
    importStatement: "import SimpleGraph from '@/components/SimpleGraph'",
    exampleCode: `<SimpleGraph
  height={392}
  animationDurationMs={1550}
  points={[
    { id: 'jan', label: 'Jan', value: 48.5 },
    { id: 'feb', label: 'Feb', value: -42.8 },
    { id: 'mar', label: 'Mar', value: 67.2 },
  ]}
/>`,
    files: ['src/components/SimpleGraph.tsx', 'src/components/SimpleGraph.css'],
    installNotes: [
      'Copy both files into your components folder.',
      'Pass your own points array to match project data.',
    ],
    props: [
      { name: 'points', type: 'Array<{ id; label; value }>', description: 'Data points rendered along the chart axis.' },
      { name: 'height', type: 'number | string', defaultValue: '390', description: 'Panel height.' },
      { name: 'showGrid', type: 'boolean', defaultValue: 'true', description: 'Toggles horizontal guide lines.' },
      { name: 'showArea', type: 'boolean', defaultValue: 'false', description: 'Shows gradient area fill under the line.' },
      { name: 'animationDurationMs', type: 'number', defaultValue: '1400', description: 'Line draw animation duration.' },
      { name: 'colors', type: 'Partial<SimpleGraphColorOverrides>', description: 'Theme token overrides.' },
    ],
  },
  {
    slug: 'neon-network',
    name: 'Neon Network',
    summary: 'Center-node neon network animation with start/restart controls and CSS-variable-driven theming.',
    category: 'Visual Effects',
    status: 'stable',
    tags: ['network', 'neon', 'svg'],
    previewTheme: 'dark',
    renderPreview: renderNeonNetworkPreview,
    importStatement: "import NeonNetwork from '@/components/NeonNetwork'",
    exampleCode: `<NeonNetwork
  startLabel="Start"
  restartLabel="Restart"
  fillDurationMs={2200}
/>`,
    files: ['src/components/NeonNetwork.tsx', 'src/components/NeonNetwork.css'],
    installNotes: [
      'Copy component and CSS files together.',
      'Optionally disable controls with showControls={false}.',
    ],
    props: [
      { name: 'showControls', type: 'boolean', defaultValue: 'true', description: 'Shows the start / restart button.' },
      { name: 'autoStart', type: 'boolean', defaultValue: 'false', description: 'Auto-runs animation on mount.' },
      { name: 'fillDurationMs', type: 'number', defaultValue: '2200', description: 'Core line fill duration.' },
      { name: 'glowDurationMs', type: 'number', description: 'Glow line fill duration.' },
      { name: 'maxWidth', type: 'number | string', defaultValue: '1024', description: 'Maximum stage width.' },
      { name: 'colors', type: 'Partial<NeonNetworkColorOverrides>', description: 'Token overrides for lines/nodes/button.' },
      { name: 'onComplete', type: '() => void', description: 'Called after one animation cycle completes.' },
    ],
    sourceDoc: 'docs/NeonNetwork.md',
  },
  {
    slug: 'cylindrical-text-reveal',
    name: 'Cylindrical Text Reveal',
    summary: 'Scroll-driven 3D cylindrical headline effect powered by GSAP ScrollTrigger.',
    category: 'Text Motion',
    status: 'stable',
    tags: ['scroll', '3d', 'headline'],
    previewTheme: 'dark',
    renderPreview: renderCylindricalTextPreview,
    importStatement: "import CylindricalTextReveal from '@/components/ui/cylindrical-text-reveal'",
    exampleCode: `<CylindricalTextReveal
  lines={['EXPLORE', 'THE', 'FUTURE', 'OF', 'DESIGN']}
  stickyTopOffset="72px"
  sectionMinHeight="240vh"
/>`,
    files: [
      'src/components/ui/cylindrical-text-reveal.tsx',
      'src/components/ui/cylindrical-text-reveal.css',
    ],
    installNotes: ['Keep gsap in dependencies: pnpm add gsap.', 'Copy TSX and CSS files to src/components/ui.'],
    props: [
      { name: 'lines', type: 'string[]', description: 'Uppercase text lines rendered on the cylinder.' },
      { name: 'stickyTopOffset', type: 'string', defaultValue: '0px', description: 'Sticky top offset for pinned stage.' },
      { name: 'sectionMinHeight', type: 'string', defaultValue: '240vh', description: 'Scroll section height.' },
      { name: 'radius', type: 'number', defaultValue: '330', description: 'Cylinder radius used in transform math.' },
      { name: 'angleStep', type: 'number', defaultValue: '0.26', description: 'Angle spacing between text lines.' },
      { name: 'rollStartAngle', type: 'number', defaultValue: '1.2', description: 'Initial roll angle in radians.' },
      { name: 'rollEndAngle', type: 'number', defaultValue: '-1.35', description: 'Final roll angle in radians.' },
    ],
    sourceDoc: 'docs/CylindricalTextReveal.md',
  },
  {
    slug: 'text-scatter',
    name: 'Text Scatter',
    summary: 'Pointer-reactive spring text displacement effect with per-character physics updates.',
    category: 'Text Motion',
    status: 'stable',
    tags: ['pointer', 'physics', 'text'],
    previewTheme: 'dark',
    renderPreview: renderTextScatterPreview,
    importStatement: "import TextScatter from '@/components/TextScatter'",
    exampleCode: '<TextScatter />',
    files: ['src/components/TextScatter.tsx', 'src/components/TextScatter.css'],
    installNotes: ['Copy TSX and CSS files.', 'No external dependencies required.'],
    props: [],
  },
  {
    slug: 'text-scatter-burst',
    name: 'Text Scatter Burst',
    summary: 'Directional letter burst effect with bounded scatter distance and spring return.',
    category: 'Text Motion',
    status: 'stable',
    tags: ['pointer', 'burst', 'letters'],
    previewTheme: 'dark',
    renderPreview: renderTextScatterBurstPreview,
    importStatement: "import TextScatterBurst from '@/components/TextScatterBurst'",
    exampleCode: `<TextScatterBurst
  text="Bounce Back."
  triggerRadius={84}
  scatterHoldMs={1200}
/>`,
    files: ['src/components/TextScatterBurst.tsx', 'src/components/TextScatterBurst.css'],
    installNotes: ['Copy TSX and CSS files.', 'Tune triggerRadius and scatterHoldMs for your interaction style.'],
    props: [
      { name: 'text', type: 'string', defaultValue: 'Bounce Back.', description: 'Rendered text content.' },
      { name: 'minHeight', type: 'number | string', defaultValue: '72vh', description: 'Minimum section height.' },
      { name: 'maxWidth', type: 'number | string', defaultValue: '1020', description: 'Maximum stage width.' },
      { name: 'triggerRadius', type: 'number', defaultValue: '78', description: 'Pointer trigger radius per character.' },
      { name: 'scatterHoldMs', type: 'number', defaultValue: '1200', description: 'How long characters stay exploded.' },
      { name: 'targetScatterDistance', type: 'number', defaultValue: '320', description: 'Preferred outward travel distance.' },
      { name: 'spring', type: 'number', defaultValue: '0.06', description: 'Spring force for returning letters.' },
      { name: 'damping', type: 'number', defaultValue: '0.86', description: 'Velocity damping multiplier.' },
    ],
    sourceDoc: 'docs/TextScatterBurst.md',
  },
]

const categoryOrder: ComponentCategory[] = ['Cards', 'Data Visualization', 'Visual Effects', 'Text Motion']

export const componentGroups = categoryOrder
  .map((category) => ({
    category,
    components: componentRegistry.filter((component) => component.category === category),
  }))
  .filter((group) => group.components.length > 0)

export const componentBySlug = new Map(componentRegistry.map((component) => [component.slug, component]))

export const getComponentBySlug = (slug: string | undefined) => (slug ? componentBySlug.get(slug) : undefined)

export type ComponentSlug = (typeof componentRegistry)[number]['slug']

