'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const SECRET = process.env.SECRET || 'secretstuff';


const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET);
      }
    }
  });

  model.beforeCreate(async (user, options) => {
    console.log(options);
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  model.authenticateBasic = async function (username, password) {
    console.log(username, password);
    const user = await this.findOne({ where: { username } })
    console.log(user);
    const valid = await bcrypt.compare(password, user.password)
    if (valid) { return user; }
    throw new Error('Invalid User');
  }

  model.authenticateToken = async function (token) {

    const parsedToken = jwt.verify(token, SECRET);
    const user = await this.findOne({ where: { username: parsedToken.username } });
    if (user) {
      return user;
    } else {
      return new Error("User Not Found");
    }
  }

  return model;
};

module.exports = userSchema;