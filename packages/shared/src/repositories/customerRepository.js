const { Customer } = require('../models');

class CustomerRepository {
  
  async findAndCountAll({ where, limit, offset }) {
    return Customer.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
    });
  }


  async findAllOrdered() {
    return Customer.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findById(id) {
    return Customer.findByPk(id);
  }


  async save(customer) {
    return customer.save();
  }

  async createCustomer(data) {
    return Customer.create(data);
  }

  async updateCustomer(id, data) {
    const customer = await this.findById(id);
    if (!customer) return null;

    await customer.update(data);
    return customer;
  }

  async deleteCustomer(id) {
    const customer = await this.findById(id);
    if (!customer) return null;

    await customer.destroy();
    return customer;
  }
}

module.exports = new CustomerRepository();
