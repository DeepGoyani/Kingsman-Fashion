import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  delay?: number;
  stagger?: number;
}

const RevealText = ({ children, className = "", as: Tag = "div", delay = 0, stagger = 0.08 }: RevealTextProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !innerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { y: "110%", skewY: 4 },
        {
          y: "0%",
          skewY: 0,
          duration: 1,
          ease: "power3.out",
          delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay, stagger]);

  return (
    <Tag ref={containerRef as any} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} style={{ willChange: "transform" }}>
        {children}
      </div>
    </Tag>
  );
};

export default RevealText;
