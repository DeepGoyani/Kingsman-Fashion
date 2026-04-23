const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const products = [
  {
    name: "Midnight Velvet Sherwani",
    slug: "midnight-velvet-sherwani",
    category: "sherwani",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800"],
    purchasePrice: 45000,
    rentPricePerDay: 2500,
    securityDeposit: 15000,
    sizes: ["S", "M", "L", "XL"],
    description: "Hand-crafted velvet sherwani with intricate zardosi embroidery, perfect for the regal groom.",
    isRentable: true,
    featured: true
  },
  {
    name: "Royal Gold Sherwani",
    slug: "royal-gold-sherwani",
    category: "sherwani",
    images: ["https://images.unsplash.com/photo-1594938384824-022766860ec4?auto=format&fit=crop&q=80&w=800"],
    purchasePrice: 52000,
    rentPricePerDay: 3000,
    securityDeposit: 20000,
    sizes: ["M", "L", "XL"],
    description: "Pure silk gold sherwani with traditional patterns, embodying timeless Indian heritage.",
    isRentable: true,
    featured: true
  },
  {
    name: "Ivory Silk Tuxedo",
    slug: "ivory-silk-tuxedo",
    category: "suit",
    images: ["https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&q=80&w=800"],
    purchasePrice: 38000,
    rentPricePerDay: 1800,
    securityDeposit: 10000,
    sizes: ["S", "M", "L", "XL"],
    description: "Contemporary ivory tuxedo in premium Italian silk for an understated luxurious look.",
    isRentable: true,
    featured: true
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB for seeding...");
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Seeding completed!");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
