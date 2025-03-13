const mongoose = require('mongoose');
const AssignedTask = require('./assignedTaskModel');
const Task = require('./taskModel');

const roleSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String },
});

module.exports = mongoose.model('Role', roleSchema);