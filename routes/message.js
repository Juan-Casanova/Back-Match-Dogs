const express=require('express');
const MessageController=require('../controllers/menssage');
const api=express.Router();
const md_auth=require('../middlewares/authenticated');

api.get('/probando-md',md_auth.ensureAuth,MessageController.probando);
api.post('/menssage',md_auth.ensureAuth,MessageController.saveMessage);
api.get('/my-menssages/:page?',md_auth.ensureAuth,MessageController.getRecivedMenssage);
api.get('/menssages/:page?',md_auth.ensureAuth,MessageController.getEmmitMenssage);
api.get('/unview-messages',md_auth.ensureAuth,MessageController.getNotView);
api.get('/set-view-messages',md_auth.ensureAuth,MessageController.setViewMessages)

module.exports=api;