const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const followSchema= new Schema({
    user:{
        type:Schema.ObjectId,ref:''
    },
    followed:{
        type:Schema.ObjectId,ref:''
    }
});

module.exports=mongoose.model('Follow',followSchema);