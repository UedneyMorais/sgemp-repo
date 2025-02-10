const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Carrega o .env do diretório atual

const app = require('shared/src/app');
const server = require('shared/src/server');

// Inicia o servidor
server.start();