const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const {auth,admin} = require('../middleware/auth');

// Get All Books
router.get('/', async (req, res) => {
  try {
    const { q, minRating, sort } = req.query;
    let query = {};

    if (q) {
      const regex = new RegExp(q, 'i');
      query.$or = [{ title: regex }, { author: regex }, { genre: regex }];
    }
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    let books = Book.find(query);

    if (sort === 'rating') books = books.sort({ rating: -1 });
    else if (sort === 'year') books = books.sort({ year: -1 });
    else if (sort === 'reviews') books = books.sort({ reviewsCount: -1 });
    else books = books.sort({ title: 1 }); // Default A-Z

    const results = await books;
    res.json(results);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get Single Book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add Review 
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const newReview = {
      user: req.user.id,
      name: req.body.name, 
      rating: Number(req.body.rating),
      text: req.body.text
    };

    book.reviews.unshift(newReview);
    book.reviewsCount = book.reviews.length;
    // Calculate new average
    const total = book.reviews.reduce((acc, r) => acc + r.rating, 0);
    book.rating = (total / book.reviews.length).toFixed(1);

    await book.save();
    res.json(book.reviews);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.json(savedBook);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    res.json({ msg: 'Book successfully deleted from database' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;