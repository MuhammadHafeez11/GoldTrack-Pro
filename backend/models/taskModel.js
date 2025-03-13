const mongoose = require('mongoose');
const Role = require('./roleModel');
const AssignedTask = require('./assignedTaskModel');

const taskSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String },
});

taskSchema.pre('save', async function(next) {
  try {
    // Get all roles
    const roles = await Role.find();

    // For each role, add the new task to the tasks array
    for (const role of roles) {
      const assignedTask = await AssignedTask.findOne({ roleId: role._id });
      if (assignedTask) {
        assignedTask.tasks.push({ taskId: this._id, status: false });
        await assignedTask.save();
      } else {
        // If no assigned task document exists for the role, create one
        const newAssignedTask = new AssignedTask({
          roleId: role._id,
          tasks: [{ taskId: this._id, status: false }]
        });
        await newAssignedTask.save();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Task', taskSchema);