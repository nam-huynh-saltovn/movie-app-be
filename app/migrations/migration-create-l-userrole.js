module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('user_role', {
        user_role_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'user_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        role_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'roles',
            key: 'role_id',
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
      await queryInterface.dropTable('user_role');
    },
};
  