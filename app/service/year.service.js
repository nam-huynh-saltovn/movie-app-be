// Import models and database connection
const db = require('../models/index');

module.exports = {
  // get all years
  getAllYear: async() => {
    const result = await db.Year.findAll();
    return result;
  },

  // get year by id
  getById: async (id) => {
      const result = await db.Year.findOne({ where: { year_id: id, status: true } });
      return result;
  },

  //get year by year name
  findYear: async (year_name, transaction) => {
    const year = await db.Year.findOne({ where: { year_name }, transaction });
    return year;
  },

  // Create a new year
  createYear: async (data, transaction) => {
    const result = await db.Year.create(
      { year_name: data.year_name, status: data.status },
      { transaction: transaction }
    );
    return result;
  },
}