const { Model, DataTypes } = require('sequelize');
const { brazilStatesEnum } = require('../enums/brazilStatesEnum');

class City extends Model {
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
                
                code: {
                    type: DataTypes.INTEGER,
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
                modelName: 'City',
                tableName: 'cities',
                timestamps: false,
                underscored: true
            }
        );
    }

    static associate(models) {
        this.hasMany(models.Address, {
            foreignKey: 'city_id',
            as: 'addresses',
        });
    }
}

module.exports = City;
