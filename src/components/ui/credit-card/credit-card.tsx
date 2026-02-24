import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";
import "./credit-card.css";

export type CreditCardColorOverrides = {
  frontFrom: string;
  frontMiddle: string;
  frontTo: string;
  backFrom: string;
  backMiddle: string;
  backTo: string;
  textPrimary: string;
  textMuted: string;
  outline: string;
  stripeFrom: string;
  stripeMiddle: string;
  stripeTo: string;
  panelBg: string;
  cvvLabel: string;
  cvvValue: string;
  glareStrong: string;
  glareSoft: string;
};

export type CreditCardProps = {
  className?: string;
  cardNumber?: string;
  cardholder?: string;
  expires?: string;
  cvv?: string;
  maxTilt?: number;
  width?: number | string;
  flipDurationMs?: number;
  clickToFlip?: boolean;
  defaultFlipped?: boolean;
  flipped?: boolean;
  onFlippedChange?: (next: boolean) => void;
  colors?: Partial<CreditCardColorOverrides>;
};

const defaultColors: CreditCardColorOverrides = {
  frontFrom: "#dedede",
  frontMiddle: "#d9d9d9",
  frontTo: "#e8e8e8",
  backFrom: "#eeeeee",
  backMiddle: "#e3e4e8",
  backTo: "#f3f4f8",
  textPrimary: "#171717",
  textMuted: "#595959",
  outline: "rgba(255, 255, 255, 0.58)",
  stripeFrom: "#2b2b31",
  stripeMiddle: "#12131a",
  stripeTo: "#02030a",
  panelBg: "#eff0f2",
  cvvLabel: "#7a7c84",
  cvvValue: "#343844",
  glareStrong: "rgba(255, 255, 255, 0.68)",
  glareSoft: "rgba(255, 255, 255, 0.26)",
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toCssDimension = (value: number | string) =>
  typeof value === "number" ? `${value}px` : value;

export function CreditCard({
  className,
  cardNumber = "1234 5678 9012 3456",
  cardholder = "JOHN DOE",
  expires = "12/25",
  cvv = "123",
  maxTilt = 14,
  width = 480,
  flipDurationMs = 520,
  clickToFlip = true,
  defaultFlipped = false,
  flipped,
  onFlippedChange,
  colors,
}: CreditCardProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointerActiveRef = useRef(false);
  const currentRef = useRef({ rx: 0, ry: 0, px: 50, py: 50, opacity: 0 });
  const targetRef = useRef({ rx: 0, ry: 0, px: 50, py: 50, opacity: 0 });
  const [internalFlipped, setInternalFlipped] = useState(defaultFlipped);

  const isControlled = typeof flipped === "boolean";
  const isFlipped = isControlled ? Boolean(flipped) : internalFlipped;

  const mergedColors = useMemo(
    () => ({
      ...defaultColors,
      ...colors,
    }),
    [colors],
  );

  const cssVars = {
    "--cc-width": toCssDimension(width),
    "--cc-flip-duration": `${Math.max(250, Math.round(flipDurationMs))}ms`,
    "--cc-front-from": mergedColors.frontFrom,
    "--cc-front-middle": mergedColors.frontMiddle,
    "--cc-front-to": mergedColors.frontTo,
    "--cc-back-from": mergedColors.backFrom,
    "--cc-back-middle": mergedColors.backMiddle,
    "--cc-back-to": mergedColors.backTo,
    "--cc-text-primary": mergedColors.textPrimary,
    "--cc-text-muted": mergedColors.textMuted,
    "--cc-outline": mergedColors.outline,
    "--cc-stripe-from": mergedColors.stripeFrom,
    "--cc-stripe-middle": mergedColors.stripeMiddle,
    "--cc-stripe-to": mergedColors.stripeTo,
    "--cc-panel-bg": mergedColors.panelBg,
    "--cc-cvv-label": mergedColors.cvvLabel,
    "--cc-cvv-value": mergedColors.cvvValue,
    "--cc-glare-strong": mergedColors.glareStrong,
    "--cc-glare-soft": mergedColors.glareSoft,
  } as CSSProperties;

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    const writeStyles = () => {
      const { rx, ry, px, py, opacity } = currentRef.current;
      card.style.setProperty("--cc-rotate-x", `${rx.toFixed(2)}deg`);
      card.style.setProperty("--cc-rotate-y", `${ry.toFixed(2)}deg`);
      card.style.setProperty("--cc-pointer-x", `${px.toFixed(2)}%`);
      card.style.setProperty("--cc-pointer-y", `${py.toFixed(2)}%`);
      card.style.setProperty("--cc-glare-opacity", opacity.toFixed(3));
    };

    const tick = () => {
      const current = currentRef.current;
      const target = targetRef.current;

      const ease = pointerActiveRef.current ? 0.16 : 0.1;
      current.rx += (target.rx - current.rx) * ease;
      current.ry += (target.ry - current.ry) * ease;
      current.px += (target.px - current.px) * ease;
      current.py += (target.py - current.py) * ease;
      current.opacity +=
        (target.opacity - current.opacity) *
        (pointerActiveRef.current ? 0.18 : 0.08);
      writeStyles();

      const shouldContinue =
        pointerActiveRef.current ||
        Math.abs(current.rx - target.rx) > 0.02 ||
        Math.abs(current.ry - target.ry) > 0.02 ||
        Math.abs(current.px - target.px) > 0.02 ||
        Math.abs(current.py - target.py) > 0.02 ||
        Math.abs(current.opacity - target.opacity) > 0.01;

      if (shouldContinue) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    const startRaf = () => {
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const px = clamp((localX / rect.width) * 100, 0, 100);
      const py = clamp((localY / rect.height) * 100, 0, 100);
      const nx = px / 100 - 0.5;
      const ny = py / 100 - 0.5;

      pointerActiveRef.current = true;
      targetRef.current.rx = -ny * maxTilt * 2;
      targetRef.current.ry = nx * maxTilt * 2;
      targetRef.current.px = px;
      targetRef.current.py = py;
      targetRef.current.opacity = 1;
      startRaf();
    };

    const onPointerLeave = () => {
      pointerActiveRef.current = false;
      targetRef.current.rx = 0;
      targetRef.current.ry = 0;
      targetRef.current.px = 50;
      targetRef.current.py = 50;
      targetRef.current.opacity = 0;
      startRaf();
    };

    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerleave", onPointerLeave);

    return () => {
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [maxTilt]);

  const setFlippedState = (next: boolean) => {
    if (!isControlled) {
      setInternalFlipped(next);
    }
    onFlippedChange?.(next);
  };

  const handleToggle = () => {
    if (!clickToFlip) return;
    setFlippedState(!isFlipped);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!clickToFlip) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setFlippedState(!isFlipped);
    }
  };

  return (
    <div
      className={cn("cc3d-root w-full max-w-[92vw]", className)}
      style={cssVars}
    >
      <div
        className="cc3d-stage w-full"
        style={{ aspectRatio: "1.58 / 1", perspective: "1200px" }}
        ref={stageRef}
      >
        <article
          className={cn(
            "cc3d-card",
            isFlipped && "is-flipped",
            clickToFlip && "is-clickable",
          )}
          ref={cardRef}
          onClick={clickToFlip ? handleToggle : undefined}
          onKeyDown={clickToFlip ? handleKeyDown : undefined}
          role={clickToFlip ? "button" : undefined}
          tabIndex={clickToFlip ? 0 : undefined}
          aria-label={
            clickToFlip
              ? isFlipped
                ? "Flip card to front side"
                : "Flip card to back side"
              : undefined
          }
          aria-pressed={clickToFlip ? isFlipped : undefined}
        >
          <div className="cc3d-inner">
            <div className="cc3d-face cc3d-face--front">
              <span className="cc3d-glare" aria-hidden="true" />
              <div className="cc3d-content">
                <p className="cc3d-number">{cardNumber}</p>
                <div className="cc3d-meta">
                  <div>
                    <span className="cc3d-label">CARDHOLDER</span>
                    <strong className="cc3d-value">{cardholder}</strong>
                  </div>
                  <div className="cc3d-meta-right">
                    <span className="cc3d-label">EXPIRES</span>
                    <strong className="cc3d-value">{expires}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="cc3d-face cc3d-face--back">
              <span className="cc3d-magstripe" aria-hidden="true" />
              <div className="cc3d-signature-panel">
                <span className="cc3d-cvv-label">CVV</span>
                <strong className="cc3d-cvv-value">{cvv}</strong>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default CreditCard;
