// 1)schema model 
const mongoose = require('mongoose');
const { trim } = require('validator');

const couponSchema = new mongoose.Schema({
   code: {
     type: String,
     trim: true,
     required: [true, 'Coupon code is required'],
     unique: true,
   },
   discount: {
     type: Number,
     min: 0,
     required: [true, 'Discount is required'],
   },
   expires: {
     type: Date,
     required: [true, 'Expiration date is required'],
   },
 }, { timestamps: true });

// 2) model
const couponmodel = mongoose.model('Coupon', couponSchema)
module.exports = couponmodel;
