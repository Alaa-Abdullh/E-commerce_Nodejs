const express =require('express');
const router =express.Router();
const {createorder,getallorder,updateorderitemandquantity,deleteitem} =require('../controllers/orderController');
const {auth,restrictTo} =require('../middlewares/auth');


router.post('/', auth, createorder);
router.get('/all', auth, getallorder);
router.put('/:ProductId', auth, updateorderitemandquantity);
router.delete('/:ProductId', auth, deleteitem);



module.exports = router;