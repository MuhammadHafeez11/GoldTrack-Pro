const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Role = require('../models/roleModel');
const ErrorHandler = require('../utils/errorHandler');

// Create a new role
exports.createRole = catchAsyncErrors(async (req, res, next) => {
    const { name, description } = req.body;

    if (!name) {
        return next(
          new ErrorHandler("Role name is required")
        );
      }

    const role = await Role.create({ name, description });
    res.status(200).json({
        success: true,
        role,
      });
})

// Fetch all roles
exports.getRoles = catchAsyncErrors(async (req, res, next) => {
    const roles = await Role.find();

    res.status(200).json({ 
        success: true,
        roles 
     });
});