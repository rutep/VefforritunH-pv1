const express = require('express');

const router = express.Router();

const {
  index,
} = require('./index');

const {
  login,
  requireAuthentication,
  UserValidation,
  BookValidation,
  ratingValidation,
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
  putBook,
  searchBooks,
  getBookById,
  updateBook,
  userReadBook,
  getUserReadBooks,
  getLogedUserReadBooks,
  deleteLogedUserBookById,
} = require('./library');


router.get('/', index);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/users/me', requireAuthentication, getMe);
router.post('/register', UserValidation, registerUser);
router.get('/categories', getCategory);
router.post('/categories', putCategory);
router.get('/books', searchBooks);
router.post('/books', BookValidation, putBook);
router.get('/books/:id', getBookById);
router.patch('/books/:id', BookValidation, updateBook);
router.post('/users/me/read', requireAuthentication, ratingValidation, userReadBook);
router.get('/users/me/read', requireAuthentication, getLogedUserReadBooks);
router.get('/users/:id', getUserId);
router.get('/users/:id/read', getUserReadBooks);
router.delete('/users/me/read/:id', requireAuthentication, deleteLogedUserBookById);

module.exports = router;
