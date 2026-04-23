import { useEffect, useRef } from "react";
import gsap from "gsap";

const CursorFollower = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power2.out" });
    };

    const onEnter = () => {
      gsap.to(dot, { scale: 2.5, opacity: 0.6, duration: 0.3 });
      gsap.to(ring, { scale: 1.8, opacity: 0, duration: 0.3 });
    };

    const onLeave = () => {
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(ring, { scale: 1, opacity: 0.4, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMove);

    const attachHovers = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    attachHovers();
    const observer = new MutationObserver(attachHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-gold pointer-events-none z-[9999] mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 rounded-full border border-gold/40 pointer-events-none z-[9999] opacity-40"
        style={{ willChange: "transform" }}
      />
    </>
  );
};

export default CursorFollower;
