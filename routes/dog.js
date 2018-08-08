const express=require('express');
const DogController=require('../controllers/dog');
const api=express.Router();
const md_auth=require('../middlewares/authenticated');
const uploadCloud = require('../helpers/cloudinary');

const multipart=require('connect-multiparty')
const md_upload=multipart({upload:'./uploads/dogs'});

api.get('/prueba-dog',md_auth.ensureAuth,DogController.probando);
api.post('/newdog',md_auth.ensureAuth,DogController.saveDog);
api.get('/dogs/:id?',md_auth.ensureAuth,DogController.getDogs);
api.get('/dog/:id',md_auth.ensureAuth,DogController.getDog);
api.delete('/dog/:id',md_auth.ensureAuth,DogController.deletedog);
 api.post('/upload-image-dog/:id',[md_auth.ensureAuth,md_upload],DogController.uploadImage);
 api.get('/get-image-dog/:imageFile',DogController.getImageFile);

module.exports=api;