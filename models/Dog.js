const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const dogSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        //default:"../public/images/default-perro.jpg"
    },
    raze:{
        type:String,
        required:true
    },
    user:
        {
            type: Schema.ObjectId,
            ref: 'User'
        }
    ,
    vaccinated:{
        type:String,
        required:true
    },
    pedigree:{
        type:String,
        required:true
    }
},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'update_at'
    }
})
module.exports=require('mongoose').model('Dog',dogSchema);