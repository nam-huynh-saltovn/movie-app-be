// Import models and database connection
const db = require("../common/connect");
const Actor = require("../models/actor.model");

module.exports = {
    createActor: async (data, transaction) => {
        // Create a new actor with the provided data
        const result = await Actor.create(
            { act_name: data.name, sort_order: data.sortOrder, status: data.status },
            { transaction }
        );
        return result;
    },

    findOrCreateActor: async (act_name, sort_order, status, transaction) => {
        return Actor.findOrCreate({
          where: { act_name },
          defaults: { sort_order, status },
          transaction
        });
    }
}