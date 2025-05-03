const express =require('express');
const router =express.Router();
const {deleteProduct,updateProduct,getallsellerProducts,searchproducts,getallProduct,createProduct} =require('../controllers/productController');
const {auth,restrictTo} =require('../middlewares/auth');




router.get('/',getallProduct);

// seller only 
router.post('/',auth,restrictTo("seller"),createProduct);
router.put('/:id',auth,restrictTo("seller"),updateProduct);
router.delete('/:id',auth,restrictTo("seller"),deleteProduct);

router.get('/seller-product',auth,restrictTo("seller"),getallsellerProducts);
router.get('/search', searchproducts); 


module.exports=router;