const productReportService = require('../services/productReportService');

class ProductReportController {
  async generateProductReport(req, res, next) {
    try {
      const { page = 1, perPage = 10, id, description, ean, all } = req.query;

      // Chama o serviço para gerar o relatório
      const pdfBuffer = await productReportService.generateReport({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        id,
        description,
        ean,
        all: all === 'true'
      });


     // Configura os headers para download do PDF
      const fileName = all === 'true' 
      ? 'Relatorio_Todos_Produtos.pdf' 
      : `Relatorio_Produtos_Pagina_${page}.pdf`;

      // Configura os headers para download do PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.status(200).send(pdfBuffer);
    } catch (error) {
      console.error('Error generating product report:', error);
      next(error);
    }
  }
}

module.exports = new ProductReportController();
