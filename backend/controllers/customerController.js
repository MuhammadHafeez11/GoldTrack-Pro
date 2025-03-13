const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const multer = require("../middleware/multer");
const Customer = require("../models/customerModel");

const convertToMilligrams = (grams) => Math.round(grams * 1000);

exports.createCustomer = [
  multer.uploadCNICImage,
  catchAsyncErrors(async (req, res, next) => {
    const { name, phoneNumber, cellNumber, address, gender, dateOfBirth, CNIC } = req.body;

    // console.log( req.files);

    // Convert the address to a JavaScript object if passed as JSON
    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

    // Ensure both CNICFront and CNICBack files exist
    if (!req.files || !req.files.CNICFront || !req.files.CNICBack) {
      return res.status(400).json({ success: false, message: "CNIC images are required" });
    }

    // Get file paths for CNIC images
    const CNICFrontPath = req.files.CNICFront ? req.files.CNICFront[0].path.replace(/^.*[\\/](Uploads[\\/])?/, '') : null;;
    const CNICBackPath = req.files.CNICBack ? req.files.CNICBack[0].path.replace(/^.*[\\/](Uploads[\\/])?/, '') : null;;


    // Create the customer
    const customer = await Customer.create({
      customerName: name,
      phoneNumber,
      cellNumber,
      address: parsedAddress,
      gender,
      dateOfBirth,
      CNIC,
      CNIC_image: {
        front: CNICFrontPath,
        back: CNICBackPath,
      },
    });

    res.status(201).json({
      success: true,
      customer,
    });
  }),
];

// Get all Customers
exports.getAllCustomer = catchAsyncErrors(async (req, res, next) => {
  const customers = await Customer.find();

  // Convert gold back to grams for display
  const customersWithGoldInGrams = customers.map((customer) => ({
    ...customer._doc,
    gold: customer.gold / 1000,
  }));

  res.status(200).json({
    success: true,
    customers: customersWithGoldInGrams,
  });
});

// Get single customer
exports.getSingleCustomer = catchAsyncErrors(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(new ErrorHandler(`Customer does not exist with Id: ${req.params.id}`));
  }

  // Convert gold back to grams for display
  customer.gold = customer.gold / 1000;

  res.status(200).json({
    success: true,
    customer,
  });
});

// Delete customer --Admin
exports.deleteCustomer = catchAsyncErrors(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(new ErrorHandler(`Customer does not exist with Id: ${req.params.id}`, 400));
  }

  await customer.remove();

  res.status(200).json({
    success: true,
    message: "Customer Deleted Successfully",
  });
});
