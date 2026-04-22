// controllers/reviewController.js
import reviewModel from '../models/review.js';

export const createReview = async (req, res) => {
  try {
    const review = await reviewModel.createReview(req.body);
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getReview = async (req, res) => {
  try {
    const review = await reviewModel.getReviewById(parseInt(req.params.id));
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.getAllReviews();
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await reviewModel.updateReview(parseInt(req.params.id), req.body);
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await reviewModel.deleteReview(parseInt(req.params.id));
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};