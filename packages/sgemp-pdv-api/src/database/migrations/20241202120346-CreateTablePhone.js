'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('phones', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: false
    },
    customer_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'customers',
        key: 'id',
      },
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    issuer_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'issuers',
        key: 'id',
      },
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },

  });
},
down: async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('phones');
}
};