import { useEffect, useRef } from "react";
import gsap from "gsap";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry animation
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { scaleY: 1, transformOrigin: "top" },
        { scaleY: 0, duration: 0.8, ease: "power4.inOut", delay: 0.1 }
      );
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] bg-charcoal pointer-events-none"
        style={{ transformOrigin: "top" }}
      />
      <div ref={contentRef}>{children}</div>
    </>
  );
};

export default PageTransition;
