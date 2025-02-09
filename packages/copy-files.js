console.log("Iniciando o processo de cópia...");
const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
 
  const apiType = process.env.API_TYPE;

  if (!apiType) {
    console.error('É necessário especificar o tipo de API (api ou pdv) na variável de ambiente API_TYPE.');
    return;
  }

  try {
    const source = path.join(__dirname, 'packages', apiType, 'src');
    const destination = path.join(__dirname, 'packages', apiType, 'dist');
    const sharedPublic = path.join(__dirname, 'shared', 'public', apiType); // Ajuste o caminho se necessário

    // Cria o diretório dist (se não existir)
    await fs.ensureDir(destination);

    // Copia tudo de src para dist (incluindo subpastas e arquivos não JS)
    await fs.copy(source, destination, { overwrite: true });

    // Copia arquivos estáticos (se existirem)
    if (sharedPublic) {
      await fs.copy(sharedPublic, path.join(destination, 'public'), { overwrite: true });
    }


    console.log(`Arquivos e pastas copiados para ${apiType} com sucesso!`);
  } catch (err) {
    console.error(`Erro ao copiar arquivos: ${err}`);
  }
}
