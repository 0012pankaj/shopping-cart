const express = require('express');
const router = express.Router() //mini instance
const {isLoggedIn} = require('../middelware');
const Product = require('../model/product');
const User = require('../model/User');

// route too see the cart
router.get('/user/cart' ,isLoggedIn , async(req,res)=>{
    let user = await User.findById(req.user._id).populate('cart');
    const totalAmount = user.cart.reduce((sum , curr)=> sum+curr.price , 0)
    res.render('cart/cart' , {user, totalAmount });
          // use populate to acess cart all products as it refer: products collection
})

// actually dding the product to the cart
router.post('/user/:productId/add' , isLoggedIn , async(req,res)=>{
    let {productId} = req.params;
    let userId = req.user._id ; 
    let product = await Product.findById(productId);
    let user = await User.findById(userId);
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart');
})

router.post('/user/:productId/remove', isLoggedIn,async (req, res) => {
    try{
        let {productId} = req.params;
        let userId = req.user._id ; 
        await  User.findByIdAndUpdate(userId , {$pull:{cart:productId}});
    req.flash('success' , 'Product remove successfully');
    res.redirect(`/user/cart`); 

    }catch(e){
        res.status(500).render('errpage',{err:e.message});
    }
    
});


module.exports = router;



// This code uses populate('cart') to replace the cart array of 
// ObjectId references with actual Product documents.

// In MongoDB, the populate() method is used to replace specified
//  paths in a document with documents from another collection.
//   This is particularly useful when dealing with references between collections.
//    It allows you to retrieve documents from other collections and
//     populate them into the results of your query.