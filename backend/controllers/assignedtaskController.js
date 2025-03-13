const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const AssignedTasks = require('../models/assignedTaskModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

// Assign tasks to a role
exports.assignTasksToRole = catchAsyncErrors(async (req, res, next) => {
 
    const { roleId, tasks } = req.body;

    if (!roleId || !tasks || !Array.isArray(tasks)) {
        return next(
            new ErrorHandler("Role id and tasks are required")
          );
    }

    // Ensure tasks are in the correct format
    const formattedTasks = tasks.map(({ taskId, status = false }) => ({
      taskId,
      status,
    }));

    const assignedTasks = await AssignedTasks.findOneAndUpdate(
      { roleId },
      { $set: { tasks: formattedTasks } }, 
      { new: true, upsert: true },
    );

    res.status(200).json({
      success: true,
      data: assignedTasks,
    });
  });

// Get assigned tasks for a role
exports.getAssignedTasksByRole = catchAsyncErrors(async (req, res, next) => {

    const { roleId } = req.params;

    const assignedTasks = await AssignedTasks.findOne({ roleId })
      .populate('tasks.taskId', 'name description')
      .populate('roleId', 'name description');

    if (!assignedTasks) {
        return next(
            new ErrorHandler("No Assigned tasks to this role")
          );
    }

    res.status(200).json({
      success: true,
      data: assignedTasks,
    });
  });

// Get tasks for a user
exports.getAssignedTasksForUser = catchAsyncErrors(async (req, res, next) => {

    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId).populate('role');
    if (!user) {
        return next(
            new ErrorHandler("No user found")
          );
    }

    // Fetch the assigned tasks based on the user's role
    const assignedTasks = await AssignedTasks.findOne({ roleId: user.role._id })
      .populate('tasks.taskId', 'name description'); // Populate task details

    if (!assignedTasks) {
        return next(
            new ErrorHandler("No Assigned tasks to this user")
          );
    }

    return res.status(200).json({
      user,
      tasks: assignedTasks.tasks.map((task) => ({
        taskId: task.taskId._id,
        name: task.taskId.name,
        description: task.taskId.description,
        status: task.status,
      })),
    });
  });

//   update task status
exports.updateTaskStatus  = catchAsyncErrors(async (req, res, next) => {
    const { roleId, taskId } = req.body;
    const { status } = req.body; 
    
    const assignedTasks = await AssignedTasks.findOne({ roleId });
    if (!assignedTasks) {
        return next(
            new ErrorHandler("Role Not Found")
          );
    }

    const taskIndex = assignedTasks.tasks.findIndex(task => task.taskId.toString() === taskId);
    if (taskIndex === -1) { 
        return next(
        new ErrorHandler("No task assigned")
      );
    }

    assignedTasks.tasks[taskIndex].status = status; // Update the status
    await assignedTasks.save();

    res.status(200).json({ message: 'Task status updated successfully', assignedTasks });
  });

//get assigned tasks
exports.getAssignedTasks  = catchAsyncErrors(async (req, res, next) => {

    const assignedTasks = await AssignedTasks.find({})
      .populate('roleId', 'name') 
      .populate('tasks.taskId', 'name description');

    if (!assignedTasks) {
        return next(
            new ErrorHandler("No task assigned")
          );
    }

    res.status(200).json({ assignedTasks });
  });