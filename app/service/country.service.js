// Import models and database connection
const db = require("../common/connect");
const Country = require("../models/country.model");

module.exports = {
  findOrCreateCountry: async (ctr_name, ctr_slug, status, transaction) => {
    return Country.findOrCreate({
      where: { ctr_slug },
      defaults: { ctr_name, status },
      transaction
    });
  },
};
