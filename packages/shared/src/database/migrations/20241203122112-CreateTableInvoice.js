'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invoices', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    payment_type: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    value: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    due_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    sale_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'sales',
        key: 'id'
      },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
  await queryInterface.dropTable('invoices');
}
};
