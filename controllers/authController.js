const jwt = require('jsonwebtoken');
const User=require('../models/User');
const bcrypt = require('bcryptjs');

const generateToken=(id)=>{
    return jwt.sign({id},process.env.Secret);
};

// register 
exports.register=async (req,res)=>{
    const {username,email,password,role}=req.body;
    try {
        const userexist=await User.findOne({email});
        if (userexist) return res.status(400).json({message:"Email Already use"});

         const user =await User.create({username,email,password,role});
  
         res.status(200).json({
            message: "User registered successfully",
            user:{

            _id:user._id
            ,username:user.username,
            email:user.email,
            password:user.password,
            role:user.role}
            ,token:generateToken(user._id),
        });

    }

    catch(err)
        {
            console.log("register error",err);
            
         res.status(500).json({message:err.message});

    }
}


// login 
exports.login=async (req,res)=>{
    const {email,password} =req.body ;
    try {
        // user 
        const user =await User.findOne({email});
        if (!user) {
            return res.status(400).json({message:"Invalid email or Password"});
        }
        //passwd 
        const ismatch=await user.matchPassword(password);
        if (!ismatch) {
            return res.status(400).json({message:"Invalid email or Password"});
        }
    
        const token=jwt.sign({id:user._id},process.env.Secret);

        
        res.status(200).json({
            message: "User login successfully",
            user:{

            _id:user._id
            ,username:user.username,
            email:user.email,
            role:user.role}
            ,token,
        });
    }
    catch(err){
        res.status(500).json({message:err.message});

    }

}