module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      id: 1,
      name: 'Tom',
      role: 'user',
      hashed_password: '$2b$10$nr8wi4Zjl8ABg0hxEi3pT.MVkP0KcKIefsnK51PtD0s3QH2OPIIJS',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Diego',
      role: 'user',
      hashed_password: '$2b$10$nr8wi4Zjl8ABg0hxEi3pT.MVkP0KcKIefsnK51PtD0s3QH2OPIIJS',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
