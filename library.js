/**
 * `/categories`
   - `GET` skilar _síðu_ af flokkum
   - `POST` býr til nýjan flokk og skilar
 * `/books`
   - `GET` skilar _síðu_ af bókum
   - `POST` býr til nýja bók ef hún er gild og skilar
 * `/books?search=query`
   - `GET` skilar _síðu_ af bókum sem uppfylla leitarskilyrði, sjá að neðan
 * `/books/:id`
   - `GET` skilar stakri bók
   - `PATCH` uppfærir bók
 * `/users/:id/read`
   - `GET` skilar _síðu_ af lesnum bókum notanda
 * `/users/me/read`
   - `GET` skilar _síðu_ af lesnum bókum innskráðs notanda (eftir)
   - `POST` býr til nýjan lestur á bók og skilar
 * `/users/me/read/:id`
   - `DELETE` eyðir lestri bókar fyrir innskráðann notanda (eftir)
 */

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
} = require('./libraryDb.js');

async function getCategory(req, res) {
  const result = await getCat();
  return res.send(result);
}

async function putCategory(req, res) {
  const { category } = req.body;
  const exists = await checkExCat(category);
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
  const result = await createBook(isbn13, title, category);
  return res.send(result);
}

async function searchBooks(req, res) {
  const { search } = req.query;
  if (!search) {
    const result = await libraryBooks();
    return res.send(result);
  }
  const rows = await select(search);
  return res.json(rows);
}

async function getBookById(req, res) {
  const { id } = req.params;
  const result = await findBookById(id);
  return res.send(result);
}

async function updateBook(req, res) {
  const { id } = req.params;
  const { title, category, isbn13 } = req.body;

  await updateDbBook(id, title, category, isbn13);
  return res.json({
    Update: id,
  });
}

async function userReadBook(req, res) {
  // const { id } = req.user.id;
  const { userId, bookId, rating } = req.body;
  const result = await readBooks(userId, bookId, rating);
  return res.send(result);
}

async function getUserReadBooks(req, res) {
  const { id } = req.params;
  const result = await findReadBooksById(id);
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
};
