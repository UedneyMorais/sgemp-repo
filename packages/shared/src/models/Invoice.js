const { Model, DataTypes } = require('sequelize');
const Sale = require('./Sale.js');

class Invoice extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                paymentType: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                value: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                dueDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                sale_id: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'sales',
                        key: 'id',
                    },
                    allowNull: false,
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
                modelName: 'Invoice',
                tableName: 'invoices',
                timestamps: false,
                underscored: true,
            }
        );
    }

    static associate(models) {
        // this.belongsTo(models.Sale, {
        //     foreignKey: 'sale_id', // Ajuste no foreignKey para corresponder ao campo do modelo
        //     as: 'sale',
        // });
    }
}

module.exports = Invoice;
