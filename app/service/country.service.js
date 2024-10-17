// Import models and database connection
const { Op } = require('sequelize');
const db = require('../models/index');

module.exports = {
  // get all countries
  getAll: async () => {
    const result = await db.Country.findAll();
    return result;
  },

  // Get country by ID
  getById: async (id) => {
    const result = await db.Country.findOne({ where: { ctr_id: id, status: true } });
    return result;
  },

  // Create a new country
  createCountry: async (data, transaction) => {
    const result = await db.Country.create(
      { ctr_name: data.ctr_name, ctr_slug: data.ctr_slug, status: data.status },
      { transaction: transaction }
    );
    return result;
  },

  // find country by slug: if not exist -> create new
  findOrCreateCountry: async (ctr_name, ctr_slug, status, transaction) => {
    const variations = [
        ctr_slug,
        ctr_slug.replace(/-/g, ' '), // Thay "-" bằng " "
        ctr_slug.replace(/-/g, '_'), // Thay "-" bằng "_"
        ctr_slug.replace(/-/g, '')   // Loại bỏ "-"
    ];
    const whereClause = {
      [Op.or]: variations.map(variation => ({ ctr_slug: variation })),
    };
  
    return db.Country.findOrCreate({
      where: whereClause,
      defaults: { ctr_name, status },
      transaction
    });
  },
};
