const express = require('express');
const { addGoldOrAmount, subtractGoldOrAmount, getGoldAndAmount } = require('../controllers/shopController');
const { isAuthenticatedUser } = require('../middleware/auth');
const router = express.Router();

router.post('/shop/add',isAuthenticatedUser, addGoldOrAmount);
router.post('/shop/subtract', isAuthenticatedUser,  subtractGoldOrAmount);
router.get('/shop/get', isAuthenticatedUser, getGoldAndAmount);

module.exports = router;