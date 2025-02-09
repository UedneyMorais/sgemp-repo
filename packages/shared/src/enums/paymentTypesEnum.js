const Enum = require('enum');

const paymentTypesEnum = new Enum({
  MONEY: 'money',
  PIX: 'pix',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD:   'debit_card'
});

module.exports = { paymentTypesEnum };