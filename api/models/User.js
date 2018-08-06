var mongoose=require('mongoose');
var Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"../public/images/default_usuario.jpg"
    },
    dog:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    adress:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    nickname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:{
        createdAt:"created_at",
        updatedAt:"update_at"
    }
});

module.exports=mongoose.model('User',userSchema)