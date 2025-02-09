require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: '-03:00',
    dialectOptions: {
        timezone: 'local'
    },
    //logging: console.log,
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
      },
});

(async () => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;

