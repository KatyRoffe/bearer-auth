'use strict';

const express = require('express');
const authRouter = express.Router();
const User = require('./models/users.js')

const { users } = require('./models/index.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')

authRouter.post('/signup', async (req, res, next) => {
  console.log(req.body);
  try {
    let userRecord = await users.create(req.body);

    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (error) {
    console.error(error);
    next(error.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
  next();
});

authRouter.get('/users', bearerAuth, async (req, res, next) => {
  const users = await User.findAll({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Got a secret, can you keep it?')
});


module.exports = authRouter;