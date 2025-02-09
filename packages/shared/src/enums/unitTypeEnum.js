const Enum = require('enum');

const unitTypeEnum = new Enum({
  UN: 'UN',
  KG: 'KG',
  LT: 'LT'
});

module.exports = { unitTypeEnum };