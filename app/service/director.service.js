// Import models and database connection
const db = require('../models/index');

module.exports = {
  // get all directors
  getAll: async (offset, limit) => {
    const result = await db.Director.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
    return result;
  },

  // Get director by ID
  getById: async (id) => {
    const result = await db.Director.findOne({ where: { dir_id: id, status: true } });
    return result;
  },

  // Create a new director
  createDirector: async (data, transaction) => {
    const result = await db.Director.create(
      { dir_name: data.dir_name, status: data.status },
      { transaction: transaction }
    );
    return result;
  },

  // find director by name: if not exist -> create new
  findOrCreateDirector: async (dir_name, status, transaction) => {
    return db.Director.findOrCreate({
      where: { dir_name },
      defaults: { status },
      transaction
    });
  },
};
