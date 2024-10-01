// Import models and database connection
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
    return db.Country.findOrCreate({
      where: { ctr_slug },
      defaults: { ctr_name, status },
      transaction
    });
  },
};
