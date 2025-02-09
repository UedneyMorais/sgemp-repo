const { PaymentMethod } = require('../models');

class PaymentMethodRepository {
  
  async findAndCountAll({ where, limit, offset }) {
    return PaymentMethod.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
    });
  }


  async findAllOrdered() {
    return PaymentMethod.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findById(id) {
    return PaymentMethod.findByPk(id);
  }


  async save(paymentMethod) {
    return paymentMethod.save();
  }

  async createPaymentMethod(data) {
    return PaymentMethod.create(data);
  }

  async updatePaymentMethod(id, data) {
    const paymentMethod = await this.findById(id);
    if (!paymentMethod) return null;

    await paymentMethod.update(data);
    return paymentMethod;
  }

  async deletePaymentMethod(id) {
    const paymentMethod = await this.findById(id);
    if (!paymentMethod) return null;

    await paymentMethod.destroy();
    return paymentMethod;
  }
}

module.exports = new PaymentMethodRepository();
