import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL);
// const sequelize = new Sequelize('postgres://postgres:zxc321@db:5432/gomoku');

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

(async () => {
  await sequelize.sync();
  // Code here
})();

export default sequelize;
