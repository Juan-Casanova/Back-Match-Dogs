const router=require('express').Router();
const User=require('../models/Owner');
const passport=require('passport');


//mid
function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.json({message:"no tienes permiso"})
    }
}



router.get('/logout',(req,res,next)=>{
    req.logout();
    res.send("se cerro chico");
})

router.get('/profile',isAuthenticated,(req,res,next)=>{
    Owners.find()
    .then(owners=>res.json(owners))
    .catch(e=>(e))
})

router.post('/login',passport.authenticate('local'),(req,res,next)=>{
    res.json();
})

router.post('/signup',(req,res,next)=>{
    Owner.register(req.body,res.body.password)
    .then(user=>{
        res.json(user)
    })
    .catch(e=>next(e))
})

module.exports=router;