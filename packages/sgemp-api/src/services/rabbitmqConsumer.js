const path = require('path');
const { consumeQueue } = require('shared/src/config/rabbitmq');
// Determinar o caminho correto com base na raiz do projeto
const saleService = require(path.resolve(__dirname, '../../src/services/saleService'));

let isConsuming = false;  // Flag para garantir que o consumidor só inicie uma vez

async function startConsume() {
    if (isConsuming) {
        console.log('Consumidor já está rodando. Evitando duplicação.');
        return; // Se já estiver consumindo, não faz nada
    }

    isConsuming = true; // Marca como iniciado
    console.log('Iniciando consumo das mensagens da fila finalized_sale...');

    try {
        await consumeQueue('finalized_sale', async (message, channel) => {
            try {
                console.log(`Mensagem recebida: ${JSON.stringify(message)}`);

                // Verificar se a venda já foi processada usando saleId
                if (await saleService.checkIfSaleProcessed(message.pdvSaleId)) {
                    console.log(`Venda com saleId ${message.pdvSaleId} já foi processada. Ignorando.`);
                    channel.ack(message);  // Confirma a mensagem sem processá-la
                    return;  // Se já foi processada, ignoramos a mensagem
                }

                await createSale(message);  // Processa a venda
               // await generateReport(message);  // Gera o relatório

                // Confirma que a mensagem foi processada com sucesso
                if (channel) {
                    channel.ack(message);
                    console.log(`✅ ACK enviado para a mensagem ID: ${message.fields.deliveryTag}`);
                }
            } catch (error) {
                console.error('Erro ao processar a mensagem:', error);

                // Se houver erro, podemos optar por re-enfileirar ou não
                if (channel) {
                    channel.nack(message, false, true); // Reenvia a mensagem para a fila
                    console.log(`🔄 NACK enviado para a mensagem ID: ${message.fields.deliveryTag}`);
                }
            }
        });
    } catch (error) {
        console.error('Erro ao consumir mensagens do RabbitMQ:', error);
    }
}

// Função para criar a venda
async function createSale(message) {
    const { customerId, items, paymentData, pdvSaleId } = message;

    const req = {
        body: {
            customerId: customerId,
            items: items,
            payments: paymentData,
            pdvSaleId: pdvSaleId
         
        },
    };

    try {
        await saleService.createSale(req);  // Processa a venda
        console.log(`Venda criada com sucesso para o cliente ${customerId}`);
    } catch (error) {
        console.error('Erro ao criar venda:', error);
    }
}

function generateReport(sale) {
    console.log('Relatório gerado para a venda:', sale);
}

module.exports = { startConsume };
