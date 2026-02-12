import CylindricalTextReveal from './ui/cylindrical-text-reveal'

function Scroll3DHeadline() {
  return (
    <CylindricalTextReveal
      stickyTopOffset="var(--app-header-height, 72px)"
      sectionMinHeight="calc((100vh - var(--app-header-height, 72px)) * 2.4)"
    />
  )
}

export default Scroll3DHeadline
