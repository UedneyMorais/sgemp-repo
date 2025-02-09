const { Model, DataTypes } = require('sequelize');
const { userProfileEnum } = require('../enums/userProfileEnum');

class User extends Model {
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
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                profile: DataTypes.ENUM(userProfileEnum.enums.map((item) => item.value)),
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                },
            },
            {
                sequelize,
                modelName: 'User',
                tableName: 'users',
                timestamps: false,
                underscored: true
            }
        );
    }

    static associate(models) {
        this.hasMany(models.ActiveToken, {
            foreignKey: 'user_id',
            as: 'activeTokens', // Nome do alias
            onDelete: 'CASCADE',
        });
    }
}


module.exports = User;
