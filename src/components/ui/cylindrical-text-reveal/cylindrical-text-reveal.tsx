import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import "./cylindrical-text-reveal.css";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_LINES = ["EXPLORE", "THE", "FUTURE", "OF", "DESIGN"];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export type CylindricalTextRevealProps = {
  lines?: string[];
  hintText?: string;
  hintArrow?: string;
  showHint?: boolean;
  className?: string;
  background?: string;
  stickyTopOffset?: string;
  sectionMinHeight?: string;
  perspective?: number;
  radius?: number;
  angleStep?: number;
  revealStart?: number;
  revealEnd?: number;
  rollStartAngle?: number;
  rollEndAngle?: number;
  scrub?: number;
};

export function CylindricalTextReveal({
  lines = DEFAULT_LINES,
  hintText = "Scroll Down",
  hintArrow = "↓",
  showHint = true,
  className,
  background = "#000",
  stickyTopOffset = "0px",
  sectionMinHeight = "240vh",
  perspective = 700,
  radius = 330,
  angleStep = 0.26,
  revealStart = 0.14,
  revealEnd = 0.32,
  rollStartAngle = 1.2,
  rollEndAngle = -1.35,
  scrub = 0.85,
}: CylindricalTextRevealProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRefs = useRef<Array<HTMLHeadingElement | null>>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!section || mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      const linesToAnimate = lineRefs.current.filter(
        (line): line is HTMLHeadingElement => line !== null,
      );
      const hint = section.querySelector(".ctr__hint");
      if (linesToAnimate.length === 0) return;

      const baseAngles = linesToAnimate.map(
        (_, index) => (index - (linesToAnimate.length - 1) / 2) * angleStep,
      );

      const renderCylinder = (progress: number) => {
        if (progress < revealStart) {
          linesToAnimate.forEach((line) => {
            gsap.set(line, {
              y: 390,
              z: 500,
              rotationX: -12,
              scale: 1.26,
              filter: "blur(0.6px)",
              autoAlpha: 0,
            });
          });

          if (hint) gsap.set(hint, { autoAlpha: 1 });
          return;
        }

        const rollProgress = clamp(
          (progress - revealStart) / (1 - revealStart),
          0,
          1,
        );
        const revealProgress = clamp(
          (progress - revealStart) / Math.max(revealEnd - revealStart, 0.001),
          0,
          1,
        );
        const exitProgress = clamp((progress - 0.86) / 0.14, 0, 1);
        const rollAngle = gsap.utils.interpolate(
          rollStartAngle,
          rollEndAngle,
          rollProgress,
        );

        linesToAnimate.forEach((line, index) => {
          const angle = baseAngles[index] + rollAngle;
          const y = Math.sin(angle) * radius - exitProgress * radius * 0.95;
          const z = Math.cos(angle) * radius - radius * 0.74;
          const rotationX = (-angle * 180) / Math.PI;
          const visibility = clamp((z + radius * 0.97) / (radius * 1.03), 0, 1);
          const blur = (1 - visibility) * 1.2;
          const scale = 0.76 + visibility * 0.26;
          const exitAlpha = 1 - exitProgress;

          gsap.set(line, {
            y,
            z,
            rotationX,
            scale,
            filter: `blur(${blur}px)`,
            autoAlpha: visibility * revealProgress * exitAlpha,
          });
        });

        if (hint) {
          gsap.set(hint, { autoAlpha: clamp(1 - revealProgress * 3, 0, 1) });
        }
      };

      renderCylinder(0);

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          renderCylinder(self.progress);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [
    angleStep,
    radius,
    revealEnd,
    revealStart,
    rollEndAngle,
    rollStartAngle,
    scrub,
  ]);

  const sectionStyle = {
    minHeight: sectionMinHeight,
    background,
  } as CSSProperties;
  const stickyStyle: CSSProperties = {
    top: stickyTopOffset,
    height: `calc(100vh - ${stickyTopOffset})`,
  };
  const stageStyle = {
    ["--ctr-perspective" as string]: `${perspective}px`,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      className={cn("ctr relative", className)}
      style={sectionStyle}
      aria-label="Cylindrical text reveal"
    >
      <div
        className="ctr__sticky sticky overflow-hidden grid place-items-center"
        style={stickyStyle}
      >
        {showHint ? (
          <p className="ctr__hint absolute top-[38vh] m-0 grid gap-[0.4rem] justify-items-center">
            {hintText}
            <span className="ctr__hint-arrow" aria-hidden="true">
              {hintArrow}
            </span>
          </p>
        ) : null}
        <div
          className="ctr__stage w-[min(96vw,1020px)] grid justify-items-center gap-0"
          style={stageStyle}
        >
          {lines.map((line, lineIndex) => (
            <h2
              key={`${line}-${lineIndex}`}
              ref={(element) => {
                lineRefs.current[lineIndex] = element;
              }}
              className="ctr__line"
            >
              {line}
            </h2>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CylindricalTextReveal;
