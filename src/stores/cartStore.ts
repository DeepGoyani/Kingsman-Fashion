import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/product";
import { products } from "@/lib/products";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, type: "PURCHASE" | "RENTAL") => void;
  updateQuantity: (productId: string, type: "PURCHASE" | "RENTAL", quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.type === item.type && i.size === item.size
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.type === item.type && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId, type) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.productId === productId && i.type === type)),
        })),

      updateQuantity: (productId, type, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => !(i.productId === productId && i.type === type))
            : state.items.map((i) =>
                i.productId === productId && i.type === type ? { ...i, quantity } : i
              ),
        })),

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return sum;
          if (item.type === "PURCHASE") return sum + product.purchasePrice * item.quantity;
          // Rental: calculate days
          if (item.startDate && item.endDate) {
            const days = Math.max(
              1,
              Math.ceil(
                (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            );
            return sum + product.rentPricePerDay * days * item.quantity;
          }
          return sum + product.rentPricePerDay * item.quantity;
        }, 0),
    }),
    { name: "kingsman-cart", partialize: (state) => ({ items: state.items }) }
  )
);
