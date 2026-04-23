const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  purchasePrice: { type: Number, required: true },
  rentPricePerDay: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  sizes: [{ type: String }],
  description: { type: String },
  isRentable: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
