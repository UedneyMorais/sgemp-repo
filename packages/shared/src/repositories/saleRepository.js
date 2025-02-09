const { Op } = require('sequelize');
const Sale = require('../models/Sale');
const SaleItem = require('../models/SaleItem');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');

class SaleRepository {
  
  async findAndCountAll({ where, limit, offset }) {
    const result = await Sale.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']],
      attributes: [['id', 'saleId'], 'customerId', 'total', 'nfeKey', 'nfeNumber', 'active'],
      include: [
        {          
          model: Customer,
          as: 'customer',
        },
        { 
          model: SaleItem,
          as: 'items',
          attributes: ['id', 'productId'], 
          include: [
            {
              model: Product,
              as: 'product',
              attributes: [['id', 'productId'], 'description', 'price']
            }
          ],
          order: [['id', 'ASC']] 
        }
      ]
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

  async findAll(options = {}) {
    const result = await Sale.findAll({
      ...options,
      order: [['id', 'ASC']],
      attributes: [['id', 'saleId'], 'customerId', 'total', 'nfeKey', 'nfeNumber', 'active'],
      include: [
        {          
          model: Payment,
          as: 'payments',
        },
        
        {          
          model: Customer,
          as: 'customer',
        },
        { 
          model: SaleItem,
          as: 'items',
          attributes: ['id', 'productId'], 
          include: [
            {
              model: Product,
              as: 'product',
              attributes: [['id', 'productId'], 'description', 'price']
            }
          ]
        }
      ]
    });
  
    return result.map(sale => ({
      ...sale.toJSON(),
      items: sale.items
        .sort((a, b) => a.id - b.id)
        .map(item => ({
          productId: item.productId,
          description: item.product?.description,
          price: item.product?.price
        }))
    }));
  }

  async findByPk(id, options = {}) {
    const result = await Sale.findByPk(id, {
      ...options,
      order: [['id', 'ASC']],
      attributes: [['id', 'saleId'], 'customerId', 'total', 'nfeKey', 'nfeNumber', 'active'],
      include: [
        {          
          model: Customer,
          as: 'customer',
        },
        { 
          model: SaleItem,
          as: 'items',
          attributes: ['id', 'productId'], 
          include: [
            {
              model: Product,
              as: 'product',
              attributes: [['id', 'productId'], 'description', 'price']
            }
          ]
        },
        {          
          model: Payment,
          as: 'payments',
        },
      ]
    });
  
  if (!result) {
    return null;
  }


  const sale = result.toJSON();

  return {
    ...sale,
    items: sale.items
      .sort((a, b) => a.id - b.id) 
      .map(item => ({
        productId: item.productId,
        description: item.product?.description,
        price: item.product?.price
      }))
  };
}
  
  async createSale(customerId, transaction) {
    return await Sale.create({ customerId }, { transaction });
  }
  
  async createSaleItems(items, transaction) {
    return SaleItem.bulkCreate(items, { transaction });
}

async updateSaleValue(saleId, totalValue, transaction) {
  return Sale.update(
      { value: totalValue },
      { where: { id: saleId }, transaction }
  );
}

  async update(id, data) {
    const sale = await Sale.findByPk(id);
    if (!sale) return null;

    return sale.update(data);
  }

  async destroy(id) {
    const sale = await Sale.findByPk(id);
    if (!sale) return null;

    return sale.destroy();
  }
}


module.exports = new SaleRepository();