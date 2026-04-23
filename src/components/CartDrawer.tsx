import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { products, formatPrice } from "@/lib/products";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore();

  const purchaseItems = items.filter((i) => i.type === "PURCHASE");
  const rentalItems = items.filter((i) => i.type === "RENTAL");

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/40 z-[70] backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background z-[75] shadow-2xl transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading text-2xl text-foreground">Your Cart</h2>
          <button onClick={closeCart} className="p-2 hover:bg-muted rounded-sm transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              <p className="font-body text-muted-foreground">Your cart is empty</p>
              <Link
                to="/collections"
                onClick={closeCart}
                className="font-body text-sm text-gold underline"
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            <>
              {purchaseItems.length > 0 && (
                <div>
                  <p className="font-body text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-4">
                    Purchase
                  </p>
                  <div className="space-y-4">
                    {purchaseItems.map((item) => (
                      <CartItemRow key={`${item.productId}-${item.type}`} item={item} />
                    ))}
                  </div>
                </div>
              )}
              {rentalItems.length > 0 && (
                <div>
                  <p className="font-body text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-4">
                    Rental
                  </p>
                  <div className="space-y-4">
                    {rentalItems.map((item) => (
                      <CartItemRow key={`${item.productId}-${item.type}`} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Total</span>
              <span className="font-heading text-2xl text-foreground">
                {formatPrice(totalPrice())}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full py-4 bg-foreground text-background font-body text-sm tracking-[0.2em] uppercase text-center hover:bg-gold hover:text-foreground transition-all duration-300"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

function CartItemRow({ item }: { item: ReturnType<typeof useCartStore.getState>["items"][0] }) {
  const { removeItem, updateQuantity } = useCartStore();
  const product = products.find((p) => p.id === item.productId);
  if (!product) return null;

  return (
    <div className="flex gap-4">
      <div className="w-16 h-20 bg-muted flex-shrink-0 overflow-hidden">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-heading text-sm text-foreground truncate">{product.name}</h4>
        <p className="font-body text-xs text-muted-foreground">
          Size: {item.size}
          {item.type === "RENTAL" && item.startDate && item.endDate && (
            <> · {format(new Date(item.startDate), "MMM d")} – {format(new Date(item.endDate), "MMM d")}</>
          )}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 border border-border">
            <button onClick={() => updateQuantity(item.productId, item.type, item.quantity - 1)} className="p-1 hover:bg-muted">
              <Minus className="w-3 h-3 text-foreground" />
            </button>
            <span className="font-body text-xs w-5 text-center text-foreground">{item.quantity}</span>
            <button onClick={() => updateQuantity(item.productId, item.type, item.quantity + 1)} className="p-1 hover:bg-muted">
              <Plus className="w-3 h-3 text-foreground" />
            </button>
          </div>
          <button
            onClick={() => removeItem(item.productId, item.type)}
            className="font-body text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
