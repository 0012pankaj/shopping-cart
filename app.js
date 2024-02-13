if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express=require("express");
const app=express();
const path=require("path");
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const MongoStore = require('connect-mongo');

// require("dotenv").config();
const cors = require('cors');
// Allow all CORS HTTP  requests from all origin use for paymentgateway
app.use(cors());

const flash = require('connect-flash');
const session = require('express-session');


//first install than import for passport-------
const User = require('./model/User');
const passport=require('passport');
const  LocalStrategy=require('passport-local');
// ----------------------

const dbURL = process.env.db_URL;
mongoose.set('strictQuery', true);
mongoose.connect(dbURL)
.then(()=>console.log("DB connected"))
.catch((err)=> console.log(err))


const secret=process.env.SECRET;

let store = MongoStore.create({
    secret:secret,
    mongoUrl: dbURL,
    touchAfter:24*60*60
})


// 1.session ------------

app.use(session({
    store:store,
    secret: secret,
    resave: true,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true ,
        expires: Date.now() + 7*24*60*60*1000 , //expire in 7 days 
        maxAge:24*7*60*60*1000
    }
}));




//-----------------------------------


//2.PASSPORT----------------------------
                   //midllewares
//1 Initialize Passport
app.use(passport.initialize());
app.use(passport.session()); 

             // 2copy from PLM... 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ----------------------------------------------------------

app.use(flash());

//3 self created middleware 
app.use((req,res,next)=>{
    res.locals.currentUser=req.user; //to store curent user who log in info in local storage
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//set some property
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));


app.engine('ejs',ejsMate);//instal andd req first and then set engin for ejs as ejs mate
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method')); //over ride post request of update to patch request



app.get('/' , (req,res)=>{
    res.render('home');
})



//if create rout the use route in app.js
const productrouts=require('./route/productroute');
app.use(productrouts);
const reviewrouts=require('./route/reviewroutes');
app.use(reviewrouts);
const authroute=require('./route/auth');
app.use(authroute);
const cartrouts=require('./route/cart');
const Product = require("./model/product");
app.use(cartrouts);
const productapi=require('./route/api/productapi');
app.use(productapi);
const paymentroute=require('./route/payment');
app.use(paymentroute);

const {isCartNoEmpty}=require('./middelware')

// //--------------------stripe payment gateway work
const stripe = require("stripe")(process.env.STRIPE_SECRET);
app.post("/create-checkout-session",isCartNoEmpty,async(req,res)=>{
    const {totalamount} = req.body;
  
    const customer = await stripe.customers.create({
        email: req.user.email, // Use the email of the authenticated user
        name:req.user.username,
   
    });
   
        const lineItems = await Promise.all(req.user.cart.map(async (productid) => {
            // Find the product by its ID
            const product = await Product.findById(productid);
    
            // Ensure that the product is found
            if (!product) {
                throw new Error(`Product with ID ${productid} not found`);
            }
    
            // Return the line item object
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.img]
                    },
                    unit_amount: product.price*100,
                },
                quantity: 1 
            };
        }));
    // Handle the error appropriately

    
    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:'http://localhost:5000/payment/success',
        cancel_url:'http://localhost:5000/payment/fail',
        customer: customer.id
    });

    res.redirect(session.url);
 
})

app.all('*', (req, res) => { 
    res.render('errpage', { err: 'You are requesting a wrong url!!!' })
});


const port=5000;

app.listen(port,()=>{
    console.log(`conncted at ${port}`);
})