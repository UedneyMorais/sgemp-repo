const { Model, DataTypes } = require('sequelize');
class ActiveToken extends Model {
    static init(sequelize) {
        return super.init(
            {
                token: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                type: {
                    type: DataTypes.ENUM('access_token', 'refresh_token'),
                    allowNull: false,
                },
                expiresAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'ActiveToken',
                tableName: 'active_tokens',
                underscored: true,
                timestamps: true,
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
}

module.exports = ActiveToken;