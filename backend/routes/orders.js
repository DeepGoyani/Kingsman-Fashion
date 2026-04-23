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

// Get unavailable dates for a product
router.get("/rentals/:productId", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["PENDING", "APPROVED"] },
      items: {
        $elemMatch: {
          productId: req.params.productId,
          type: "RENTAL"
        }
      }
    });

    const unavailableDates = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.productId.toString() === req.params.productId && item.type === "RENTAL") {
          unavailableDates.push({
            start: item.startDate,
            end: item.endDate
          });
        }
      });
    });

    res.json(unavailableDates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Create a new order (Checkout)
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    
    // ACID Check: Avoid double booking for rentals
    for (const item of items) {
      if (item.type === "RENTAL") {
        const overlap = await Order.findOne({
          status: { $in: ["PENDING", "APPROVED"] },
          items: {
            $elemMatch: {
              productId: item.productId,
              type: "RENTAL",
              startDate: { $lte: new Date(item.endDate) },
              endDate: { $gte: new Date(item.startDate) }
            }
          }
        });
        
        if (overlap) {
          return res.status(400).json({ msg: `The item ${item.productId} is already booked for the selected dates.` });
        }
      }
    }

    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      status: "PENDING"
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get user's orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
