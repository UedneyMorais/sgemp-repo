const { Model, DataTypes } = require('sequelize');

class SaleItem extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                saleId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'sales',
                        key: 'id',
                    },
                    allowNull: true,
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                },
                productId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'products',
                        key: 'id',
                    },
                    allowNull: true,
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                },
                price: {
                    type: DataTypes.DECIMAL(10,2),
                    allowNull: false,
                },
                quantity: {
                    type: DataTypes.DECIMAL(10,2),
                    allowNull: false,
                },
                value: {
                    type: DataTypes.DECIMAL(10,2),
                    allowNull: false,
                }
            },
            {
                sequelize,
                modelName: 'SaleItem',
                tableName: 'sale_items',
                timestamps: false,
                underscored: true,
            }
        );
    }

    static associate(models) {

        this.belongsTo(models.Sale, {
            foreignKey: 'sale_id',
            as: 'sale',
        });

        this.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product',
        });

        this.hasOne(models.StockMovement, {
            foreignKey: 'sale_item_id',
            as: 'stockMovement'
        });

    }
}

module.exports = SaleItem;
