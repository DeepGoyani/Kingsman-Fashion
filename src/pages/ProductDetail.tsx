import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, ShoppingBag, Minus, Plus } from "lucide-react";
import { getProductBySlug, formatPrice } from "@/lib/products";
import { useCartStore } from "@/stores/cartStore";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const totalItems = useCartStore((s) => s.totalItems());

  const [mode, setMode] = useState<"PURCHASE" | "RENTAL">("PURCHASE");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  if (!product) {
    return (
      <PageTransition>
        <div className="bg-background min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-4xl text-foreground mb-4">Product Not Found</h1>
            <Link to="/collections" className="font-body text-gold underline">
              Back to Collections
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const rentalDays =
    startDate && endDate
      ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

  const totalPrice =
    mode === "PURCHASE"
      ? product.purchasePrice * quantity
      : product.rentPricePerDay * rentalDays * quantity;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (mode === "RENTAL" && (!startDate || !endDate)) {
      toast.error("Please select rental dates");
      return;
    }
    addItem({
      productId: product.id,
      type: mode,
      size: selectedSize,
      quantity,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
        <Navigation />
        <CartDrawer />

        <section className="pt-28 pb-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Back + Cart */}
            <div className="flex items-center justify-between mb-10">
              <Link
                to="/collections"
                className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Link>
              <button onClick={toggleCart} className="relative p-3 border border-border rounded-sm hover:bg-muted transition-colors">
                <ShoppingBag className="w-5 h-5 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold text-foreground text-xs flex items-center justify-center font-body font-semibold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Image */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="aspect-[3/4] bg-muted overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-8">
                <div>
                  <p className="font-body text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-2">
                    {product.category}
                  </p>
                  <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
                    {product.name}
                  </h1>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Buy / Rent Toggle */}
                {product.isRentable && (
                  <div className="flex border border-border">
                    <button
                      onClick={() => setMode("PURCHASE")}
                      className={`flex-1 py-3 font-body text-sm tracking-wider transition-all ${
                        mode === "PURCHASE"
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Buy — {formatPrice(product.purchasePrice)}
                    </button>
                    <button
                      onClick={() => setMode("RENTAL")}
                      className={`flex-1 py-3 font-body text-sm tracking-wider transition-all ${
                        mode === "RENTAL"
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Rent — {formatPrice(product.rentPricePerDay)}/day
                    </button>
                  </div>
                )}

                {/* Size Selector */}
                <div>
                  <p className="font-body text-xs tracking-[0.2em] text-muted-foreground uppercase mb-3">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] py-2.5 px-4 border font-body text-sm transition-all ${
                          selectedSize === size
                            ? "bg-foreground text-background border-foreground"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rental Date Range */}
                {mode === "RENTAL" && (
                  <div className="space-y-3">
                    <p className="font-body text-xs tracking-[0.2em] text-muted-foreground uppercase">
                      Rental Period
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-body text-sm",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PP") : "Start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-body text-sm",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PP") : "End date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) => date < (startDate || new Date())}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {rentalDays > 0 && (
                      <p className="font-body text-sm text-muted-foreground">
                        {rentalDays} day{rentalDays > 1 ? "s" : ""} · Deposit: {formatPrice(product.securityDeposit)}
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <p className="font-body text-xs tracking-[0.2em] text-muted-foreground uppercase mb-3">
                    Quantity
                  </p>
                  <div className="flex items-center gap-4 border border-border w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4 text-foreground" />
                    </button>
                    <span className="font-body text-foreground w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="space-y-3 pt-4 border-t border-border">
                  {totalPrice > 0 && (
                    <p className="font-heading text-2xl text-foreground">
                      {formatPrice(totalPrice)}
                    </p>
                  )}
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-foreground text-background font-body text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-foreground transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
