const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  console.log("Iniciando o processo de cópia...");
  const apiType = process.env.API_TYPE;

  if (!apiType) {
    console.error('É necessário especificar o tipo de API (api ou pdv) na variável de ambiente API_TYPE.');
    return;
  }

  try {
    const apiSource = path.join(__dirname, 'packages', apiType, 'src');
    const sharedSource = path.join(__dirname, 'packages', 'shared', 'src');
    const destination = path.join(__dirname, 'packages', apiType, 'dist');
    const sharedPublic = path.join(__dirname, 'packages', 'shared', 'src', 'public', apiType);

    // Criar diretório dist
    await fs.ensureDir(destination);
    console.log(`Diretório dist criado em: ${destination}`);

    // Copiar arquivos da API específica
    if (fs.existsSync(apiSource)) {
      console.log(`Copiando arquivos de ${apiSource} para ${destination}...`);
      await fs.copy(apiSource, destination, { overwrite: true });
    } else {
      console.warn(`Diretório ${apiSource} não encontrado, ignorando cópia.`);
    }

    // Copiar arquivos compartilhados
    if (fs.existsSync(sharedSource)) {
      console.log(`Copiando arquivos compartilhados de ${sharedSource} para ${destination}...`);
      await fs.copy(sharedSource, destination, { overwrite: true });
    } else {
      console.warn(`Diretório ${sharedSource} não encontrado, ignorando cópia.`);
    }

    // Copiar arquivos estáticos, se existirem
    if (fs.existsSync(sharedPublic)) {
      console.log(`Copiando arquivos estáticos de ${sharedPublic} para dist/public...`);
      await fs.copy(sharedPublic, path.join(destination, 'public'), { overwrite: true });
    } else {
      console.log(`Diretório ${sharedPublic} não encontrado, ignorando a cópia.`);
    }

    console.log(`Arquivos e pastas copiados para ${apiType} com sucesso!`);
  } catch (err) {
    console.error(`Erro ao copiar arquivos: ${err}`);
  }
}

// Executar o script
copyFiles();
