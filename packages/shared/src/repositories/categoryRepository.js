const { Category } = require('../models');

class CategoryRepository {
  
  async findAndCountAll({ where, limit, offset }) {
    return Category.findAndCountAll({
      where,
      limit,
      offset,
      order: [['categoryName', 'ASC']],
    });
  }


  async findAllOrdered() {
    return Category.findAll({
      order: [['categoryName', 'ASC']],
    });
  }

  async findById(id) {
    return Category.findByPk(id);
  }


  async save(category) {
    return category.save();
  }

  async createCategory(data) {
    return Category.create(data);
  }

  async updateCategory(id, data) {
    const category = await this.findById(id);
    if (!category) return null;

    await category.update(data);
    return category;
  }

  async deleteCategory(id) {
    const category = await this.findById(id);
    if (!category) return null;

    await category.destroy();
    return category;
  }
}

module.exports = new CategoryRepository();
