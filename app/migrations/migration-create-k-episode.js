'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('episodes', {
            ep_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            ep_title: { type: Sequelize.STRING(255) },
            ep_name: { type: Sequelize.STRING },
            ep_slug: { type: Sequelize.STRING },
            link_embed: { type: Sequelize.STRING },
            link_m3u8: { type: Sequelize.STRING },
            sort_order: { type: Sequelize.INTEGER },
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
        await queryInterface.dropTable('episodes');
    }
};