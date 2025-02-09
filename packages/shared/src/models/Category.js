const { Model, DataTypes } = require('sequelize');

class Category extends Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                categoryName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    field: 'category_name',
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                },
            },
            {
                sequelize,
                modelName: 'Category',
                tableName: 'categories',
                timestamps: false,
                underscored: true,
            }
        );
    }

    static associate(models) {
        this.hasMany(models.Product, {
            foreignKey: 'category_id',
            as: 'products',
        });        
    }
}

module.exports = Category;
