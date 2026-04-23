import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import MagneticButton from "./MagneticButton";
import { toast } from "sonner";

const standardLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Lookbook", href: "/#lookbook" },
  { label: "About", href: "/#about" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("kingsman_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        overlayRef.current,
        { clipPath: "circle(0% at calc(100% - 40px) 40px)" },
        { clipPath: "circle(150% at calc(100% - 40px) 40px)", duration: 0.8, ease: "power3.inOut" }
      );
      gsap.fromTo(
        linksRef.current.filter(Boolean),
        { y: 80, opacity: 0, rotateX: 40 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.08, duration: 0.6, ease: "power3.out", delay: 0.3 }
      );
    } else {
      document.body.style.overflow = "";
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          clipPath: "circle(0% at calc(100% - 40px) 40px)",
          duration: 0.5,
          ease: "power3.inOut",
        });
      }
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("kingsman_token");
    localStorage.removeItem("kingsman_user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
    setIsOpen(false);
  };

  const dynamicLinks = [
    ...standardLinks,
    ...(user?.role === "admin" ? [{ label: "Admin", href: "/admin" }] : []),
    ...(user
      ? [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Logout", action: handleLogout }
        ]
      : [{ label: "Login", href: "/auth" }]),
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
          scrolled ? "bg-charcoal/90 backdrop-blur-md py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12">
          <MagneticButton strength={0.15}>
            <Link to="/" onClick={() => setIsOpen(false)} className={`font-heading text-xl md:text-2xl tracking-wider ${isOpen ? 'text-ivory' : 'text-ivory'}`}>
              KINGSMAN
            </Link>
          </MagneticButton>

          <span className={`hidden md:block font-body text-xs tracking-[0.3em] uppercase tabular-nums transition-colors duration-500 ${isOpen ? 'text-ivory/50' : 'text-ivory/50'}`}>
            {clock}
          </span>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-[70] flex flex-col gap-1.5 p-2 group"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-7 h-[2px] bg-ivory transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-[8px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-ivory transition-all duration-300 ml-auto ${
                isOpen ? "opacity-0 w-0" : "group-hover:w-7"
              }`}
            />
            <span
              className={`block w-7 h-[2px] bg-ivory transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-[8px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Full-screen overlay menu with pure Tailwind */}
      <div
        className={`fixed inset-0 z-[55] bg-charcoal flex items-center justify-center transition-all duration-700 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto rounded-none" : "opacity-0 pointer-events-none rounded-b-[100%]"
        }`}
      >
        <div className="flex flex-col items-center gap-8 translate-y-[-20px]">
          {dynamicLinks.map((link, i) => (
            <div
              key={link.label}
              style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              className={`transition-all duration-700 transform ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              <MagneticButton strength={0.2}>
                {link.action ? (
                  <button
                    onClick={link.action}
                    className="font-heading text-5xl md:text-7xl text-ivory/80 hover:text-gold transition-colors duration-300 tracking-wide hover:tracking-widest inline-block"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    to={link.href!}
                    onClick={() => setIsOpen(false)}
                    className="font-heading text-5xl md:text-7xl text-ivory/80 hover:text-gold transition-colors duration-300 tracking-wide hover:tracking-widest inline-block"
                  >
                    {link.label}
                  </Link>
                )}
              </MagneticButton>
            </div>
          ))}
        </div>
        <div className={`absolute bottom-12 left-0 right-0 flex justify-center transition-all duration-1000 delay-500 ${isOpen ? "opacity-100" : "opacity-0"}`}>
          <span className="font-body text-sm tracking-[0.3em] text-ivory/30 uppercase">
            Kingsman Wedding Palace — Est. 2024
          </span>
        </div>
      </div>
    </>
  );
};

export default Navigation;
