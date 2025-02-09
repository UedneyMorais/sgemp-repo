const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database'); // Instância do Sequelize

const models = {};

// Inicializar modelos
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js')) // Ignorar o próprio arquivo index.js
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    model.init(sequelize);
    models[model.name] = model;

  });

// Configurar associações entre os modelos
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};

