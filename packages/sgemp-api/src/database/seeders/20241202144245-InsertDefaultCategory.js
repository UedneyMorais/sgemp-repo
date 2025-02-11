'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [
      {
        category_name: 'bebidas',
      },
      {
        category_name: 'alimentos',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DELETE FROM categories;`);
  }
};