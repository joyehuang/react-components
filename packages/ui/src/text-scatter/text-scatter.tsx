import { forwardRef, useEffect, useMemo, useRef, type CSSProperties, type HTMLAttributes } from 'react'
import './text-scatter.css'

type LetterPhysics = {
  x: number
  y: number
  vx: number
  vy: number
  ox: number
  oy: number
}

const RADIUS = 150
const FORCE = 2.6
const SPRING = 0.065
const DAMPING = 0.86

const toCssSize = (value: number | string) => (typeof value === 'number' ? `${value}px` : value)

export type TextScatterProps = Omit<HTMLAttributes<HTMLElement>, 'color'> & {
  text?: string
  minHeight?: number | string
  maxWidth?: number | string
  triggerRadius?: number
  force?: number
  spring?: number
  damping?: number
  background?: string
  color?: string
  hoverColor?: string
}

export const TextScatter = forwardRef<HTMLElement, TextScatterProps>(function TextScatter(
  {
    className,
    style,
    text = 'Bounce Back.',
    minHeight = 'calc(100vh - var(--app-header-height, 72px))',
    maxWidth = 980,
    triggerRadius = RADIUS,
    force = FORCE,
    spring = SPRING,
    damping = DAMPING,
    background = '#000',
    color = '#f5f5f5',
    hoverColor = '#fff',
    ...rest
  },
  ref,
) {
  const chars = useMemo(() => Array.from(text), [text])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([])
  const physicsRef = useRef<LetterPhysics[]>([])
  const pointerRef = useRef({ x: 0, y: 0, active: false })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const setupLetters = () => {
      const containerRect = root.getBoundingClientRect()

      physicsRef.current = letterRefs.current.map((el) => {
        if (!el) {
          return { x: 0, y: 0, vx: 0, vy: 0, ox: 0, oy: 0 }
        }

        const rect = el.getBoundingClientRect()
        return {
          x: rect.left - containerRect.left + rect.width * 0.5,
          y: rect.top - containerRect.top + rect.height * 0.5,
          vx: 0,
          vy: 0,
          ox: 0,
          oy: 0,
        }
      })
    }

    const animate = () => {
      const letters = physicsRef.current
      const pointer = pointerRef.current

      for (let i = 0; i < letters.length; i += 1) {
        const point = letters[i]
        const dx = point.x + point.ox - pointer.x
        const dy = point.y + point.oy - pointer.y
        const dist = Math.hypot(dx, dy) || 1

        if (pointer.active && dist < triggerRadius) {
          const power = (1 - dist / triggerRadius) * force
          point.vx += (dx / dist) * power
          point.vy += (dy / dist) * power
        }

        point.vx += -point.ox * spring
        point.vy += -point.oy * spring
        point.vx *= damping
        point.vy *= damping
        point.ox += point.vx
        point.oy += point.vy

        const el = letterRefs.current[i]
        if (el) {
          const rotation = point.ox * 0.2
          el.style.transform = `translate(${point.ox.toFixed(2)}px, ${point.oy.toFixed(2)}px) rotate(${rotation.toFixed(2)}deg)`
        }
      }

      rafRef.current = window.requestAnimationFrame(animate)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      pointerRef.current.x = event.clientX - rect.left
      pointerRef.current.y = event.clientY - rect.top
      pointerRef.current.active = true
    }

    const onPointerLeave = () => {
      pointerRef.current.active = false
    }

    setupLetters()
    rafRef.current = window.requestAnimationFrame(animate)

    root.addEventListener('pointermove', onPointerMove)
    root.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('resize', setupLetters)

    return () => {
      root.removeEventListener('pointermove', onPointerMove)
      root.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', setupLetters)
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [damping, force, spring, triggerRadius])

  const cssVars = {
    '--ts-min-height': toCssSize(minHeight),
    '--ts-max-width': toCssSize(maxWidth),
    '--ts-background': background,
    '--ts-char-color': color,
    '--ts-char-hover-color': hoverColor,
  } as CSSProperties

  return (
    <section
      ref={ref}
      {...rest}
      className={`text-scatter${className ? ` ${className}` : ''}`}
      style={{ ...cssVars, ...(style as CSSProperties | undefined) }}
      aria-label="Interactive text scatter"
    >
      <div ref={containerRef} className="text-scatter__stage">
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            ref={(el) => {
              letterRefs.current[index] = el
            }}
            className={`text-scatter__char ${char === ' ' ? 'is-space' : ''}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </section>
  )
})

TextScatter.displayName = 'TextScatter'

export default TextScatter
