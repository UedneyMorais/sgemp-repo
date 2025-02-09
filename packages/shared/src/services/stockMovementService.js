const { Op } = require('sequelize');
const stockMovementRepository = require('../repositories/stockMovementRepository');
const productRepository = require('../repositories/productRepository');
const sequelize = require('../config/database');


class StockMovementService {

    async getStockAllProducts({ page, perPage, id }) {
      const offset = (page - 1) * perPage;
  
      const where = {};
      if (id) where.id = id;
  
      const { rows: products, count } = await productRepository.findAndCountAll({
        where,
        limit: perPage,
        offset,
        attributes: ['id', 'description', 'price', 'ean'],
    });

    const formattedStockProducts = await Promise.all(
        products.map(async (product) => {
            const totalEntries = await stockMovementRepository.sumStockByType(product.id, 'ENTRY');
            const totalExits = await stockMovementRepository.sumStockByType(product.id, 'EXIT');

            const stock = (totalEntries || 0) - (totalExits || 0);

            return {
                productId: product.id,
                description: product.description,
                price: product.price,
                stock,
                ean: product.ean
            };
        })
    );

    return {
        total: count,
        perPage,
        currentPage: page,
        lastPage: Math.ceil(count / perPage),
        data: formattedStockProducts
    };
    }

  async registerStocksEntry(data, transaction = null) {
    const newTransaction = transaction || await sequelize.transaction(); 

    try {
        
        if(data.reason !== 'cadprod') {
            const product = await productRepository.findByPk(data.productId, { transaction: newTransaction });

            if (!product) {
                throw new Error(`Produto com ID ${data.productId} não encontrado.`);
        }
        }



        if (data.type === 'EXIT') {
            const currentStock = await this.getStockByProductId(data.productId);
            console.log(`Estoque atual do produto ${data.productId}:`, currentStock);

            if (currentStock < data.quantity) {
                throw new Error('Estoque insuficiente para saída.');
            }

            console.log("✅ Estoque validado, preparando para registrar a saída...");
        }

        console.log("Criando registro de movimentação de estoque...");
        console.log("Dados a serem salvos:", JSON.stringify(data, null, 2));

        const stockMovement = await stockMovementRepository.createStockMovement(data, newTransaction);

        if (!transaction) {
            console.log("Commitando transação...");
            await newTransaction.commit();
            console.log("Transação de estoque concluída!");
        }

        return stockMovement;

    } catch (error) {
        if (!transaction) await newTransaction.rollback();
        throw error;
    }
}

  async getStockByProductId(productId) {
    const totalEntries = await stockMovementRepository.sumStockByType(productId, 'ENTRY');
    const totalExits = await stockMovementRepository.sumStockByType(productId, 'EXIT');

    return (totalEntries || 0) - (totalExits || 0);
  }



  // async getCategories({ page, perPage, id, categoryName }) {
  //   const offset = (page - 1) * perPage;

  //   const where = {};
  //   if (id) where.id = id;
  //   if (categoryName) where.categoryName = { [Op.like]: `%${categoryName}%` };

  //   const { rows: categories, count } = await categoryRepository.findAndCountAll({
  //     where,
  //     limit: perPage,
  //     offset,
  //   });

  //   return {
  //     total: count,
  //     perPage,
  //     currentPage: page,
  //     lastPage: Math.ceil(count / perPage),
  //     data: categories,
  //   };
  // }
  
  // async getAllCategories() {
  //   return categoryRepository.findAllOrdered();
  // }

  // async getCategoryById(id) {
  //   return categoryRepository.findById(id);
  // }

  // async createCategory(data) {
  //   return categoryRepository.createCategory(data);
  // }

  // async updateCategory(id, data) {
  //   return categoryRepository.updateCategory(id, data);
  // }

  // async deleteCategory(id) {
  //   return categoryRepository.deleteCategory(id);
  // }

  // async activateCategory(id) {
  //   const category = await categoryRepository.findById(id);
  //   if (!category) return null;

  //   category.active = true;

  //   return categoryRepository.save(category);
  // }

  // async deactivateCategory(id) {
  //   const category = await categoryRepository.findById(id);
  //   if (!category) return null;

  //   category.active = false;

  //   return categoryRepository.save(category);
  // }
}

module.exports = new StockMovementService();
