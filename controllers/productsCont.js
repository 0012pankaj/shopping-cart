let Product = require('../model/product');

const showAllProducts = async(req,res)=>{

    try{
        const products=await Product.find();
        res.render('productstemp/index.ejs',{products});

    }catch(e){
        res.status(500).render('errpage',{err:e.message});
    }
    
}

const productForm = async(req,res)=>{
    try{
        res.render('productstemp/new.ejs');
    }catch(e){
        res.status(500).render('errpage',{err:e.message});
    }
   
}


const createProduct =  async (req, res) => {
    try{
        const { name, img, dec, price } = req.body;        
        await Product.create({ name,img,dec, price ,author:req.user._id});

        req.flash('success' , 'Product added successfully');
        res.redirect('/products');
       
    }catch(e){
        res.status(500).render('errpage',{err:e.message});
    }
    
}



const showProduct = async (req,res)=>{
    try{

        const { id }=req.params;
 //    for giving reference to review model use .populate('reviews') to sow review array
     const product= await Product.findById(id).populate('reviews');
     res.render('productstemp/show.ejs',{product});  // use populate to acess review array, as it refer: review collection
       
    }catch(e){
        res.status(500).render('errpage',{err:e.message});
    }
    

}

const editProductForm = async (req,res)=>{
    try{ 

        const { id }=req.params;
        const product= await Product.findById(id);

        res.render('productstemp/edit.ejs',{product});

       
    }catch(e){
        res.status(500).render('errpage',{err:e.message});
    }
    
}

const updateProduct = async (req, res) => {
    try{
        const { name, img, dec, price } = req.body;
        const { id }=req.params;
      await Product.findByIdAndUpdate(id, { name, img, dec, price });

       req.flash('success' , 'Product edited successfully');
       res.redirect(`/products/${id}`);
       
    }catch(e){
        res.status(500).render('errpage',{err:e.message});
    }
   
}

const deleteProduct = async (req, res) => {
    try{
    const { id }=req.params;
    await Product.findByIdAndDelete(id );

    req.flash('success' , 'Product deleted successfully');
    res.redirect(`/products`); 

    }catch(e){
        res.status(500).render('errpage',{err:e.message});
    }
    
}

module.exports = {showAllProducts , productForm , createProduct , showProduct , editProductForm , updateProduct , deleteProduct }