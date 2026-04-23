const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const products = [
  {
    name: "Royal Midnight Sherwani",
    slug: "royal-midnight-sherwani",
    category: "sherwani",
    images: ["/assets/product-sherwani-midnight.jpg"],
    purchasePrice: 45000,
    rentPricePerDay: 3500,
    securityDeposit: 15000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A regal midnight blue sherwani with intricate gold threadwork, perfect for the modern groom who commands attention.",
    isRentable: true,
    featured: true,
  },
  {
    name: "Imperial Gold Sherwani",
    slug: "imperial-gold-sherwani",
    category: "sherwani",
    images: ["/assets/product-sherwani-gold.jpg"],
    purchasePrice: 55000,
    rentPricePerDay: 4200,
    securityDeposit: 18000,
    sizes: ["M", "L", "XL"],
    description: "Handcrafted gold sherwani with zardozi embroidery and pearl accents. A masterpiece for royal celebrations.",
    isRentable: true,
    featured: true,
  },
  {
    name: "Scarlet Bridal Lehenga",
    slug: "scarlet-bridal-lehenga",
    category: "lehenga",
    images: ["/assets/product-lehenga-scarlet.jpg"],
    purchasePrice: 85000,
    rentPricePerDay: 6500,
    securityDeposit: 25000,
    sizes: ["S", "M", "L"],
    description: "A breathtaking scarlet lehenga adorned with hand-embroidered floral motifs and kundan work.",
    isRentable: true,
    featured: true,
  },
  {
    name: "Blush Pink Lehenga",
    slug: "blush-pink-lehenga",
    category: "lehenga",
    images: ["/assets/product-lehenga-pink.jpg"],
    purchasePrice: 72000,
    rentPricePerDay: 5500,
    securityDeposit: 22000,
    sizes: ["S", "M", "L", "XL"],
    description: "Delicate blush pink lehenga with sequin work and soft tulle dupatta. Modern elegance redefined.",
    isRentable: true,
    featured: false,
  },
  {
    name: "Midnight Velvet Suit",
    slug: "midnight-velvet-suit",
    category: "suit",
    images: ["/assets/product-suit-midnight.jpg"],
    purchasePrice: 38000,
    rentPricePerDay: 2800,
    securityDeposit: 12000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A sophisticated midnight velvet three-piece suit with satin lapels. Perfect for receptions and cocktail events.",
    isRentable: true,
    featured: false,
  },
  {
    name: "Classic Ivory Suit",
    slug: "classic-ivory-suit",
    category: "suit",
    images: ["/assets/product-suit-ivory.jpg"],
    purchasePrice: 32000,
    rentPricePerDay: 2400,
    securityDeposit: 10000,
    sizes: ["M", "L", "XL"],
    description: "Timeless ivory suit crafted from premium Italian wool. Clean lines and impeccable tailoring.",
    isRentable: true,
    featured: false,
  },
  {
    name: "Heritage Kundan Set",
    slug: "heritage-kundan-set",
    category: "accessory",
    images: ["/assets/product-kundan-set.jpg"],
    purchasePrice: 28000,
    rentPricePerDay: 2000,
    securityDeposit: 10000,
    sizes: ["One Size"],
    description: "Exquisite heritage kundan jewelry set with necklace, earrings, and maang tikka. Handcrafted by master artisans.",
    isRentable: true,
    featured: true,
  },
  {
    name: "Pearl & Gold Pagdi",
    slug: "pearl-gold-pagdi",
    category: "accessory",
    images: ["/assets/product-pagdi.jpg"],
    purchasePrice: 12000,
    rentPricePerDay: 1500,
    securityDeposit: 5000,
    sizes: ["One Size"],
    description: "Handcrafted safa/pagdi adorned with pearls and gold embroidery. The crowning glory for the groom.",
    isRentable: true,
    featured: false,
  },
  {
    name: "Emerald Bridal Lehenga",
    slug: "emerald-bridal-lehenga",
    category: "lehenga",
    images: ["/assets/product-lehenga-emerald.jpg"],
    purchasePrice: 95000,
    rentPricePerDay: 7000,
    securityDeposit: 30000,
    sizes: ["S", "M", "L"],
    description: "A stunning emerald green lehenga with gold thread detailing, perfect for Mehndi and Sangeet celebrations.",
    isRentable: true,
    featured: false,
  },
  {
    name: "Diamond Brooch Set",
    slug: "diamond-brooch-set",
    category: "accessory",
    images: ["/assets/product-brooch-set.jpg"],
    purchasePrice: 18000,
    rentPricePerDay: 1200,
    securityDeposit: 8000,
    sizes: ["One Size"],
    description: "Elegant diamond-studded brooch and cufflink set. The perfect finishing touch for the distinguished groom.",
    isRentable: false,
    featured: false,
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB for final seeding...");
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Seeding completed successfully!");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
