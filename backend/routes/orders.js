const express = require("express");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to Auth
const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Create a new order (Checkout)
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    
    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      status: "PENDING"
    });

    const order = await newOrder.save();
    // Normally you'd trigger Stripe here
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get user's orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
