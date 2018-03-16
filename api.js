const express = require('express');

const router = express.Router();

const {
  index,
} = require('./index');

const {
  login,
  requireAuthentication,
} = require('./login');

const {
  getUsers,
  getUserId,
  getMe,
  registerUser,
} = require('./users');

const {
  getCategory,
  putCategory,
  // getBooks,
  putBook,
  searchBooks,
  getBookById,
  updateBook,
  userReadBook,
  getUserReadBooks,
} = require('./library');


router.get('/', index);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/users:id', getUserId);
router.get('/users/me', requireAuthentication, getMe);
router.post('/register', registerUser);
router.get('/category', getCategory);
router.post('/category', putCategory);
router.get('/books', searchBooks);
router.post('/books', putBook);
router.get('/books/:id', getBookById);
router.patch('/books/:id', updateBook);
router.post('/users/me/read', userReadBook);
router.get('/users/:id/read', getUserReadBooks);

module.exports = router;
