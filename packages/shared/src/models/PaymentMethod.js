const { Model, DataTypes } = require('sequelize');

class PaymentMethod extends Model {
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
                description: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                }
            },
            {
                sequelize,
                modelName: 'PaymentMethod',
                tableName: 'payment_methods',
                timestamps: true,
                underscored: true,
            }
        );
    }

    static associate(models) {

        this.hasMany(models.Payment, {
            foreignKey: 'payment_method_id', 
            as: 'payments', 
        });
    
    }
}

module.exports = PaymentMethod;
