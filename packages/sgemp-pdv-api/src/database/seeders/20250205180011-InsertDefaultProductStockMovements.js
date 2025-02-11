'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('stock_movements', [
      {
        product_id: 1,
        quantity: 18,
        type: "entry",
        sale_id: null,
        reason: "Default entry",
        active: true,
      },
      {
        product_id: 2,
        quantity: 24,
        type: "entry",
        sale_id: null,
        reason: "Default entry",
        active: true,
      },
      {
        product_id: 3,
        quantity: 8,
        type: "entry",
        sale_id: null,
        reason: "Default entry",
        active: true,
      },
      {
        product_id: 4,
        quantity: 1,
        type: "entry",
        sale_id: null,
        reason: "Default entry",
        active: true,
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DELETE FROM stock_movements;`);
  }
};