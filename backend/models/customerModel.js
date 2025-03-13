const { kMaxLength } = require("buffer");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  cellNumber: {
    type: Number,
    unique: true,
  },
  address: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String },
    streetAddress: { type: String },
  },
  gender: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  CNIC: {
    type: Number,
    required: true,
    unique: true,
  },
  CNIC_image: {
    front: {
      type: String,
      required: true,
    },
    back: {
      type: String,
      required: true,
    },
  },
  gold: {
    type: Number,
    default: 0,
  },
  amount: {
    type: Number,
    default: 0,
  },
}, {timestamps: true});

module.exports = mongoose.model("Customer", customerSchema);
