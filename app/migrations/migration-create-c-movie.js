'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('movies', {
            mov_id: {
                type: Sequelize.INTEGER, 
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            mov_name: { type: Sequelize.STRING, },                   
            mov_slug: { type: Sequelize.STRING, },
            ori_name: { type: Sequelize.STRING },
            content: { type: Sequelize.TEXT },
            poster_url: { type: Sequelize.STRING },
            thumb_url: { type: Sequelize.STRING },
            time: { type: Sequelize.STRING },
            episode_current: { type: Sequelize.STRING },
            episode_total: { type: Sequelize.STRING },
            quality: { type: Sequelize.STRING },
            lang: { type: Sequelize.STRING },
            year_id: { 
                type: Sequelize.INTEGER,
                references: { model: 'years', key: 'year_id' }
            },
            type_id: { 
                type: Sequelize.INTEGER,
                references: { model: 'types', key: 'type_id' }
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
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('movies');
    }
};