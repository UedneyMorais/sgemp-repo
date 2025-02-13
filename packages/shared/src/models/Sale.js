const { Model, DataTypes } = require('sequelize');
const Customer = require('./Customer.js');
const Product = require('./Product.js');
const SaleItem = require('./SaleItem.js');
const Invoice = require('./Invoice.js');
const Payment = require('./Payment.js')

class Sale extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                customerId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'customers',
                        key: 'id',
                    },
                    allowNull: true,
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                },
                total: {
                    type: DataTypes.FLOAT,
                },
                nfeKey: {
                    type: DataTypes.STRING,
                },
                nfeNumber: {
                    type: DataTypes.INTEGER,
                },
                pdvSaleId: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                },
            },
            {
                sequelize,
                modelName: 'Sale',
                tableName: 'sales',
                timestamps: false,
                underscored: true,
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Customer, {
            foreignKey: 'customer_id',
            as: 'customer',
        });

        this.hasMany(models.SaleItem, {
            foreignKey: 'sale_id',
            as: 'items'
        });

        this.hasMany(models.Payment, {
            foreignKey: 'sale_id',
            as: 'payments'
        });

        // this.hasOne(models.Invoice, {
        //     foreignKey: 'invoice_id',
        //     as: 'invoice',
        // });
    }
}

module.exports = Sale;
