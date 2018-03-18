const bcrypt = require('bcrypt');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://notandi:@localhost/v3';

async function query(q, values = []) {
  const client = new Client({ connectionString });
  await client.connect();
  let result;

  try {
    result = await client.query(q, values);
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
  return result;
}

async function comparePasswords(hash, password) {
  const result = await bcrypt.compare(hash, password);
  return result;
}

async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';
  const result = await query(q, [username]);
  if (result.rowCount === 1) {
    return result.rows[0];
  }
  return null;
}

async function findUsers() {
  const q = 'SELECT id, username FROM users';
  const result = await query(q);
  if (result.rowCount > 0) {
    return result;
  }
  return null;
}

async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';
  const result = await query(q, [id]);
  if (result.rowCount === 1) {
    return result.rows[0];
  }
  return null;
}

async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 11);
  const q = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
  const result = await query(q, [username, hashedPassword]);
  return result.rows[0];
}

module.exports = {
  comparePasswords,
  findByUsername,
  findById,
  createUser,
  findUsers,
  query,
};
