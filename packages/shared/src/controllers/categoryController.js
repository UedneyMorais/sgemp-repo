const categoryService = require('../services/categoryService');

class CategoryController {
  
  async getCategories(req, res, next) {
    try {
      const { page = 1, perPage = 10, id, categoryName } = req.query;

      const response = await categoryService.getCategories({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        id,
        categoryName,
      });

      if (!response || response.data.length === 0) {
        return res.status(404).send({ message: 'Nenhuma categoria foi encontrada.' });
      }

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
    }
  
    async getAllCategories(req, res, next) {
      try {
        const categories = await categoryService.getAllCategories();
  
        if (!categories || categories.length === 0) {
          return res.status(404).send({ message: 'Nenhuma categoria foi encontrada.' });
        }
  
        res.status(200).send(categories);
      } catch (error) {
        next(error);
      }
    }
  
    async getCategoryById(req, res, next) {
      try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);
  
        if (!category) {
          return res.status(404).send({ message: `Categoria com ID ${id} não encontrada.` });
        }
  
        res.status(200).send(category);
      } catch (error) {
        next(error);
      }
    }
  
    async createCategory(req, res, next) {
      try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).send(category);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).send({
            message: 'Categoria já existe.',
            errors: error.errors.map((err) => err.message),
          });
        }
        next(error);
      }
    }
  
    async updateCategory(req, res, next) {
      try {
        const { id } = req.params;
        const updatedCategory = await categoryService.updateCategory(id, req.body);
  
        if (!updatedCategory) {
          return res.status(404).send({ message: 'Categoria não encontrada.' });
        }
  
        res.status(200).send(updatedCategory);
      } catch (error) {
        next(error);
      }
    }
  
    async deleteCategory(req, res, next) {
      try {
        const { id } = req.params;
        const deletedCategory = await categoryService.deleteCategory(id);
  
        if (!deletedCategory) {
          return res.status(404).send({ message: `Categoria com ID ${id} não encontrada.` });
        }
  
        res.status(200).send({ message: `Categoria com ID ${id} excluída com sucesso.` });
      } catch (error) {
        next(error);
      }
    }

    async activateCategory(req, res, next) {
      try {
        const { id } = req.params;
        const activateCategory = await categoryService.activateCategory(id, req.body);
  
        if (!activateCategory) {
          return res.status(404).send({ message: 'Categoria com ID ${id} não encontrada.' });
        }
  
        res.status(200).send(activateCategory);
      } catch (error) {
        next(error);
      }
    }

    async deactivateCategory(req, res, next) {
      try {
        const { id } = req.params;
        const deactivateCategory = await categoryService.deactivateCategory(id, req.body);
  
        if (!deactivateCategory) {
          return res.status(404).send({ message: 'Categoria não encontrada.' });
        }
  
        res.status(200).send(deactivateCategory);
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = new CategoryController();
  