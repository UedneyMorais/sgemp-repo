'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('cities', [
      {
        name: 'Anápolis',
        uf: 'GO',
        code: 5201108
      },
      {
        name: 'Goiânia',
        uf: 'GO',
        code: 5208707
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DELETE FROM cities;`);
  }
};
