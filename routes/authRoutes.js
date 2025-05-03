const express =require('express');
const router =express.Router();
const {register,login} =require('../controllers/authController');
const {auth,restrictTo} =require('../middlewares/auth');




router.post('/register',register);

router.post('/login',login);


router.get('/admin', auth, restrictTo('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin!' });
  });
  
  router.get('/user', auth, (req, res) => {
    res.json({ message: 'Welcome User', user: req.user });
  });

module.exports=router;