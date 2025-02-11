'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('addresses', [
      {
        complement: 'Qd 00 Lt 01 - Casa 04',
        country: 'Brasil',
        postal_code: 75000000,
        municipality: 'Anápolis',
        neighborhood: 'Centro',
        number: 10,
        street: 'Rua street default ',
        city_id: 1,
        customer_id: 1,
        issuer_id: null
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DELETE FROM addresses;`);
  }
};