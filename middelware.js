const {productSchema , reviewSchema} = require('./joiSchema');
const Review = require('./model/Review');
const Product=require('./model/product');

//after creating joiSchema we create middlewares for
//  validate and use them in between routs when Create and update

const validateProduct = (req,res,next)=>{
    const {name,img,price,dec} = req.body;
    const {error} = productSchema.validate({name,img,price,dec})
    if(error){
        return res.render('errpage');
    }
    next();
}

const validateReview = (req,res,next)=>{
    
    const {rating, comment} = req.body;
    const {error} = reviewSchema.validate({rating,comment});

    if(error){
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    next();
}

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){

        req.flash('error' , 'please login first');
        return res.redirect('/login');
    }
    next();
}

const isSeller = (req,res,next)=>{
    if(!req.user.role){
        req.flash('error' , 'You donot have the permission to do that');
        return res.redirect('/products');
    }
    else if(req.user.role !== 'seller'){
        req.flash('error' , 'You donot have the permission to do that');
        return res.redirect('/products');
    }
    next();

}


const isProductAuthor = async(req,res,next)=>{
    let {id} = req.params; //product id
    let product = await Product.findById(id); //entire product
    if(!product.author.equals(req.user._id)){  // we not use === to check bcz it can't compare object id 
        req.flash('error' , 'You are not the authorised user');
        return res.redirect('/products');
    }
    next();
}

const isReviewAuthor = async(req,res,next)=>{
    let {productId,reviewId} = req.params;
    let review = await Review.findById(reviewId); //entire product
    if(!review.author.equals(req.user._id)){  // we not use === to check bcz it can't compare object id 
        req.flash('error' , 'You are not the authorised user');
        return res.redirect(`/products/${productId}`); 
    }
    next();
}
const isCartNoEmpty= async(req,res,next)=>{
    if(req.user.cart.length === 0){  // we not use === to check bcz it can't compare object id 
        req.flash('error' , 'Cart is Empty Add To Cart first...');
        return res.redirect('/products');
    }
    next();
}





module.exports = {isCartNoEmpty,isProductAuthor, isSeller,validateReview , validateProduct,isLoggedIn,isReviewAuthor}

//now require them in product and review routs and use






