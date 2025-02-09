const cityService = require('../services/cityService');

class CityController {
  
  async getCities(req, res, next) {
    try {
      const { page = 1, perPage = 10, id, name } = req.query;

      const response = await cityService.getCities({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        id,
        name,
      });

      if (!response || response.data.length === 0) {
        return res.status(404).send({ message: 'Nenhuma cidade foi encontrada.' });
      }

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
    }
  
    async getAllCities(req, res, next) {
      try {
        const cities = await cityService.getAllCities();
  
        if (!cities || cities.length === 0) {
          return res.status(404).send({ message: 'Nenhuma cidade foi encontrada.' });
        }
  
        res.status(200).send(cities);
      } catch (error) {
        next(error);
      }
    }
  
    async getCityById(req, res, next) {
      try {
        const { id } = req.params;
        const city = await cityService.getCityById(id);
  
        if (!city) {
          return res.status(404).send({ message: `Cidade com ID ${id} não encontrada.` });
        }
  
        res.status(200).send(city);
      } catch (error) {
        next(error);
      }
    }
  
    async createCity(req, res, next) {
      try {
        const city = await cityService.createCity(req.body);
        res.status(201).send(city);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).send({
            message: 'Cidade já existe.',
            errors: error.errors.map((err) => err.message),
          });
        }
        next(error);
      }
    }
  
    async updateCity(req, res, next) {
      try {
        const { id } = req.params;
        const updatedCity = await cityService.updateCity(id, req.body);
  
        if (!updatedCity) {
          return res.status(404).send({ message: 'Cidade não encontrada.' });
        }
  
        res.status(200).send(updatedCity);
      } catch (error) {
        next(error);
      }
    }
  
    async deleteCity(req, res, next) {
      try {
        const { id } = req.params;
        const deletedCity = await cityService.deleteCity(id);
  
        if (!deletedCity) {
          return res.status(404).send({ message: `Cidade com ID ${id} não encontrada.` });
        }
  
        res.status(200).send({ message: `Cidade com ID ${id} excluída com sucesso.` });
      } catch (error) {
        next(error);
      }
    }

    async activateCity(req, res, next) {
      try {
        const { id } = req.params;
        const activateCity = await cityService.activateCity(id, req.body);
  
        if (!activateCity) {
          return res.status(404).send({ message: 'Cidade com ID ${id} não encontrada.' });
        }
  
        res.status(200).send(activateCity);
      } catch (error) {
        next(error);
      }
    }

    async deactivateCity(req, res, next) {
      try {
        const { id } = req.params;
        const deactivateCity = await cityService.deactivateCity(id, req.body);
  
        if (!deactivateCity) {
          return res.status(404).send({ message: 'Cidade não encontrada.' });
        }
  
        res.status(200).send(deactivateCity);
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = new CityController();
  