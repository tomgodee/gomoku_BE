import { DataTypes, where } from 'sequelize';
import sequelize from '../services/DatabaseService';

export const User = sequelize.define('user', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user"
  },
  hashed_password: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
  tableName: 'users'
});

const createOne = async (name, hashed_password) => {
  return await User.create({
    name,
    hashed_password,
    role: 'user',
  });
};

const getAll = async () => {
  return await User.findAll({
    attributes: [ 'id', 'name', 'role']
  });
};

const getOne = async (username) => {
  return await User.findOne({
    attributes: [ 'id', 'name', 'role', 'hashed_password'],
    where: {
      name: username
    }
  });
};

const getOneByPK = async (id) => {
  return await User.findByPk(id, {
    attributes: [ 'id', 'name', 'role'],
  });
};

const updateOne = async () => {
  return await User.update({
      name: "Jane 1",
      role: 'user',
      hashed_password: 'secret',
    },
    { 
      where: {
        id: 1,
      }
  });
};

const deleteOne = async () => {
  return await User.destroy({
    where: {
      id: 1
    }
  });
};

export default {
  createOne,
  getAll,
  getOne,
  getOneByPK,
  updateOne,
  deleteOne,
};
