const express = require('express');
const router = express.Router() 
const User = require('../model/User');
const { isLoggedIn } = require('../middelware');


router.get('/payment/success',isLoggedIn ,async (req,res)=>{
    const userId = req.user._id; // Assuming you have the user's ID available


    await User.findByIdAndUpdate(
        userId, // Filter by user ID
        { $set: { cart: [] }  }, // Remove all items from the cart array
        { new: true } // To return the updated document
    );

    req.flash('success' , 'Payment Successfull....');
    res.redirect('/products');
});

router.get('/payment/fail',(req,res)=>{
    req.flash('error' , 'Some Thing Went Wrong... Payment Fail...');
    res.redirect('/products');
});

module.exports = router;