const express = require('express');
const User=require('../models/user')
const router=express.Router();
const passport=require("passport");
router.get('/register',(req,res)=>{
    res.render('users/login')
})

router.post('/register',async(req,res)=>{
    try{
    const {email,newusername,newpassword,isAdmin}=req.body;
    const isAdminB=isAdmin === 'true'
    const u=new User({email,username:newusername,isAdmin:isAdminB});
    const registerUser=await User.register(u,newpassword)
    await registerUser.save();
    console.log(registerUser);
    res.redirect('/login')
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
})

router.get('/login',(req,res)=>{
    res.render('users/login')
})
router.post('/login',passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login' }),async(req,res)=>{
    console.log("Done")
    req.flash('success','welcome back');
    res.redirect('/register');
})
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}); 
module.exports=router;