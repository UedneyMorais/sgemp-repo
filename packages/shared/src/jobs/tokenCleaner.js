const schedule = require('node-schedule');
const ms = require('ms');

const { Op } = require('sequelize');
const { ActiveToken } = require('../models'); 

const removeExpiredTokens = async () => {
    try {
        const now = new Date();
        const expirationTime = ms(process.env.JWT_EXPIRES_IN || '1h');
        
        // const result = await ActiveToken.destroy({
        //     where: {
        //         created_at: {
        //             [Op.lt]: new Date(now.getTime() - expirationTime)
        //         }
        //     }
        // });

                // Remover tokens expirados com base no campo `expires_at`
        const result = await ActiveToken.destroy({
            where: {
                expires_at: {
                    [Op.lt]: now, // Tokens cujo `expires_at` seja menor que o momento atual
                }
            }
        });
        

        console.log(`${result} tokens expirados removidos com sucesso`);
    } catch (error) {
        console.error('Erro ao limpar tokens expirados:', error);
    }
};
// Configurar uma tarefa agendada para rodar a cada hora
const startTokenCleaner = () => {
    //1 hora = '0 * * * *'
    //2 minutos = '*/2 * * * *'
    schedule.scheduleJob(process.env.CLEAN_TOKEN_TIME, () => {
        console.log('Executando limpeza de tokens expirados...');
        removeExpiredTokens();
    });
};

module.exports = { startTokenCleaner };
