const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://notandi:@localhost/v3';
const {
  query,
} = require('./usersDb');

async function getCat() {
  const q = 'SELECT * FROM Category';
  const result = await query(q);
  if (result.rowCount > 0) {
    return result.rows;
  }
  return null;
}

async function libraryBooks() {
  const q = 'SELECT * FROM books';
  const result = await query(q);
  if (result.rowCount > 0) {
    return result.rows;
  }
  return null;
}

async function createCat(category) {
  const q = 'INSERT INTO Category (category) VALUES ($1) RETURNING *';
  const result = await query(q, [category]);
  return result.rows[0];
}

async function checkExCat(category) {
  const q = 'SELECT * FROM Category WHERE category = $1';
  const result = await query(q, [category]);
  if (result.rows.length > 0) {
    return true;
  }
  return false;
}

/**
 * id serial primary key,
  ISBN13 character varying(255),
  title character varying(255) ,
  category character varying(255),
  UNIQUE(title),
  UNIQUE(ISBN13) 13 tölur
 */
async function createBook(isbn13, title, category) {
  const q = 'INSERT INTO books (isbn13, title, category) VALUES ($1, $2, $3) RETURNING *';
  const result = await query(q, [isbn13, title, category]);
  return result.rows[0];
}

async function checkExBook(isbn13, book) {
  const q = 'SELECT * FROM books WHERE title = $1 OR isbn13 = $2';
  const result = await query(q, [book, isbn13]);
  if (result.rows.length > 0) {
    return true;
  }
  return false;
}

async function select(search = '') {
  const client = new Client({
    connectionString,
  });
  await client.connect();
  try {
    const q = `
      SELECT * FROM books
      WHERE
        to_tsvector('english', title) @@ to_tsquery('english', $1)
        OR
        to_tsvector('english', category) @@ to_tsquery('english', $1)
    `;
    const res = await client.query(q, [search]);
    return res.rows;
  } catch (e) {
    console.error('Error selecting', e);
  }
  await client.end();
  return null;
}

async function findBookById(id) {
  const q = 'SELECT * FROM books WHERE id = $1';
  const result = await query(q, [id]);
  if (result.rowCount === 1) {
    return result.rows[0];
  }
  return null;
}

async function updateDbBook(id, title, category, isbn13) {
  const q = 'UPDATE books SET title = $1, category = $2, isbn13 = $3, id = $4 WHERE id = $4';
  const result = await query(q, [title, category, isbn13, id]);
  return result;
}

async function readBooks(id, bookId, rating) {
  const q = 'INSERT INTO readBooks (userId, bookId, rating) VALUES ($1, $2, $3) RETURNING *';
  const result = await query(q, [id, bookId, rating]);
  return result.rows[0];
}

async function findReadBooksById(id) {
  const q = 'SELECT * FROM readBooks WHERE userid = $1';
  const result = await query(q, [id]);
  return result.rows;
}

module.exports = {
  getCat,
  createCat,
  checkExCat,
  libraryBooks,
  createBook,
  checkExBook,
  select,
  findBookById,
  updateDbBook,
  readBooks,
  findReadBooksById,
};
