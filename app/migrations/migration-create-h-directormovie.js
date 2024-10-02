module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('director_movie', {
        dir_mov_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        mov_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'movies',
            key: 'mov_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        dir_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'directors',
            key: 'dir_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
      },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('director_movie');
    },
  };
  