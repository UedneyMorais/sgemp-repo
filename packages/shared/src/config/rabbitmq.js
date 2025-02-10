const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

let connection;
let channel;

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

async function createQueue(queueName) {
    try {
        if (!channel) {
            await connect();
        }
        await channel.assertQueue(queueName, { durable: true });
    } catch (error) {
        console.error(`Erro ao criar/verificar fila ${queueName}:`, error);
        throw error;
    }
}

async function sendToQueue(queueName, message) {
    try {
        if (!channel) {
            await connect();
        }
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    } catch (error) {
        throw error;
    }
}

async function consumeQueue(queueName, callback) {
    try {
        if (!channel) {
            await connect();
        }

        await channel.assertQueue(queueName, { durable: true });

        channel.prefetch(1); 

        await channel.consume(queueName, (message) => {
            if (message !== null) {
                const content = JSON.parse(message.content.toString());

                if (message.fields.redelivered) {
                    console.log(`Mensagem redelivered ${message.fields.deliveryTag}. Ignorando ou processando de forma diferente...`);
                    channel.ack(message); 
                    return; 
                }

                try {
                    callback(content);
                    channel.ack(message);
                } catch (error) {
                    console.error('Erro ao consumir mensagens do RabbitMQ:', error);
                    //channel.nack(message, false, true); 
                }
            }
 
        }, { noAck: false });



    } catch (error) {
        console.error(`Erro ao configurar consumidor para a fila ${queueName}:`, error);
        throw error;
    }
}

module.exports = {
    connect,
    createQueue,
    sendToQueue,
    consumeQueue,
};