'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js')

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization;
  // console.log(basic);
  let splitHeader = basic.split(' ')
  let [username, pass] = base64.decode(splitHeader[1]).split(':');
  // console.log('POST SPLIT HEADER', username, pass);

  try {
    req.user = await users.authenticateBasic(username, pass)
    next();
  } catch (e) {
    res.status(403).send('Invalid Login');
  }

}
