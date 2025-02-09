const { Model, DataTypes } = require('sequelize');
const Address = require('./Address.js');

class Issuer extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                corporateName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                tradeName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                lastInvoiceNumber: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                nfeSeriesNumber: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                eventSequence: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                taxId: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                stateRegistration: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                certificate: {
                    type: DataTypes.BLOB('long'),
                    allowNull: true,
                },
                certificatePassword: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                environment: {
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
                modelName: 'Issuer',
                tableName: 'issuers',
                timestamps: false,
                underscored: true
            }
        );
    }

    static associate(models) {
        this.hasOne(models.Address, {
            foreignKey: 'address_id',
            as: 'address',
        });
    }
}

module.exports = Issuer;
