import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { formatPrice } from "@/lib/products";
import RevealText from "./RevealText";

gsap.registerPlugin(ScrollTrigger);

const API_BASE = "http://localhost:5000/api";

const desktopDirections = [
  { x: -120, y: 60, rotate: -5, scale: 0.85 },
  { x: 120, y: 60, rotate: 5, scale: 0.85 },
  { x: -80, y: 120, rotate: -3, scale: 0.9 },
  { x: 80, y: 120, rotate: 3, scale: 0.9 },
];

const mobileDirections = [
  { x: -60, y: 40, rotate: -3, scale: 0.92 },
  { x: 60, y: 40, rotate: 3, scale: 0.92 },
  { x: -60, y: 40, rotate: -3, scale: 0.92 },
  { x: 60, y: 40, rotate: 3, scale: 0.92 },
];

const FeaturedSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products`);
        setFeaturedProducts(res.data.filter((p: any) => p.featured).slice(0, 4));
      } catch (err) {
        console.error("Error fetching featured products:", err);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (featuredProducts.length === 0) return;

    const isMobile = window.innerWidth < 768;
    const directions = isMobile ? mobileDirections : desktopDirections;

    const ctx = gsap.context(() => {
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        const dir = directions[i] || directions[0];
        gsap.fromTo(
          card,
          { opacity: 0, y: dir.y, x: dir.x, rotate: dir.rotate, scale: dir.scale },
          {
            opacity: 1,
            y: 0,
            x: 0,
            rotate: 0,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              toggleActions: "restart none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [featuredProducts]);

  return (
    <section ref={sectionRef} className="bg-background py-24 md:py-32 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <RevealText as="p" className="font-body text-xs tracking-[0.4em] uppercase text-secondary mb-4">
            Curated
          </RevealText>
          <RevealText as="h2" className="font-heading text-4xl md:text-6xl text-foreground" delay={0.1}>
            Featured Collection
          </RevealText>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: "1000px" }}>
          {featuredProducts.map((product, i) => (
            <Link
              key={product._id}
              to={`/product/${product.slug}`}
              ref={(el: any) => { cardsRef.current[i] = el; }}
              className="group cursor-pointer block"
            >
              <div className="relative overflow-hidden aspect-[3/4] mb-5 border border-transparent group-hover:border-gold/40 transition-all duration-500 group-hover:shadow-[0_20px_60px_-15px_hsl(42_45%_53%/0.25)]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />
                <div className="absolute bottom-4 left-4 right-4 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
                  <span className="block w-full py-3 bg-gold text-charcoal font-body text-xs tracking-[0.2em] uppercase text-center relative overflow-hidden group/btn">
                    <span className="relative z-10">View Details</span>
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </span>
                </div>
              </div>
              <h3 className="font-heading text-lg text-foreground mb-1 group-hover:text-secondary transition-colors duration-300">
                {product.name}
              </h3>
              <div className="flex items-center gap-3">
                <span className="font-body text-sm text-foreground">{formatPrice(product.purchasePrice)}</span>
                <span className="font-body text-xs text-muted-foreground">or {formatPrice(product.rentPricePerDay)}/day</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
