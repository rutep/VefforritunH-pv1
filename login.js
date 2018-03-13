/**
 * 
 * `/register`
   - `POST` býr til notanda og skilar án lykilorðs hash
 * `/login`
   - `POST` með notendanafni og lykilorði skilar token
 */

require('dotenv').config();
const express = require('express');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const users = require('./usersDb');

const router = express.Router();


router.use(passport.initialize());

const {
    JWT_SECRET: jwtSecret,
    TOKEN_LIFETIME: tokenLifetime = 20,
} = process.env;

if (!jwtSecret) {
console.error('JWT_SECRET not registered in .env');
process.exit(1);
}

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
}


async function strat(data, next) {
    const user = await users.findById(data.id);
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
}

passport.use(new Strategy(jwtOptions, strat));

async function login(req,res){
    const { username, password } = req.body;

    const user = await users.findByUsername(username);
  
    if (!user) {
      return res.status(401).json({ error: 'No such user' });
    }
    const passwordIsCorrect = await users.comparePasswords(password, user.password);
  
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
        }
    )(req, res, next);
}



module.exports = {
    login,
    requireAuthentication,
};