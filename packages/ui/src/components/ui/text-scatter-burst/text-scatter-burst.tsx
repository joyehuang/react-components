import { useEffect, useMemo, useRef, type CSSProperties } from 'react'
import './TextScatterBurst.css'

type LetterState = {
  x: number
  y: number
  cx: number
  cy: number
  sx: number
  sy: number
  vx: number
  vy: number
  angle: number
  isSpace: boolean
  explode: number
  isNear: boolean
  scatterUntil: number
}

const DEFAULT_TRIGGER_RADIUS = 78
const DEFAULT_SPRING = 0.06
const DEFAULT_DAMPING = 0.86
const DEFAULT_EXPLODE_LERP = 0.12
const DEFAULT_SCATTER_HOLD_MS = 1200
const DEFAULT_TARGET_SCATTER_DISTANCE = 320
const DEFAULT_STAGE_PADDING = 34
const DEFAULT_POINTER_SPEED_FALLBACK = 0.03

type TextScatterBurstProps = {
  text?: string
  className?: string
  stageClassName?: string
  minHeight?: number | string
  maxWidth?: number | string
  color?: string
  hoverColor?: string
  triggerRadius?: number
  scatterHoldMs?: number
  targetScatterDistance?: number
  spring?: number
  damping?: number
  explodeLerp?: number
  stagePadding?: number
  pointerSpeedFallback?: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function randomUnit(seed: number) {
  return Math.abs(Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1
}

function normalize(x: number, y: number) {
  const length = Math.hypot(x, y) || 1
  return { x: x / length, y: y / length }
}

function getBoundedDistance(
  x: number,
  y: number,
  dirX: number,
  dirY: number,
  stageWidth: number,
  stageHeight: number,
  preferredDistance: number,
  stagePadding: number,
) {
  const limits: number[] = [preferredDistance]

  if (dirX > 0) limits.push((stageWidth - stagePadding - x) / dirX)
  if (dirX < 0) limits.push((stagePadding - x) / dirX)
  if (dirY > 0) limits.push((stageHeight - stagePadding - y) / dirY)
  if (dirY < 0) limits.push((stagePadding - y) / dirY)

  const positiveLimits = limits.filter((value) => Number.isFinite(value) && value > 0)
  return positiveLimits.length ? Math.min(...positiveLimits) : 0
}

function toCssSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

export type { TextScatterBurstProps }

function TextScatterBurst({
  text = 'Bounce Back.',
  className,
  stageClassName,
  minHeight = '72vh',
  maxWidth = 1020,
  color = '#f7f7f7',
  hoverColor = '#ffffff',
  triggerRadius = DEFAULT_TRIGGER_RADIUS,
  scatterHoldMs = DEFAULT_SCATTER_HOLD_MS,
  targetScatterDistance = DEFAULT_TARGET_SCATTER_DISTANCE,
  spring = DEFAULT_SPRING,
  damping = DEFAULT_DAMPING,
  explodeLerp = DEFAULT_EXPLODE_LERP,
  stagePadding = DEFAULT_STAGE_PADDING,
  pointerSpeedFallback = DEFAULT_POINTER_SPEED_FALLBACK,
}: TextScatterBurstProps) {
  const chars = useMemo(() => Array.from(text), [text])
  const stageRef = useRef<HTMLDivElement | null>(null)
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([])
  const stateRef = useRef<LetterState[]>([])
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
    lastTs: 0,
    active: false,
  })
  const stageSizeRef = useRef({ width: 0, height: 0 })
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const setup = () => {
      const stageRect = stage.getBoundingClientRect()
      const width = stageRect.width
      const height = stageRect.height
      stageSizeRef.current.width = width
      stageSizeRef.current.height = height

      stateRef.current = letterRefs.current.map((node, index) => {
        if (!node) {
          return {
            x: 0,
            y: 0,
            cx: 0,
            cy: 0,
            sx: 0,
            sy: 0,
            vx: 0,
            vy: 0,
            angle: 0,
            isSpace: chars[index] === ' ',
            explode: 0,
            isNear: false,
            scatterUntil: 0,
          }
        }

        const rect = node.getBoundingClientRect()
        const rx = randomUnit(index + 0.17)
        return {
          x: rect.left - stageRect.left + rect.width * 0.5,
          y: rect.top - stageRect.top + rect.height * 0.5,
          cx: rect.left - stageRect.left + rect.width * 0.5,
          cy: rect.top - stageRect.top + rect.height * 0.5,
          sx: 0,
          sy: 0,
          vx: 0,
          vy: 0,
          angle: (rx - 0.5) * 94,
          isSpace: chars[index] === ' ',
          explode: 0,
          isNear: false,
          scatterUntil: 0,
        }
      })
    }

    const tick = () => {
      const now = performance.now()
      const pointer = pointerRef.current
      const letters = stateRef.current

      for (let i = 0; i < letters.length; i += 1) {
        const item = letters[i]
        const triggerDist = Math.hypot(item.x - pointer.x, item.y - pointer.y)
        const isNear = pointer.active && !item.isSpace && triggerDist < triggerRadius

        if (isNear && !item.isNear) {
          const stageWidth = stageSizeRef.current.width
          const stageHeight = stageSizeRef.current.height
          const pointerSpeed = Math.hypot(pointer.vx, pointer.vy)
          const velocityDir =
            pointerSpeed > pointerSpeedFallback
              ? normalize(pointer.vx, pointer.vy)
              : normalize(item.x - pointer.x, item.y - pointer.y)
          const randomDrift = normalize(randomUnit(i + 1.2) - 0.5, randomUnit(i + 4.6) - 0.5)
          const mixedDir = normalize(
            velocityDir.x * 0.82 + randomDrift.x * 0.18,
            velocityDir.y * 0.82 + randomDrift.y * 0.18,
          )
          const distance = getBoundedDistance(
            item.x,
            item.y,
            mixedDir.x,
            mixedDir.y,
            stageWidth,
            stageHeight,
            targetScatterDistance,
            stagePadding,
          )
          item.sx = mixedDir.x * distance
          item.sy = mixedDir.y * distance
          item.scatterUntil = now + scatterHoldMs
        }
        item.isNear = isNear

        const targetExplode = now < item.scatterUntil ? 1 : 0

        item.explode += (targetExplode - item.explode) * explodeLerp

        const targetX = item.x + item.sx * item.explode
        const targetY = item.y + item.sy * item.explode
        const dxTarget = targetX - item.cx
        const dyTarget = targetY - item.cy

        item.vx += dxTarget * spring
        item.vy += dyTarget * spring

        item.vx *= damping
        item.vy *= damping
        item.cx += item.vx
        item.cy += item.vy

        const node = letterRefs.current[i]
        if (!node) continue

        const speed = Math.hypot(item.vx, item.vy)
        const rotate = clamp(item.angle * item.explode + item.vx * 2.3, -58, 58)
        const scale = clamp(1 + speed * 0.04, 1, 1.24)
        const blur = clamp(speed * 0.32, 0, 2.8)

        node.style.transform = `translate(${(item.cx - item.x).toFixed(2)}px, ${(item.cy - item.y).toFixed(2)}px) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`
        node.style.filter = item.isSpace ? 'none' : `blur(${blur.toFixed(2)}px)`
        node.style.opacity = item.isSpace ? `${(1 - item.explode).toFixed(3)}` : '1'
      }

      frameRef.current = window.requestAnimationFrame(tick)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      const nextX = event.clientX - rect.left
      const nextY = event.clientY - rect.top
      const now = event.timeStamp || performance.now()
      const pointer = pointerRef.current
      const isFirstSample = !pointer.active || pointer.lastTs === 0
      const deltaTime = Math.max(1, now - pointer.lastTs)

      pointer.vx = isFirstSample ? 0 : (nextX - pointer.lastX) / deltaTime
      pointer.vy = isFirstSample ? 0 : (nextY - pointer.lastY) / deltaTime
      pointer.x = nextX
      pointer.y = nextY
      pointer.lastX = nextX
      pointer.lastY = nextY
      pointer.lastTs = now
      pointer.active = true
    }

    const onPointerEnter = (event: PointerEvent) => {
      onPointerMove(event)
    }

    const onPointerLeave = () => {
      pointerRef.current.active = false
      pointerRef.current.vx = 0
      pointerRef.current.vy = 0
    }

    setup()
    frameRef.current = window.requestAnimationFrame(tick)
    stage.addEventListener('pointerenter', onPointerEnter)
    stage.addEventListener('pointermove', onPointerMove)
    stage.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('resize', setup)

    return () => {
      stage.removeEventListener('pointerenter', onPointerEnter)
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', setup)
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [
    chars,
    damping,
    explodeLerp,
    pointerSpeedFallback,
    scatterHoldMs,
    spring,
    stagePadding,
    targetScatterDistance,
    triggerRadius,
  ])

  const containerStyle = {
    ['--tsb-min-height' as string]: toCssSize(minHeight),
    ['--tsb-char-color' as string]: color,
    ['--tsb-char-hover-color' as string]: hoverColor,
  } as CSSProperties

  const stageStyle = {
    ['--tsb-max-width' as string]: toCssSize(maxWidth),
  } as CSSProperties

  return (
    <section
      className={`text-scatter-burst${className ? ` ${className}` : ''}`}
      style={containerStyle}
      aria-label="Explosive text scatter"
    >
      <div
        ref={stageRef}
        className={`text-scatter-burst__stage${stageClassName ? ` ${stageClassName}` : ''}`}
        style={stageStyle}
      >
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            ref={(el) => {
              letterRefs.current[index] = el
            }}
            className={`text-scatter-burst__char ${char === ' ' ? 'is-space' : ''}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </section>
  )
}

export default TextScatterBurst
