const expenseReviewService = require("../services/expenseReviewService");

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 01-11-2025
 */

class ExpenseReviewController {

  // 1) POST API → Create or Update Review
  async createReview(req, res) {
    try {
      const reviewData = req.body;
      const result = await expenseReviewService.createReview(reviewData);

      res.status(201).json({
        success: true,
        message: result.isUpdated
          ? "Review updated successfully"
          : "Review added successfully",
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 2) Post - Bulk Create Reviews
  async createBulkReview(req, res) {
    try {
        const {expense_id, reviewer_id, status, comment} = req.body;

        const result = await expenseReviewService.createBulkReview(
            expense_id,
            reviewer_id,
            status,
            comment
        );

        res.status(201).json({
            success: true,
            message: "Bulk reviews added successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
 }

    // 3) Get All Reviews
   async getAllReviews(req, res) {
    try {
      const reviews = await expenseReviewService.getAllReviews();
      res.status(200).json({
        success: true,
        message: "Expense reviews fetched successfully",
        data: reviews,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }  

   // 4) Update Review By ID
    async updateReviewById(req, res) {
    try {
        const { review_id } = req.params;
        const updateData = req.body;

        const updatedReview = await expenseReviewService.updateReviewById(
            review_id,
            updateData
        );

        res.status(200).json({
            success: true,
            message: "Expense review updated successfully",
            data: updatedReview,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    }

    // 5) Delete Review By ID
    async deleteReviewById(req, res) {
    try {
        const { review_id } = req.params;

        const result = await expenseReviewService.deleteReviewById(review_id);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
 }
}
module.exports = new ExpenseReviewController();
