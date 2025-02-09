const { Op } = require('sequelize');
const  StockMovement  = require('../models/StockMovement');
const Sale = require('../models/Sale');
const SaleItem = require('../models/SaleItem');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

class StockMovementRepository {

  async findAndCountAll({ where, limit, offset }) {
    const result = await StockMovement.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
      attributes: [['id', 'stockId'], 'type', 'reason'],
      // include: [
      //   {          
      //     model: Sale,
      //     as: 'sale',
      //   },
      //   { 
      //     model: SaleItem,
      //     as: 'items',
      //     attributes: ['id', 'productId'], 
      //     include: [
      //       {
      //         model: Product,
      //         as: 'product',
      //         attributes: [['id', 'productId'], 'description', 'price']
      //       }
      //     ],
      //     order: [['id', 'ASC']] 
      //   }
      // ]
    });

    return {
      ...result,
      rows: result.rows.map(sale => ({
        ...sale.toJSON(),
        items: sale.items
          .sort((a, b) => a.id - b.id)
          .map(item => ({
            productId: item.productId,
            description: item.product?.description,
            price: item.product?.price
          }))
      }))
    };
  }

  async createStockMovement(data, transaction) {
    try {
      console.log("🔍 Tentando inserir movimentação de estoque no banco...");
      const stockMovement = await StockMovement.create(data, { transaction });
      
      console.log("✅ Movimento de estoque inserido:", stockMovement.toJSON()); 
      return stockMovement;
    } catch (error) {
      console.error("❌ Erro ao inserir movimentação de estoque:", error);
      throw error; 
  }
}



  async sumStockByType(productId, type) {
    return await StockMovement.sum('quantity', {
        where: { productId, type }
    });
  }

  

    // async findById(id) {
  //   return Category.findByPk(id);
  // }

  // async findAndCountAll({ where, limit, offset }) {
  //   return Category.findAndCountAll({
  //     where,
  //     limit,
  //     offset,
  //     order: [['categoryName', 'ASC']],
  //   });
  // }


  // async findAllOrdered() {
  //   return Category.findAll({
  //     order: [['categoryName', 'ASC']],
  //   });
  // }

  // async findById(id) {
  //   return Category.findByPk(id);
  // }


  // async save(category) {
  //   return category.save();
  // }

  // async createCategory(data) {
  //   return Category.create(data);
  // }

  // async updateCategory(id, data) {
  //   const category = await this.findById(id);
  //   if (!category) return null;

  //   await category.update(data);
  //   return category;
  // }

  // async deleteCategory(id) {
  //   const category = await this.findById(id);
  //   if (!category) return null;

  //   await category.destroy();
  //   return category;
  // }
}

module.exports = new StockMovementRepository();
