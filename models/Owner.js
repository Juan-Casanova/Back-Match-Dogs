//BASIC DATA OF USERS
const passportLocalMongoose=require("passport-local-mongoose")
const mongoose = require('mongoose')
const Schema=require('mongoose').Schema;

const ownerSchema=new Schema({
    name:{
        type:string,
        required:true
    },
    image:{
        type:string,
        default:"../public/images/default_usuario.jpg"
    },
    dog:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    adress:{
        type:string,
        required:true
    }
},{
    timestamps:{
        createdAt:"created_at",
        updatedAt:"update_at"
    }
});

module.exports=mongoose.model('Owner',ownerSchema);