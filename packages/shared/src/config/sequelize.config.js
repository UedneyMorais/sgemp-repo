const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); 

module.exports = {
  development: {
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sgemp', // Nome do seu banco de dados
    // ... outras configurações
  },
  // ... outras configurações de ambiente
  migrationStorageTableName: 'sequelize_meta'
};