require('dotenv').config();
const amqp = require('amqplib')

const RABBITMQ_URL =process.env.RABBITMQ_URL || 'amqp://localhost';

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

    if(!channel){
        await connect();
    }

    await channel.assertQueue(queueName, { durable: true });
    console.log(`Fila ${queueName} criada/verificada `);
}

async function sendToQueue(queueName, message) {

    if(!channel){
        await connect();
    }

    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Mensagem enviada para a fila ${queueName}:`, message);
    
}

async function consumeQueue(queueName, callback) {

    if(!channel){
        await connect();
    }

    await channel.consume(queueName, (message) => {

        if(message !==null){
            const content = JSON.parse(message.content.toString());
            callback(content);
            channel.ack(message);
        }
        console.log(`Consumindo mensagens da fila ${queueName}`);
    });
    
}

module.exports = {
    connect,
    createQueue,
    sendToQueue,
    consumeQueue,
  };


 