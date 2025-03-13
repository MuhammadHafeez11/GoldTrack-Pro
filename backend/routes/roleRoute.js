const express = require('express');
const { createRole, getRoles } = require('../controllers/roleController');
const router = express.Router();

router.post('/role/new', createRole);
router.get('/role/get', getRoles);

module.exports = router;