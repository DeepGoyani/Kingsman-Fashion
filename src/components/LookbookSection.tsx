import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
  { src: "/assets/lookbook-1.jpg", title: "Bridal Lehenga", subtitle: "Heritage Collection" },
  { src: "/assets/lookbook-2.jpg", title: "Royal Sherwani", subtitle: "Groom's Edit" },
  { src: "/assets/lookbook-3.jpg", title: "Emerald Anarkali", subtitle: "Festive Collection" },
  { src: "/assets/lookbook-4.jpg", title: "Golden Saree", subtitle: "Occasion Wear" },
];

const LookbookSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<Record<number, React.CSSProperties>>({});

  const handleCardMove = (e: React.MouseEvent, index: number) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltStyle((prev) => ({
      ...prev,
      [index]: {
        transform: `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`,
        transition: "transform 0.1s ease-out",
      },
    }));
  };

  const handleCardLeave = (index: number) => {
    setTiltStyle((prev) => ({
      ...prev,
      [index]: {
        transform: "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)",
        transition: "transform 0.5s ease-out",
      },
    }));
  };

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    // Wait a frame so layout is settled
    const rafId = requestAnimationFrame(() => {
      const scrollWidth = container.scrollWidth - window.innerWidth;
      if (scrollWidth <= 0) return;

      const ctx = gsap.context(() => {
        gsap.to(container, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            pin: true,
            pinType: "transform",
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
      }, section);

      // Store for cleanup
      (section as any).__gsapCtx = ctx;
    });

    return () => {
      cancelAnimationFrame(rafId);
      const ctx = (section as any).__gsapCtx;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="lookbook"
      
      className="relative bg-charcoal overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Title */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-16 pb-8 px-8 md:px-16">
        <p className="font-body text-xs tracking-[0.4em] uppercase text-gold mb-3">Editorial</p>
        <h2 className="font-heading text-4xl md:text-6xl text-ivory">The Lookbook</h2>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-8 right-8 md:left-16 md:right-16 z-10 h-[1px] bg-ivory/10">
        <div
          ref={progressRef}
          className="h-full bg-gold origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={containerRef}
        className="flex items-center gap-8 pt-40 pb-20 px-8 md:px-16 will-change-transform"
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="flex-shrink-0 relative group cursor-pointer"
            style={{ width: "clamp(300px, 40vw, 600px)", ...tiltStyle[i] }}
            onMouseMove={(e) => handleCardMove(e, i)}
            onMouseLeave={() => handleCardLeave(i)}
          >
            <div className="relative overflow-hidden aspect-[3/4]">
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-2">
                  {img.subtitle}
                </p>
                <h3 className="font-heading text-3xl text-ivory">{img.title}</h3>
              </div>
            </div>
          </div>
        ))}
        <div className="flex-shrink-0 w-[20vw]" />
      </div>
    </section>
  );
};

export default LookbookSection;
