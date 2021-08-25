'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // Add seed commands here.
    
    // Example:
    await queryInterface.bulkInsert('Users', [{
      username: 'John Doe',
      email: "john@gmail.com",
      password: "john",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */ 
    await queryInterface.bulkDelete('Users', null, {});
     
  }
};
