import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "./RevealText";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger columns from bottom
      columnsRef.current.filter(Boolean).forEach((col, i) => {
        gsap.fromTo(
          col,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.15,
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 85%",
            },
          }
        );
      });

      // Gold shimmer on title
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { backgroundPosition: "-200% 0" },
          {
            backgroundPosition: "200% 0",
            duration: 3,
            ease: "none",
            repeat: -1,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 90%",
            },
          }
        );
      }
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} id="footer" className="bg-charcoal border-t border-gold/20 pt-20 pb-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div ref={(el) => { columnsRef.current[0] = el; }} className="md:col-span-2">
            <h3
              ref={titleRef}
              className="font-heading text-3xl text-ivory mb-4"
              style={{
                background: "linear-gradient(90deg, hsl(40 33% 94%) 0%, hsl(42 55% 70%) 40%, hsl(42 45% 53%) 50%, hsl(42 55% 70%) 60%, hsl(40 33% 94%) 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Kingsman
            </h3>
            <p className="font-body text-ivory/50 text-sm leading-relaxed max-w-md">
              Premium ethnic wear for those who believe every occasion deserves to be dressed in royalty.
              Buy or rent — the choice is yours, the elegance is guaranteed.
            </p>
          </div>

          <div ref={(el) => { columnsRef.current[1] = el; }}>
            <h4 className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-6">Explore</h4>
            <div className="flex flex-col gap-3">
              {["Collections", "Lookbook", "Rental Guide", "Size Chart"].map((link) => (
                <a key={link} href="#" className="font-body text-sm text-ivory/50 hover:text-gold transition-colors duration-300 story-link w-fit">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div ref={(el) => { columnsRef.current[2] = el; }}>
            <h4 className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-6">Connect</h4>
            <div className="flex flex-col gap-3">
              {["Instagram", "WhatsApp", "Email Us", "Visit Store"].map((link) => (
                <a key={link} href="#" className="font-body text-sm text-ivory/50 hover:text-gold transition-colors duration-300 story-link w-fit">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-ivory/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-ivory/30">
            © 2024 Kingsman Wedding Palace. All rights reserved.
          </p>
          <p className="font-body text-xs text-ivory/30 tracking-[0.2em]">
            CRAFTED WITH LOVE
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
