const mongoose=require('mongoose');
const Review = require('./Review');

const productSchema=new mongoose.Schema({
    name : {
       type:String,
       trim:true,
       required:true

    },
    img:{
      type:String,
      trim:true,
      default:"./image/product.js"
    },
    price:{
      type:Number,
      min:0,
      default:0

    },
    dec:{
        type:String,
        trim:true

    }, avgRating: {
      type: Number,
      default:0 
  },
    reviews:[
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Review'
      }
  ], 
  author:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }

}, {timestamps:true})

//middlewareof moongose --> pre / post apply on monoose Schema they work after or before monodb operation 
// middleware jo  mongodb operations karwane par use hota hai and iske andar pre nd post middleware hote hai which 
//are basically used over the schema and before the model is js class.
// when we do  Product.findByIdAndDelete(id ); this delete allthe reviews of that product
                                                  //product--> whose id is there
productSchema.post('findOneAndDelete' , async function(product){
  if(product.reviews.length > 0){
      await Review.deleteMany({_id:{$in:product.reviews}})
  }
})

//  If there are reviews associated with the deleted product,
//  this line uses Review.deleteMany to delete all the reviews whose
//   _id is in the product.reviews array. The $in operator is used 
//   to match documents where the value of the _id field is in the specified array.


const Product=mongoose.model("Product",productSchema);
module.exports=Product;