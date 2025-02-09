const { Model, DataTypes } = require('sequelize');
const { paymentTypesEnum } = require('../enums/paymentTypesEnum.js');

class Payment extends Model {
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
                    allowNull: false,
                    references: {
                        model: 'sales',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                },
                amount: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                },
                details: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                paymentMethodId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'payment_methods',
                        key: 'id',
                    },
                    allowNull: true,
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                },
            },
            {
                sequelize,
                modelName: 'Payment',
                tableName: 'payments',
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

        this.belongsTo(models.PaymentMethod, {
            foreignKey: 'payment_method_id',
            as: 'paymentMethod',
        });        
    }
}

module.exports = Payment;
