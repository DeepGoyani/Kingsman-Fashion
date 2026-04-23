const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
      type: { type: String, enum: ["PURCHASE", "RENTAL"], required: true },
      size: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      itemPrice: { type: Number, required: true },
      depositAmount: { type: Number, default: 0 }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "PENDING" },
  shippingAddress: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
