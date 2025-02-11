
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('customers', [
      {
        name: 'Consumidor final',
        cpf_cnpj: '00000000000',
        tax_payer: 0,
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DELETE FROM customers;`);
  }
};
