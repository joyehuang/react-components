import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import "./text-scatter.css";

type LetterPhysics = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
};

const RADIUS = 150;
const FORCE = 2.6;
const SPRING = 0.065;
const DAMPING = 0.86;

export function TextScatter() {
  const text = "Bounce Back.";
  const chars = useMemo(() => Array.from(text), [text]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const physicsRef = useRef<LetterPhysics[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const setupLetters = () => {
      const containerRect = root.getBoundingClientRect();

      physicsRef.current = letterRefs.current.map((el) => {
        if (!el) {
          return { x: 0, y: 0, vx: 0, vy: 0, ox: 0, oy: 0 };
        }

        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width * 0.5,
          y: rect.top - containerRect.top + rect.height * 0.5,
          vx: 0,
          vy: 0,
          ox: 0,
          oy: 0,
        };
      });
    };

    const animate = () => {
      const letters = physicsRef.current;
      const pointer = pointerRef.current;

      for (let i = 0; i < letters.length; i += 1) {
        const point = letters[i];
        const dx = point.x + point.ox - pointer.x;
        const dy = point.y + point.oy - pointer.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (pointer.active && dist < RADIUS) {
          const power = (1 - dist / RADIUS) * FORCE;
          point.vx += (dx / dist) * power;
          point.vy += (dy / dist) * power;
        }

        point.vx += -point.ox * SPRING;
        point.vy += -point.oy * SPRING;
        point.vx *= DAMPING;
        point.vy *= DAMPING;
        point.ox += point.vx;
        point.oy += point.vy;

        const el = letterRefs.current[i];
        if (el) {
          const rotation = point.ox * 0.2;
          el.style.transform = `translate(${point.ox.toFixed(2)}px, ${point.oy.toFixed(2)}px) rotate(${rotation.toFixed(2)}deg)`;
        }
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointerRef.current.x = event.clientX - rect.left;
      pointerRef.current.y = event.clientY - rect.top;
      pointerRef.current.active = true;
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    setupLetters();
    rafRef.current = window.requestAnimationFrame(animate);

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", setupLetters);

    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", setupLetters);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section
      className="text-scatter min-h-[calc(100vh-var(--app-header-height,72px))] grid place-items-center bg-black"
      aria-label="Interactive text scatter"
    >
      <div
        ref={containerRef}
        className="text-scatter__stage w-[min(92vw,980px)] min-h-[52vh] flex items-center justify-center flex-wrap gap-[clamp(2px,0.45vw,7px)] select-none cursor-default"
      >
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            ref={(el) => {
              letterRefs.current[index] = el;
            }}
            className={cn(
              "text-scatter__char inline-block",
              char === " " && "is-space",
            )}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </section>
  );
}

export default TextScatter;
