const path = require('path');
const moment = require('moment');
const PdfPrinter = require('pdfmake');

// Caminho base para recursos do relatório
const basePath = path.resolve(__dirname, '../../../templates');

const fonts = {
  Roboto: {
    normal: `${basePath}/fonts/Roboto-Regular.ttf`,
    bold: `${basePath}/fonts/Roboto-Medium.ttf`,
    italics: `${basePath}/fonts/Roboto-Italic.ttf`,
    bolditalics: `${basePath}/fonts/Roboto-MediumItalic.ttf`,
  },
};

const createProductReport = async (title, subtitle, products, userName) => {
  const printer = new PdfPrinter(fonts);

  const headers = ['ID', 'Descrição', 'Preço', 'CFOP', 'EAN', 'Categoria', 'Ativo'];

  const data = products.map((product) => [
    product.id,
    product.description,
    `R$ ${product.price.toFixed(2)}`,
    product.cfop,
    product.ean,
    product.category?.categoryName || 'N/A',
    product.active ? 'Sim' : 'Não',
  ]);

  const documentDefinition = {
    info: {
      title: 'Relatório de Produtos', // Título exibido no navegador
      author: userName, // Autor do documento
      subject: subtitle, // Subtítulo ou descrição do relatório
      keywords: 'Relatório, Produtos, PDF', // Palavras-chave para pesquisa
      creator: 'Seu Sistema', // Sistema criador do documento
      producer: 'pdfmake', // Biblioteca usada
    },
    pageOrientation: 'portrait',
    pageMargins: [30, 70, 30, 40],
    defaultStyle: {
      fontSize: 9,
    },
    header() {
        return {
          margin: [30, 20], // Ajusta margens do topo
          alignment: 'center',
          columns: [
            {
              width: '*',
              alignment: 'center',
              stack: [
                { text: title, fontSize: 14, bold: true, margin: [0, 0, 0, 5] }, // Margem inferior para separação
                { text: subtitle, fontSize: 10, italics: true },
              ],
            },
          ],
          border: [false, false, false, true], // Borda apenas na parte inferior
        };
      },      
    content: [
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto', '*', 'auto'],
          body: [
            headers.map((header) => ({ text: header, bold: true })),
            ...data,
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ],
    footer(currentPage, pageCount) {
      return {
        margin: [30, 0, 30, 0],
        columns: [
          { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center' },
          {
            text: `Gerado por: ${userName} em ${moment().format('DD/MM/YYYY HH:mm:ss')}`,
            alignment: 'right',
          },
        ],
      };
    },
  };

  const pdfDoc = printer.createPdfKitDocument(documentDefinition);
  const chunks = [];

  pdfDoc.on('data', (chunk) => chunks.push(chunk));
  pdfDoc.end();

  return new Promise((resolve, reject) => {
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.on('error', (error) => reject(error));
  });
};

module.exports = { createProductReport };
