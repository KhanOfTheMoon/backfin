const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: String,
  year: Number,
  price: Number,
  cover: String,
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: Number,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Book', BookSchema);