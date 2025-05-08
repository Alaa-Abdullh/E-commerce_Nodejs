// 1)schema model 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, 'user name is required'],
        unique: [true, 'must be unique'],
        trim: true,  // remove spacses
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        require: [true, 'email is required'],
        unique: [true, 'must be unique'],
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: () => "invalid email format"
        }
    },
    password: {
        type: String,
        require: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {
        type: String,
        enum: ['user', 'admin', 'seller'],
        default: 'user'
    },
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: () => "invalid phone number"
        }
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    }
}, {timestamps: true});

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

// generate reset token
userSchema.methods.generateResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    return resetToken;
};

// 2) model
const User = mongoose.model('User', userSchema)
module.exports = User;
