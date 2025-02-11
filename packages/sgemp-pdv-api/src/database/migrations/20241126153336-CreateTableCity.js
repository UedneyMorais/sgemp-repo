'use strict';
const { brazilStatesEnum } = require('shared/src/enums/brazilStatesEnum');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cities', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    uf: {
      type: Sequelize.ENUM(...brazilStatesEnum.enums.map((item) => item.key)),
      allowNull: false,
    },
    code: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
},
down: async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('cities');
}
};
