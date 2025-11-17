const express = require("express");
const router = express.Router();
const expenseReviewController = require("../controllers/expenseReviewController");
const verifyToken = require("../middleware/authMiddleware");

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 01-11-2025
 */

// Apply middleware to all routes
router.use(verifyToken);

// 1) POST API → Create or Update Review
router.post("/", expenseReviewController.createReview);

// 2) POST - Bulk Create Reviews
router.post("/bulk", expenseReviewController.createBulkReview);

// 3) GET All Reviews
router.get("/", expenseReviewController.getAllReviews);

// 4) PUT - Update Review by ID
router.put("/:review_id", expenseReviewController.updateReviewById);

// 5) DELETE - Delete Review by ID
router.delete("/:review_id", expenseReviewController.deleteReviewById);

module.exports = router;
