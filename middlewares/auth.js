const jwt = require('jsonwebtoken');
const User=require('../models/User');


exports.auth =async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ status: 'faild', message: 'Authorization header is missing' });
    }
    const token = authHeader.split(' ')[1];

    try {
        let decoded = jwt.verify(token, process.env.Secret);
        console.log(decoded);

      
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
          return res.status(401).json({ status: 'fail', message: 'User not found' });
        }
        req.user = user;
        req.id=user._id
        req.role=user.role
        next();
    } catch (error) {
        res.status(401).json({ status: 'faild', message: error.message });
    }
}


exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.role)) {
        return res.status(403).json({
          status: 'failed',
          message: 'You do not have permission to perform this action'
        });
      }
      next();
    };
  };
  
