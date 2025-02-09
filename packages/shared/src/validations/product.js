const { object, string, number, date } = require('yup');
const Product = require('../models/Product');

const createProduct = object({
    description: string()
        .required('A descrição é obrigatória')
        .max(255, 'A descrição deve ter no máximo 255 caracteres.'),
    price: number()
        .required('O preço é obrigatório')
        .positive('O preço deve ser um valor positivo.')
        .max(999999.99, 'O preço não pode ser maior que 999999.99.'),
    cfop: string()
        .required('O CFOP é obrigatório')
        .matches(/^\d{4}$/, 'O CFOP deve conter exatamente 4 dígitos.'),
    ean: string()
        .required('O EAN é obrigatório')
        .matches(/^\d{8,13}$/, 'O EAN deve conter entre 8 e 13 dígitos.')
        .test('unique', 'Já existe um produto com este código de barras cadastrado.', async (value) => {
            const existingProduct = await Product.findOne({ where: { ean: value } });
            return !existingProduct;
        }),
    dtvenc: date()
        .required('A data de vencimento é obrigatória')
        .typeError('A data de vencimento deve ser uma data válida.')
        .min(new Date(), 'A data de vencimento deve ser futura.'),
    unitType: string()
        .required('O tipo de unidade é obrigatório')
        .oneOf(['UN', 'KG', 'LT'], 'O tipo de unidade deve ser UN, KG ou LT.'),
    cstCsosn: string()
        .required('O CST/CSOSN é obrigatório')
        .matches(/^\d{4}$/, 'O CST/CSOSN deve conter exatamente 4 dígitos.'),
    cstPis: string()
        .required('O CST do PIS é obrigatório')
        .matches(/^\d{2}$/, 'O CST do PIS deve conter exatamente 2 dígitos.'),
    cstCofins: string()
        .required('O CST do COFINS é obrigatório')
        .matches(/^\d{2}$/, 'O CST do COFINS deve conter exatamente 2 dígitos.'),
    cstIpi: string()
        .required('O CST do IPI é obrigatório')
        .matches(/^\d{2}$/, 'O CST do IPI deve conter exatamente 2 dígitos.'),
    perIcms: number()
        .required('O percentual de ICMS é obrigatório')
        .min(0, 'O percentual de ICMS não pode ser negativo.')
        .max(100, 'O percentual de ICMS não pode ser maior que 100.'),
    perPis: number()
        .required('O percentual de PIS é obrigatório')
        .min(0, 'O percentual de PIS não pode ser negativo.')
        .max(100, 'O percentual de PIS não pode ser maior que 100.'),
    perCofins: number()
        .required('O percentual de COFINS é obrigatório')
        .min(0, 'O percentual de COFINS não pode ser negativo.')
        .max(100, 'O percentual de COFINS não pode ser maior que 100.'),
    perIpi: number()
        .required('O percentual de IPI é obrigatório')
        .min(0, 'O percentual de IPI não pode ser negativo.')
        .max(100, 'O percentual de IPI não pode ser maior que 100.'),
    categoryId: number()
        .required('A categoria é obrigatória')
        .positive('O ID da categoria deve ser um número positivo.')
        .integer('O ID da categoria deve ser um número inteiro.'),
    quantity: number()
    .required('A quantidade do produto é obrigatória')      
});

const updateProduct = object({
    description: string()
    .required('A descrição é obrigatória')
    .max(255, 'A descrição deve ter no máximo 255 caracteres.'),
price: number()
    .required('O preço é obrigatório')
    .positive('O preço deve ser um valor positivo.')
    .max(999999.99, 'O preço não pode ser maior que 999999.99.'),
cfop: string()
    .required('O CFOP é obrigatório')
    .matches(/^\d{4}$/, 'O CFOP deve conter exatamente 4 dígitos.'),
ean: string()
    .required('O EAN é obrigatório')
    .matches(/^\d{8,13}$/, 'O EAN deve conter entre 8 e 13 dígitos.'),
    // .test('unique', 'Já existe uma cidade com este código(IBGE).', async (value) => {
    //     const existingProduct = await Product.findOne({ where: { ean: value } });
    //     return !existingProduct;
    // }),
dtvenc: date()
    .required('A data de vencimento é obrigatória')
    .typeError('A data de vencimento deve ser uma data válida.')
    .min(new Date(), 'A data de vencimento deve ser futura.'),
unitType: string()
    .required('O tipo de unidade é obrigatório')
    .oneOf(['UN', 'KG', 'LT'], 'O tipo de unidade deve ser UN, KG ou LT.'),
cstCsosn: string()
    .required('O CST/CSOSN é obrigatório')
    .matches(/^\d{4}$/, 'O CST/CSOSN deve conter exatamente 4 dígitos.'),
cstPis: string()
    .required('O CST do PIS é obrigatório')
    .matches(/^\d{2}$/, 'O CST do PIS deve conter exatamente 2 dígitos.'),
cstCofins: string()
    .required('O CST do COFINS é obrigatório')
    .matches(/^\d{2}$/, 'O CST do COFINS deve conter exatamente 2 dígitos.'),
cstIpi: string()
    .required('O CST do IPI é obrigatório')
    .matches(/^\d{2}$/, 'O CST do IPI deve conter exatamente 2 dígitos.'),
perIcms: number()
    .required('O percentual de ICMS é obrigatório')
    .min(0, 'O percentual de ICMS não pode ser negativo.')
    .max(100, 'O percentual de ICMS não pode ser maior que 100.'),
perPis: number()
    .required('O percentual de PIS é obrigatório')
    .min(0, 'O percentual de PIS não pode ser negativo.')
    .max(100, 'O percentual de PIS não pode ser maior que 100.'),
perCofins: number()
    .required('O percentual de COFINS é obrigatório')
    .min(0, 'O percentual de COFINS não pode ser negativo.')
    .max(100, 'O percentual de COFINS não pode ser maior que 100.'),
perIpi: number()
    .required('O percentual de IPI é obrigatório')
    .min(0, 'O percentual de IPI não pode ser negativo.')
    .max(100, 'O percentual de IPI não pode ser maior que 100.'),
categoryId: number()
    .required('A categoria é obrigatória')
    .positive('O ID da categoria deve ser um número positivo.')
    .integer('O ID da categoria deve ser um número inteiro.'),
});

module.exports = {
    createProduct,
    updateProduct,
};
