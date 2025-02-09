const { Op } = require('sequelize');
const cityRepository = require('../repositories/cityRepository');

class CityService {

  async getCities({ page, perPage, id, name }) {
    const offset = (page - 1) * perPage;

    const where = {};
    if (id) where.id = id;
    if (name) where.name = { [Op.like]: `%${name}%` };

    const { rows: cities, count } = await cityRepository.findAndCountAll({
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
  
  async getAllCities() {
    return cityRepository.findAllOrdered();
  }

  async getCityById(id) {
    return cityRepository.findById(id);
  }

  async createCity(data) {
    return cityRepository.createCity(data);
  }

  async updateCity(id, data) {
    return cityRepository.updateCity(id, data);
  }

  async deleteCity(id) {
    return cityRepository.deleteCity(id);
  }

  async activateCity(id) {
    const city = await cityRepository.findById(id);
    if (!city) return null;

    city.active = true;

    return cityRepository.save(city);
  }

  async deactivateCity(id) {
    const city = await cityRepository.findById(id);
    if (!city) return null;

    city.active = false;

    return cityRepository.save(city);
  }
}

module.exports = new CityService();
