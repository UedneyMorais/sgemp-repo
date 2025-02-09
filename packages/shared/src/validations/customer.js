const { object, string, number, date } = require('yup');

const createCustomer = object({
        name: string()
        .required('O nome do cliente é necessário.'),
        cpfCnpj: string()
        .required('O cpf/cnpj do cliente é necessário.'),
        taxPayer: string()
        .required('O campp contribuinte paga icms do cliente é necessário.'),
});

const updateCustomer = object({
    name: string()
    .required('O nome do cliente é necessário.'),
    cpfCnpj: string()
    .required('O cpf/cnpj do cliente é necessário.'),
    taxPayer: string()
    .required('O campp contribuinte paga icms do cliente é necessário.'),
});

module.exports = {
    createCustomer,
    updateCustomer,
};
