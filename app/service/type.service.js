// Import models and database connection
const db = require('../models/index');

module.exports = {
    // get all types
    getAllType: async() => {
        const types = await db.Type.findAll();
        return types;
    },

    // get type by id
    getById: async (id) => {
        const result = await db.Type.findOne({ where: { type_id: id, status: true } });
        return result;
    },

    // get type by slug
    findTypeBySlug: async (type_slug, transaction) => {
        const type = await db.Type.findOne({ where: { type_slug }, transaction });
        return type;
    },
    
    // Create a new type
    createType: async (data, transaction) => {
        const result = await db.Type.create(
        { type_name: data.type_name, type_slug: data.type_slug, status: data.status },
        { transaction: transaction }
        );
        return result;
    },
}