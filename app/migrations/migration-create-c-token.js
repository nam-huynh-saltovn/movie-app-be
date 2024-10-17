'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('tokens', {
            token_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            access_token: { type: Sequelize.STRING },
            refresh_token: { type: Sequelize.STRING },
            expired: { type: Sequelize.BOOLEAN },
            invoked: { type: Sequelize.BOOLEAN },
            acc_token_date: { type: Sequelize.DATE },
            ref_token_date: { type: Sequelize.DATE },
            user_id: { 
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'user_id' }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            status: { type: Sequelize.BOOLEAN }
        },{
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('tokens');
    }
};