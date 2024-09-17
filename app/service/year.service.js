// Import models and database connection
const db = require("../common/connect");
const Year = require("../models/year.model");

module.exports = {
    findYear: async (year_name, transaction) => {
      const year = await Year.findOne({ where: { year_name }, transaction });
      return year;
    }
}