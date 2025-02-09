const { Model, DataTypes } = require('sequelize');
const Address = require('./Address.js');
const Phone = require('./Phone.js');
const Sale = require('./Sale.js');

class Customer extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                cpfCnpj: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                taxPayer: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                },
            },
            {
                sequelize,
                modelName: 'Customer',
                tableName: 'customers',
                timestamps: false,
                underscored: true
            }
        );
    }

    static associate(models) {
        this.hasOne(models.Address, {
            foreignKey: 'customer_id',
            as: 'addresses',
        });

        this.hasMany(models.Phone, {
            foreignKey: 'customer_id',
            as: 'phones',
        });

        this.hasMany(models.Sale, {
            foreignKey: 'customer_id',
            as: 'sales',
        });
    }
}

module.exports = Customer;
