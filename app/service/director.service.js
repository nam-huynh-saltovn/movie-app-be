// Import models and database connection
const db = require("../common/connect");
const Director = require("../models/director.model");

module.exports = {
  findOrCreateDirector: async (dir_name, status, transaction) => {
    return Director.findOrCreate({
      where: { dir_name },
      defaults: { status },
      transaction,
    });
  },
};
