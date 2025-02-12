const path = require('path');
const { Sequelize } = require('sequelize');
const { Umzug } = require('umzug');
require('dotenv').config({ path: path.join(__dirname, 'packages/shared/.env') });

// Configuração do Sequelize
const config = require('./packages/shared/src/config/config.js');

// Nome do pacote passado como argumento
const packageName = process.argv[2];

if (!packageName) {
  console.error('Erro: Nenhum pacote foi especificado. Use: node run-migrations.js <package-name>');
  process.exit(1);
}

// Mapeamento dos diretórios de migrations
const migrationsPaths = [
  path.resolve(__dirname, 'packages/shared/src/database/migrations'),
  path.resolve(__dirname, 'packages', packageName, 'src', 'database', 'migrations'),
];

// Configuração do Umzug
async function runMigrations(databaseName) {  // databaseName usado aqui
  require('dotenv').config({ path: path.join(__dirname, 'packages', 'shared', '.env') });

  // Use databaseName *aqui* para criar a instância do Sequelize
  const sequelize = new Sequelize({
    ...config.development,
    database: databaseName, // Use o argumento databaseName
  });

  console.log("Configurações do Sequelize (antes da instância):", config.development);
  console.log("Instância do Sequelize:", sequelize.config);
  console.log("Migrations Paths:", migrationsPaths);

  for (const migrationsPath of migrationsPaths) {
    const umzug = new Umzug({
      migrations: {
        path: migrationsPath,
        params: [sequelize.getQueryInterface(), Sequelize],
      },
      context: sequelize.getQueryInterface(),
      storage: 'sequelize',
      storageOptions: {
        sequelize: sequelize,
        tableName: 'sequelize_meta', // Ou 'sequelize_meta',
      },
      logger: console,
    });

    console.log("Configuração do Sequelize dentro do Umzug:", umzug.options.storageOptions.sequelize.config);
    console.log("Caminho das migrations:", umzug.migrations.path);

    try {
      console.log(` Executando migrations para ${databaseName} no diretório: ${umzug.migrations.path}`);
      await umzug.up();
      console.log('✅ Migrations executadas com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao executar migrations:', error);
      throw error;
    }
  }
  await sequelize.close();
}

const databaseName = process.argv[3]; // Pega o nome do banco de dados como argumento
if (!databaseName) {
  console.error('Por favor, especifique o nome do banco de dados como argumento.');
  process.exit(1);
}

runMigrations(databaseName); // Passa o nome do banco de dados para a função