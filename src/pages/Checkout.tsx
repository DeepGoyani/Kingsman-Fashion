import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/products";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { toast } from "sonner";

const steps = ["Review", "Address", "Payment"];
import { API_BASE_URL as API_BASE } from "@/lib/api-config";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="bg-background min-h-screen">
          <Navigation />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="font-heading text-3xl text-foreground mb-4">Cart is empty</h1>
              <button
                onClick={() => navigate("/collections")}
                className="font-body text-sm text-gold underline"
              >
                Browse Collections
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const checkoutItems = items.map((item) => {
        return {
          productId: item.productId,
          quantity: item.quantity,
          type: item.type,
          size: item.size,
          itemPrice: item.price,
          depositAmount: item.securityDeposit || 0,
          startDate: item.startDate,
          endDate: item.endDate
        };
      });

      const token = localStorage.getItem("kingsman_token");
      if (!token) throw new Error("Not authenticated");

      await axios.post(`${API_BASE}/orders/checkout`, {
        items: checkoutItems,
        totalAmount: totalPrice(),
        shippingAddress: address
      }, {
        headers: { "x-auth-token": token }
      });

      clearCart();
      navigate("/payment-success");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || err.message || "Payment processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
        <Navigation />

        <section className="pt-28 pb-24 px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            {/* Back */}
            <button
              onClick={() => (step > 0 ? setStep(step - 1) : navigate("/collections"))}
              className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> {step > 0 ? "Back" : "Continue Shopping"}
            </button>

            {/* Steps */}
            <div className="flex items-center gap-4 mb-12">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-sm transition-all ${
                      i < step
                        ? "bg-gold text-foreground"
                        : i === step
                        ? "bg-foreground text-background"
                        : "border border-border text-muted-foreground"
                    }`}
                  >
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`font-body text-sm hidden sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                    {s}
                  </span>
                  {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
                </div>
              ))}
            </div>

            {/* Step 0: Review */}
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="font-heading text-3xl text-foreground">Review Order</h2>
                <div className="space-y-4">
                  {items.map((item) => {
                    return (
                      <div key={`${item.productId}-${item.type}`} className="flex gap-4 py-4 border-b border-border">
                        <div className="w-16 h-20 bg-muted flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-heading text-sm text-foreground">{item.name}</h4>
                          <p className="font-body text-xs text-muted-foreground">
                            {item.type === "RENTAL" ? "Rental" : "Purchase"} · Size: {item.size} · Qty: {item.quantity}
                          </p>
                          {item.type === "RENTAL" && item.startDate && item.endDate && (
                            <p className="font-body text-xs text-muted-foreground">
                              {format(new Date(item.startDate), "MMM d")} – {format(new Date(item.endDate), "MMM d, yyyy")}
                            </p>
                          )}
                        </div>
                        <span className="font-body text-sm text-foreground">
                          {formatPrice(
                            item.type === "PURCHASE"
                              ? item.price * item.quantity
                              : item.startDate && item.endDate
                              ? (item.price *
                                Math.max(1, Math.ceil((new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / 86400000)) *
                                item.quantity) + (item.securityDeposit || 0)
                              : item.price * item.quantity
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="font-body text-muted-foreground">Total</span>
                  <span className="font-heading text-2xl text-foreground">{formatPrice(totalPrice())}</span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-4 bg-foreground text-background font-body text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-foreground transition-all"
                >
                  Continue to Address
                </button>
              </div>
            )}

            {/* Step 1: Address */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-heading text-3xl text-foreground">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full Name", full: true },
                    { key: "phone", label: "Phone", full: false },
                    { key: "line1", label: "Address Line 1", full: true },
                    { key: "line2", label: "Address Line 2", full: true },
                    { key: "city", label: "City", full: false },
                    { key: "state", label: "State", full: false },
                    { key: "pincode", label: "Pincode", full: false },
                  ].map((field) => (
                    <div key={field.key} className={field.full ? "sm:col-span-2" : ""}>
                      <label className="font-body text-xs tracking-[0.2em] text-muted-foreground uppercase block mb-2">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={address[field.key as keyof typeof address]}
                        onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border font-body text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) {
                      toast.error("Please fill all required fields");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full py-4 bg-foreground text-background font-body text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-foreground transition-all"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-heading text-3xl text-foreground">Secure Checkout</h2>
                <div className="p-8 border border-border text-center space-y-4">
                  <p className="font-body text-muted-foreground">
                    Confirm your order placement
                  </p>
                  <p className="font-heading text-3xl text-foreground">{formatPrice(totalPrice())}</p>
                </div>
                <button
                  disabled={isLoading}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gold text-foreground font-body text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Checkout;
