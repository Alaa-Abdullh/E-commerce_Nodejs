const express =require('express');
const router =express.Router();
const {createCoupon,getAllCoupons,updateCoupon,deleteCoupon} =require('../controllers/couponController');
const {auth,restrictTo} =require('../middlewares/auth');


router.post('/', auth,restrictTo('admin'), createCoupon);
router.get('/all', auth,restrictTo('admin'), getAllCoupons);
router.put('/:id', auth, restrictTo('admin'),updateCoupon);
router.delete('/:id', auth,restrictTo('admin'), deleteCoupon);




module.exports = router;