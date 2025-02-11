'use strict';
const { unitTypeEnum } = require('shared/src/enums/unitTypeEnum.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    cfop: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ean: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dtvenc: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    unit_type: Sequelize.ENUM(...unitTypeEnum.enums.map((item) => item.value)),
    cst_csosn: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cst_pis: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cst_cofins: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cst_ipi: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    per_icms: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    per_pis: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    per_cofins: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    per_ipi: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    category_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'categories',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
},
down: async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('products');
}
};
