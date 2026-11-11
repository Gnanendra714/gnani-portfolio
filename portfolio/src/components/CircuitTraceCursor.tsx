import { useEffect, useRef } from "react";
import "./CircuitTraceCursor.css";

export default function CircuitTraceCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!finePointer || reducedMotion) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      // Direct 1:1 tracking with the actual mouse position.
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;

      const target = event.target;

      const interactive =
        target instanceof Element &&
        target.closest(
          "a, button, [role='button'], input, textarea, select, label, .cursor-interactive",
        );

      cursor.classList.toggle("is-hovering", Boolean(interactive));
      cursor.classList.add("is-visible");
    };

    const handleLeave = () => {
      cursor.classList.remove("is-visible");
    };

    const handleEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        cursor.classList.add("is-visible");
      }
    };

    const handleClick = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      cursor.classList.remove("is-clicking");
      void cursor.offsetWidth;
      cursor.classList.add("is-clicking");
    };

    document.documentElement.classList.add("hexa-cursor-enabled");

    window.addEventListener("pointermove", handleMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("pointerenter", handleEnter);
    window.addEventListener("pointerdown", handleClick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("pointerenter", handleEnter);
      window.removeEventListener("pointerdown", handleClick);

      document.documentElement.classList.remove("hexa-cursor-enabled");
    };
  }, []);

  return (
    <div ref={cursorRef} className="hexa-cursor" aria-hidden="true">
      <div className="hexa-glow" />

      <svg viewBox="0 0 48 48" className="hexa-svg">
        <polygon
          className="hexa-outer"
          points="24,3 42,13.5 42,34.5 24,45 6,34.5 6,13.5"
          fill="none"
          strokeWidth="1.5"
        />

        <polygon
          className="hexa-inner"
          points="24,10 36,17 36,31 24,38 12,31 12,17"
          fill="none"
          strokeWidth="1.2"
        />

        <circle className="hexa-center" cx="24" cy="24" r="3.5" />

        <path
          className="hexa-ticks"
          d="M24 0 V5 M24 43 V48 M3 24 H7 M41 24 H45"
          fill="none"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
