'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove o campo 'profile' existente
    await queryInterface.removeColumn('users', 'profile');

    // Adiciona o campo 'profile' novamente, agora como ENUM
    await queryInterface.addColumn('users', 'profile', {
      type: Sequelize.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove o campo 'profile' com o tipo ENUM
    await queryInterface.removeColumn('users', 'profile');

    // Adiciona o campo 'profile' de volta como STRING (caso você precise reverter)
    await queryInterface.addColumn('users', 'profile', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user',
    });

    // Remove o tipo ENUM do banco de dados para evitar problemas
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_profile";');
  }
};
