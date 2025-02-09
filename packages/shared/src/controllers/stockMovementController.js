const stockMovementService = require('../services/stockMovementService');
const productService = require('../services/productService');

class StockMovementController {

    async getStockAllProducts(req, res, next) {
      try {
        const { page = 1, perPage = 10, id } = req.query;
  
        const response = await stockMovementService.getStockAllProducts({
          page: parseInt(page, 10),
          perPage: parseInt(perPage, 10),
          id,
        });
  
        if (!response || response.data.length === 0) {
          return res.status(404).send({ message: 'Nenhum produto foi encontrado.' });
        }
  
        res.status(200).send(response);
      } catch (error) {
        next(error);
      }
    }

    async getStockByProductId(req, res, next) {
      try {
        const { id } = req.params;

        const product = await productService.getProductById(id);

        if (!product) {
          return res.status(404).send({ message: `Produto com ID ${id} não encontrado.` });
        }

        const stock = await stockMovementService.getStockByProductId(id);
  
        if (stock === null) {
            return res.status(404).send({ message: `Produto código ${id} não encontrado.` });
        }

        res.status(200).send({ 
            productId: id,
            stock: stock 
        });
      } catch (error) {
        next(error);
      }
    }

    async getStockByProductEan(req, res, next) {
      try {
        const { ean } = req.params;

        const product = await productService.getProductByEan(ean);

        if (!product) {
          return res.status(404).send({ message: `Produto com Código de barras ${ean} não encontrado.` });
        }

        const stock = await stockMovementService.getStockByProductId(product.id);
  
        if (stock === null) {
            return res.status(404).send({ message: `Produto código de barras ${ean} não encontrado.` });
        }

        res.status(200).send({ 
            id: product.id,
            ean: product.ean,
            price: product.price,
            description: product.description,
            stock: stock 
        });
      } catch (error) {
        next(error);
      }
    }

    async registerStocksEntry(req, res, next) {
      try {
        const registeredEntry = await stockMovementService.registerStocksEntry(req.body);
  
        if (!registeredEntry) {
          return res.status(404).send({ message: 'AJUSTAR:Categoria não encontrada.' });
        }
  
        res.status(200).send(registeredEntry);
      } catch (error) {
        if (error.message === 'Estoque insuficiente para saída.') {
          return res.status(400).json({ message: error.message }); 
        }
    
        next(error);
      }
    }






      //   async getCategoryById(req, res, next) {
  //     try {
  //       const { id } = req.params;
  //       const category = await categoryService.getCategoryById(id);
  
  //       if (!category) {
  //         return res.status(404).send({ message: `Categoria com ID ${id} não encontrada.` });
  //       }
  
  // async getCategories(req, res, next) {
  //   try {
  //     const { page = 1, perPage = 10, id, categoryName } = req.query;

  //     const response = await categoryService.getCategories({
  //       page: parseInt(page, 10),
  //       perPage: parseInt(perPage, 10),
  //       id,
  //       categoryName,
  //     });

  //     if (!response || response.data.length === 0) {
  //       return res.status(404).send({ message: 'Nenhuma categoria foi encontrada.' });
  //     }

  //     res.status(200).send(response);
  //   } catch (error) {
  //     next(error);
  //   }
  //   }
  
  //   async getAllCategories(req, res, next) {
  //     try {
  //       const categories = await categoryService.getAllCategories();
  
  //       if (!categories || categories.length === 0) {
  //         return res.status(404).send({ message: 'Nenhuma categoria foi encontrada.' });
  //       }
  
  //       res.status(200).send(categories);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  
  //   async getCategoryById(req, res, next) {
  //     try {
  //       const { id } = req.params;
  //       const category = await categoryService.getCategoryById(id);
  
  //       if (!category) {
  //         return res.status(404).send({ message: `Categoria com ID ${id} não encontrada.` });
  //       }
  
  //       res.status(200).send(category);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  
  //   async createCategory(req, res, next) {
  //     try {
  //       const category = await categoryService.createCategory(req.body);
  //       res.status(201).send(category);
  //     } catch (error) {
  //       if (error.name === 'SequelizeUniqueConstraintError') {
  //         return res.status(400).send({
  //           message: 'Categoria já existe.',
  //           errors: error.errors.map((err) => err.message),
  //         });
  //       }
  //       next(error);
  //     }
  //   }
  
  //   async updateCategory(req, res, next) {
  //     try {
  //       const { id } = req.params;
  //       const updatedCategory = await categoryService.updateCategory(id, req.body);
  
  //       if (!updatedCategory) {
  //         return res.status(404).send({ message: 'Categoria não encontrada.' });
  //       }
  
  //       res.status(200).send(updatedCategory);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  
  //   async deleteCategory(req, res, next) {
  //     try {
  //       const { id } = req.params;
  //       const deletedCategory = await categoryService.deleteCategory(id);
  
  //       if (!deletedCategory) {
  //         return res.status(404).send({ message: `Categoria com ID ${id} não encontrada.` });
  //       }
  
  //       res.status(200).send({ message: `Categoria com ID ${id} excluída com sucesso.` });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }

  //   async activateCategory(req, res, next) {
  //     try {
  //       const { id } = req.params;
  //       const activateCategory = await categoryService.activateCategory(id, req.body);
  
  //       if (!activateCategory) {
  //         return res.status(404).send({ message: 'Categoria com ID ${id} não encontrada.' });
  //       }
  
  //       res.status(200).send(activateCategory);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }

  //   async deactivateCategory(req, res, next) {
  //     try {
  //       const { id } = req.params;
  //       const deactivateCategory = await categoryService.deactivateCategory(id, req.body);
  
  //       if (!deactivateCategory) {
  //         return res.status(404).send({ message: 'Categoria não encontrada.' });
  //       }
  
  //       res.status(200).send(deactivateCategory);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }


  }
  
  module.exports = new StockMovementController();
  