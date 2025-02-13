const { consumeQueue } = require('shared/src/config/rabbitmq');
const saleService = require('./saleService');

async function startConsume() {
    console.log("Iniciando consumo do RabbitMQ..."); // Verificar quantas vezes aparece no log
    try {
        await consumeQueue('finalized_sale', async (message) => {
            console.log('Mensagem recebida:', message);
            console.log('Nova venda finalizada recebida:', message);
            console.log('Processando mensagem...');

            try {
                await createSale(message); // Adicionado await
                await generateReport(message); // Adicionado await
                console.log('Mensagem processada com sucesso.');
            } catch (error) {
                console.error('Erro ao processar mensagem:', error);
            }
        });
    } catch (error) {
        console.error('Erro ao consumir mensagens do RabbitMQ:', error);
    }
}

async function createSale(message) {
    console.log("Entrando no createSale a partir do rabbitMQ");
    const { customerId, items, paymentData, pdvSaleId } = message;

    const req = {
        body: {
            customerId,
            items,
            payments: paymentData,
            pdvSaleId,
        },
    };

    await saleService.createSale(req);
}

function generateReport(sale) {
    // Lógica para gerar relatório...
    console.log('Relatório gerado para a venda:', sale);
}

// Inicia o consumo das mensagens
//startConsume();

module.exports = { startConsume };