import { Product } from "@/types/product";

import productSherwaniMidnight from "@/assets/product-sherwani-midnight.jpg";
import productSherwaniGold from "@/assets/product-sherwani-gold.jpg";
import productLehengaScarlet from "@/assets/product-lehenga-scarlet.jpg";
import productLehengaPink from "@/assets/product-lehenga-pink.jpg";
import productSuitMidnight from "@/assets/product-suit-midnight.jpg";
import productSuitIvory from "@/assets/product-suit-ivory.jpg";
import productKundanSet from "@/assets/product-kundan-set.jpg";
import productPagdi from "@/assets/product-pagdi.jpg";
import productLehengaEmerald from "@/assets/product-lehenga-emerald.jpg";
import productBroochSet from "@/assets/product-brooch-set.jpg";

export const products: Product[] = [
  {
    id: "1",
    name: "Royal Midnight Sherwani",
    slug: "royal-midnight-sherwani",
    category: "sherwani",
    images: [productSherwaniMidnight],
    purchasePrice: 45000,
    rentPricePerDay: 3500,
    securityDeposit: 15000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A regal midnight blue sherwani with intricate gold threadwork, perfect for the modern groom who commands attention.",
    isRentable: true,
    featured: true,
  },
  {
    id: "2",
    name: "Imperial Gold Sherwani",
    slug: "imperial-gold-sherwani",
    category: "sherwani",
    images: [productSherwaniGold],
    purchasePrice: 55000,
    rentPricePerDay: 4200,
    securityDeposit: 18000,
    sizes: ["M", "L", "XL"],
    description: "Handcrafted gold sherwani with zardozi embroidery and pearl accents. A masterpiece for royal celebrations.",
    isRentable: true,
    featured: true,
  },
  {
    id: "3",
    name: "Scarlet Bridal Lehenga",
    slug: "scarlet-bridal-lehenga",
    category: "lehenga",
    images: [productLehengaScarlet],
    purchasePrice: 85000,
    rentPricePerDay: 6500,
    securityDeposit: 25000,
    sizes: ["S", "M", "L"],
    description: "A breathtaking scarlet lehenga adorned with hand-embroidered floral motifs and kundan work.",
    isRentable: true,
    featured: true,
  },
  {
    id: "4",
    name: "Blush Pink Lehenga",
    slug: "blush-pink-lehenga",
    category: "lehenga",
    images: [productLehengaPink],
    purchasePrice: 72000,
    rentPricePerDay: 5500,
    securityDeposit: 22000,
    sizes: ["S", "M", "L", "XL"],
    description: "Delicate blush pink lehenga with sequin work and soft tulle dupatta. Modern elegance redefined.",
    isRentable: true,
  },
  {
    id: "5",
    name: "Midnight Velvet Suit",
    slug: "midnight-velvet-suit",
    category: "suit",
    images: [productSuitMidnight],
    purchasePrice: 38000,
    rentPricePerDay: 2800,
    securityDeposit: 12000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A sophisticated midnight velvet three-piece suit with satin lapels. Perfect for receptions and cocktail events.",
    isRentable: true,
  },
  {
    id: "6",
    name: "Classic Ivory Suit",
    slug: "classic-ivory-suit",
    category: "suit",
    images: [productSuitIvory],
    purchasePrice: 32000,
    rentPricePerDay: 2400,
    securityDeposit: 10000,
    sizes: ["M", "L", "XL"],
    description: "Timeless ivory suit crafted from premium Italian wool. Clean lines and impeccable tailoring.",
    isRentable: true,
  },
  {
    id: "7",
    name: "Heritage Kundan Set",
    slug: "heritage-kundan-set",
    category: "accessory",
    images: [productKundanSet],
    purchasePrice: 28000,
    rentPricePerDay: 2000,
    securityDeposit: 10000,
    sizes: ["One Size"],
    description: "Exquisite heritage kundan jewelry set with necklace, earrings, and maang tikka. Handcrafted by master artisans.",
    isRentable: true,
    featured: true,
  },
  {
    id: "8",
    name: "Pearl & Gold Pagdi",
    slug: "pearl-gold-pagdi",
    category: "accessory",
    images: [productPagdi],
    purchasePrice: 12000,
    rentPricePerDay: 1500,
    securityDeposit: 5000,
    sizes: ["One Size"],
    description: "Handcrafted safa/pagdi adorned with pearls and gold embroidery. The crowning glory for the groom.",
    isRentable: true,
  },
  {
    id: "9",
    name: "Emerald Bridal Lehenga",
    slug: "emerald-bridal-lehenga",
    category: "lehenga",
    images: [productLehengaEmerald],
    purchasePrice: 95000,
    rentPricePerDay: 7000,
    securityDeposit: 30000,
    sizes: ["S", "M", "L"],
    description: "A stunning emerald green lehenga with gold thread detailing, perfect for Mehndi and Sangeet celebrations.",
    isRentable: true,
  },
  {
    id: "10",
    name: "Diamond Brooch Set",
    slug: "diamond-brooch-set",
    category: "accessory",
    images: [productBroochSet],
    purchasePrice: 18000,
    rentPricePerDay: 1200,
    securityDeposit: 8000,
    sizes: ["One Size"],
    description: "Elegant diamond-studded brooch and cufflink set. The perfect finishing touch for the distinguished groom.",
    isRentable: false,
  },
];

export const categories = [
  { value: "all", label: "All" },
  { value: "sherwani", label: "Sherwanis" },
  { value: "lehenga", label: "Lehengas" },
  { value: "suit", label: "Suits" },
  { value: "accessory", label: "Accessories" },
] as const;

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
