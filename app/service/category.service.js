// Import models and database connection
const { Op } = require('sequelize');
const db = require('../models/index');

module.exports = {
  // get all categories
  getAll: async () => {
    const result = await db.Category.findAll();
    return result;
  },

  // Get category by ID
  getById: async (id) => {
    const result = await db.Category.findOne({ where: { cat_id: id, status: true } });
    return result;
  },

  // Create a new category
  createCategory: async (data, transaction) => {
    const result = await db.Category.create(
      { cat_name: data.cat_name, cat_slug: data.cat_slug, status: data.status },
      { transaction: transaction }
    );
    return result;
  },

  // find category by slug: if not exist -> create new
  findOrCreateCategory: async (cat_name, cat_slug, status, transaction) => {
    const variations = [
      cat_slug,
      cat_slug.replace(/-/g, ' '), // Thay "-" bằng " "
      cat_slug.replace(/-/g, '_'), // Thay "-" bằng "_"
      cat_slug.replace(/-/g, '')   // Loại bỏ "-"
    ];
    const whereClause = {
      [Op.or]: variations.map(variation => ({ cat_slug: variation })),
    };
    return db.Category.findOrCreate({
      where: whereClause,
      defaults: { cat_name, status },
      transaction
    });
  },
};
