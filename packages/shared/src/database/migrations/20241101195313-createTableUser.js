'use strict';

const { DataTypes } = require('sequelize'); // ✅ Certifique-se de importar corretamente
const { userProfileEnum } = require('../../enums/userProfileEnum');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER, // ✅ Corrigido para DataTypes.INTEGER
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile: DataTypes.ENUM(...userProfileEnum.enums.map((item) => item.value)), // ✅ Correto
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // ✅ Corrigido para DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};



// 'use strict';
// const { userProfileEnum } = require('../../enums/userProfileEnum');

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('users', {
//       id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false,
//       },
//       name: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true,
//       },
//       password: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       profile: Sequelize.ENUM(...userProfileEnum.enums.map((item) => item.value)),
//       active: {
//         type: Sequelize.BOOLEAN,
//         allowNull: false,
//         defaultValue: true
//       },
//       created_at: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//       },
//       updated_at: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//       },
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('users');
//   }
// };
