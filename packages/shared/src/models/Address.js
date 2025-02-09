const { Model, DataTypes } = require('sequelize');
const City = require('./City.js');
const Customer = require('./Customer.js');
const Issuer = require('./Issuer.js');

class Address extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                complement: {
                    type: DataTypes.STRING,
                },
                country: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                postalCode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                municipality: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                neighborhood: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                number: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                street: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                cityId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'cities',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                    allowNull: true,
                },
                customerId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'customers',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                    allowNull: true,
                },
                issuerId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'issuers',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
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
                modelName: 'Address',
                tableName: 'addresses',
                timestamps: false,
                underscored: true
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.City, {
            foreignKey: 'city_id',
            as: 'city',
        });

        this.belongsTo(models.Customer, {
            foreignKey: 'customer_id',
            as: 'customer',
        });

        this.belongsTo(models.Issuer, {
            foreignKey: 'issuer_id',
            as: 'issuer',
        });
    }
}

module.exports = Address;
