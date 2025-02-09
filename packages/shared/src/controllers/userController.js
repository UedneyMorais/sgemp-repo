const userService = require('../services/userService');

class UserController {
  
  async getUsers(req, res, next) {
    try {
      const { page = 1, perPage = 10, id, name, email, profile, active } = req.query;

      const response = await userService.getUsers({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        id,
        name,
        email,
        profile,
        active
      });

      if (!response || response.data.length === 0) {
        return res.status(404).send({ message: 'Nenhuma usuário foi encontrada.' });
      }

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
    }
  
    async getAllUsers(req, res, next) {
      try {
        const users = await userService.getAllUsers();
  
        if (!users || users.length === 0) {
          return res.status(404).send({ message: 'Nenhuma usuário foi encontrada.' });
        }
  
        res.status(200).send(users);
      } catch (error) {
        next(error);
      }
    }
  
    async getUserById(req, res, next) {
      try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
  
        if (!user) {
          return res.status(404).send({ message: `Usuário com ID ${id} não encontrada.` });
        }
  
        res.status(200).send(user);
      } catch (error) {
        next(error);
      }
    }
  
    async createUser(req, res, next) {
      try {
        const user = await userService.createUser(req.body);
        res.status(201).send(user);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).send({
            message: 'Usuário já existe.',
            errors: error.errors.map((err) => err.message),
          });
        }
        next(error);
      }
    }
  
    async updateUser(req, res, next) {
      try {
        const { id } = req.params;
        const updatedUser = await userService.updateUser(id, req.body);
  
        if (!updatedUser) {
          return res.status(404).send({ message: 'Usuário não encontrada.' });
        }
  
        res.status(200).send(updatedUser);
      } catch (error) {
        next(error);
      }
    }
  
    async deleteUser(req, res, next) {
      try {
        const { id } = req.params;
        const deletedUser = await userService.deleteUser(id);
  
        if (!deletedUser) {
          return res.status(404).send({ message: `Usuário com ID ${id} não encontrada.` });
        }
  
        res.status(200).send({ message: `Usuário com ID ${id} excluída com sucesso.` });
      } catch (error) {
        next(error);
      }
    }

    async activateUser(req, res, next) {
      try {
        const { id } = req.params;
        const activateUser = await userService.activateUser(id, req.body);
  
        if (!activateUser) {
          return res.status(404).send({ message: 'Usuário com ID ${id} não encontrada.' });
        }
  
        res.status(200).send(activateUser);
      } catch (error) {
        next(error);
      }
    }

    async deactivateUser(req, res, next) {
      try {
        const { id } = req.params;
        const deactivateUser = await userService.deactivateUser(id, req.body);
  
        if (!deactivateUser) {
          return res.status(404).send({ message: 'Usuário não encontrada.' });
        }
  
        res.status(200).send(deactivateUser);
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = new UserController();
  