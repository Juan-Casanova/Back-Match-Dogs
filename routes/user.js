const express=require('express');
const UserController=require('../controllers/user');
//const mongoose=require('mongoose');
//const User=mongoose.model('User');

const api=express.Router();//este es pra tener acceso al CRUD 
const md_auth=require('../middlewares/authenticated');

const multipart=require('connect-multiparty');
const md_upload=multipart({uploadDir:"./uploads/users"})

api.get('/home',UserController.home);
api.get('/pruebas',md_auth.ensureAuth,UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.get('/user/:id',md_auth.ensureAuth,UserController.getUser);
api.get('/users/:page?',md_auth.ensureAuth,UserController.getUsers);
api.get('/counters/:id?',md_auth.ensureAuth,UserController.getCounters);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.post('/upload-image/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);
api.get('/get_image_user/:imageFile',UserController.getImageFile);

module.exports=api;