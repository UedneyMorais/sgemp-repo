const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const server = require('shared/src/server');
const { startConsume } = require('./services/rabbitmqConsumer'); // Seu arquivo de consumidor RabbitMQ
const rabbitmq = require('shared/src/config/rabbitmq'); // Importe o seu arquivo rabbitmq.js

async function startApp() {
    try {
      //await rabbitmq.createQueue('finalized_sale');
      server.start();
  
      // Inicia o consumidor
      //startConsume();
  
      // Aguarda 2 segundos para garantir que o consumidor esteja pronto
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Consumidor RabbitMQ está pronto.');
    } catch (error) {
      console.error("Erro ao iniciar a aplicação (RabbitMQ):", error);
      process.exit(1);
    }
  }
  
  startApp();