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
            mov_name: { type: Sequelize.STRING(255), },                   
            mov_slug: { type: Sequelize.STRING(255), },
            ori_name: { type: Sequelize.STRING(255) },
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
        await queryInterface.dropTable('movies');
    }
};