const jwt = require('jsonwebtoken');
const Product=require('../models/Product');
const Order=require('../models/Order');
const Coupon=require('../models/coupon');
exports.createorder = async (req, res) => {
  try {
      const { productitems, paymentMethod, couponCode, shippingAddress } = req.body;
      const userId = req.user.id;

      let totalAmount = 0;
      const orderProducts = [];

      for (const item of productitems) {
          const product = await Product.findById(item.product);
          if (!product) {
              return res.status(404).json({ message: `Product ${item.product} not found` });
          }

         
          const quantity = Number(item.quantity);
          const price = Number(item.price);

          if (isNaN(quantity) || isNaN(price)) {
              return res.status(400).json({ message: 'Invalid quantity or price' });
          }

          const totalPrice = price * quantity;

          totalAmount += totalPrice;

          orderProducts.push({
              product: product._id,
              quantity,
              price,
          });
      }

      let discount = 0;

      if (couponCode) {
          const coupon = await Coupon.findOne({ code: couponCode });
          if (!coupon) {
              return res.status(400).json({ message: 'Coupon is not correct' });
          }

          const now = new Date();
          if (coupon.expires < now) {
              return res.status(400).json({ message: 'Coupon has expired' });
          }

          discount = (totalAmount * coupon.discount) / 100;
      }

      const finalAmount = totalAmount - discount;

      if (isNaN(finalAmount) || finalAmount <= 0) {
          return res.status(400).json({ message: 'Invalid final amount' });
      }

      const newOrder = new Order({
          user: userId,
          productitems: orderProducts,
          totalAmount: finalAmount,
          discount,
          paymentMethod,
          shippingAddress,
      });

      await newOrder.save();

      res.status(200).json({
          message: 'Order created successfully :)',
          order: newOrder,
      });
  } catch (err) {
      console.log('Add to order error', err);
      res.status(500).json({ message: err.message });
  }
};


// grt

exports.getallorder=async (req,res) =>{
    try{
        const orders=await Order.find({user:req.user.id}).populate("user","name").populate("productitems.product", "name image"); 
        if (!orders ||  orders.length === 0) {
        res.status(404).json({message:"order not found"});

        }
        res.status(200).json({orders});
    }
    catch(err){
        console.log("get all orders error",err);

        res.status(500).json({message:err.message});
         
    }
    
};

// update order
exports.updateorderitemandquantity=async (req,res) =>{
    try{
        const {ProductId}=req.params;
        const {quantity}=req.body;

        const order=await Order.findOne({user:req.user.id});
        if (!order) {
            res.status(404).json({message:"order not found"});
    
            }
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ message: "You are not authorized to update this order" });
              }

        const item= order.productitems.find( i => i.product.toString() === ProductId);
        if (!item){
            return   res.status(404).json({message:"item not found :( "}); 
        }
       item.quantity=quantity;
       await order.save();
       res.json({ message: "quantity updated", order });
    }
    catch(err){
        console.log(" updated quantity error",err);

        res.status(500).json({message:err.message});
         
    }
    
};


// delete 

exports.deleteitem=async (req,res) =>{
    try{
        const {ProductId}=req.params;
        const order=await Order.findOne({user:req.user.id});
        if (!order) {
            res.status(404).json({message:"order not found"});

            }
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ message: "You are not authorized to Delete this order" });
              }
        order.productitems=order.productitems.filter(
            item=>item.product.toString()!== ProductId
        );

        await order.save();


        res.json({ message: "item deleted", order });
    }
    catch(err){
        console.log("remove item error",err);

        res.status(500).json({message:err.message});
         
    }
    
};
