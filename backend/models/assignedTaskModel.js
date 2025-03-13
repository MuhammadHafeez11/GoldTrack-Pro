const mongoose = require('mongoose');

const assignedTasksSchema = new mongoose.Schema({
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  tasks: [
    { 
      taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
      status: {type: Boolean, default: false}
    }
  ],
});

module.exports = mongoose.model('AssignedTasks', assignedTasksSchema);