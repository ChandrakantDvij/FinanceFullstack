const Investment = require("../models/Investment");
const Investor = require("../models/Investor");
const Project = require("../models/Project");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 15-11-2025
 */

class InvestmentService {

    // 1) Create a new investment
    async createInvestment(investmentData) {
        const { investor_id, project_id, invested_amount, mode_of_payment, investment_type, investment_date, created_by } = investmentData;

        if (!investor_id || !project_id || !invested_amount || !mode_of_payment || !investment_type || !investment_date || !created_by) {
            throw new Error("Missing required fields: investor_id, project_id, invested_amount, mode_of_payment, investment_type, investment_date, created_by");
        }

        return await Investment.create(investmentData);
        };
    
    // 2) Get Investors by Project ID    
    async getInvestorsByProject(project_id) {
    if (!project_id) {
        throw new Error("project_id is required");
    }
    const investments = await Investment.findAll({
        where: { project_id },
        include: [
            {
                model: Investor,
                as: "Investor",
                attributes: ["investor_id", "name"]
            }
        ],
        attributes: ["invested_amount", "mode_of_payment", "investment_date"]
    });

    return investments;
}
    
    }

module.exports = new InvestmentService();
