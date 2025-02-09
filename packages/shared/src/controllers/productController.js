const productService = require('../services/productService');

class ProductController {
  
  async getProducts(req, res, next) {
    try {
      const { page = 1, perPage = 10, id, description, ean } = req.query;

      // Passa os parâmetros diretamente para o serviço
      const response = await productService.getProducts({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        id,
        description,
        ean,
      });

      if (!response || response.data.length === 0) {
        return res.status(404).send({ message: 'Nenhum produto foi encontrado.' });
      }

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }


  async getAllProducts(req, res, next) {
    try {
      const products = await productService.getAllProducts(req);

      if (!products || products.length === 0) {
        return res.status(404).send({ message: 'Nenhum produto foi encontrado.' });
      }

      res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      if (!product) {
        return res.status(404).send({ message: `Produto com ID ${id} não encontrado.` });
      }

      res.status(200).send(product);
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).send(product);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({
          message: 'Produto já existe.',
          errors: error.errors.map((err) => err.message),
        });
      }
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updatedProduct = await productService.updateProduct(id, req.body);

      if (!updatedProduct) {
        return res.status(404).send({ message: 'Produto não encontrado.' });
      }

      res.status(200).send(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deletedProduct = await productService.deleteProduct(id);

      if (!deletedProduct) {
        return res.status(404).send({ message: `Produto com ID ${id} não encontrado.` });
      }

      res.status(200).send({ message: `Produto com ID ${id} excluído com sucesso.` });
    } catch (error) {
      next(error);
    }
  }

  async activateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const activatedProduct = await productService.activateProduct(id);

      if (!activatedProduct) {
        return res.status(404).send({ message: `Produto com ID ${id} não encontrado.` });
      }

      res.status(200).send({
        message: 'Produto ativado com sucesso.',
        product: activatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deactivatedProduct = await productService.deactivateProduct(id);

      if (!deactivatedProduct) {
        return res.status(404).send({ message: `Produto com ID ${id} não encontrado.` });
      }

      res.status(200).send({
        message: 'Produto desativado com sucesso.',
        product: deactivatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
