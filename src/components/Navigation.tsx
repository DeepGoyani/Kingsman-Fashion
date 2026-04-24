import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import MagneticButton from "./MagneticButton";
import { useCartStore } from "@/stores/cartStore";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const openCart = useCartStore((state) => state.openCart);

  // Clock Update
  useEffect(() => {
    const update = () => {
      setClock(new Date().toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false 
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll handler for background color
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const handleNav = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  const handleCartClick = () => {
    setIsOpen(false);
    openCart();
  };

  const menuItems = [
    { label: "Home", action: () => handleNav("/") },
    { label: "Collection", action: () => handleNav("/collections") },
    { label: "Cart", action: handleCartClick },
    { label: "About Us", action: () => handleNav("/#about") },
  ];

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-12",
          scrolled ? "bg-charcoal/90 backdrop-blur-md py-4 shadow-xl" : "bg-transparent py-8"
        )}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <MagneticButton strength={0.1}>
            <Link to="/" onClick={() => setIsOpen(false)} className="font-heading text-xl md:text-2xl tracking-[0.2em] text-ivory">
              KINGSMAN
            </Link>
          </MagneticButton>

          {/* Clock */}
          <div className="hidden md:block font-body text-xs tracking-[0.4em] text-gold/60 uppercase tabular-nums">
            {clock}
          </div>

          {/* Burger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-[110] flex flex-col items-end gap-1.5 p-2 group overflow-hidden"
          >
            <span className={cn("block h-[2px] bg-gold transition-all duration-500", isOpen ? "w-8 rotate-45 translate-y-[8px]" : "w-8")} />
            <span className={cn("block h-[2px] bg-gold transition-all duration-500", isOpen ? "w-0 opacity-0" : "w-5 group-hover:w-8")} />
            <span className={cn("block h-[2px] bg-gold transition-all duration-500", isOpen ? "w-8 -rotate-45 -translate-y-[8px]" : "w-8")} />
          </button>
        </div>
      </nav>

      {/* Full-Screen Hamburger Menu */}
      <div 
        className={cn(
          "fixed inset-0 z-[90] bg-charcoal flex items-center justify-center transition-all duration-700 ease-in-out",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Dynamic Background Ornament */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center overflow-hidden">
          <span className="font-heading text-[30vw] text-ivory select-none whitespace-nowrap">KINGSMAN</span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 md:gap-10">
          {menuItems.map((item, i) => (
            <div
              key={item.label}
              style={{ 
                transitionDelay: isOpen ? `${(i + 1) * 100}ms` : '0ms',
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(40px)'
              }}
              className="transition-all duration-700"
            >
              <button
                onClick={item.action}
                className="group relative inline-block py-2"
              >
                <span className="font-heading text-5xl md:text-8xl text-ivory/90 group-hover:text-gold transition-colors duration-300 tracking-[0.05em]">
                  {item.label}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold transition-all duration-500 group-hover:w-full" />
              </button>
            </div>
          ))}
        </div>

        {/* Menu Footer */}
        <div className={cn(
          "absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4 transition-all duration-1000 delay-500",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div className="w-12 h-[1px] bg-gold/30" />
          <span className="font-body text-[10px] tracking-[0.5em] text-gold/40 uppercase">
            Signature Couture House · 2024
          </span>
        </div>
      </div>
    </>
  );
};

export default Navigation;
