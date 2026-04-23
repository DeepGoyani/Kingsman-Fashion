import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { products, categories, formatPrice } from "@/lib/products";
import { ProductCategory } from "@/types/product";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const Collections = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
        <Navigation />
        <CartDrawer />

        {/* Header */}
        <section className="pt-32 pb-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-end justify-between">
            <div>
              <p className="font-body text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">
                Curated for Royalty
              </p>
              <h1 className="font-heading text-5xl md:text-7xl text-foreground">
                Collections
              </h1>
            </div>
            <button
              onClick={toggleCart}
              className="relative p-3 border border-border rounded-sm hover:bg-muted transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold text-foreground text-xs flex items-center justify-center font-body font-semibold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="px-6 md:px-12 mb-12">
          <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`font-body text-sm tracking-wider px-5 py-2.5 border transition-all duration-300 ${
                  activeCategory === cat.value
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="px-6 md:px-12 pb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link
                      to={`/product/${product.slug}`}
                      className="group block"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-muted mb-4 relative">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {product.isRentable && (
                          <span className="absolute top-4 left-4 font-body text-[10px] tracking-[0.2em] uppercase px-3 py-1 bg-foreground/80 text-background backdrop-blur-sm">
                            Rent Available
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="font-body text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                          {product.category}
                        </p>
                        <h3 className="font-heading text-xl text-foreground group-hover:text-gold transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-3 font-body text-sm">
                          <span className="text-foreground font-medium">
                            {formatPrice(product.purchasePrice)}
                          </span>
                          {product.isRentable && (
                            <span className="text-muted-foreground">
                              / {formatPrice(product.rentPricePerDay)}/day
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Collections;
