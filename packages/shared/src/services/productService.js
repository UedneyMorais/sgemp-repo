const { Op } = require('sequelize');
const productRepository = require('../repositories/productRepository');
const stockMovementService = require('../services/stockMovementService');
const sequelize = require('../config/database');

class ProductService {
  
  async getProducts({ page, perPage, id, description, ean }) {
    const offset = (page - 1) * perPage;

    const where = {};
    if (id) where.id = id;
    if (description) where.description = { [Op.like]: `%${description}%` };
    if (ean) where.ean = ean;

    const { rows: products, count } = await productRepository.findAndCountAll({
      where,
      limit: perPage,
      offset,
    });
    
    const productsWithStock = await Promise.all(products.map(async (product) => {
      const stock = await stockMovementService.getStockByProductId(product.id);
      return {
          ...product.toJSON(), 
          quantity: stock      
      };
  }));

    return {
      total: count,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(count / perPage),
      data: productsWithStock,
    };
  }

  // async getAllProducts() {
  //   // Busca todos os produtos sem paginação
  //   return productRepository.findAll();
  // }

  async getAllProducts({ id, description, ean, all }) {
   
    const where = {};

    if(!all){
      if (id) where.id = id;
      if (description) where.description = { [Op.like]: `%${description}%` };
      if (ean) where.ean = ean;
    }

    const products = await productRepository.findAll({ where });

    return { data: products, total: products.length };
  }

  async getProductById(id) {
    // Busca produto por ID
    return productRepository.findByPk(id, {
      include: ['category'], // Inclui a relação com categorias
    });
  }

  async getProductByEan(ean) {
    // Busca produto por ID
    return productRepository.findByEan(ean);
  }

  async createProduct(data, transaction = null) {
    const newTransaction = transaction || await sequelize.transaction();
    try {
      const { quantity, ...productData } = data; 

      const newProduct = await productRepository.create(productData);

      const formatedDataStock = {
        "productId" : newProduct.id,
        "quantity" : quantity,
        "type": 'ENTRY',
        "reason" : 'cadprod'
      }

      const stockMovement = await stockMovementService.registerStocksEntry(formatedDataStock, newTransaction);

      if (!transaction) {
        console.log("Commitando transação...");
        await newTransaction.commit();
        console.log("Transação de estoque concluída!");
      }

      return productRepository.findByPk(newProduct.id, {
        include: ['category'], 
      });
    } catch (error) {
        if (!transaction) await newTransaction.rollback();
        throw error;
    }


  }

  async updateProduct(id, productData) {
    const product = await productRepository.findByPk(id);

    if (!product) {
      return null;
    }

    await productRepository.update(id, productData);
    return productRepository.findByPk(id, {
      include: ['category'],
    });
  }

  async deleteProduct(id) {
    const product = await productRepository.findByPk(id);

    if (!product) {
      return null; // Retorna nulo se o produto não for encontrado
    }

    await productRepository.destroy(id);
    return product;
  }

  async activateProduct(id) {
    const product = await productRepository.findByPk(id);

    if (!product) {
      return null; // Retorna nulo se o produto não for encontrado
    }

    await productRepository.update(id, { active: true });
    return productRepository.findByPk(id, {
      include: ['category'], // Inclui categoria após ativar
    });
  }

  async deactivateProduct(id) {
    const product = await productRepository.findByPk(id);

    if (!product) {
      return null; // Retorna nulo se o produto não for encontrado
    }

    await productRepository.update(id, { active: false });
    return productRepository.findByPk(id, {
      include: ['category'], // Inclui categoria após desativar
    });
  }
}

module.exports = new ProductService();
