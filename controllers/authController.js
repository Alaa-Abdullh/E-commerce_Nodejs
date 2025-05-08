const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.Secret);
};

// register 
exports.register = async (req, res) => {
    const {username, email, password, role} = req.body;
    try {
        const userexist = await User.findOne({email});
        if (userexist) return res.status(400).json({message: "Email Already in use"});

        const user = await User.create({username, email, password, role});
  
        res.status(200).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id),
        });
    } catch(err) {
        console.log("register error", err);
        res.status(500).json({message: err.message});
    }
}

// login 
exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "Invalid email or Password"});
        }
        
        const ismatch = await user.matchPassword(password);
        if (!ismatch) {
            return res.status(400).json({message: "Invalid email or Password"});
        }
    
        const token = generateToken(user._id);
        
        res.status(200).json({
            message: "User login successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token,
        });
    } catch(err) {
        res.status(500).json({message: err.message});
    }
}

// forgot password
exports.forgotpasswd = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const resetToken = user.generateResetToken();
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset Request</h1>
                <p>Please click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({message: 'Password reset link sent to email'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
}

// reset password
exports.resetpasswd = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {$gt: Date.now()}
        });

        if (!user) {
            return res.status(400).json({message: "Invalid or expired token"});
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({message: 'Password reset successful'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
}

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const {username, email, phone, address} = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Update fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

// Delete user account
exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        await user.remove();
        res.json({message: "Account deleted successfully"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}