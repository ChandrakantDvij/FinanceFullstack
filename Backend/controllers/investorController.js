const investorService = require('../services/investorService');

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 09-10-2025
 */

class InvestorController {

   // 1) Create Investor
   async createInvestor(req, res) {
   const user = req.user;
   if (!user) 
    return res.status(401).json({ success: false, message: "Unauthorized" });

   if (user.role !== "accountant")
    return res.status(403).json({ success: false, message: "Permission denied" });

   try {
    const investor = await investorService.createInvestor({
      ...req.body,
      created_by: user.id,
    });

    res.status(201).json({ success: true, investor });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

    // 2) Get All Investors
    async getAllInvestors(req, res) {
    try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 

    const investors = await investorService.getAllInvestors(page, limit);

    res.status(200).json({
      success: true,
      message: "Investors fetched successfully",
      data: investors.data,
      pagination: {
        currentPage: page,
        totalPages: investors.totalPages,
        totalRecords: investors.totalRecords,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

  // 3) Get Investor by ID
  async getInvestorById(req, res) {
    try {
      const {investor_id} = req.params;

      const investor = await investorService.getInvestorById(investor_id);

      res.status(200).json({
        success: true,
        data: investor,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      })
    }    
}

// 4) Update Investor by ID
  async updateInvestorById(req, res) {
    try {
      const { investor_id } = req.params;
      const updateData = req.body;
      const user = req.user;  
      
      if (user.role !== "accountant") {
      return res.status(403).json({
        success: false,
        message: "Only accountants can update investors",
      });
    }

      const updatedInvestor = await investorService.updateInvestorById(investor_id, updateData);
      res.status(200).json({
        success: true,
        message: "Investor updated successfully",
        data: updatedInvestor,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
}

// 5) Delete Investor by ID
    async deleteInvestorById(req, res) {
    try {
      const { investor_id } = req.params;
      const user = req.user;

      if (user.role !== "accountant") {
      return res.status(403).json({
        success: false,
        message: "Only accountants can delete investors",
      });
    }
      const deletedInvestor = await investorService.deleteInvestorById(investor_id);

      res.status(200).json({
        success: true,
        message: "Investor deleted successfully",
        data: deletedInvestor,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
    
module.exports = new InvestorController();