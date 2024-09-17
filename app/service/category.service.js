// Import models and database connection
const db = require("../common/connect");
const Category = require("../models/category.model");

module.exports = {
  findOrCreateCategory: async (cat_name, cat_slug, status, transaction) => {
    return Category.findOrCreate({
      where: { cat_slug },
      defaults: { cat_name, status },
      transaction,
    });
  },
};
