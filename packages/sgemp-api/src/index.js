const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Carrega o .env do diretório atual

const server = require('shared/src/server');
//const { startConsume } = require('./services/rabbitmqConsumer');

// Inicia o servidor
server.start();

startConsume();

