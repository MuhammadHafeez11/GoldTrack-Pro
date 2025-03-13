const express = require('express');
const router = express.Router();
const {
  assignTasksToRole,
  getAssignedTasksByRole,
  getAssignedTasksForUser,
  updateTaskStatus,
  getAssignedTasks,
} = require('../controllers/assignedtaskController');

// Route to assign tasks to a roles
router.post('/assignedtask/new', assignTasksToRole);

// Route to fetch tasks assigned to a specific role
router.get('/assignedtask/:roleId', getAssignedTasksByRole);

router.get('/assignedtask/get', getAssignedTasks);

router.get('/assignedtask/:userId', getAssignedTasksForUser);

router.patch('/assignedtask/update-task-status', updateTaskStatus);

module.exports = router;