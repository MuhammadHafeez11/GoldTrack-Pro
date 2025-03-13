const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../controllers/taskController');

// Route to create a task
router.post('/task/new', createTask);

// Route to fetch all tasks
router.get('/task/get', getTasks);

module.exports = router;
