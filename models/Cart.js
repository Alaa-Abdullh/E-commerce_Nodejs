// 1)schema model 
const mongoose = require('mongoose');


const cartitemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'user name is requiers'],
        ref: 'Product'
       
    },
 quantity:{
    type: Number,
    default: 1,
    min: 1
 }
});


const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'user name is requiers'],
        ref: 'User',
    },
    items: [cartitemSchema]
},{ timestamps: true });


// 2) model
const cartmodel = mongoose.model('Cart', cartSchema)
module.exports = cartmodel;
