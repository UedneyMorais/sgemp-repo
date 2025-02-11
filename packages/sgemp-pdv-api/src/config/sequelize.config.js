const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); // Ajuste o caminho do .env se necessário

module.exports = {
  development: { // Configuração para desenvolvimento
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sgemp-pdv',
    // Outras configurações de desenvolvimento...
  },
  test: { // Configuração para testes (se necessário)
    // ...
  },
  production: { // Configuração para produção
    // ...
  },
  migrationStorageTableName: 'sequelize_meta' // Esta linha pode ficar aqui ou no .sequelizerc
};