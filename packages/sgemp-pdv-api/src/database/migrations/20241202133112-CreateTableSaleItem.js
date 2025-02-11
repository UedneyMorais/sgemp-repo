'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sale_items', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sale_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'sales',
        key: 'id',
      },
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'products',
        key: 'id',
      },
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
    value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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
    }
  });
},

down: async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('sale_items');
}
};

