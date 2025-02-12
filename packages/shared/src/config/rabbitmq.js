const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

let connection;
let channel;

// Conecta ao RabbitMQ
async function connect() {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('Conectado ao RabbitMQ');
    } catch (error) {
        console.error('Erro ao conectar ao RabbitMQ:', error);
        throw error;
    }
}

// Cria/verifica uma fila
async function createQueue(queueName) {
    try {
        if (!channel) {
            await connect();
        }
        await channel.assertQueue(queueName, { durable: true });
        console.log(`Fila ${queueName} criada/verificada.`);
    } catch (error) {
        console.error(`Erro ao criar/verificar fila ${queueName}:`, error);
        throw error;
    }
}

// Envia uma mensagem para a fila
async function sendToQueue(queueName, message) {
    try {
        if (!channel) {
            await connect();
        }
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(`Mensagem enviada para a fila ${queueName}:`, message);
    } catch (error) {
        console.error(`Erro ao enviar mensagem para a fila ${queueName}:`, error);
        throw error;
    }
}

// Consome mensagens de uma fila
async function consumeQueue(queueName, callback) {
    try {
        if (!channel) {
            await connect();
        }

        await channel.assertQueue(queueName, { durable: true });

        // Limita o número de mensagens não confirmadas
        channel.prefetch(1);

        console.log(`Consumindo mensagens da fila ${queueName}...`);

        // Verifique se a mensagem já foi redelivery
        await channel.consume(queueName, async (message) => {
            if (message !== null) {
                const content = JSON.parse(message.content.toString());
        
                // Verifica se a mensagem já foi processada (redelivered)
                if (message.fields.redelivered) {
                    console.log(`Mensagem redelivered (ID: ${message.fields.deliveryTag}). Ignorando ou processando de forma diferente...`);
                    channel.ack(message); // Confirma a mensagem para evitar loops
                    return;
                }
        
                try {
                    // Processa a mensagem
                    await callback(content);
                    console.log(`Mensagem processada com sucesso (ID: ${message.fields.deliveryTag}).`);
                    channel.ack(message); // Confirma a mensagem após o processamento
                } catch (error) {
                    console.error(`Erro ao processar mensagem (ID: ${message.fields.deliveryTag}):`, error);
                    // Caso ocorra um erro, rejeite a mensagem e a recoloque na fila
                    channel.nack(message, false, true); // Rejeita a mensagem e a coloca novamente na fila
                }
            }
        }, { noAck: false });

        console.log('VEIO AQUI')
    } catch (error) {
        console.error(`Erro ao configurar consumidor para a fila ${queueName}:`, error);
        throw error;
    }
}

// Fecha a conexão com o RabbitMQ
async function closeConnection() {
    try {
        if (channel) {
            await channel.close();
            console.log('Canal do RabbitMQ fechado.');
        }
        if (connection) {
            await connection.close();
            console.log('Conexão com o RabbitMQ fechada.');
        }
    } catch (error) {
        console.error('Erro ao fechar conexão com o RabbitMQ:', error);
        throw error;
    }
}

// Reconecta ao RabbitMQ em caso de falha
async function reconnect() {
    try {
        await closeConnection();
        await connect();
        console.log('Reconectado ao RabbitMQ.');
    } catch (error) {
        console.error('Erro ao reconectar ao RabbitMQ:', error);
        throw error;
    }
}

module.exports = {
    connect,
    createQueue,
    sendToQueue,
    consumeQueue,
    closeConnection,
    reconnect,
};
