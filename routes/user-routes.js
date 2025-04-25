const express = require('express');
const router = express.Router();

console.log('in user routes');
const userController = require('../controllers/user-controller');

router.get('/login', userController.getLogin);
router.get('/signup', userController.getSignup);
router.get('/logout', userController.getLogout);

router.post('/login', userController.postLogin);
router.post('/signup', userController.postSignup);

module.exports = router;