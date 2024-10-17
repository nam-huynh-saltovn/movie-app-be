// Import models and database connection
const db = require('../models/index');

module.exports = {
    // get all tokens
    getAllTokens: async (offset, limit) => {
        const result = await db.Token.findAll({
            offset: parseInt(offset),
            limit: parseInt(limit),
        });
        return result;
    },

    // get token by id
    getTokenById: async (id) => {
        const result = await db.Token.findOne({ where: { token_id: id, status: true } });
        return result;
    },

    // Create a new token
    createToken: async (data, transaction) => {
        const result = await db.Token.create(
            { 
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                expired: data.expired,
                invoked: data.invoked,
                acc_token_date: data.acc_token_date,
                ref_token_date: data.ref_token_date,
                user_id: data.user_id,
                status: data.status 
            },
            { transaction }
        );
        return result;
    }
}