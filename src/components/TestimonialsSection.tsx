import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Priya Sharma",
    text: "The sherwani we rented for my husband was absolutely stunning. Every detail was perfect, and the service was impeccable.",
    role: "Bride, Delhi",
  },
  {
    name: "Arjun Malhotra",
    text: "Kingsman made our wedding day truly regal. The quality of their lehengas is unmatched. Worth every penny.",
    role: "Groom, Mumbai",
  },
  {
    name: "Kavya Patel",
    text: "Renting from Kingsman was the smartest decision. Designer quality at a fraction of the cost. Our guests couldn't stop complimenting.",
    role: "Bride, Bangalore",
  },
  {
    name: "Rajesh Iyer",
    text: "The attention to craftsmanship is extraordinary. Each piece feels like it was made just for you.",
    role: "Customer, Chennai",
  },
];

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const text = testimonials[active].text;
    setDisplayText("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [active]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-charcoal py-24 md:py-32 px-6 md:px-16 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-body text-xs tracking-[0.4em] uppercase text-gold mb-4">Testimonials</p>
        <h2 className="font-heading text-4xl md:text-5xl text-ivory mb-16">
          Words of <span className="text-gold-gradient">Elegance</span>
        </h2>

        {/* Decorative quote marks */}
        <div ref={quoteRef} className="relative min-h-[200px]">
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-heading text-[120px] leading-none text-gold/[0.07] select-none pointer-events-none">
            "
          </span>

          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
                i === active
                  ? "opacity-100 scale-100 blur-0"
                  : "opacity-0 scale-95 blur-sm pointer-events-none"
              }`}
            >
              <p className="font-heading text-2xl md:text-3xl text-ivory/90 leading-relaxed mb-8 italic min-h-[100px]">
                "{i === active ? displayText : t.text}"
                {i === active && displayText.length < t.text.length && (
                  <span className="inline-block w-[2px] h-6 bg-gold ml-1 animate-pulse" />
                )}
              </p>
              <p className="font-body text-sm tracking-[0.2em] uppercase text-gold">{t.name}</p>
              <p className="font-body text-xs text-ivory/40 mt-1">{t.role}</p>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-16">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i === active ? "w-8 bg-gold" : "bg-ivory/20 hover:bg-ivory/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
