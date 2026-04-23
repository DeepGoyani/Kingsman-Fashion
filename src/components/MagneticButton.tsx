import { useRef } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
}

const MagneticButton = ({ children, className = "", strength = 0.3, onClick, href }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, { x: x * strength, y: y * strength, duration: 0.3, ease: "power2.out" });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
};

export default MagneticButton;
