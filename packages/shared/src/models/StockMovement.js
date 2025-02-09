const { Model, DataTypes } = require('sequelize');
const { typeStockMovementEnum } = require('../enums/typeStockMovementEnum');

class StockMovement extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                  type: DataTypes.INTEGER,
                  autoIncrement: true,
                  primaryKey: true,
                },
                productId: {
                  type: DataTypes.INTEGER,
                  allowNull: false,
                  references: {
                    model: 'products',
                    key: 'id',
                  },
                },
                quantity: {
                  type: DataTypes.INTEGER,
                  allowNull: false
                },
                type: DataTypes.ENUM(typeStockMovementEnum.enums.map((item) => item.value)),
                saleId: {
                  type: DataTypes.INTEGER,
                  allowNull: true,
                  references: {
                    model: 'sales',
                    key: 'id',
                  },
                },
                reason: {
                  type: DataTypes.STRING,
                  allowNull: true,
                },
                createdAt: {
                  type: DataTypes.DATE,
                  allowNull: false,
                  defaultValue: DataTypes.NOW,
                },
            },
            {
              sequelize,
              modelName: 'StockMovement',
              tableName: 'stock_movements',
              underscored: true,
              timestamps: true,
          }  
        );
    }

    static associate(models) {
        // 🔹 Relacionamento correto com `Product` (1:N)
        this.belongsTo(models.Product, {
          foreignKey: 'productId',
          as: 'product',
      });

      // 🔹 Relacionamento correto com `Sale` (1:N)
      this.belongsTo(models.Sale, {
          foreignKey: 'saleId',
          as: 'sale',
      });
    }
}

module.exports = StockMovement;
