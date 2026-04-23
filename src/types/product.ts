export type ProductCategory = "sherwani" | "lehenga" | "accessory" | "suit";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  images: string[];
  purchasePrice: number;
  rentPricePerDay: number;
  securityDeposit: number;
  sizes: string[];
  description: string;
  isRentable: boolean;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  type: "PURCHASE" | "RENTAL";
  size: string;
  quantity: number;
  startDate?: string;
  endDate?: string;
  securityDeposit?: number;
}
