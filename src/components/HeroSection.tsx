import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax zoom on scroll
      gsap.to(imageRef.current, {
        scale: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Rotating radial light sweep
      gsap.to(overlayRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });

      // Split-word headline animation
      if (headlineRef.current) {
        const words = headlineRef.current.innerText.split(" ");
        headlineRef.current.innerHTML = words
          .map((word) => `<span class="inline-block overflow-hidden mr-[0.3em]"><span class="inline-block hero-word">${word}</span></span>`)
          .join("");

        gsap.fromTo(
          headlineRef.current.querySelectorAll(".hero-word"),
          { y: "110%", rotateX: 40 },
          {
            y: "0%",
            rotateX: 0,
            stagger: 0.06,
            duration: 1,
            ease: "power3.out",
            delay: 0.4,
          }
        );
      }

      // Subtitle fade in
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out", delay: 1.3 }
      );

      // CTA fade in
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.8 }
      );

      // Scroll indicator
      gsap.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 2.5 }
      );

      // Fade out hero on scroll
      gsap.to(sectionRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "70% top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div ref={imageRef} className="absolute inset-0 scale-100">
        <img src="/assets/hero-bg.jpg" alt="Luxury ethnic wear" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/60" />
      </div>

      {/* Rotating radial gradient overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-[-50%] pointer-events-none"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, hsl(42 45% 53% / 0.04) 25%, transparent 50%, hsl(345 65% 18% / 0.04) 75%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl" style={{ perspective: "800px" }}>
        <p className="font-body text-xs tracking-[0.4em] uppercase text-gold mb-6 opacity-80">
          Premium Ethnic Wear · Buy & Rent
        </p>
        <h1
          ref={headlineRef}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-ivory leading-[1.1] mb-8"
        >
          Kingsman Wedding Palace
        </h1>
        <p ref={subtitleRef} className="font-body text-lg md:text-xl text-ivory/70 max-w-2xl mx-auto mb-12 leading-relaxed">
          Where tradition meets couture. Discover our exquisite collection of wedding attire,
          available to purchase or rent for your most precious moments.
        </p>
        <div ref={ctaRef}>
          <MagneticButton>
            <button className="relative px-10 py-4 font-body text-sm tracking-[0.25em] uppercase bg-transparent border border-gold text-gold hover:bg-gold hover:text-charcoal transition-colors duration-500 gold-glow overflow-hidden group">
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
          </MagneticButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div ref={scrollRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-ivory/40">Scroll</span>
        <div className="w-[1px] h-12 bg-ivory/20 relative overflow-hidden">
          <div className="w-full h-4 bg-gold animate-scroll-indicator" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
