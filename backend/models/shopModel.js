const mongoose =  require('mongoose');

const ShopSchema = mongoose.Schema({
    amount: { type: Number},
    gold: { type: Number}
})

module.exports =  mongoose.model("Shop", ShopSchema);