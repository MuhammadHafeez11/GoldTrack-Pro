const express = require('express');
const { isAuthenticatedUser } = require('../middleware/auth');
const { createCustomer, getAllCustomer, getSingleCustomer, deleteCustomer } = require('../controllers/customerController');

const router = express.Router();

router.post('/customer/new', isAuthenticatedUser, createCustomer);
router.get('/customer/get', isAuthenticatedUser,getAllCustomer);
router.get('/customer/get/:id', isAuthenticatedUser,getSingleCustomer);
router.delete('/customer/delete', isAuthenticatedUser, deleteCustomer);

module.exports = router;