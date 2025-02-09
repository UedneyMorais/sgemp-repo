const { object, string, number, date } = require('yup');
const Category = require('../models/Category');

const createCategory = object({
    categoryName: string()
        .required('A descrição da categoria é necessária.')
        .test('unique', 'Já existe uma categoria com este nome.', async (value) => {
            const existingCategory = await Category.findOne({ where: { categoryName: value } });
            return !existingCategory;
        }),
        
});

const updateCategory = object({
    categoryName: string()
        .required('A descrição da categoria é necessária.')
        .test('unique', 'Já existe uma categoria com este nome.', async (value, context) => {
            const { id } = context.parent; 
            const category = await Category.findOne({ where: { categoryName: value } });
            return !category || category.id === id;
        }),
});

module.exports = {
    createCategory,
    updateCategory,
};
