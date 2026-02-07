const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Create Order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingDetails, total } = req.body;
    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
      shippingDetails
    });
    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;