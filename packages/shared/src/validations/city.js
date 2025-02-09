const City = require('../models/City');

const { object, string, number, date } = require('yup');

const createCity = object({
    name: string().required('A descrição da cidade é necessária.')
    .test('unique', 'Já existe uma cidade com este nome.', async (value) => {
        const existingCity = await City.findOne({ where: { name: value } });
        return !existingCity;
    }),
    uf: string().required('A uf da cidade é necessária.'),
    code: string().required('O código(IBGE) da cidade é necessária.')
    .test('unique', 'Já existe uma cidade com este código(IBGE).', async (value) => {
        const existingCity = await City.findOne({ where: { code: value } });
        return !existingCity;
    }),
});

const updateCity = object({
    name: string().required('A descrição da cidade é necessária.')
    .test('unique', 'Já existe uma categoria com este nome.', async (value, context) => {
        const { id } = context.parent; // Captura o ID da categoria atual
        const city = await City.findOne({ where: { name: value } });
        return !city || city.id === id;
    }),
    uf: string().required('A uf da cidade é necessária.'),
    code: string().required('O código(IBGE) da cidade é necessária.')
    .test('unique', 'Já existe uma categoria com este nome.', async (value, context) => {
        const { id } = context.parent; // Captura o ID da categoria atual
        const city = await City.findOne({ where: { code: value } });
        return !city || city.id === id;
    }),
});

module.exports = {
    createCity,
    updateCity,
};
