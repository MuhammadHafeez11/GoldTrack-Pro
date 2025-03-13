const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Shop = require('../models/shopModel');
const ErrorHandler = require('../utils/errorHandler');

// Utility function to convert grams to milligrams
const convertToMilligrams = (grams) => Math.round(grams * 1000);
const convertToGrams = (milligrams) => milligrams / 1000;

// Add gold and/or amount
exports.addGoldOrAmount = catchAsyncErrors(async (req, res, next) => {
    const { amount = 0, gold = 0 } = req.body;

    if (!amount && !gold) {
        return next(new ErrorHandler("At least one of 'amount' or 'gold' is required"));
    }

    // Convert gold to milligrams
    const goldInMilligrams = convertToMilligrams(gold);

    const shop = await Shop.findOne(); // Assuming a single shop record
    if (!shop) {
        return next(new ErrorHandler("Shop data not found", 404));
    }

    // Update values
    shop.amount += amount;
    shop.gold += goldInMilligrams;

    await shop.save();

    res.status(200).json({
        success: true,
        message: "Values added successfully",
        data: {
            amount: shop.amount,
            gold: convertToGrams(shop.gold), // Convert to grams for display
        },
    });
});

// Subtract gold and/or amount
exports.subtractGoldOrAmount = catchAsyncErrors(async (req, res, next) => {
    const { amount = 0, gold = 0 } = req.body;

    if (!amount && !gold) {
        return next(new ErrorHandler("At least one of 'amount' or 'gold' is required"));
    }

    // Convert gold to milligrams
    const goldInMilligrams = convertToMilligrams(gold);

    const shop = await Shop.findOne(); // Assuming a single shop record
    if (!shop) {
        return next(new ErrorHandler("Shop data not found", 404));
    }

    // Ensure values cannot go negative
    if (shop.amount - amount < 0 || shop.gold - goldInMilligrams < 0) {
        return next(new ErrorHandler("Insufficient gold or amount to subtract"));
    }

    // Update values
    shop.amount -= amount;
    shop.gold -= goldInMilligrams;

    await shop.save();

    res.status(200).json({
        success: true,
        message: "Values subtracted successfully",
        data: {
            amount: shop.amount,
            gold: convertToGrams(shop.gold), // Convert to grams for display
        },
    });
});

// Get current gold and amount
exports.getGoldAndAmount = catchAsyncErrors(async (req, res, next) => {
    const shop = await Shop.findOne(); // Assuming a single shop record
    if (!shop) {
        return next(new ErrorHandler("Shop data not found", 404));
    }

    res.status(200).json({
        success: true,
        data: {
            amount: shop.amount,
            gold: convertToGrams(shop.gold), // Convert to grams for display
        },
    });
});
