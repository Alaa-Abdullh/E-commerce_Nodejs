// 1)schema model 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, 'user name is requiers'],
        unique: [true, 'must be unique'],
        trim: true,  // remove spacses
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        require: [true, 'email is requiers '],
        unique: [true, 'must be unique'],
        validate: {
            validator: function (v) {
                return /^[a-zA-z]{3,10}(@)(gmail|yahoo)(.com)$/.test(v)
            },
            message: () => "invalid email",
        }

    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['user', 'admin','seller'],
        default: 'user'
    },
},{timestamps:true} );

// hasing passwd
userSchema.pre('save', async function (next) {
    console.log(this);
    if (!this.isModified('password')) return next();
    let salt = await bcrypt.genSalt(10); // 10 complexty
    let hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();

});

// compare passwd 
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  


// 2) model
const usermodel = mongoose.model('User', userSchema)
module.exports = usermodel;
