const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const messageSchema=new Schema({
    emitter:{
        type:Schema.ObjectId,
        ref:'User'
    },
    receiver:{
        type:Schema.ObjectId,
        ref:'User'
    },
        text:String
},{
    timestamps:{
        createdAt:"created_at",
        updatedAt:"update_at"
    }
});

module.exports=mongoose.model('Message',messageSchema);