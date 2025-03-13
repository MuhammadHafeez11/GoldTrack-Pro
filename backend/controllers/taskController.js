const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Task = require('../models/taskModel');
const ErrorHandler = require('../utils/errorHandler');

// Create a new task
exports.createTask = catchAsyncErrors(async (req, res, next) => {
    const { name, description } = req.body;

    if (!name) {
        return next(
          new ErrorHandler("Task name is required")
        );
      }

    const task = await Task.create({ name, description });
    res.status(200).json({
        success: true,
        task,
      });
})

// Fetch all tasks
exports.getTasks = catchAsyncErrors(async (req, res, next) => {
    const tasks = await Task.find();

    res.status(200).json({ 
        success: true,
        tasks
     });
});