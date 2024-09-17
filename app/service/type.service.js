// Import models and database connection
const db = require("../common/connect");
const Type = require("../models/type.model");

module.exports = {
    findType: async (type_slug, transaction) => {
        const type = await Type.findOne({ where: { type_slug }, transaction });
        return type;
    }
}