//BASIC DATA OF DOGS    
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const dogSchema=new Schema({
    name:{
        type:string,
        required:true
    },
    image:{
        type:string,
        default:"../public/images/default-perro.jpg"
    },
    raze:{
        type:string,
        required:true
    },
    owner:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    vaccinated:{
        type:boolean,
        required:true
    },
    pedigree:{
        type:boolean,
        required:true
    }
},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'update_at'
    }
})
module.exports=require('mongoose').model('Dog',dogSchema);