const { Op } = require('sequelize');
const customerRepository = require('../repositories/customerRepository');

class CustomerService {

  async getCustomers({ page, perPage, id, name, cpfCnpj }) {
    const offset = (page - 1) * perPage;

    const where = {};
    if (id) where.id = id;
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (cpfCnpj) where.cpfCnpj = { [Op.like]: `%${cpfCnpj}%` };

    const { rows: cities, count } = await customerRepository.findAndCountAll({
      where,
      limit: perPage,
      offset,
    });

    return {
      total: count,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(count / perPage),
      data: cities,
    };
  }
  
  async getAllCustomers() {
    return customerRepository.findAllOrdered();
  }

  async getCustomerById(id) {
    return customerRepository.findById(id);
  }

  async createCustomer(data) {
    return customerRepository.createCustomer(data);
  }

  async updateCustomer(id, data) {
    return customerRepository.updateCustomer(id, data);
  }

  async deleteCustomer(id) {
    return customerRepository.deleteCustomer(id);
  }

  async activateCustomer(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) return null;

    customer.active = true;

    return customerRepository.save(customer);
  }

  async deactivateCustomer(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) return null;

    customer.active = false;

    return customerRepository.save(customer);
  }
}

module.exports = new CustomerService();
