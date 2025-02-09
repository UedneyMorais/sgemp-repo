const customerService = require('../services/customerService');

class CustomerController {
  
  async getCustomers(req, res, next) {
    try {
      const { page = 1, perPage = 10, id, name, cpfCnpj } = req.query;

      const response = await customerService.getCustomers({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        id,
        name,
        cpfCnpj
      });

      if (!response || response.data.length === 0) {
        return res.status(404).send({ message: 'Nenhuma cidade foi encontrada.' });
      }

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
    }
  
    async getAllCustomers(req, res, next) {
      try {
        const cities = await customerService.getAllCustomers();
  
        if (!cities || cities.length === 0) {
          return res.status(404).send({ message: 'Nenhuma cidade foi encontrada.' });
        }
  
        res.status(200).send(cities);
      } catch (error) {
        next(error);
      }
    }
  
    async getCustomerById(req, res, next) {
      try {
        const { id } = req.params;
        const customer = await customerService.getCustomerById(id);
  
        if (!customer) {
          return res.status(404).send({ message: `Cliente com ID ${id} não encontrada.` });
        }
  
        res.status(200).send(customer);
      } catch (error) {
        next(error);
      }
    }
  
    async createCustomer(req, res, next) {
      try {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).send(customer);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).send({
            message: 'Cliente já existe.',
            errors: error.errors.map((err) => err.message),
          });
        }
        next(error);
      }
    }
  
    async updateCustomer(req, res, next) {
      try {
        const { id } = req.params;
        const updatedCustomer = await customerService.updateCustomer(id, req.body);
  
        if (!updatedCustomer) {
          return res.status(404).send({ message: 'Cliente não encontrada.' });
        }
  
        res.status(200).send(updatedCustomer);
      } catch (error) {
        next(error);
      }
    }
  
    async deleteCustomer(req, res, next) {
      try {
        const { id } = req.params;
        const deletedCustomer = await customerService.deleteCustomer(id);
  
        if (!deletedCustomer) {
          return res.status(404).send({ message: `Cliente com ID ${id} não encontrada.` });
        }
  
        res.status(200).send({ message: `Cliente com ID ${id} excluída com sucesso.` });
      } catch (error) {
        next(error);
      }
    }

    async activateCustomer(req, res, next) {
      try {
        const { id } = req.params;
        const activateCustomer = await customerService.activateCustomer(id, req.body);
  
        if (!activateCustomer) {
          return res.status(404).send({ message: 'Cliente com ID ${id} não encontrada.' });
        }
  
        res.status(200).send(activateCustomer);
      } catch (error) {
        next(error);
      }
    }

    async deactivateCustomer(req, res, next) {
      try {
        const { id } = req.params;
        const deactivateCustomer = await customerService.deactivateCustomer(id, req.body);
  
        if (!deactivateCustomer) {
          return res.status(404).send({ message: 'Cliente não encontrada.' });
        }
  
        res.status(200).send(deactivateCustomer);
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = new CustomerController();
  