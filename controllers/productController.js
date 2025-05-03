const jwt = require('jsonwebtoken');
const Product=require('../models/Product');

const User = require('../models/User'); 

// register 
exports.createProduct=async (req,res)=>{
  
    try {
        const {name,description,image,price}=req.body;
        const sellerId=req.user.id;
    
        const newProduct = await Product.create({ name, description, image, seller: sellerId,price });
  
         res.status(200).json({
            message: " Product created successfully",newProduct});

    }

    catch(err)
        {
            console.log("created Product error",err);
            
         res.status(500).json({message:err.message});

    }
};

// get all prouduct 
exports.getallProduct=async (req,res) =>{
    try{
        const Products=await Product.find().populate("seller","name");
        res.json(Products);
    }
    catch(err){
        console.log("get all Product error",err);

        res.status(500).json({message:err.message});
         
    }
    
};



// get all seller prouduct 
exports.getallsellerProducts=async (req,res) =>{
    try{
        const Products=await Product.find({seller:req.user.id});
        res.json(Products);
    }
    catch(err){
        console.log("get all Productseller  error",err);

        res.status(500).json({message:err.message});
         
    }
    
};


// update  prouduct 
exports.updateProduct=async (req,res) =>{
    try{
        const {id}=req.params;
        const Productupdated=await Product.findById(id);
        if (!Productupdated){
            return   res.status(404).json({message:"Product not found :("}); 
        }
        if (Productupdated.seller.toString() !== req.user.id){
            return   res.status(404).json({message:"not user seller here :("}); 
        }

        const update=await Product.findByIdAndUpdate(id,req.body,{new:true});
        res.json({ message: "Product updated", update });
    }
    catch(err){
        console.log("get updated Product error",err);

        res.status(500).json({message:err.message});
         
    }
    
};


// delete 

exports.deleteProduct=async (req,res) =>{
    try{
        const {id}=req.params;
        const delProduct=await Product.findById(id);
        if (!delProduct){
            return   res.status(404).json({message:"Product not found :("}); 
        }
        if (delProduct.seller.toString() !== req.user.id){
            return   res.status(404).json({message:"not user seller here :("}); 
        }

        const deleted=await Product.findByIdAndDelete(id);
        res.json({ message: "Product deleted", deleted });
    }
    catch(err){
        console.log("get updated Product error",err);

        res.status(500).json({message:err.message});
         
    }
    
};


// search
exports.searchproducts=async (req,res)=>{
    try {
        const {query,sellerName}=req.query;
        const searchQuery = {};
        if (query) {
            searchQuery.$or=[
                
                {name:{ $regex: query, $options: 'i'}},
                {description:{ $regex: query, $options: 'i'}},

            
        ];
            
        }
        if (sellerName){
            const seller=await User.findOne({ name: { $regex: sellerName, $options: 'i' } });
            if (!seller) {
            return res.status(404).json({message:"no seller found"});
                
            }
            searchQuery.seller=seller._id;
        }
    const products=await Product.find(searchQuery).populate('seller', 'name');
        // if (products.length===0){
        //     return res.status(404).json({message:"no prouduct found"});
         
        // }
         res.json(products);

        
    } catch (err) {
        console.log("search Product error",err);

        res.status(500).json({message:err.message});
         
        
    }
}