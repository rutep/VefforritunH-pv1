const express = require('express');
const passport = require('passport');

const router = express.Router();

const {
    index,
} = require('./index');

const { 
    login,
    requireAuthentication,
} = require('./login');

const{
    getUsers,
    getUserId,
    getMe,
    registerUser,
} = require('./users');


router.get('/',index);
router.post('/login',login);
router.get('/users',getUsers);
router.get('/users:id',getUserId);
router.get('/users/me',requireAuthentication,getMe);
router.post('/register',registerUser);

module.exports = router;
