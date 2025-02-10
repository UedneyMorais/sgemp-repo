// packages/sgemp-api/src/rabbitmqConsumer.js
const { consumeQueue } = require('shared/src/config/rabbitmq');

async function startConsume() {
  try {
    await consumeQueue('vendas_finalizadas', (message) => {
      console.log('Nova venda finalizada recebida:', message);

      // Lógica para processar a venda (ex: atualizar estoque)
      updateStock(message.itens);
      generateReport(message);
    });
  } catch (error) {
    console.error('Erro ao consumir mensagens do RabbitMQ:', error);
  }
}

function updateStock(itens) {
  // Lógica para atualizar o estoque...
  console.log('Estoque atualizado para os itens:', itens);
}

function generateReport(sale) {
  // Lógica para gerar relatório...
  console.log('Relatório gerado para a venda:', sale);
}

// Inicia o consumo das mensagens
startConsume();