
const { validationResult } = require('express-validator/check');
const xss = require('xss');

const {
  findById,
  createUser,
  findUsers,
  findByUsername,
} = require('./usersDb');

async function getUsers(req, res) {
  const result = await findUsers();
  return res.send(JSON.stringify(result.rows, null, '    '));
}

async function getUserId(req, res) {
  const { id } = req.params;
  const result = await findById(id);
  const { username } = result;
  return res.send(JSON.stringify({
    id: id,
    username: username,
  }));
}

async function getMe(req, res) {
  const id = req.user.id;
  const result = await findById(id);
  const { username } = result;
  return res.send(JSON.stringify({
    id: id,
    username: username,
  }));
}

async function registerUser(req, res) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json(validation.array());
  }
  const { username, password } = req.body;
  const check = await findByUsername(username);
  if (check !== null) {
    return res.send(JSON.stringify({
      username: 'Þegar til',
    }));
  }
  const result = await createUser(xss(username), xss(password));
  return res.send(JSON.stringify({
    username: username,
  }));
}


module.exports = {
  getUsers,
  getUserId,
  getMe,
  registerUser,
};
