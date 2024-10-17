// Import models and database connection
const raw = require('body-parser/lib/types/raw');
const db = require('../models/index');

module.exports = {
  // get all users
  getAllUser: async() => {
    const result = await db.User.findAll({through: { attributes: ["password"] }});
    return result;
  },

  // get user by id
  getById: async (id, transaction) => {
      const result = await db.User.findOne({ where: { user_id: id, status: true } }, {transaction});
      return result;
  },

  //get user by userName
  findByUserName: async (user_name, transaction) => {
    const user = await db.User.findOne({ where: { user_name }, transaction });
    return user;
  },

  //get admin
  findAdmin: async (transaction) => {
    const admin = await db.User.findAndCountAll({ 
        include: [
          { model: db.Role, as: 'Roles', 
            where: {role_name: 'admin'}, 
            attributes: ['role_id', 'role_name'],
            required: true }
        ],
        through: {attributes: []},
        distinct: true,
        raw: true
      }, 
      {transaction});
    return admin;
  }
}