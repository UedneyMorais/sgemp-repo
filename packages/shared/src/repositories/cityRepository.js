const { City } = require('../models');

class CityRepository {
  
  async findAndCountAll({ where, limit, offset }) {
    return City.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
    });
  }


  async findAllOrdered() {
    return City.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findById(id) {
    return City.findByPk(id);
  }


  async save(city) {
    return city.save();
  }

  async createCity(data) {
    return City.create(data);
  }

  async updateCity(id, data) {
    const city = await this.findById(id);
    if (!city) return null;

    await city.update(data);
    return city;
  }

  async deleteCity(id) {
    const city = await this.findById(id);
    if (!city) return null;

    await city.destroy();
    return city;
  }
}

module.exports = new CityRepository();
