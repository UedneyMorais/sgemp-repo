const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductReportRepository {

  async findAndCountAll({ where, limit, offset }) {
    return Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [['description', 'ASC']],
      attributes: {
        exclude: ['categoryId', 'category_id'],
      },
      include: [
        {
          model: Category,
          as: 'category',
        },
      ],
    });
  }

  async findAll(options = {}) {
    return Product.findAll({
      ...options,
      attributes: {
        exclude: ['categoryId', 'category_id'],
      },
      include: [
        {
          model: Category,
          as: 'category',
        },
      ],
    });
  }

  async findByPk(id, options = {}) {
    return Product.findByPk(id, {
      ...options,
      attributes: {
        exclude: ['categoryId', 'category_id'],
      },
      include: [
        {
          model: Category,
          as: 'category',
        },
      ],
    });
  }

  async create(productData) {
    return Product.create(productData);
  }

  async update(id, productData) {
    const product = await Product.findByPk(id);
    if (!product) return null;

    return product.update(productData);
  }

  async destroy(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;

    return product.destroy();
  }
}

module.exports = new ProductRepository();
