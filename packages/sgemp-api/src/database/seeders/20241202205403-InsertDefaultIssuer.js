'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('issuers', [
      {
        corporate_name: 'Razão social default',
        trade_name: 'Nome fantasia',
        last_invoice_number: 1,
        nfe_series_number: 1,
        event_sequence: 0,
        tax_id: 0,
        state_registration: '5055555',
        certificate: null,
        certificate_password: null,
        environment: null,
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DELETE FROM issuers;`);
  }
};
