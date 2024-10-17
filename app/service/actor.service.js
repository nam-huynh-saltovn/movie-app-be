// Import models and database connection
const db = require('../models/index');

module.exports = {
    // get all actors
    getAllActors: async (offset, limit) => {
        const result = await db.Actor.findAll({
            offset: parseInt(offset),
            limit: parseInt(limit),
        });
        return result;
    },

    // get actor by id
    getActorById: async (id) => {
        const result = await db.Actor.findOne({ where: { act_id: id, status: true } });
        return result;
    },

    // Create a new actor
    createActor: async (data, transaction) => {
        const result = await db.Actor.create(
            { act_name: data.name, sort_order: data.sortOrder, status: data.status },
            { transaction }
        );
        return result;
    },

    // find actor by name: if not exist -> create new
    findOrCreateActor: async (act_name, sort_order, status, transaction) => {
        return db.Actor.findOrCreate({
            where: { act_name },
            defaults: { sort_order, status },
            transaction
        });
    }
}