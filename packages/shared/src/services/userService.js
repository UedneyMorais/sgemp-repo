const { Op } = require('sequelize');
const userRepository = require('../repositories/userRepository');

class UserService {

  async getUsers({ page, perPage, id, name, email, profile }) {
    const offset = (page - 1) * perPage;

    const where = {};
    if (id) where.id = id;
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (profile) where.profile = profile;
    //if (active !== undefined) where.active = active === true;

    const { rows: users, count } = await userRepository.findAndCountAll({
      where,
      limit: perPage,
      offset,
    });

    return {
      total: count,
      perPage,
      currentPage: page,
      lastPage: Math.ceil(count / perPage),
      data: users,
    };
  }
  
  async getAllUsers() {
    return userRepository.findAllOrdered();
  }

  async getUserById(id) {
    return userRepository.findById(id);
  }

  async createUser(data) {
    return userRepository.createUser(data);
  }

  async updateUser(id, data) {
    return userRepository.updateUser(id, data);
  }

  async deleteUser(id) {
    return userRepository.deleteUser(id);
  }

  async activateUser(id) {
    const user = await userRepository.findById(id);
    if (!user) return null;

    user.active = true;

    return userRepository.save(user);
  }

  async deactivateUser(id) {
    const user = await userRepository.findById(id);
    if (!user) return null;

    user.active = false;

    return userRepository.save(user);
  }
}

module.exports = new UserService();
