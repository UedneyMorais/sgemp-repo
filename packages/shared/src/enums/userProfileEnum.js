const Enum = require('enum');

const userProfileEnum = new Enum({
  ADMIN: 'admin',
  USER: 'user',
});

module.exports = { userProfileEnum };