// 1)schema model 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'prouduct name is requiers'],
        unique: [true, 'must be unique'],
        trim: true, 
        minLength: 3,
        maxLength: 50
    },
    description: {
        type: String,
        require: [true, 'email is requiers '],
    },
    image: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        required: [true, 'price is required'],
        min: [0, 'Price must be a positive value']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
});

// 2) model
const productmodel = mongoose.model('Product', productSchema)
module.exports = productmodel;
