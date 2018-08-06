const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const publicationSchema= new Schema({
    text:String,
    file:String,
    user:{
        type:Schema.ObjectId,
        ref:'User'
    }
},{
    timestamps:{
        createdAt:"created_at",
        updatedAt:"update_at"
    }
});

module.exports=mongoose.model('Publication',publicationSchema);