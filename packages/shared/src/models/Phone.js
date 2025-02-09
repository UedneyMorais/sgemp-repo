const { Model, DataTypes } = require('sequelize');
const Customer = require('./Customer.js');
const Issuer = require('./Issuer.js');

class Phone extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                phoneNumber: {
                    type: DataTypes.STRING,
                    allowNull: false,
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
                issuerId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'issuers',
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
                modelName: 'Phone',
                tableName: 'phones',
                timestamps: false,
                underscored: true
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Customer, {
            foreignKey: 'customerId',
            as: 'customer',
        });

        this.belongsTo(models.Issuer, {
            foreignKey: 'issuer_id',
            as: 'issuer',
        });
    }
}

module.exports = Phone;
