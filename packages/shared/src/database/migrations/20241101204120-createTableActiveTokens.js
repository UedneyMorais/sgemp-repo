module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('active_tokens', {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
          },
          token: {
              type: Sequelize.TEXT,
              allowNull: false,
          },
          user_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'users', // Nome da tabela de usuários
                  key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
          },
          type: {
              type: Sequelize.ENUM('access_token', 'refresh_token'),
              allowNull: false,
          },
          expires_at: {
              type: Sequelize.DATE,
              allowNull: false,
          },
          created_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('active_tokens');
  },
};
