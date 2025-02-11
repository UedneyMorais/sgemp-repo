'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('payment_methods', [
      {
        name: "Dinheiro",
        description: "Pagamento em dinheiro",
        active: true
      },
      {
        name: "Pix",
        description: "Pagamento em pix",
        active: true
      },
      {
        name: "Cartão de crédito",
        description: "Pagamento em cartão de crédito",
        active: true
      },
      {
        name: "Cartão de débito",
        description: "Pagamento  em cartão de débito",
        active: true
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DELETE FROM payment_methods;`);
  }
};