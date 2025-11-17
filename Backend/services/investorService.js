const Investor = require('../models/Investor');

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 09-10-2025
 */ 

  class InvestorService {

  // 1) Create Investor
  async createInvestor(data) {
  const { name, email, phone } = data;

  if (!name || !email || !phone) {
    throw new Error("Name, email, and phone are required");
  }

  const investor = await Investor.create({
    name,
    email,
    phone,
    created_by: data.created_by,
  });
  return investor;
}

  // 2) Get ALl Investors
    async getAllInvestors(page, limit) {
    try {
    const offset = (page - 1) * limit;

    const { count, rows } = await Investor.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    if (!rows || rows.length === 0) {
      throw new Error("No investors found");
    }

    const totalPages = Math.ceil(count / limit);

    return {
      totalRecords: count,
      totalPages,
      data: rows,
    };
  } catch (error) {
    throw new Error("Error fetching investors: " + error.message);
  }
}

   // 3) Get Investor by ID
    async getInvestorById(investor_id) {
      const investor = await Investor.findOne({
        where: { investor_id },
        order: [['createdAt', 'DESC']],
      });
      if (!investor) {
        throw new Error("Investor not found");
      }
      return investor;
    }

    // 4) Update Investor by ID
    async updateInvestorById (investor_id, updateData) {
      const investor = await Investor.findOne({ where: { investor_id } });

      if (!investor) {
        throw new Error("Investor not found");
 }
      await investor.update(updateData);
      const updatedInvestor = await Investor.findOne({ where: { investor_id } });

      return updatedInvestor;
    }
  
    //5) Delete Investor by ID 
    async deleteInvestorById(investor_id) {
    const investor = await Investor.findByPk(investor_id);

    if (!investor) {
      throw new Error("Investor not found");
    }

    await investor.destroy(); 
    return investor;
  }
}                 
module.exports = new InvestorService();