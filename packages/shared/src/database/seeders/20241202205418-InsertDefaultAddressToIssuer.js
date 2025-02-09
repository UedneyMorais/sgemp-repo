'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('addresses', [
      {
        complement: 'Qd 00 Lt 01 - Casa 02',
        country: 'Brasil',
        postal_code: 75000000,
        municipality: 'Goiania',
        neighborhood: 'Centro',
        number: 10,
        street: 'Rua street goiana ',
        city_id: 2,
        customer_id: null,
        issuer_id: 1
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DELETE FROM addresses;`);
  }
};