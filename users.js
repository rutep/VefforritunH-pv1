/**
 * `/users`
   - `GET` skilar _síðu_ (sjá að neðan) af notendum
   - Lykilorðs hash skal ekki vera sýnilegt
 * `/users/:id`
   - `GET` skilar stökum notanda ef til
   - Lykilorðs hash skal ekki vera sýnilegt
 * `/users/me`
   - `GET` skilar innskráðum notanda (þ.e.a.s. _þér_)
   - `PATCH` uppfærir sendar upplýsingar um notanda fyrir utan notendanafn, þ.e.a.s. nafn eða lykilorð, ef þau eru gild
 * `/users/me/profile`
   - `POST` setur eða uppfærir mynd fyrir notanda í gegnum Cloudinary og skilar slóð
 */
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const xss = require('xss');

const formValidation = [
  check('username')
    .isLength({ min: 1 })
    .withMessage('Titill má ekki vera tómt'),
  check('password')
    .isLength({ min: 1 })
    .withMessage('Texti má ekki vera tómt'),
  sanitize('username').trim(),
  sanitize('password').trim(),
];

const {
    comparePasswords,
    findByUsername,
    findById, 
    createUser,
    findUsers,
  } = require('./usersDb');

 async function getUsers(req,res) {
    const result = await findUsers();
    return res.send(JSON.stringify(result.rows, null, "    "));
 }

 async function getUserId(req,res){
    const { id } = req.params;
    const result = await findById(id);
    return res.send(result);
 }

 async function getMe(req,res){
    const id = req.user.id;
    console.log(id);
    const result = await findById(id);
    return res.send(result);
 }

 async function registerUser(req, res) {
    const validation = validationResult(req);
		const {username, password} = req.body;
		if (username < 1) {
			res.status(400).json({
				field: 'Notendarnafn',
				error: 'Má ekki vera tómt',
				});
		}
		if (password < 1) {
			res.status(400).json({
				field: 'Lykilorð',
				error: 'Má ekki vera tómt',
				});
		}
		await createUser(username,password);
		return res.send('this');
}

 module.exports = {
    getUsers,
    getUserId,
    getMe,
    registerUser,
}
  