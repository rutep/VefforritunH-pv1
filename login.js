require('dotenv').config();
const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const xss = require('xss');
const express = require('express');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const users = require('./usersDb');


const UserValidation = [
  check('username')
    .isLength({ min: 3 })
    .withMessage('Nafnverður að ver að ver minstakost þrír stafir'),
  check('password')
    .isLength({ min: 6 })
    .custom(value => !/\s/.test(value))
    .withMessage('Lykilorð má ekki innihalda línubil og veður að vera minstakosti 6 stafir'),
  sanitize('username').trim(),
  sanitize('password').trim(),
];

const BookValidation = [
  check('title')
    .isLength({ min: 1 })
    .withMessage('Titill veðrur að vera minstakosti ein stafur'),
  check('isbn13')
    .matches(/[0-9]{13}$/)
    .withMessage('isbn13 Verður að vera akkurat 13 tölustafir'),
];

const ratingValidation = [
  check('rating')
    .matches(/[1-5]{1}$/)
    .withMessage('Einkunn á að vera frá einum og uppí fimm'),
];


const router = express.Router();


router.use(passport.initialize());

const {
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 200000,
} = process.env;

if (!jwtSecret) {
  console.error('JWT_SECRET not registered in .env');
  process.exit(1);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  const user = await users.findById(data.id);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));

async function login(req, res) {
  const { username, password } = req.body;
  const user = await users.findByUsername(xss(username));
  if (!user) {
    return res.status(401).json({ error: 'No such user' });
  }
  const passwordIsCorrect = await users.comparePasswords(xss(password), user.password);

  if (passwordIsCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: tokenLifetime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid password' });
}

function requireAuthentication(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const error = info.name === 'TokenExpiredError' ? 'expired token' : 'invalid token';
        return res.status(401).json({ error });
      }

      req.user = user;
      next();
    },
  )(req, res, next);
}

module.exports = {
  login,
  requireAuthentication,
  UserValidation,
  BookValidation,
  ratingValidation,
};
