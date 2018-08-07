const path=require('path');
//const fs=require('fs');
const mongoosePaginate=require('mongoose-pagination');

const User=require('../models/User');
const Follow=require('../models/Follow');

//FOLLOW USER
function saveFollow(req,res){
    const params=req.body;
    const follow=new Follow();

    follow.user=req.user.sub;
    follow.followed=params.followed;

    follow.save((err,followStored)=>{
        
        if(err)return res.status(500).send({message:"error al guardar el seguimiento"});

        if(!followStored)return res.status(404).send({message:"el seguimiento no se ha guardado"});

        return res.status(200).send({follow:followStored});
    });
}

//DELETE FOLLOW
function deleteFollow(req,res){
    const userId=req.user.sub;
    const followId=req.params.id;

    Follow.find({'user':userId,'followed':followId}).remove(err=>{
        if(err)return res.status(500).send({message:"error al intentar de dejar de seguir"});

        return res.status(200).send({message:"el follow se ha eliminado"})
    })
}

//FIND FOLLOWS
function getFollowingUsers(req,res){
    var userId=req.user.sub;

    if(req.params.id&&req.params.page){
        userId=req.user.sub;
    }

    var page=1;

    if(req.params.page){
        page=req.params.page;
    }
    else{
        page=req.params.id;
    }

    var itemsPerPage=4;

    Follow.find({user:userId}).populate({path:'followed'}).paginate(page,itemsPerPage,(err,follows,total)=>{
        if(err){
            console.log(err);
            return res.status(500).send({message:"error en el servidor"});
        }
            


        if(follows==0)return res.status(404).send({message:"No estas siguiendo a ningun usuario"});

        return res.status(200).send({
            total:total,
            pages:Math.ceil(total/itemsPerPage),
            follows
        });
    });
}

function getFollowedUser(req,res){
    var userId=req.user.sub;

    if(req.params.id&&req.params.page){
        userId=req.user.sub;
    }

    var page=1;

    if(req.params.page){
        page=req.params.page;
    }
    else{
        page=req.params.id;
    }

    var itemsPerPage=4;

    Follow.find({followed:userId}).populate('user').paginate(page,itemsPerPage,(err,follows,total)=>{
        if(err){
            console.log(err);
            return res.status(500).send({message:"error en el servidor"});
        }           


        if(follows==0)return res.status(404).send({message:"No te sigue ningun usuario"});

        return res.status(200).send({
            total:total,
            pages:Math.ceil(total/itemsPerPage),
            follows
        });
    });
}

//list users following
function getMyFollows(req,res){
    var userId=req.user.sub;

    var find=Follow.find({user:userId});

    if(req.params.followed){
        find=Follow.find({followed:userId})
    }

        find.populate('user followed').exec((err,follows)=>{
        if(err){
            console.log(err);
            return res.status(500).send({message:"error en el servidor"});
        }   
        if(follows==0)return res.status(404).send({message:"No sigues a ningun usuario"});

        return res.status(200).send({follows});
    });
}



module.exports={
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUser,
    getMyFollows
}