const { Op } = require('sequelize');
const paymentMethodRepository = require('../repositories/paymentMethodRepository');

class PaymentMethodService {

  async getPaymentMethods({ page, perPage, id, name }) {
    const offset = (page - 1) * perPage;

    const where = {};
    if (id) where.id = id;
    if (name) where.name = { [Op.like]: `%${name}%` };

    const { rows: paymentMethods, count } = await paymentMethodRepository.findAndCountAll({
      where,
      limit: perPage,
      offset,
    });

    return {
      total: count,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(count / perPage),
      data: paymentMethods,
    };
  }
  
  async getAllPaymentMethods() {
    return paymentMethodRepository.findAllOrdered();
  }

  async getPaymentMethodById(id) {
    return paymentMethodRepository.findById(id);
  }

  async createPaymentMethod(data) {
    return paymentMethodRepository.createPaymentMethod(data);
  }

  async updatePaymentMethod(id, data) {
    return paymentMethodRepository.updatePaymentMethod(id, data);
  }

  async deletePaymentMethod(id) {
    return paymentMethodRepository.deletePaymentMethod(id);
  }

  async activatePaymentMethod(id) {
    const paymentMethod = await paymentMethodRepository.findById(id);
    if (!paymentMethod) return null;

    paymentMethod.active = true;

    return paymentMethodRepository.save(paymentMethod);
  }

  async deactivatePaymentMethod(id) {
    const paymentMethod = await paymentMethodRepository.findById(id);
    if (!paymentMethod) return null;

    paymentMethod.active = false;

    return paymentMethodRepository.save(paymentMethod);
  }
}

module.exports = new PaymentMethodService();
