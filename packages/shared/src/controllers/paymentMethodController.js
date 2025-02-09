const paymentMethodService = require('../services/paymentMethodService');

class PaymentMethodController {
  
  async getPaymentMethods(req, res, next) {
    try {
      const { page = 1, perPage = 10, id, name } = req.query;

      const response = await paymentMethodService.getPaymentMethods({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        id,
        name,
      });

      if (!response || response.data.length === 0) {
        return res.status(404).send({ message: 'Nenhuma forma de pagamento foi encontrada.' });
      }

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
    }
  
    async getAllPaymentMethods(req, res, next) {
      try {
        const paymentMethods = await paymentMethodService.getAllPaymentMethods();
  
        if (!paymentMethods || paymentMethods.length === 0) {
          return res.status(404).send({ message: 'Nenhuma forma de pagamento foi encontrada.' });
        }
  
        res.status(200).send(paymentMethods);
      } catch (error) {
        next(error);
      }
    }
  
    async getPaymentMethodById(req, res, next) {
      try {
        const { id } = req.params;
        const paymentMethod = await paymentMethodService.getPaymentMethodById(id);
  
        if (!paymentMethod) {
          return res.status(404).send({ message: `Forma de pagamento com ID ${id} não encontrada.` });
        }
  
        res.status(200).send(paymentMethod);
      } catch (error) {
        next(error);
      }
    }
  
    async createPaymentMethod(req, res, next) {
      try {
        const paymentMethod = await paymentMethodService.createPaymentMethod(req.body);
        res.status(201).send(paymentMethod);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).send({
            message: 'Forma de pagamento já existe.',
            errors: error.errors.map((err) => err.message),
          });
        }
        next(error);
      }
    }
  
    async updatePaymentMethod(req, res, next) {
      try {
        const { id } = req.params;
        const updatedPaymentMethod = await paymentMethodService.updatePaymentMethod(id, req.body);
  
        if (!updatedPaymentMethod) {
          return res.status(404).send({ message: 'Forma de pagamento não encontrada.' });
        }
  
        res.status(200).send(updatedPaymentMethod);
      } catch (error) {
        next(error);
      }
    }
  
    async deletePaymentMethod(req, res, next) {
      try {
        const { id } = req.params;
        const deletedPaymentMethod = await paymentMethodService.deletePaymentMethod(id);
  
        if (!deletedPaymentMethod) {
          return res.status(404).send({ message: `Forma de pagamento com ID ${id} não encontrada.` });
        }
  
        res.status(200).send({ message: `Forma de pagamento com ID ${id} excluída com sucesso.` });
      } catch (error) {
        next(error);
      }
    }

    async activatePaymentMethod(req, res, next) {
      try {
        const { id } = req.params;
        const activatePaymentMethod = await paymentMethodService.activatePaymentMethod(id, req.body);
  
        if (!activatePaymentMethod) {
          return res.status(404).send({ message: 'Forma de pagamento com ID ${id} não encontrada.' });
        }
  
        res.status(200).send(activatePaymentMethod);
      } catch (error) {
        next(error);
      }
    }

    async deactivatePaymentMethod(req, res, next) {
      try {
        const { id } = req.params;
        const deactivatePaymentMethod = await paymentMethodService.deactivatePaymentMethod(id, req.body);
  
        if (!deactivatePaymentMethod) {
          return res.status(404).send({ message: 'Forma de pagamento não encontrada.' });
        }
  
        res.status(200).send(deactivatePaymentMethod);
      } catch (error) {
        next(error);
      }
    }


  }
  
  module.exports = new PaymentMethodController();
  