const express =require('express');
const router =express.Router();
const {addTocart,getallcart,updatecartitemandquantity,deleteitem} =require('../controllers/cartController');
const {auth,restrictTo} =require('../middlewares/auth');


router.post('/', auth, addTocart);
router.get('/all', auth, getallcart);
router.put('/:ProductId', auth, updatecartitemandquantity);
router.delete('/:ProductId', auth, deleteitem);



module.exports = router;