const saleService = require('../services/saleService');

class SaleController {
  
  async getSales(req, res, next) {
    try {
      const { page = 1, perPage = 10, id } = req.query;

      const response = await saleService.getSales({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        id,
      });

      if (!response || response.data.length === 0) {
        return res.status(404).send({ message: 'Nenhuma venda foi encontrada.' });
      }

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
    }
  
    async getAllSales(req, res, next) {
      try {
        const sales = await saleService.getAllSales(req);
  
        if (!sales || sales.length === 0) {
          return res.status(404).send({ message: 'Nenhuma venda foi encontrada.' });
        }
  
        res.status(200).send(sales);
      } catch (error) {
        next(error);
      }
    }
  
    async getSaleById(req, res, next) {
      try {
        const { id } = req.params;
        const sale = await saleService.getSaleById(id);
  
        if (!sale) {
          return res.status(404).send({ message: `Venda com ID ${id} não encontrada.` });
        }
  
        res.status(200).send(sale);
      } catch (error) {
        next(error);
      }
    }
  
    async createSale(req, res, next) {
      try {
        const sale = await saleService.createSale(req);
        res.status(201).send(sale);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).send({
            message: 'Venda já existe.',
            errors: error.errors.map((err) => err.message),
          });
        }

        if (error.message.includes('Estoque insuficiente para saída do produto')) {
          return res.status(400).send({
            message: error.message,
            errors: error.errors ? error.errors.map((err) => err.message) : [],
          });
        }
        
        next(error);
      }
    }
  
    async updateSale(req, res, next) {
      try {
        const { id } = req.params;
        const updatedSale = await saleService.updateSale(id, req.body);
  
        if (!updatedSale) {
          return res.status(404).send({ message: 'Venda não encontrada.' });
        }
  
        res.status(200).send(updatedSale);
      } catch (error) {
        next(error);
      }
    }
  
    async deleteSale(req, res, next) {
      try {
        const { id } = req.params;
        const deletedSale = await saleService.deleteSale(id);
  
        if (!deletedSale) {
          return res.status(404).send({ message: `Venda com ID ${id} não encontrada.` });
        }
  
        res.status(200).send({ message: `Venda com ID ${id} excluída com sucesso.` });
      } catch (error) {
        next(error);
      }
    }

    async activateSale(req, res, next) {
      try {
        const { id } = req.params;
        const activateSale = await saleService.activateSale(id, req.body);
    
        if (!activateSale) {
          return res.status(404).send({ message: `Venda com ID ${id} não encontrada.` }); 
        }
    
        res.status(200).send(activateSale);
      } catch (error) {
        next(error);
      }
    }
    
    async deactivateSale(req, res, next) {
      try {
        const { id } = req.params;
        const deactivateSale = await saleService.deactivateSale(id, req.body);
    
        if (!deactivateSale) {
          return res.status(404).send({ message: `Venda com ID ${id} não encontrada.` });
        }
    
        res.status(200).send(deactivateSale);
      } catch (error) {
        next(error);
      }
    }


  }
  
  module.exports = new SaleController();
  