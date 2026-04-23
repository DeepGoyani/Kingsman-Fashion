import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "./RevealText";

gsap.registerPlugin(ScrollTrigger);

const counters = [
  { value: 500, suffix: "+", label: "Designs" },
  { value: 15, suffix: "+", label: "Years" },
  { value: 10, suffix: "K+", label: "Happy Clients" },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax image with horizontal shift
      gsap.to(imageRef.current, {
        yPercent: -20,
        xPercent: -5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Counter animation
      counterRefs.current.filter(Boolean).forEach((el, i) => {
        const target = counters[i].value;
        gsap.fromTo(
          { val: 0 },
          { val: 0 },
          {
            val: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            onUpdate: function () {
              if (el) el.textContent = Math.floor(this.targets()[0].val) + counters[i].suffix;
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative min-h-screen bg-charcoal overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-screen">
        {/* Image side */}
        <div className="relative h-[50vh] md:h-auto overflow-hidden">
          <div ref={imageRef} className="absolute inset-[-10%] scale-110">
            <img src="/assets/about-bg.jpg" alt="Luxury collection" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-charcoal/30" />
          </div>
        </div>

        {/* Text side */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20">
          <RevealText as="p" className="font-body text-xs tracking-[0.4em] uppercase text-gold mb-6">
            The Art of Luxury
          </RevealText>
          <RevealText as="h2" className="font-heading text-4xl md:text-5xl lg:text-6xl text-ivory leading-[1.15] mb-8" delay={0.1}>
            Crafted for
            <br />
            <span className="text-gold-gradient">Royalty</span>
          </RevealText>
          <RevealText as="p" className="font-body text-ivory/60 text-lg leading-relaxed mb-6" delay={0.2}>
            Every piece in our collection tells a story of heritage. Hand-embroidered by
            master artisans, each garment carries generations of craftsmanship,
            designed for those who appreciate the extraordinary.
          </RevealText>
          <RevealText as="p" className="font-body text-ivory/60 text-lg leading-relaxed mb-10" delay={0.3}>
            Whether you choose to purchase your dream outfit or rent it for a special
            occasion, we ensure every moment feels nothing less than regal.
          </RevealText>
          <RevealText delay={0.4}>
            <div className="flex gap-12">
              {counters.map((c, i) => (
                <div key={c.label}>
                  <span
                    ref={(el) => { counterRefs.current[i] = el; }}
                    className="font-heading text-4xl text-gold"
                  >
                    0{c.suffix}
                  </span>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-ivory/40 mt-2">{c.label}</p>
                </div>
              ))}
            </div>
          </RevealText>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
