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
            ep_title: { type: Sequelize.STRING },
            ep_name: { type: Sequelize.STRING },
            ep_slug: { type: Sequelize.STRING },
            ep_link: { type: Sequelize.STRING },
            sort_order: { type: Sequelize.INTEGER },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            status: { type: Sequelize.BOOLEAN }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('episodes');
    }
};