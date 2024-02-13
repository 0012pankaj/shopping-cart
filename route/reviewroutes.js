const express = require('express');
const router = express.Router() //mini instance
const Product = require('../model/product')
const Review = require('../model/Review')

const {validateReview,isReviewAuthor}=require('../middelware') //add this middlevare in create and update its use is to do SERVER SIDE VALIDATION

                                    //ss validation
router.post('/products/:id/review' , validateReview,async(req,res)=>{
  try{
    let {id} = req.params;
    let {rating,comment} =req.body;
    const product = await Product.findById(id);
    const review = new Review({rating,comment,author:req.user._id});
    const productAverageRating =(product.avgRating || 1);
    const newAverageRating = ((productAverageRating * product.reviews.length) + parseInt(rating)) / (product.reviews.length + 1);
    product.avgRating = parseFloat(newAverageRating.toFixed(1));

    product.reviews.push(review);
    await review.save();
    await product.save();

    req.flash('success' , 'Review added successfully')
    res.redirect(`/products/${id}`);

  }catch(e){
    res.status(500).render('errpage',{err:e.message});
}
})


router.post('/products/:productId/:reviewId/delete-review',isReviewAuthor,async (req, res) => {
  try{
      let {productId,reviewId} = req.params;
      await  Product.findByIdAndUpdate(productId , {$pull:{reviews:reviewId}});
      await Review.findByIdAndDelete(reviewId);
  req.flash('success' , 'Review Delet successfully');
  res.redirect(`/products/${productId}`); 

  }catch(e){
      res.status(500).render('errpage',{err:e.message});
  }
  
});



module.exports = router;

