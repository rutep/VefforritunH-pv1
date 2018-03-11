const express = require('express');
const passport = require('passport');

const router = express.Router();

const {
    index,
} = require('./index');

const { 
    login,
    admin,
    requireAuthentication,
} = require('./login');

router.get('/',index);
router.post('/login',login);
router.get('/admin',requireAuthentication,admin);

module.exports = router;
