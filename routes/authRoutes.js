const express = require('express');
const router = express.Router();
const {register, login, forgotpasswd, resetpasswd, updateProfile, deleteAccount} = require('../controllers/authController');
const {auth, restrictTo} = require('../middlewares/auth');

const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotpasswd);
router.post('/reset-password/:token', resetpasswd);

// Protected routes
router.get('/admin', auth, restrictTo('admin'), (req, res) => {
    res.json({message: 'Welcome Admin!'});
});

router.get('/user', auth, (req, res) => {
    res.json({message: 'Welcome User', user: req.user});
});

// Profile management routes
router.put('/profile', auth, updateProfile);
router.delete('/profile', auth, deleteAccount);

module.exports = router;