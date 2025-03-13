const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    records: [
      {
        type: { type: String, required: true },
        amount: { type: Number, required: true },
        gold: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        time: { type: String },
        goldRate: { type: Number, required: false },
        returnCash: { type: Number, required: false },
        shopGoldAfterTransaction: { type: Number }, // New field for shop gold
        shopAmountAfterTransaction: { type: Number }, // New field for shop amount
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', historySchema);
