const mongoose = require('mongoose')
const Schema=require('mongoose').Schema;

const dateloveSchema=new Schema({
    dogs:[
        {
            type: Schema.ObjectId,
            ref: 'Dog'
        }
    ],
    place:{
        type:string,
        required:true
    },
    owners:[
        {
            type: Schema.ObjectId,
            ref: 'User'
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