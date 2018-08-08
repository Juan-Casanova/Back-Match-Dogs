const moment=require('moment');
const mongoosePaginate=require('mongoose-pagination');

const User=require('../models/User');
const Follow=require('../models/Follow');
const Message=require('../models/Message');


function probando(req,res){
    res.status(200).send({message:"hola"});
}

function saveMessage(req,res){
    var params=req.body;

    if(!params.text || !params.receiver)return res.status(400).send({message:"Envia todos los dato"});
    
    var message=new Message();

    message.emitter=req.user.sub;
    message.receiver=params.receiver;
    message.text=params.text;
    message.created_at=moment().unix(); 
    message.viewed='false';

    message.save((err,menssageStored)=>{
        if(err)return res.status(500).send({message:"error en la peticion"});

        if(!menssageStored)return res.status(500).send({message:"error al enviar mensaje"});

        return res.status(200).send({menssge:menssageStored});
    })
}

function getRecivedMenssage(req,res){
    var userId=req.user.sub;

    var page=1;
    if(req.params.page){
        page=req.params.page;
    }

    var itemsPerPage=4;

    Message.find({receiver:userId}).populate('emitter').paginate(page,itemsPerPage,(err,menssages,total)=>{
        if(err)return res.status(500).send({message:"error en la peticion"});

        if(!menssages)return res.status(404).send({message:"no hay mensajes"});

        return res.status(200).send({
            total:total,
            pages: Math.ceil(total/itemsPerPage),
            menssages
        });
    });
}

function getEmmitMenssage(req,res){
    var userId=req.user.sub;

    var page=1;
    if(req.params.page){
        page=req.params.page;
    }

    var itemsPerPage=4;

    Message.find({emitter:userId}).populate('emitter receiver').paginate(page,itemsPerPage,(err,menssages,total)=>{
        if(err)return res.status(500).send({message:"error en la peticion"});

        if(!menssages)return res.status(404).send({message:"no hay mensajes"});

        return res.status(200).send({
            total:total,
            pages: Math.ceil(total/itemsPerPage),
            menssages
        });
    });
}

function getNotView(req,res){
    var userId=req.user.sub;

    Message.count({receiver:userId, viewed:'false'}).exec((err,count)=>{
        if(err) return res.status(500).send({message:"error en la peticion"});
        return res.status(200).send({
            'unviewed':count
        })
    })
}

function setViewMessages(req,res){
    var userId=req.user.sub;

    Message.update({receiver:userId, viewed:'false'},{viewed:'true'},{"multi":true},(err,messageupdate)=>{
        if(err)return res.status(500).send({message:"error en la peticion"});
        return  res.status(200).send({
            messages:messageupdate
        })
    })
}

module.exports={
    probando,
    saveMessage,
    getRecivedMenssage,
    getEmmitMenssage,
    getNotView,
    setViewMessages
}