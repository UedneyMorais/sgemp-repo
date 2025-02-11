'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customers', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cpf_cnpj: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tax_payer: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customers');
  }
};

