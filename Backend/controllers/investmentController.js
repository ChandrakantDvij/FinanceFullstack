const investmentService = require('../services/investmentService');

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 15-11-2025
 */

class InvestmentController {

    // 1) Create Investment
     async createInvestment(req, res) {
        try {
            if (req.user.role !== "accountant") {
            return res.status(403).json({
            success: false,
            message: "Access denied. Only accountants can create investments."
             });
            }
            const created_by = req.user.id; 
            const investmentData = { ...req.body, created_by };

            const newInvestment = await investmentService.createInvestment(investmentData);

            res.status(201).json({
                success: true,
                message: "Investment created successfully",
                data: newInvestment
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 2) Get Investors by Project ID
    async getInvestorsByProject(req, res) {
    try {
        const { project_id } = req.params;

        const investors = await investmentService.getInvestorsByProject(project_id);

        return res.status(200).json({
            success: true,
            message: "Investors fetched successfully",
            data: investors
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

}

module.exports = new InvestmentController();