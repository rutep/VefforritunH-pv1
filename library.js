const { validationResult } = require('express-validator/check');
const xss = require('xss');

const {
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
  deleteBookById,
} = require('./libraryDb.js');

async function getCategory(req, res) {
  const result = await getCat();
  return res.send(result);
}

async function putCategory(req, res) {
  const { category } = req.body;
  const exists = await checkExCat(xss(category));
  if (exists) {
    return res.json({
      field: 'Category',
      error: 'Þegar til',
    });
  }
  const result = await createCat(category);
  return res.send(result);
}

async function putBook(req, res) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json(validation.array());
  }
  const { isbn13, title, category } = req.body;
  const exists = await checkExBook(isbn13, title);
  if (exists) {
    return res.json({
      field: 'Bók',
      error: 'Þegar til',
    });
  }
  const catExists = await checkExCat(category);
  if (!catExists) {
    await createCat(category);
  }
  const result = await createBook(xss(isbn13), xss(title), xss(category));
  return res.send(result);
}

async function searchBooks(req, res) {
  const { search } = req.query;
  if (!search) {
    const result = await libraryBooks();
    return res.send(result);
  }
  const rows = await select(xss(search));
  return res.json(rows);
}

async function getBookById(req, res) {
  const { id } = req.params;
  const result = await findBookById(xss(id));
  return res.send(result);
}

async function updateBook(req, res) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json(validation.array());
  }
  const { id } = req.params;
  const { title, category, isbn13 } = req.body;
  await updateDbBook(xss(id), xss(title), xss(category), xss(isbn13));
  return res.json({
    Update: id,
  });
}

async function userReadBook(req, res) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json(validation.array());
  }
  const id = req.user.id;
  const { bookId, rating } = req.body;
  const result = await readBooks(xss(id), xss(bookId), xss(rating));
  return res.send(result);
}

async function getUserReadBooks(req, res) {
  const { id } = req.params;
  const result = await findReadBooksById(id);
  return res.send(result);
}

async function getLogedUserReadBooks(req, res) {
  const { id } = req.user;
  const result = await findReadBooksById(id);
  return res.send(result);
}

async function deleteLogedUserBookById(req, res) {
  const { id } = req.user;
  const bookId = req.params.id;
  const result = await deleteBookById(id, bookId);
  return res.send(result);
}

module.exports = {
  getCategory,
  putCategory,
  putBook,
  searchBooks,
  getBookById,
  updateBook,
  userReadBook,
  getUserReadBooks,
  getLogedUserReadBooks,
  deleteLogedUserBookById,
};
