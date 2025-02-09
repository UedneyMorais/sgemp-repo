'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('issuers', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    corporate_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    trade_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_invoice_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    nfe_series_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    event_sequence: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    tax_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state_registration: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    certificate: {
      type: Sequelize.BLOB('long'),
      allowNull: true,
    },
    certificate_password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    environment: {
      type: Sequelize.INTEGER,
      allowNull: true,
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
  await queryInterface.dropTable('issuers');
}
};
