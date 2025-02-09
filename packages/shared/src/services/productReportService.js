const { createProductReport } = require('../utils/reports/product/productReport');
const productService = require('./productService');

class ProductReportService {
  async generateReport({ page, perPage, id, description, ean, all }) {

    // Reutiliza o método de listagem do productService
    const { data: products, total } = all
      ? await productService.getAllProducts({ id, description, ean }) // Método para buscar todos os produtos
      : await productService.getProducts({ page, perPage, id, description, ean });

    // Formata os produtos para o relatório
    const formattedProducts = products.map((product) => {
      const { dataValues, category } = product;
      return {
        ...dataValues,
        category: category ? category.dataValues : null,
      };
    });

    // Subtítulo com base na condição
    const subtitle = all 
      ? 'Relatório completo de todos os produtos' 
      : `Página ${page} de ${Math.ceil(total / perPage)}`;

    // Gera o PDF com os produtos filtrados
    return createProductReport(
      'Relatório de Produtos',
      subtitle,
      formattedProducts,
      'Administrador'
    );
  }
}

module.exports = new ProductReportService();
