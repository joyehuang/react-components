import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";
import "./simple-graph.css";

export type SimpleGraphPoint = {
  id: string;
  label: string;
  value: number;
  displayValue?: string;
};

export type SimpleGraphColorOverrides = {
  background: string;
  panelBorder: string;
  grid: string;
  line: string;
  lineGlow: string;
  point: string;
  pointBorder: string;
  pointActive: string;
  tooltipBackground: string;
  tooltipText: string;
  tooltipMuted: string;
  tooltipNegative: string;
  tooltipPositive: string;
};

export type SimpleGraphProps = {
  className?: string;
  points?: SimpleGraphPoint[];
  maxWidth?: number | string;
  height?: number | string;
  gridLines?: number;
  showGrid?: boolean;
  showArea?: boolean;
  strokeWidth?: number;
  pointRadius?: number;
  activePointRadius?: number;
  animationDurationMs?: number;
  yPaddingRatio?: number;
  colors?: Partial<SimpleGraphColorOverrides>;
};

const defaultPoints: SimpleGraphPoint[] = [
  { id: "jan", label: "Jan", value: 43.2 },
  { id: "feb", label: "Feb", value: 28.9, displayValue: "-28.9%" },
  { id: "mar", label: "Mar", value: 57.6 },
  { id: "apr", label: "Apr", value: 52.4 },
  { id: "may", label: "May", value: 64.8 },
  { id: "jun", label: "Jun", value: 78.2 },
];

const defaultColors: SimpleGraphColorOverrides = {
  background: "#04060b",
  panelBorder: "rgba(124, 138, 180, 0.18)",
  grid: "rgba(159, 176, 222, 0.18)",
  line: "#ad99ff",
  lineGlow: "rgba(175, 153, 255, 0.45)",
  point: "#ab96ff",
  pointBorder: "#efe9ff",
  pointActive: "#b7a6ff",
  tooltipBackground: "rgba(17, 22, 35, 0.96)",
  tooltipText: "#e9ecf9",
  tooltipMuted: "#97a4c8",
  tooltipNegative: "#ff6b6b",
  tooltipPositive: "#79e09f",
};

const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 45;
const CHART_PADDING = { top: 5.5, right: 5, bottom: 4.5, left: 5 };

const toCssDimension = (value: number | string): string =>
  typeof value === "number" ? `${value}px` : value;

const clampDuration = (value: number): number =>
  Math.max(200, Math.round(value));
const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const buildSmoothPath = (points: Array<{ x: number; y: number }>): string => {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const smoothness = 0.18;
  const path: string[] = [`M ${points[0].x} ${points[0].y}`];

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + ((p2.x - p0.x) * smoothness) / 1.5;
    const cp1y = p1.y + ((p2.y - p0.y) * smoothness) / 1.5;
    const cp2x = p2.x - ((p3.x - p1.x) * smoothness) / 1.5;
    const cp2y = p2.y - ((p3.y - p1.y) * smoothness) / 1.5;

    path.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }

  return path.join(" ");
};

export function SimpleGraph({
  className,
  points = defaultPoints,
  maxWidth = 860,
  height = 390,
  gridLines = 5,
  showGrid = true,
  showArea = false,
  strokeWidth = 0.5,
  pointRadius = 1.1,
  activePointRadius = 1.85,
  animationDurationMs = 1400,
  yPaddingRatio = 0.14,
  colors,
}: SimpleGraphProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [runId, setRunId] = useState(0);
  const [pointRevealDelays, setPointRevealDelays] = useState<number[]>([]);
  const corePathRef = useRef<SVGPathElement | null>(null);
  const drawDurationMs = clampDuration(animationDurationMs);

  useEffect(() => {
    setRunId((prev) => prev + 1);
  }, [points, animationDurationMs]);

  useEffect(() => {
    if (points.length === 0) {
      setActiveIndex(null);
      return;
    }

    if (activeIndex !== null && activeIndex > points.length - 1) {
      setActiveIndex(null);
    }
  }, [activeIndex, points]);

  const mergedColors = useMemo(
    () => ({
      ...defaultColors,
      ...colors,
    }),
    [colors],
  );

  const chartPoints = useMemo(() => {
    if (points.length === 0) {
      return [] as Array<{
        x: number;
        y: number;
        value: number;
        label: string;
        displayValue?: string;
      }>;
    }

    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(1e-6, max - min);
    const yPad = span * Math.max(0, yPaddingRatio);
    const scaledMin = min - yPad;
    const scaledMax = max + yPad;
    const scaledSpan = Math.max(1e-6, scaledMax - scaledMin);

    const usableWidth =
      VIEWBOX_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
    const usableHeight =
      VIEWBOX_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

    return points.map((point, index) => {
      const ratioX = points.length > 1 ? index / (points.length - 1) : 0.5;
      const ratioY = (point.value - scaledMin) / scaledSpan;

      return {
        x: CHART_PADDING.left + ratioX * usableWidth,
        y: CHART_PADDING.top + (1 - ratioY) * usableHeight,
        value: point.value,
        label: point.label,
        displayValue: point.displayValue,
      };
    });
  }, [points, yPaddingRatio]);

  const linePath = useMemo(() => buildSmoothPath(chartPoints), [chartPoints]);
  const fallbackRevealDelays = useMemo(() => {
    if (chartPoints.length <= 1) {
      return chartPoints.length === 1 ? [0] : [];
    }

    return chartPoints.map((_, index) =>
      Math.round((index / (chartPoints.length - 1)) * drawDurationMs),
    );
  }, [chartPoints, drawDurationMs]);

  useLayoutEffect(() => {
    if (chartPoints.length === 0) {
      setPointRevealDelays([]);
      return;
    }

    const path = corePathRef.current;
    if (!path) {
      setPointRevealDelays(fallbackRevealDelays);
      return;
    }

    try {
      const totalLength = path.getTotalLength();
      if (!Number.isFinite(totalLength) || totalLength <= 0) {
        setPointRevealDelays(fallbackRevealDelays);
        return;
      }

      const sampleCount = Math.max(360, chartPoints.length * 160);
      const sampledPoints = Array.from(
        { length: sampleCount + 1 },
        (_, index) => {
          const ratio = index / sampleCount;
          const sample = path.getPointAtLength(totalLength * ratio);
          return { x: sample.x, y: sample.y, ratio };
        },
      );

      const computedDelays = chartPoints.map((point) => {
        let bestRatio = 0;
        let bestDistanceSquared = Number.POSITIVE_INFINITY;

        for (let index = 0; index < sampledPoints.length; index += 1) {
          const sampled = sampledPoints[index];
          const dx = sampled.x - point.x;
          const dy = sampled.y - point.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < bestDistanceSquared) {
            bestDistanceSquared = distanceSquared;
            bestRatio = sampled.ratio;
          }
        }

        return Math.round(bestRatio * drawDurationMs);
      });

      setPointRevealDelays(computedDelays);
    } catch {
      setPointRevealDelays(fallbackRevealDelays);
    }
  }, [chartPoints, drawDurationMs, fallbackRevealDelays, linePath, runId]);

  const areaPath = useMemo(() => {
    if (!showArea || chartPoints.length < 2) {
      return "";
    }

    const baseY = VIEWBOX_HEIGHT - CHART_PADDING.bottom;
    const first = chartPoints[0];
    const last = chartPoints[chartPoints.length - 1];
    return `${linePath} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
  }, [chartPoints, linePath, showArea]);

  const activePoint = activeIndex !== null ? chartPoints[activeIndex] : null;
  const activeValue = activeIndex !== null ? points[activeIndex] : null;
  const trendText =
    activeValue?.displayValue ??
    `${activeValue && activeValue.value > 0 ? "+" : ""}${activeValue?.value.toFixed(1) ?? "0.0"}%`;

  const isNegative = (activeValue?.value ?? 0) < 0;
  const trendArrow = isNegative ? "↘" : "↗";
  const tooltipRotateZ = useMemo(() => {
    if (activeIndex === null || chartPoints.length < 2) {
      return 0;
    }

    const prev = chartPoints[Math.max(activeIndex - 1, 0)];
    const next = chartPoints[Math.min(activeIndex + 1, chartPoints.length - 1)];
    const angle =
      Math.atan2(next.y - prev.y, next.x - prev.x) * (180 / Math.PI);
    return Math.max(-12, Math.min(12, angle));
  }, [activeIndex, chartPoints]);
  const tooltipLeftPercent = activePoint
    ? clamp((activePoint.x / VIEWBOX_WIDTH) * 100, 8, 92)
    : 50;

  const cssVars = {
    "--sg-max-width": toCssDimension(maxWidth),
    "--sg-height": toCssDimension(height),
    "--sg-background": mergedColors.background,
    "--sg-panel-border": mergedColors.panelBorder,
    "--sg-grid": mergedColors.grid,
    "--sg-line": mergedColors.line,
    "--sg-line-glow": mergedColors.lineGlow,
    "--sg-point": mergedColors.point,
    "--sg-point-border": mergedColors.pointBorder,
    "--sg-point-active": mergedColors.pointActive,
    "--sg-tooltip-bg": mergedColors.tooltipBackground,
    "--sg-tooltip-text": mergedColors.tooltipText,
    "--sg-tooltip-muted": mergedColors.tooltipMuted,
    "--sg-tooltip-negative": mergedColors.tooltipNegative,
    "--sg-tooltip-positive": mergedColors.tooltipPositive,
    "--sg-duration": `${drawDurationMs}ms`,
    "--sg-point-reveal-duration": "180ms",
  } as CSSProperties;

  return (
    <section
      className={cn(
        "simple-graph w-[min(var(--sg-max-width,860px),96vw)] mx-auto",
        className,
      )}
      style={cssVars}
      aria-label="Simple animated graph"
    >
      <div
        className="simple-graph__panel relative w-full h-[var(--sg-height,390px)] rounded-[20px] overflow-visible"
        onPointerLeave={() => setActiveIndex(null)}
      >
        <div className="simple-graph__canvas w-full h-full rounded-[inherit] overflow-hidden">
          <svg
            className="simple-graph__svg w-full h-full block overflow-visible"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id="simple-graph-area"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={mergedColors.line}
                  stopOpacity="0.5"
                />
                <stop
                  offset="100%"
                  stopColor={mergedColors.line}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {showGrid ? (
              <g className="simple-graph__grid">
                {Array.from({ length: Math.max(gridLines, 2) }).map(
                  (_, index, arr) => {
                    const ratio = index / (arr.length - 1);
                    const y =
                      CHART_PADDING.top +
                      ratio *
                        (VIEWBOX_HEIGHT -
                          CHART_PADDING.top -
                          CHART_PADDING.bottom);

                    return (
                      <line
                        key={`grid-${index}`}
                        x1={CHART_PADDING.left}
                        x2={VIEWBOX_WIDTH - CHART_PADDING.right}
                        y1={y}
                        y2={y}
                      />
                    );
                  },
                )}
              </g>
            ) : null}

            {areaPath ? (
              <path className="simple-graph__area" d={areaPath} />
            ) : null}

            <g key={`line-${runId}`} className="simple-graph__line-wrap">
              <path
                className="simple-graph__line simple-graph__line--glow"
                d={linePath}
                pathLength={100}
              />
              <path
                ref={corePathRef}
                className="simple-graph__line simple-graph__line--core"
                d={linePath}
                pathLength={100}
                style={{ strokeWidth }}
              />
            </g>

            {chartPoints.map((point, index) => {
              const isActive = index === activeIndex;
              const revealDelayMs =
                pointRevealDelays[index] ?? fallbackRevealDelays[index] ?? 0;

              return (
                <g
                  key={`${point.label}-${index}-${runId}`}
                  className={cn("simple-graph__point", isActive && "is-active")}
                  style={
                    {
                      "--sg-point-delay": `${revealDelayMs}ms`,
                    } as CSSProperties
                  }
                  onPointerEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                >
                  <circle
                    className="simple-graph__point-hit"
                    cx={point.x}
                    cy={point.y}
                    r={6.5}
                    tabIndex={0}
                  />
                  <circle
                    className="simple-graph__point-dot"
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? activePointRadius : pointRadius}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {activePoint ? (
          <div
            className="simple-graph__tooltip absolute min-w-[88px] pointer-events-none rounded-xl px-3 py-[10px]"
            style={
              {
                left: `${tooltipLeftPercent}%`,
                top: `${(activePoint.y / VIEWBOX_HEIGHT) * 100}%`,
                "--sg-tooltip-rotate-z": `${tooltipRotateZ}deg`,
              } as CSSProperties
            }
            role="status"
            aria-live="polite"
          >
            <p
              className={cn(
                "simple-graph__tooltip-value m-0 leading-[1.1]",
                isNegative ? "is-negative" : "is-positive",
              )}
            >
              {trendArrow} {trendText}
            </p>
            <p className="simple-graph__tooltip-label m-0 mt-[6px] leading-[1.1]">
              {activePoint.label}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default SimpleGraph;
