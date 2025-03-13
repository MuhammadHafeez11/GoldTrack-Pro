const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const History = require("../models/historyModel");
const Customer = require("../models/customerModel");
const Shop = require('../models/shopModel');

const convertToMilligrams = (grams) => Math.round(grams * 1000);

exports.createOrUpdateHistory = catchAsyncErrors(async (req, res, next) => {
  const { customerId, type, amount, gold, goldRate, date, time } = req.body;

  // Validate customer existence
  const customer = await Customer.findById(customerId);
  if (!customer) {
    return next(new ErrorHandler(`Customer does not exist with ID: ${customerId}`, 404));
  }

  const shop = await Shop.findOne();
  if (!shop) {
    return next(new ErrorHandler("Shop record not found", 404));
  }

  const goldInMilligrams = convertToMilligrams(gold);

  if (type === "GoldWithdraw" && gold > customer.gold) {
    return next(new ErrorHandler("Insufficient gold for withdrawal", 400));
  }

  if (type === "CashWithdraw" && amount > customer.amount) {
    return next(new ErrorHandler("Insufficient cash for withdrawal", 400));
  }

  if (type === "GoldPurchase" && amount > customer.amount) {
    return next(new ErrorHandler("Insufficient funds for purchase", 400));
  }

  // Update based on type
  switch (type) {
    case "CashDeposit":
      customer.amount += amount;
      shop.amount += amount;
      break;
    case "GoldDeposit":
      customer.gold += goldInMilligrams;
      shop.gold += goldInMilligrams;
      break;
    case "CashWithdraw":
      customer.amount -= amount;
      shop.amount -= amount;
      break;
    case "GoldWithdraw":
      customer.gold -= goldInMilligrams;
      shop.gold -= goldInMilligrams;
      break;
    case "GoldPurchase":
      customer.amount -= amount;
      customer.gold += goldInMilligrams;
      shop.amount -= amount;
      shop.gold += goldInMilligrams;
      break;
    case "GoldSale":
      customer.amount += amount;
      customer.gold -= goldInMilligrams;
      shop.amount += amount;
      shop.gold -= goldInMilligrams;
      break;
    default:
      return next(new ErrorHandler("Invalid transaction type", 400));
  }

  await customer.save({ validateModifiedOnly: true });
  await shop.save();
  
  let history = await History.findOne({ customerId });

  const newRecord = {
    type,
    amount,
    gold: goldInMilligrams,
    goldRate,
    date: date || new Date(),
    time
  };

  if (history) {
    // Update existing history by adding a new record
    history.records.push(newRecord);
    await history.save();
  } else {
    // Create a new history document
    history = await History.create({
      customerId,
      records: [newRecord],
    });
  }

  res.status(200).json({
    success: true,
    history,
  });
});

// Get All History with Populated Customer Details
exports.getAllHistory = catchAsyncErrors(async (req, res, next) => {
  const histories = await History.find().populate("customerId");

//  console.log(histories)

  // Convert gold back to grams for display
  const historiesWithGoldInGrams = histories.map((history) => ({
    ...history._doc,
    records: history.records.map((record) => ({
      gold: record.gold / 1000,
      type: record.type,
      amount: record.amount,
      date: record.date,
      goldRate : record.goldRate,
      returnCash : record.returnCash,
      shopAmountAfterTransaction: record.shopAmountAfterTransaction/1000,
      shopGoldAfterTransaction: record.shopGoldAfterTransaction/1000
    })),
  }));

  // console.log(historiesWithGoldInGrams)

  res.status(200).json({
    success: true,
    histories: historiesWithGoldInGrams,
  });
});

// Get History for a Specific Customer by ID
exports.getHistoryByCustomerId = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const history = await History.findOne({ customerId: id }).populate(
    "customerId",
    "customerName phoneNumber address"
  );

  if (!history) {
    return next(new ErrorHandler(`History does not exist for Customer with Id: ${id}`, 404));
  }

  // Convert gold back to grams for display
  history.records = history.records.map((record) => ({
    ...record,
    gold: record.gold / 1000,
  }));

  res.status(200).json({
    success: true,
    history,
  });
});


// -------------------------------------------- //
// --------------Get Notifications----------- //
// -------------------------------------------- // 

// controllers/history.js (or similar)
exports.getNotifications = catchAsyncErrors(async (req, res, next) => {
  // Get all histories and populate customer details
  const allHistories = await History.find().populate('customerId', 'customerName');

  // Flatten all records into a single array with a timestamp for sorting
  const notifications = allHistories.flatMap((history) =>
    history.records.map((record) => {
      const dateObj = new Date(record.date); 
      // Format date as needed (for message display)
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const formattedTime = record.time; // assuming time is already a string
      
      // Build the notification message based on type:
      const message =
        record.type === 'CashDeposit'
          ? `${history.customerId.customerName} has deposited ${record.amount} cash`
          : record.type === 'GoldDeposit'
          ? `${history.customerId.customerName} has deposited ${record.gold / 1000} grams gold`
          : record.type === 'CashWithdraw'
          ? `${history.customerId.customerName} has withdrawn ${record.amount} cash`
          : record.type === 'GoldWithdraw'
          ? `${history.customerId.customerName} has withdrawn ${record.gold / 1000} grams gold`
          : record.type === 'GoldSale'
          ? `${history.customerId.customerName} has sold ${record.gold / 1000} grams gold`
          : `${history.customerId.customerName} has purchased ${record.gold / 1000} grams gold`;

      return {
        message: `${message} on ${formattedDate} at ${formattedTime}`,
        date: dateObj.toISOString().split('T')[0],
        type: record.type,
        timestamp: dateObj.getTime(), // used for sorting
      };
    })
  );

  // Sort notifications so that most recent comes first
  notifications.sort((a, b) => b.timestamp - a.timestamp);

  res.status(200).json({
    success: true,
    notifications,
  });
});

// exports.getNotifications = catchAsyncErrors(async (req, res, next) => {
//   const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

//   const allHistories = await History.find().populate('customerId', 'customerName');

//   const notifications = allHistories.flatMap((history) =>
//     history.records.map((record) => {
//       const date = new Date(record.date);
//       const formattedDate = date.toLocaleDateString('en-US', {
//         weekday: 'short',
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       });
//       const formattedTime = record.time;

//       return {
//         message: `${history.customerId.customerName} has ${
//           record.type === 'CashDeposit' ? `deposited ${record.amount} cash` :
//           record.type === 'GoldDeposit' ? `deposited ${record.gold /1000} grams gold` :
//           record.type === 'CashWithdraw' ? `withdrawn ${record.amount} cash` :
//           record.type === 'GoldWithdraw' ? `withdrawn ${record.gold /1000} grams gold` :
//           record.type === 'GoldSale' ? `sold ${record.gold /1000} grams gold` :
//           `purchased ${record.gold /1000} grams gold`
//         } on ${formattedDate} at ${formattedTime}`,
//         date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
//         type: record.type,
//       };
//     })
//   );

//   const todayNotifications = notifications.filter((note) => note.date === today);
//   const previousNotifications = notifications.filter((note) => note.date !== today);

//   res.status(200).json({
//     success: true,
//     today: todayNotifications,
//     previous: previousNotifications,
//   });
// });

// -------------------------------------------- //
// --------------Cards/Analytics Data----------- //
// -------------------------------------------- //
exports.getAnalyticsData = catchAsyncErrors(async (req, res) => {
  try {
    // Extract startDate and endDate from query parameters
    let { startDate: queryStart, endDate: queryEnd } = req.query;
    // console.log(queryEnd,queryStart);
    
    const now = new Date();

    let startDate, endDate;
    if (queryStart && queryEnd) {
      startDate = new Date(queryStart);
      endDate = new Date(queryEnd);
      // Include the entire end date (set time to end of day)
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Default to last 7 days if no range provided
      endDate = now;
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    }

    // Fetch total shop amount and gold
    const shop = await Shop.findOne();
    const totalShopAmount = shop ? shop.amount : 1;
    const totalShopGold = shop ? shop.gold / 1000 : 1;

    // Fetch all transactions
    const transactions = await History.find();

    // Initialize analytics data
    const analytics = {
      CashDeposit: { total: 0, series: [] },
      GoldDeposit: { total: 0, series: [] },
      CashWithdraw: { total: 0, series: [] },
      GoldWithdraw: { total: 0, series: [] },
      GoldPurchase: { total: 0, series: [] },
      GoldSale: { total: 0, series: [] },
    };

    // Process transactions filtering by date range
    transactions.forEach((transaction) => {
      transaction.records.forEach((record) => {
        const { type, amount, gold, date } = record;
        const recordDate = new Date(date);

        // Filter: record date must be within the selected range
        if (recordDate >= startDate && recordDate <= endDate) {
          if (analytics[type]) {
            if (type === "GoldPurchase" || type === "GoldSale") {
              // Use gold value (scaled) for these types
              analytics[type].total += gold / 1000;
              analytics[type].series.push({
                x: recordDate.toISOString(),
                y: gold / 1000,
              });
            } else {
              // Use amount (or gold scaled) for other types
              analytics[type].total += amount || (gold / 1000);
              analytics[type].series.push({
                x: recordDate.toISOString(),
                y: amount || (gold / 1000),
              });
            }
          }
        }
      });
    });

    // Convert analytics into cardsData format
    const cardsData = [
      {
        title: "Cash Deposits",
        color: {
          backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
          boxShadow: "0px 10px 20px 0px #e0c6f5",
        },
        barValue: (analytics.CashDeposit.total / totalShopAmount) * 100,
        value: analytics.CashDeposit.total.toLocaleString(),
        png: "UilUsdSquare",
        series: [{ name: "Cash Deposits", data: analytics.CashDeposit.series }],
      },
      {
        title: "Gold Deposits",
        color: {
          backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
          boxShadow: "0px 10px 20px 0px #FDC0C7",
        },
        barValue: (analytics.GoldDeposit.total / totalShopGold) * 100,
        value: analytics.GoldDeposit.total.toLocaleString(),
        png: "UilMoneyWithdrawal",
        series: [{ name: "Gold Deposits", data: analytics.GoldDeposit.series }],
      },
      {
        title: "Cash Withdrawals",
        color: {
          backGround: "linear-gradient(180deg, #c2b280 0%, #d4af37 100%)", // Muted olive & soft gold
          boxShadow: "0px 10px 20px 0px #d1c497",
    // // Instead of a gradient similar to the glass theme, we use a cooler, more saturated tone.
    // backGround: "linear-gradient(180deg, #e0a899 0%, #ff8c00 100%)",
    //       // backGround: "linear-gradient(rgb(224, 207, 178) -146.42%, rgb(255 202 113) -46.42%)",
    //       boxShadow: "0px 10px 20px 0px #F9D59B",
        },
        barValue: (analytics.CashWithdraw.total / totalShopAmount) * 100,
        value: analytics.CashWithdraw.total.toLocaleString(),
        png: "UilClipboardAlt",
        series: [{ name: "Cash Withdrawals", data: analytics.CashWithdraw.series }],
      },
      {
        title: "Gold Withdrawals",
        color: {
          backGround: "linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)",
          boxShadow: "0px 10px 20px 0px #97d9e1",
        },
        barValue: (analytics.GoldWithdraw.total / totalShopGold) * 100,
        value: analytics.GoldWithdraw.total.toLocaleString(),
        png: "UilGold",
        series: [{ name: "Gold Withdrawals", data: analytics.GoldWithdraw.series }],
      },
      {
        title: "Gold Purchases",
        color: {
    backGround: "linear-gradient(180deg, #b8860b 0%, #8fbc8f 100%)", // Muted gold with soft teal
    boxShadow: "0px 10px 20px 0px #bfa57a",
    //       // backGround: "linear-gradient(180deg, #ffb347 0%, #ffcc33 100%)",
    // // Change this gradient to something more contrasting: using warm, reddish-orange tones.
    // backGround: "linear-gradient(180deg, #ffa07a 0%, #ff6347 100%)",
    //       boxShadow: "0px 10px 20px 0px #ffda79",
        },
        barValue: (analytics.GoldPurchase.total / totalShopGold) * 100,
        value: analytics.GoldPurchase.total.toLocaleString(),
        png: "UilDollarSign",
        series: [{ name: "Gold Purchases", data: analytics.GoldPurchase.series }],
      },
      {
        title: "Gold Sales",
        color: {
          backGround: "linear-gradient(180deg, #ff6a00 0%, #ee0979 100%)",
          boxShadow: "0px 10px 20px 0px #f79d00",
        },
        barValue: (analytics.GoldSale.total / totalShopGold) * 100,
        value: analytics.GoldSale.total.toLocaleString(),
        png: "UilBill",
        series: [{ name: "Gold Sales", data: analytics.GoldSale.series }],
      },
    ];

    res.status(200).json(cardsData);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// exports.getAnalyticsData = catchAsyncErrors(async (req, res) => {
//   try {
//     const { timeRange } = req.query; // Get timeRange from query params

//     // Fetch total shop amount and gold
//     const shop = await Shop.findOne();
//     const totalShopAmount = shop ? shop.amount : 1;
//     const totalShopGold = shop ? shop.gold / 1000 : 1;

//     // Fetch all transactions
//     const transactions = await History.find();

//     // Initialize analytics data
//     const analytics = {
//       CashDeposit: { total: 0, series: [] },
//       GoldDeposit: { total: 0, series: [] },
//       CashWithdraw: { total: 0, series: [] },
//       GoldWithdraw: { total: 0, series: [] },
//       GoldPurchase: { total: 0, series: [] },
//       GoldSale: { total: 0, series: [] },
//     };

//     // Get current date
//     const now = new Date();

//     // Define time range filters
//     const timeRangeFilters = {
//       "1day": new Date(now.setDate(now.getDate() - 1)),
//       "1week": new Date(now.setDate(now.getDate() - 7)),
//       "1month": new Date(now.setMonth(now.getMonth() - 1)),
//       "thisyear": new Date(now.setMonth(0, 1)), // Start of the year
//       "all": new Date(0), // All time
//     };

//     const filterDate = timeRangeFilters[timeRange] || timeRangeFilters["all"];

//     // Process transactions
//     transactions.forEach((transaction) => {
//       transaction.records.forEach((record) => {
//         const { type, amount, gold, date } = record;
//         const recordDate = new Date(date);

//         // Filter transactions based on the selected time range
//         if (recordDate >= filterDate) {
//           if (analytics[type]) {
//             if (type === "GoldPurchase" || type === "GoldSale") {
//               // Only use gold value for GoldPurchase and GoldSale
//               analytics[type].total += gold / 1000;
//               analytics[type].series.push({
//                 x: recordDate.toISOString(),
//                 y: gold / 1000,
//               });
//             } else {
//               // Use amount or gold (whichever is non-zero) for other types
//               analytics[type].total += amount || gold / 1000;
//               analytics[type].series.push({
//                 x: recordDate.toISOString(),
//                 y: amount || gold / 1000,
//               });
//             }
//           }
//         }
//       });
//     });

//     // Convert analytics into cardsData format
//     const cardsData = [
//       {
//         title: "Cash Deposits",
//         color: {
//           backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
//           boxShadow: "0px 10px 20px 0px #e0c6f5",
//         },
//         barValue: (analytics.CashDeposit.total / totalShopAmount) * 100,
//         value: analytics.CashDeposit.total.toLocaleString(),
//         png: "UilUsdSquare",
//         series: [{ name: "Cash Deposits", data: analytics.CashDeposit.series }],
//       },
//       {
//         title: "Gold Deposits",
//         color: {
//           backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
//           boxShadow: "0px 10px 20px 0px #FDC0C7",
//         },
//         barValue: (analytics.GoldDeposit.total / totalShopGold) * 100,
//         value: analytics.GoldDeposit.total.toLocaleString(),
//         png: "UilMoneyWithdrawal",
//         series: [{ name: "Gold Deposits", data: analytics.GoldDeposit.series }],
//       },
//       {
//         title: "Cash Withdrawals",
//         color: {
//           backGround: "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
//           boxShadow: "0px 10px 20px 0px #F9D59B",
//         },
//         barValue: (analytics.CashWithdraw.total / totalShopAmount) * 100,
//         value: analytics.CashWithdraw.total.toLocaleString(),
//         png: "UilClipboardAlt",
//         series: [{ name: "Cash Withdrawals", data: analytics.CashWithdraw.series }],
//       },
//       {
//         title: "Gold Withdrawals",
//         color: {
//           backGround: "linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)",
//           boxShadow: "0px 10px 20px 0px #97d9e1",
//         },
//         barValue: (analytics.GoldWithdraw.total / totalShopGold) * 100,
//         value: analytics.GoldWithdraw.total.toLocaleString(),
//         png: "UilGold",
//         series: [{ name: "Gold Withdrawals", data: analytics.GoldWithdraw.series }],
//       },
//       {
//         title: "Gold Purchases",
//         color: {
//           backGround: "linear-gradient(180deg, #ffb347 0%, #ffcc33 100%)",
//           boxShadow: "0px 10px 20px 0px #ffda79",
//         },
//         barValue: (analytics.GoldPurchase.total / totalShopGold) * 100,
//         value: analytics.GoldPurchase.total.toLocaleString(),
//         png: "UilDollarSign",
//         series: [{ name: "Gold Purchases", data: analytics.GoldPurchase.series }],
//       },
//       {
//         title: "Gold Sales",
//         color: {
//           backGround: "linear-gradient(180deg, #ff6a00 0%, #ee0979 100%)",
//           boxShadow: "0px 10px 20px 0px #f79d00",
//         },
//         barValue: (analytics.GoldSale.total / totalShopGold) * 100,
//         value: analytics.GoldSale.total.toLocaleString(),
//         png: "UilBill",
//         series: [{ name: "Gold Sales", data: analytics.GoldSale.series }],
//       },
//     ];

//     res.status(200).json(cardsData);
//   } catch (error) {
//     console.error("Error fetching analytics data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// exports.getAnalyticsData = catchAsyncErrors( async (req, res) => {
//   try {
//     // Fetch total shop amount and gold
//     const shop = await Shop.findOne();
//     const totalShopAmount = shop ? shop.amount : 1;
//     const totalShopGold = shop ? shop.gold/1000 : 1;

//     // Fetch all transactions
//     const transactions = await History.find();

//     // Initialize analytics data
//     const analytics = {
//       CashDeposit: { total: 0, series: [] },
//       GoldDeposit: { total: 0, series: [] },
//       CashWithdraw: { total: 0, series: [] },
//       GoldWithdraw: { total: 0, series: [] },
//       GoldPurchase: { total: 0, series: [] },
//       GoldSale: { total: 0, series: [] },
//     };

//     // Process transactions
//     transactions.forEach((transaction) => {
//       transaction.records.forEach((record) => {
//         const { type, amount, gold, date } = record;

//         if (analytics[type]) {
//           if (type === "GoldPurchase" || type === "GoldSale") {
//             // Only use gold value for GoldPurchase and GoldSale
//             analytics[type].total += gold / 1000;
//             analytics[type].series.push({
//               x: new Date(date).toISOString(),
//               y: gold / 1000,
//             });
//           } else {
//             // Use amount or gold (whichever is non-zero) for other types
//             analytics[type].total += amount || gold / 1000;
//             analytics[type].series.push({
//               x: new Date(date).toISOString(),
//               y: amount || gold / 1000,
//             });
//           }
//         }
//       });
//     });

//     // Convert analytics into cardsData format
//     const cardsData = [
//       {
//         title: "Cash Deposits",
//         color: {
//           backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
//           boxShadow: "0px 10px 20px 0px #e0c6f5",
//         },
//         barValue: (analytics.CashDeposit.total / totalShopAmount) * 100,
//         value: analytics.CashDeposit.total.toLocaleString(),
//         png: "UilUsdSquare",
//         series: [{ name: "Cash Deposits", data: analytics.CashDeposit.series }],
//       },
//       {
//         title: "Gold Deposits",
//         color: {
//           backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
//           boxShadow: "0px 10px 20px 0px #FDC0C7",
//         },
//         barValue: (analytics.GoldDeposit.total / totalShopGold) * 100,
//         value: analytics.GoldDeposit.total.toLocaleString(),
//         png: "UilMoneyWithdrawal",
//         series: [{ name: "Gold Deposits", data: analytics.GoldDeposit.series }],
//       },
//       {
//         title: "Cash Withdrawals",
//         color: {
//           backGround: "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
//           boxShadow: "0px 10px 20px 0px #F9D59B",
//         },
//         barValue: (analytics.CashWithdraw.total / totalShopAmount) * 100,
//         value: analytics.CashWithdraw.total.toLocaleString(),
//         png: "UilClipboardAlt",
//         series: [{ name: "Cash Withdrawals", data: analytics.CashWithdraw.series }],
//       },
//       {
//         title: "Gold Withdrawals",
//         color: {
//           backGround: "linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)",
//           boxShadow: "0px 10px 20px 0px #97d9e1",
//         },
//         barValue: (analytics.GoldWithdraw.total / totalShopGold) * 100,
//         value: analytics.GoldWithdraw.total.toLocaleString(),
//         png: "UilGold",
//         series: [{ name: "Gold Withdrawals", data: analytics.GoldWithdraw.series }],
//       },
//       {
//         title: "Gold Purchases",
//         color: {
//           backGround: "linear-gradient(180deg, #ffb347 0%, #ffcc33 100%)",
//           boxShadow: "0px 10px 20px 0px #ffda79",
//         },
//         barValue: (analytics.GoldPurchase.total / totalShopGold) * 100,
//         value: analytics.GoldPurchase.total.toLocaleString(),
//         png: "UilDollarSign",
//         series: [{ name: "Gold Purchases", data: analytics.GoldPurchase.series }],
//       },
//       {
//         title: "Gold Sales",
//         color: {
//           backGround: "linear-gradient(180deg, #ff6a00 0%, #ee0979 100%)",
//           boxShadow: "0px 10px 20px 0px #f79d00",
//         },
//         barValue: (analytics.GoldSale.total / totalShopGold) * 100,
//         value: analytics.GoldSale.total.toLocaleString(),
//         png: "UilBill",
//         series: [{ name: "Gold Sales", data: analytics.GoldSale.series }],
//       },
//     ];

//     res.status(200).json(cardsData);
//   } catch (error) {
//     console.error("Error fetching analytics data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });