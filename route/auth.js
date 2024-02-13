const express=require("express");
const passport = require('passport'); // for using authenticate middleware and .register 
const User = require("../model/User");
const router=express.Router();

//1 .signup-------------->
router.get('/register',(req,res)=>{
    res.render('auth/signup.ejs');
});

  //add the user data to userDB
router.post('/register',async(req,res)=>{
    const {email,password,username,role}=req.body;
    const user=new User({email,username,role});
    const newuser=await User.register(user,password);//add slat with passward and save it in hash form user DB
    // res.send(newuser);                            //static method of PLM
    req.flash('success' , 'welcome,  you are registed succesfully');
    res.redirect('/login');
});

//signup end---------------------->




//login part----------------->
router.get('/login',(req,res)=>{
    res.render('auth/login.ejs');
});

  //add the user data to userDB
                                             //stetergy-local 
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' })
,(req,res)=>{
    // console.log(req.user);
    req.flash('success' , 'welcome back')
    res.redirect('/products');
});






//logout part ----------------->
router.get('/logout',(req,res)=>{
//    ()=>{
//     req.logout(); }//always call in callback fun

//     req.flash('success' , 'goodbye friends, see you again')
//    res.redirect('/login');
   req.logout(()=>{
    req.flash('success' , 'goodbye friend');
    res.redirect('/login');
});
});



module.exports=router;