const { consumeQueue } = require('shared/src/config/rabbitmq');
const saleService = require('./saleService');

async function startConsume() {
    try {
        await consumeQueue('finalized_sale', async (message) => {

            try {
                await createSale(message); // Adicionado await
                await generateReport(message); // Adicionado await
            } catch (error) {
                console.error('Erro ao processar mensagem:', error);
            }
        });
    } catch (error) {
        console.error('Erro ao consumir mensagens do RabbitMQ:', error);
    }
}

async function createSale(message) {
    const { customerId, items, paymentData, saleNumber } = message;

    const req = {
        body: {
            customerId,
            items,
            payments: paymentData,
            saleNumber,
        },
    };

    await saleService.createSale(req);
}

function generateReport(sale) {
    // Lógica para gerar relatório...
    console.log('Relatório gerado para a venda:', sale);
}

// Inicia o consumo das mensagens
startConsume();

module.exports = { startConsume };