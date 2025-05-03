const jwt = require('jsonwebtoken');
// const Product=require('../models/Product');
const Coupon=require('../models/coupon');

exports.createCoupon = async (req, res) => {
    try {
      const { code, discount, expires } = req.body;
  
      const existingCoupon = await Coupon.findOne({ code });
      if (existingCoupon) {
        return res.status(400).json({ message: 'Coupon already exist ' });
      }
  
      const newCoupon = new Coupon({
        code,
        discount,
        expires
      });
  
      await newCoupon.save();
  
      res.status(201).json({
        message: 'coupon create success',
        coupon: newCoupon
      });
    } catch (err) {
      console.error('error to create coupon', err);
      res.status(500).json({ message: err.message });
    }
  };

  //get all 


exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ coupons });
  } catch (err) {
    console.error('Error fetching coupons:', err);
    res.status(500).json({ message: err.message });
  }
};


  // update

  exports.updateCoupon = async (req, res) => {
    try {
      const { id } = req.params;
      const { code, discount, expires } = req.body;
  
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id,
        { code, discount, expires },
        { new: true, runValidators: true }
      );
  
      if (!updatedCoupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      res.status(200).json({ message: 'Coupon updated successfully', coupon: updatedCoupon });
    } catch (err) {
      console.error('Error updating coupon:', err);
      res.status(500).json({ message: err.message });
    }
  };


  // delete 
  exports.deleteCoupon = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedCoupon = await Coupon.findByIdAndDelete(id);
  
      if (!deletedCoupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (err) {
      console.error('Error deleting coupon:', err);
      res.status(500).json({ message: err.message });
    }
  };