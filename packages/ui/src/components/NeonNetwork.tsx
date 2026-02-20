import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import './NeonNetwork.css'

type NodeConfig = {
  id: string
  x: number
  y: number
  highlighted?: boolean
  delay?: number
}

type ConnectionConfig = {
  id: string
  d: string
}

type NeonNetworkColorOverrides = {
  lineBase: string
  lineGlow: string
  lineCore: string
  nodeDot: string
  nodeDotHighlight: string
  coreBorder: string
  logo: string
  buttonBg: string
  buttonBorder: string
  buttonText: string
}

export type NeonNetworkProps = {
  className?: string
  showControls?: boolean
  autoStart?: boolean
  startLabel?: string
  restartLabel?: string
  fillDurationMs?: number
  glowDurationMs?: number
  maxWidth?: number | string
  colors?: Partial<NeonNetworkColorOverrides>
  onComplete?: () => void
}

const nodes: NodeConfig[] = [
  { id: 'top', x: 50, y: 12, highlighted: true, delay: 0.15 },
  { id: 'top-left', x: 22.5, y: 22, delay: 0.4 },
  { id: 'top-right', x: 77.5, y: 22, delay: 0.55 },
  { id: 'left', x: 9, y: 50, highlighted: true, delay: 0.1 },
  { id: 'right', x: 91, y: 50, delay: 0.5 },
  { id: 'bottom-left', x: 22.5, y: 78, highlighted: true, delay: 0.25 },
  { id: 'bottom-right', x: 77.5, y: 78, highlighted: true, delay: 0.35 },
  { id: 'bottom', x: 50, y: 88, delay: 0.6 },
]

const connections: ConnectionConfig[] = [
  { id: 'top', d: 'M500 90 L500 202' },
  { id: 'top-left', d: 'M255 130 Q350 150 445 210' },
  { id: 'top-right', d: 'M745 130 Q650 150 555 210' },
  { id: 'left', d: 'M110 250 L422 250' },
  { id: 'right', d: 'M890 250 L578 250' },
  { id: 'bottom-left', d: 'M255 370 Q340 330 445 290' },
  { id: 'bottom-right', d: 'M745 370 Q660 330 555 290' },
  { id: 'bottom', d: 'M500 420 L500 298' },
]

const defaultColors: NeonNetworkColorOverrides = {
  lineBase: 'rgba(99, 102, 140, 0.26)',
  lineGlow: 'rgba(181, 83, 255, 0.42)',
  lineCore: '#c63dff',
  nodeDot: 'rgba(182, 72, 255, 0.45)',
  nodeDotHighlight: '#d83cff',
  coreBorder: 'rgba(216, 63, 255, 0.72)',
  logo: '#da44ff',
  buttonBg: 'rgba(34, 18, 49, 0.88)',
  buttonBorder: 'rgba(203, 129, 255, 0.44)',
  buttonText: '#f3d8ff',
}

const toCssDimension = (value: number | string): string =>
  typeof value === 'number' ? `${value}px` : value

const clampDuration = (value: number): number => Math.max(250, Math.round(value))

function NeonNetwork({
  className,
  showControls = true,
  autoStart = false,
  startLabel = 'Start',
  restartLabel = 'Restart',
  fillDurationMs = 2200,
  glowDurationMs,
  maxWidth = 1024,
  colors,
  onComplete,
}: NeonNetworkProps) {
  const [runId, setRunId] = useState(() => (autoStart ? 1 : 0))
  const [hasStarted, setHasStarted] = useState(() => autoStart)
  const [isRunning, setIsRunning] = useState(() => autoStart)
  const [isComplete, setIsComplete] = useState(false)

  const mergedColors = useMemo(
    () => ({
      ...defaultColors,
      ...colors,
    }),
    [colors],
  )

  const coreDuration = clampDuration(fillDurationMs)
  const glowDuration = clampDuration(glowDurationMs ?? fillDurationMs + 200)
  const totalRunDuration = Math.max(coreDuration, glowDuration)

  const cssVars = {
    '--nn-max-width': toCssDimension(maxWidth),
    '--nn-line-base': mergedColors.lineBase,
    '--nn-line-glow': mergedColors.lineGlow,
    '--nn-line-core': mergedColors.lineCore,
    '--nn-node-dot': mergedColors.nodeDot,
    '--nn-node-dot-highlight': mergedColors.nodeDotHighlight,
    '--nn-core-border': mergedColors.coreBorder,
    '--nn-logo': mergedColors.logo,
    '--nn-button-bg': mergedColors.buttonBg,
    '--nn-button-border': mergedColors.buttonBorder,
    '--nn-button-text': mergedColors.buttonText,
    '--nn-glow-duration': `${glowDuration}ms`,
    '--nn-core-duration': `${coreDuration}ms`,
  } as CSSProperties

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const timer = window.setTimeout(() => {
      setIsRunning(false)
      setIsComplete(true)
      onComplete?.()
    }, totalRunDuration)

    return () => window.clearTimeout(timer)
  }, [isRunning, onComplete, runId, totalRunDuration])

  const runAnimation = () => {
    setHasStarted(true)
    setIsRunning(true)
    setIsComplete(false)
    setRunId((prev) => prev + 1)
  }

  return (
    <div className={`neon-network-demo ${className ?? ''}`} style={cssVars}>
      <section
        className={`neon-network ${isRunning ? 'is-running' : ''} ${isComplete ? 'is-complete' : ''}`}
        aria-label="Animated neon network"
      >
        <svg
          className="neon-network__lines"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {connections.map((connection) => (
            <path
              key={`${connection.id}-base`}
              className="connection connection--base"
              d={connection.d}
            />
          ))}

          {connections.map((connection) => (
            <g key={`${connection.id}-animated-${runId}`} className="connection-animated">
              <path className="connection connection--glow" d={connection.d} pathLength={100} />
              <path className="connection connection--core" d={connection.d} pathLength={100} />
            </g>
          ))}
        </svg>

        {nodes.map((node) => (
          <span
            key={node.id}
            className={`neon-network__node ${node.highlighted ? 'is-highlighted' : ''}`}
            style={
              {
                left: `${node.x}%`,
                top: `${node.y}%`,
                animationDelay: `${node.delay ?? 0}s`,
              } as CSSProperties
            }
            aria-hidden="true"
          >
            <span className="neon-network__node-dot" />
          </span>
        ))}

        <div className="neon-network__core" aria-hidden="true">
          <span className="neon-network__core-glow" />
          <svg className="neon-network__logo" viewBox="0 0 64 64">
            <polyline points="18,20 32,13 46,20" />
            <polyline points="18,30 32,23 46,30" />
            <polyline points="18,40 32,33 46,40" />
          </svg>
        </div>
      </section>

      {showControls ? (
        <div className="neon-network__controls">
          <button
            className="neon-network__button"
            type="button"
            onClick={runAnimation}
            disabled={isRunning}
          >
            {hasStarted ? restartLabel : startLabel}
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default NeonNetwork
