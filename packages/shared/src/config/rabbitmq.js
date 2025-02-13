const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

let connection;
let channel;

// // Conecta ao RabbitMQ
// async function connect() {
//     try {
//         connection = await amqp.connect(RABBITMQ_URL);
//         channel = await connection.createChannel();
//         console.log('Conectado ao RabbitMQ');
//     } catch (error) {
//         console.error('Erro ao conectar ao RabbitMQ:', error);
//         throw error;
//     }
// }

// Conecta ao RabbitMQ
async function connect() {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('Conectado ao RabbitMQ');

        // Adiciona listeners para erros de conexão e canal
        connection.on('close', () => {
            console.error('Conexão com o RabbitMQ fechada. Tentando reconectar...');
            setTimeout(connect, 5000); // Reconecta após 5 segundos
        });

        connection.on('error', (error) => {
            console.error('Erro na conexão com o RabbitMQ:', error);
        });

        channel.on('close', () => {
            console.error('Canal do RabbitMQ fechado. Tentando reconectar...');
            setTimeout(connect, 5000); // Reconecta após 5 segundos
        });

        channel.on('error', (error) => {
            console.error('Erro no canal do RabbitMQ:', error);
        });

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
        channel.prefetch(1); // Garante que cada consumidor processe apenas uma mensagem por vez

        console.log(`📥 Consumindo mensagens da fila: ${queueName}...`);

        await channel.consume(queueName, async (message) => {
            if (!message) {
                console.error('❌ Recebeu mensagem nula.');
                return;
            }

            console.log(`🔍 Mensagem recebida - ID: ${message.fields.deliveryTag} | Redelivery: ${message.fields.redelivered}`);

            const content = JSON.parse(message.content.toString());

            try {
                if (message.fields.redelivered) {
                    console.log(`🔁 Mensagem já redelivered - ID: ${message.fields.deliveryTag}. Ignorando ou processando de forma diferente...`);
                    channel.ack(message); // Confirma para evitar loop
                    return;
                }

                console.log(`🟢 Processando mensagem ID: ${message.fields.deliveryTag}`);

                await callback(content); // Processa a mensagem

                if (channel) {
                    channel.ack(message); // ✅ Envia ACK somente após sucesso
                    console.log(`✅ Mensagem processada e confirmada (ACK enviado) - ID: ${message.fields.deliveryTag}`);
                } else {
                    console.error('⚠️ Canal fechado antes do ACK.');
                }
            } catch (error) {
                console.error(`❌ Erro ao processar mensagem (ID: ${message.fields.deliveryTag}):`, error);

                if (channel) {
                    console.warn(`🔄 Mensagem ${message.fields.deliveryTag} será reenviada para a fila.`);
                    channel.nack(message, false, true); // Reenvia a mensagem para a fila
                }
            }
        }, { noAck: false });

    } catch (error) {
        console.error(`❌ Erro ao configurar consumidor para a fila ${queueName}:`, error);
    }
}


// async function consumeQueue(queueName, callback) {
//     try {
//         if (!channel) {
//             await connect();
//         }

//         await channel.assertQueue(queueName, { durable: true });

//         // Limita o número de mensagens não confirmadas
//         channel.prefetch(1);

//         console.log(`Consumindo mensagens da fila ${queueName}...`);

//         // Verifique se a mensagem já foi redelivery
//         await channel.consume(queueName, async (message) => {
//             if (message !== null) {
//                 const content = JSON.parse(message.content.toString());
        
//                 // Verifica se a mensagem já foi processada (redelivered)
//                 if (message.fields.redelivered) {
//                     console.log(`Mensagem redelivered (ID: ${message.fields.deliveryTag}). Ignorando ou processando de forma diferente...`);
//                     channel.ack(message); // Confirma a mensagem para evitar loops
//                     return;
//                 }
        
//                 try {
//                     // Processa a mensagem
//                     await callback(content);

//                     if (channel) {
//                         channel.ack(message);
//                         console.log(`Mensagem processada com sucesso (ID: ${message.fields.deliveryTag}).`);
//                     } else {
//                         console.error('Canal fechado antes de ACK.');
//                     }
//                 } catch (error) {
//                     console.error(`Erro ao processar mensagem (ID: ${message.fields.deliveryTag}):`, error);
//                     // Caso ocorra um erro, rejeite a mensagem e a recoloque na fila
//                     channel.nack(message, false, true); // Rejeita a mensagem e a coloca novamente na fila
//                 }
//             }
//         }, { noAck: false });

//         console.log('VEIO AQUI')
//     } catch (error) {
//         console.error(`Erro ao configurar consumidor para a fila ${queueName}:`, error);
//         throw error;
//     }
// }

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
