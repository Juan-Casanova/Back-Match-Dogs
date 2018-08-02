const mongoose = require('mongoose')
const Schema=require('mongoose').Schema;

const dateloveSchema=new Schema({
    dogs:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    place:{
        type:string,
        required:true
    },
    owners:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    date:{
        type:Date,
        required:true
    }
},{
    timestamps:{
        createdAt:"created_at",
        updatedAt:"update_at"
    }
});

module.exports=mongoose.model('Datelove',dateloveSchema);