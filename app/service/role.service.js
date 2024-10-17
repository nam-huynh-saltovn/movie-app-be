// Import models and database connection
const db = require('../models/index');

module.exports = {
    // get all roles
    getAllRoles: async (offset, limit) => {
        const result = await db.Role.findAll({
            offset: parseInt(offset),
            limit: parseInt(limit),
        });
        return result;
    },

    // get role by id
    getRoleById: async (id) => {
        const result = await db.Role.findOne({ where: { role_id: id, status: true } });
        return result;
    },

    // Create a new role
    createRole: async (data, transaction) => {
        const result = await db.Role.create(
            { role_name: data.role_name, status: data.status },
            { transaction }
        );
        return result;
    }
}