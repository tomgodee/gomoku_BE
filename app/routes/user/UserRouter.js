import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS, TOKEN_EXPIRATION_TIME } from '../../config/constants';
import UserModel from '../../models/user';
// import { verifyAdminToken, verifyToken } from '../../middlewares/verifyToken';

const userRouter = express.Router();

const generateAccessToken = (userInfo) => {
  return jwt.sign(userInfo, process.env.TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION_TIME });
};

userRouter.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS, async (err, hash) => {
    const user = await UserModel.createOne(req.body.name, hash);
    res.status(200).send({
      id: user.getDataValue('id'),
      name: user.getDataValue('name'),
      role: user.getDataValue('role'),
    });
  });
});

userRouter.post('/login', async (req, res) => {
  const user = await UserModel.getOne(req.body.username);
  bcrypt.compare(req.body.password, user.hashed_password, function(err, result) {
    if (result) {
      const token = generateAccessToken({
        username: req.body.username,
        role: user.role,
      });
      res.setHeader('access_token', token);
      res.status(200).send({
        id: user.id,
        name: user.name,
        role: user.role,
      });
    } else {
      res.status(401).send({
        status: 'error',
        message: 'Can\'t authenticate',
      });
    }
  });
});

userRouter.get('/verify', (req, res) => {
  const accessToken = req.headers.authorization.split('Bearer ')[1];
  jwt.verify(accessToken, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (decoded) {
      const user = await UserModel.getOne(decoded.username);
      res.status(200).send({
        id: user.id,
        name: user.name,
        role: user.role,
      });
    } else if (err) {
      res.status(401).send({
        status: 'error',
        message: 'Token is not verified',
      });
    }
  });
});

userRouter.get('/', async (req, res) => {
  try {
    const users = await UserModel.getAll();
    res.status(200).send(users);
  } catch (err) {
    res.send(err);
  }
});

// userRouter.get('/:id', verifyToken);
// userRouter.get('/:id', async (req, res) => {
//   try {
//     const user = await UserModel.getOneByID(req.params.id);
//     res.json(user);
//   } catch (error) {
//     res.status(400).json({
//       code: error.code,
//       message: error.message
//     });
//   }
// });

// userRouter.put('/', verifyAdminToken);
// userRouter.put('/', async (req, res) => {
//   try {
//     const user = await UserModel.update(req.body.id, req.body.role, req.body.money);
//     res.json(user);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

export default userRouter;
