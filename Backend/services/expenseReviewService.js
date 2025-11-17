const ExpenseReview = require("../models/ExpenseReview");
const { get } = require("../routes/expenseReviewRoutes");

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 01-11-2025
 */

class ExpenseReviewService {
  
  // 1) Create or Update Review
  async createReview(reviewData) {
    const { expense_id, reviewer_id, status, comment } = reviewData;

    if (!expense_id || !reviewer_id) {
      throw new Error("expense_id and reviewer_id are required");
    }

    const existingReview = await ExpenseReview.findOne({
      where: { expense_id, reviewer_id },
    });

    if (existingReview) {
      existingReview.status = status || existingReview.status;
      existingReview.comment = comment || existingReview.comment;
      await existingReview.save();
      return { isUpdated: true, data: existingReview };
    }

    const newReview = await ExpenseReview.create({
      expense_id,
      reviewer_id,
      status: status || "pending",
      comment,
    });

    return { isUpdated: false, data: newReview };
  }

    // 2) Bulk Create Reviews

    async createBulkReview(expense_id, reviewer_id, status, comment) {
    if (!Array.isArray(expense_id) || expense_id.length === 0)
      throw new Error("expense_id must be a non-empty array");
    if (!reviewer_id || !status)
      throw new Error("reviewer_id and status are required");

    const existing = await ExpenseReview.findAll({
      where: { expense_id, reviewer_id },
    });

    const existingIds = existing.map(r => r.expense_id);
    const toInsert = expense_id.filter(id => !existingIds.includes(id));

    await Promise.all(
      existing.map(r =>
        r.update({ status, comment })
      )
    );

    const created = await ExpenseReview.bulkCreate(
      toInsert.map(id => ({ expense_id: id, reviewer_id, status, comment }))
    );

    return { created: created.length, updated: existing.length };
  }

    // 3) Get All Reviews
    async getAllReviews() {
    const reviews = await ExpenseReview.findAll({
      order: [["createdAt", "DESC"]],
    });
    if (!reviews || reviews.length === 0)
      throw new Error("No expense reviews found");
    return reviews;
  }

  
   // 4) Update Review By ID
    async updateReviewById(review_id, data) {
    const { status, comment } = data;

    const review = await ExpenseReview.findOne({ where: { review_id } });
    if (!review) {
      throw new Error("Expense review not found");
    }
    review.status = status || review.status;
    review.comment = comment || review.comment;
    await review.save();
    return review;
  }  

  // 5) Delete Review By ID
    async deleteReviewById(review_id) {
        if (!review_id) {
            return {success: false, message: "Review ID is required"};
        }

        const review = await ExpenseReview.findOne({ where: { review_id } });
        if (!review) {
            throw new Error("Expense review not found");
        }
        await review.destroy();
        return { success: true, message: "Expense review deleted successfully" };
    }
}

module.exports = new ExpenseReviewService();