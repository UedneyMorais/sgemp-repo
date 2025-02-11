'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('phones', [
      {
        phone_number: '88888888',
        customer_id: null,
        issuer_id: 1
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DELETE FROM phones;`);
  }
};