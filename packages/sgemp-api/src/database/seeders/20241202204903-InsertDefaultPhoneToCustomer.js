'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('phones', [
      {
        phone_number: '99999999999',
        customer_id: 1,
        issuer_id: null
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DELETE FROM phones;`);
  }
};