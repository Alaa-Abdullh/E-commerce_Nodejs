const jwt = require('jsonwebtoken');
const Product=require('../models/Product');
const Cart=require('../models/Cart');


exports.addTocart = async (req, res) => {
    try {
        const { ProductId, quantity } = req.body;
        const userId = req.user.id;

        const product = await Product.findById(ProductId); 
        console.log("Product found:", product);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            // If the cart does not exist, create a new one
            cart = new Cart({ 
                user: userId,
                items: [{ product: ProductId, quantity }]  
            });
        } else {
            const existingItemIndex = cart.items.findIndex(
                item => item.product.toString() === ProductId.toString()
            );
            if (existingItemIndex >= 0) {
                // If the product already exists, update the quantity
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Create a new item in the cart
                cart.items.push({ product: ProductId, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (err) {
        console.log("add to cart error", err);
        res.status(500).json({ message: err.message });
    }
};

// grt

exports.getallcart=async (req,res) =>{
    try{
        const carts=await Cart.findOne({user:req.user.id}).populate("user","name").populate("items.product", "name image"); 
        if (!carts) {
        res.status(404).json({message:"cart not found"});

        }
        res.json(carts);
    }
    catch(err){
        console.log("get all carts error",err);

        res.status(500).json({message:err.message});
         
    }
    
};

// update cart
exports.updatecartitemandquantity=async (req,res) =>{
    try{
        const {ProductId}=req.params;
        const {quantity}=req.body;

        const cart=await Cart.findOne({user:req.user.id});
        if (!cart) {
            res.status(404).json({message:"cart not found"});
    
            }
        if (cart.user.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ message: "You are not authorized to update this cart" });
              }

        const item= cart.items.find( i => i.product.toString() === ProductId);
        if (!item){
            return   res.status(404).json({message:"item not found :("}); 
        }
       item.quantity=quantity;
       await cart.save();
       res.json({ message: "quantity updated", cart });
    }
    catch(err){
        console.log("get updated quantity error",err);

        res.status(500).json({message:err.message});
         
    }
    
};


// delete 

exports.deleteitem=async (req,res) =>{
    try{
        const {ProductId}=req.params;
        const cart=await Cart.findOne({user:req.user.id});
        if (!cart) {
            res.status(404).json({message:"cart not found"});

            }
        if (cart.user.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ message: "You are not authorized to update this cart" });
              }
        cart.items=cart.items.filter(
            item=>item.product.toString()!== ProductId
        );

        await cart.save();


        res.json({ message: "item deleted", cart });
    }
    catch(err){
        console.log("remove item error",err);

        res.status(500).json({message:err.message});
         
    }
    
};
