const { object, string, number, date } = require('yup');
const StockMovement = require('../models/StockMovement');
const { default: Enum } = require('enum');

const createStockMovement = object({
    productId: number()
        .typeError('O código do produto deve ser um número.')
        .required('O código do produto é necessário.'),

    quantity: number()
        .typeError('A quantidade deve ser um número.')
        .required('A quantidade do produto é necessária.')
        .positive('A quantidade deve ser maior que zero.'),

    type: string()
        .required('O tipo do estoque é obrigatório.')
        .oneOf(['ENTRY', 'EXIT'], 'O tipo deve ser ENTRY ou EXIT.'),

    saleId: number()
        .when('type', (type, schema) => {
            return type === 'EXIT' 
                ? schema.required('O número da venda é necessário para saída.') 
                : schema.nullable();
        }),

    reason: string()
        .required('A razão do movimento de estoque é necessária.')
});


const getStockByProductId = object({
    
});

const updateStockMovement = object({
    productId: number()
        .required('O código do produto é necessária.'),
    quantity: number()
    .required('A quantidade do produto é necessária.'),
    type: string()
        .required('O tipo do estoque é obrigatório')
        .oneOf(['ENTRY', 'EXIT'], 'O tipo deve ser ENTRY ou EXIT.'),
    saleId: number()
        .when('type', {
            is: 'EXIT',
            then: number()
            .required('O número da venda é necessário para saída.')
        }),
    reason: string()
    .required('A razão do movimento de estoque é necessária.'),    
});

module.exports = {
    createStockMovement,
    updateStockMovement,
    getStockByProductId
};
