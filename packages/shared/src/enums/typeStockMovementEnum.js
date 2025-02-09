const Enum = require('enum');

const typeStockMovementEnum = new Enum({
  ENTRY: 'entry',
  EXIT: 'exit',
});

module.exports = { typeStockMovementEnum };