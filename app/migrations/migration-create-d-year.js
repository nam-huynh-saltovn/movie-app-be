'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('years', {
            year_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            year_name: { type: Sequelize.INTEGER },
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
        await queryInterface.dropTable('years');
    }
};