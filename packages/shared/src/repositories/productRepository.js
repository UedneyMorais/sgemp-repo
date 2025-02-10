const Product = require('../models/Product');
const Category = require('../models/Category');

class ProductRepository {

  async findAndCountAll({ where, limit, offset }) {
    return await Product.findAndCountAll({
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
    return await Product.findAll({
      ...options,
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

  async findByPk(id, options = {}) {

    const product = await Product.findByPk(id, {
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

    return product;
  }

  async findByEan(ean, options = {}) {

    const product = await Product.findOne({
      //...options,
      where: { ean },
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

    return product;
  }


  async create(productData) {
    return await Product.create(productData);
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
