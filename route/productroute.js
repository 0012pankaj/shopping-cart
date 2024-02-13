const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const Product = require('../model/product');


const {isProductAuthor, validateProduct,isLoggedIn,isSeller}=require('../middelware') //add this middlevare in create and update its use is to do SERVER SIDE VALIDATION
const {showAllProducts, productForm , createProduct , showProduct , editProductForm , updateProduct , deleteProduct} =  require('../controllers/productsCont')

router.get("/products",showAllProducts);

// create--->
router.get("/products/new",isLoggedIn,isSeller, productForm);

                          //ssvalidation    //isSeller make sure that if it is buyer it cant create new products ,server-side validation by creation middleware 
router.post('/products',isLoggedIn, isSeller,createProduct);

// create--->

//read-->


router.get('/products/:id',isLoggedIn,showProduct);

//read-->

//edit /UPDATE-------->
 
router.get('/products/:id/edit',isLoggedIn,isProductAuthor,editProductForm);
                               //ssvalidation
router.patch('/products/:id', isProductAuthor,  validateProduct,isLoggedIn,updateProduct);

//edit /UPDATE-------->

//delete--->
router.delete('/products/:id', isLoggedIn,isProductAuthor, deleteProduct);

//delete-->



module.exports=router;