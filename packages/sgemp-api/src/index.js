const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const server = require('shared/src/server');
const { startConsume } = require('./services/rabbitmqConsumer'); // Seu arquivo de consumidor RabbitMQ
const rabbitmq = require('shared/src/config/rabbitmq'); // Importe o seu arquivo rabbitmq.js

async function startApp() {
    try {
        
        server.start();

        startConsume();

    } catch (error) {
        console.error("Erro ao iniciar a aplicação (RabbitMQ):", error);
        process.exit(1); // Ou outra forma de lidar com o erro
    }
}

startApp();