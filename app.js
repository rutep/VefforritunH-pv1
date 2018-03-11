require('dotenv').config();
const express = require('express');
const path = require('path');
const api = require('./api');

const app = express();

const port = 4000;

app.use(express.json());
app.use('/', api);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


function notFoundHandler(req, res, next) { // eslint-disable-line
    res.status(404).render('error', { title: '404' });
  }
  
  function errorHandler(err, req, res, next) { // eslint-disable-line
    console.error(err);
    res.status(500).render('error', { err });
  }


app.listen(port, () => {
    console.info(`Server running at http://localhost:${port}/`);
  });