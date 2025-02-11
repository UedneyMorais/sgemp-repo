// packages/sgemp-api/src/rabbitmqConsumer.js
const { consumeQueue } = require('shared/src/config/rabbitmq');
const saleService = require('./saleService');

async function startConsume() {
  try {
    await consumeQueue('finalized_sale', (message) => {
      console.log('Nova venda finalizada recebida:', message);

      createSale(message);
      generateReport(message);
    });
  } catch (error) {
    console.error('Erro ao consumir mensagens do RabbitMQ:', error);
  }
}

function createSale(message) {
  console.log("Entrando no createSale apartir do rabbitMQ")
  const { customerId, items, paymentData, saleNumber } = message;

    const req = {
      body: {
        customerId,
        items,
        payments: paymentData,
        saleNumber,
      },
    };

  saleService.createSale(req);
}

function generateReport(sale) {
  // Lógica para gerar relatório...
  console.log('Relatório gerado para a venda:', sale);
}

// Inicia o consumo das mensagens
startConsume();

module.exports = {startConsume}