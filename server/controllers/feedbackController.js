const connectDB = require('../config/db')
const Feedback = require('../models/Feedback')
async function submitFeedback(req, res, next) {
  try {
    await connectDB();   // <-- Add this

    const { rating, comment, wordCount } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required and must be between 1 and 5.'
      });
    }

    const feedback = await Feedback.create({ rating, comment, wordCount });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      data: feedback
    });
  } catch (err) {
    next(err);
  }
}

async function getAllFeedback(req, res, next) {
  try {
      await connectDB();   // <-- Add this

    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(50)
    const total = await Feedback.countDocuments()
    const avgRating = await Feedback.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ])

    res.json({
      success: true,
      data: {
        feedbacks,
        total,
        averageRating: avgRating[0]?.avg?.toFixed(1) || 0
      }
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { submitFeedback, getAllFeedback }