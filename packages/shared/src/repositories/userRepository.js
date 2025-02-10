const  User  = require('../models/User');

class UserRepository {
  
  async findAndCountAll({ where, limit, offset }) {
    return User.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
    });
  }


  async findAllOrdered() {
    return User.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findById(id) {
    return User.findByPk(id);
  }


  async save(user) {
    return user.save();
  }

  async createUser(data) {
    return User.create(data);
  }

  async updateUser(id, data) {
    const user = await this.findById(id);
    if (!user) return null;

    await user.update(data);
    return user;
  }

  async deleteUser(id) {
    const user = await this.findById(id);
    if (!user) return null;

    await user.destroy();
    return user;
  }
}

module.exports = new UserRepository();
