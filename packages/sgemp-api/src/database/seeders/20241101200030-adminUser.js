'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: '$2a$12$wUkVZN/DtvAle3OzidAMV.SG3fOl3zn2POB8QMP5j3khKOGGq8ETi',
        profile: 'admin',
        active: true,
        created_at: new Date(), 
        updated_at: new Date()  
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { email: 'admin@gmail.com' });
  }
};
