const { object, string, number, date, boolean, array } = require('yup');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const PaymentMethod = require('../models/PaymentMethod'); // Importe o modelo PaymentMethod

const createSale = object({
    customerId: number()
        .required('O ID do cliente é obrigatório.')
        .positive('O ID do cliente deve ser um número positivo.')
        .integer('O ID do cliente deve ser um número inteiro.'), // 🔥 Garante que não seja decimal

    items: array()
        .of(
            object({
                productId: number()
                    .required('O ID do produto é obrigatório.')
                    .positive('O ID do produto deve ser um número positivo.')
                    .integer('O ID do produto deve ser um número inteiro.')
                    .test('produto-existe', 'O produto informado não existe.', async (value) => {
                        console.log("🔍 Validando productId:", value);
                        if (!value) return false; // 🔥 Garante que o valor foi passado
                        const product = await Product.findByPk(value);
                        return !!product; // 🔥 Retorna true se existir, false se não existir
                    }),

                quantity: number()
                    .required('A quantidade do produto é obrigatória.')
                    .positive('A quantidade do produto deve ser um número positivo.')
                    .integer('A quantidade deve ser um número inteiro.') // 🔥 Não pode ser decimal
            })
        )
        .min(1, 'A venda deve conter pelo menos um item.') // 🔥 Garante que não seja um array vazio
        .required('Os itens são obrigatórios.'), // 🔥 Garante que items seja sempre enviado

    payments: array()
        .of(
            object({
                amount: number()
                    .required('O valor do pagamento é obrigatório.')
                    .positive('O valor do pagamento deve ser um número positivo.'),
                paymentMethodId: number() // Agora é paymentMethodId, não paymentMethod
                    .required('O ID da forma de pagamento é obrigatório.')
                    .positive('O ID da forma de pagamento deve ser um número positivo.')
                    .integer('O ID da forma de pagamento deve ser um número inteiro.')
                    .test('payment-method-existe', 'A forma de pagamento informada não existe.', async (value) => {
                        console.log("🔍 Validando paymentMethodId:", value);
                        if (!value) return false;
                         // 🔥 Garante que o valor foi passado
                        const paymentMethod = await PaymentMethod.findByPk(value);
                        return !!paymentMethod; // 🔥 Retorna true se existir, false se não existir
                    })
            })
        )
        .min(1, 'A venda deve conter pelo menos uma forma de pagamento.')
        .required('Os pagamentos são obrigatórios.')
});

// 🔥 Função para validar se um productId existe no banco
async function isValidProduct(productId) {
    const product = await Product.findByPk(productId);
    return !!product; // Retorna true se o produto existir, false caso contrário
}

// ✅ Validação para atualização de venda
const updateSale = object({
    customerId: number()
        .positive('O ID do cliente deve ser um número positivo.')
        .nullable(), // Permite não enviar customerId

    items: array()
        .of(
            object({
                productId: number()
                    .required('O ID do produto é obrigatório.')
                    .positive('O ID do produto deve ser um número positivo.')
                    .test('product-exists', 'Produto não encontrado.', async (value) => {
                        return await isValidProduct(value);
                    }),

                quantity: number()
                    .required('A quantidade do produto é obrigatória.')
                    .positive('A quantidade do produto deve ser um número positivo.')
            })
        )
        .min(1, 'A venda deve conter pelo menos um item.'),

    payments: array()
        .of(
            object({
                amount: number()
                    .required('O valor do pagamento é obrigatório.')
                    .positive('O valor do pagamento deve ser um número positivo.'),
                paymentMethodId: number() // Agora é paymentMethodId, não paymentMethod
                    .required('O ID da forma de pagamento é obrigatório.')
                    .positive('O ID da forma de pagamento deve ser um número positivo.')
                    .integer('O ID da forma de pagamento deve ser um número inteiro.')
                    .test('payment-method-existe', 'A forma de pagamento informada não existe.', async (value) => {
                        console.log("🔍 Validando paymentMethodId:", value);
                        if (!value) return false; // 🔥 Garante que o valor foi passado
                        const paymentMethod = await PaymentMethod.findByPk(value);
                        return !!paymentMethod; // 🔥 Retorna true se existir, false se não existir
                    })
            })
        )
        .min(1, 'A venda deve conter pelo menos uma forma de pagamento.')
        .required('Os pagamentos são obrigatórios.')
});

module.exports = {
    createSale,
    updateSale,
};