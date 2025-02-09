const { object, string, number, date } = require('yup');
const PaymentMethod = require('../models/PaymentMethod');

const createPaymentMethod = object({
    name: string()
        .required('O nome da forma de pagamento é necessária.')
        .test('unique', 'Já existe uma forma de pagamento.', async (value) => {
            const existingPaymentMethod = await PaymentMethod.findOne({ where: { name: value } });
            return !existingPaymentMethod;
        }),
    description: string()
    .required('A descrição da forma de pagamento é necessária.'),
});

const updatePaymentMethod = object({
    name: string()
        .required('O nome da forma de pagamento é necessária.')
        .test('unique', 'Já existe uma forma de pagamento.', async (value) => {
            const existingPaymentMethod = await PaymentMethod.findOne({ where: { name: value } });
            return !existingPaymentMethod;
        }),
    description: string()
    .required('A descrição da forma de pagamento é necessária.'),
});

module.exports = {
    createPaymentMethod,
    updatePaymentMethod,
};
