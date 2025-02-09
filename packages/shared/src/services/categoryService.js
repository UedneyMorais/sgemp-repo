const { Op } = require('sequelize');
const categoryRepository = require('../repositories/categoryRepository');

class CategoryService {

  async getCategories({ page, perPage, id, categoryName }) {
    const offset = (page - 1) * perPage;

    const where = {};
    if (id) where.id = id;
    if (categoryName) where.categoryName = { [Op.like]: `%${categoryName}%` };

    const { rows: categories, count } = await categoryRepository.findAndCountAll({
      where,
      limit: perPage,
      offset,
    });

    return {
      total: count,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(count / perPage),
      data: categories,
    };
  }
  
  async getAllCategories() {
    return categoryRepository.findAllOrdered();
  }

  async getCategoryById(id) {
    return categoryRepository.findById(id);
  }

  async createCategory(data) {
    return categoryRepository.createCategory(data);
  }

  async updateCategory(id, data) {
    return categoryRepository.updateCategory(id, data);
  }

  async deleteCategory(id) {
    return categoryRepository.deleteCategory(id);
  }

  async activateCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) return null;

    category.active = true;

    return categoryRepository.save(category);
  }

  async deactivateCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) return null;

    category.active = false;

    return categoryRepository.save(category);
  }
}

module.exports = new CategoryService();
