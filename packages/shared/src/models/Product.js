const { Model, DataTypes } = require('sequelize');
// const Category = require('../models/Category.js');
// const SaleItem = require('../models/SaleItem.js');
// const Sale = require('../models/Sale.js');
const { unitTypeEnum } = require('../enums/unitTypeEnum.js');

class Product extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                price: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                },
                cfop: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                ean: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                dtvenc: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                unitType: DataTypes.ENUM(unitTypeEnum.enums.map((item) => item.value)),
                cstCsosn: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                cstPis: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                cstCofins: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                cstIpi: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                perIcms: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                perPis: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                perCofins: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                perIpi: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                categoryId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'categories',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                },
            },
            {
                sequelize,
                modelName: 'Product',
                tableName: 'products',
                timestamps: false
            }
        );
    }

    static associate(models) {

         // 🔹 Relacionamento com Categoria (1:N)
        this.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category',
        });

        // 🔹 Relacionamento com SaleItem (1:N)
        this.hasMany(models.SaleItem, {
            foreignKey: 'product_id',
            as: 'saleItems'
        });
        
        this.belongsToMany(models.Sale, {
            through: models.SaleItem,
            foreignKey: 'product_id',
        });

        // 🔹 Relacionamento com StockMovement (1:N)
        this.hasMany(models.StockMovement, {
            foreignKey: 'product_id',
            as: 'stockMovements'
        });

        
    }
}

module.exports = Product;
