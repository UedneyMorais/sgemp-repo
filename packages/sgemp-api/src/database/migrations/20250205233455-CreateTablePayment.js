'use strict';
const { paymentTypesEnum } = require('shared/src/enums/paymentTypesEnum.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    sale_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'sales',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    details: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    payment_method_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'payment_methods',
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
      defaultValue: Sequelize.fn('CURRENT_TIMESTAMP'),
      },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('CURRENT_TIMESTAMP'),
      }
  });
},
down: async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('payments');
}
};
