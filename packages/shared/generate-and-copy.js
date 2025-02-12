const path = require('path');
const { exec } = require('child_process');

function generateMigration(migrationName) {
  const sharedMigrationsPath = path.resolve(__dirname, '../../packages/shared/src/database/migrations');

  exec(`npx sequelize-cli migration:generate --name ${migrationName}`, { cwd: path.resolve(sharedMigrationsPath) }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao gerar a migration: ${error}`);
      console.error(`Stderr: ${stderr}`);
      return;
    }

    console.log(`Migration gerada com sucesso na pasta compartilhada:\n${stdout}`);
  });
}

// Obtém o nome da migration da linha de comando
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Uso: node generate-migration.js <migration-name>');
  process.exit(1);
}

generateMigration(migrationName);