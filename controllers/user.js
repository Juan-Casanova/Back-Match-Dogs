const User=require('../models/User');
const bcrypt=require('bcrypt-nodejs');
const jwt=require('../services/jwt');
//const User=require('../models/User');
const Follow=require('../models/Follow');
const mongoosePaginate=require('mongoose-pagination');
const fs=require('fs');
const path=require('path');

//test methods
function home(req,res){
    res.status(200).send({
        message:"pruebas en el servidor home"
    });
}

function pruebas(req,res){
    res.status(200).send({
        message:"pruebas en el servidor"
    });
}

//REGITRY
function saveUser(req,res){
    var params=req.body;
    var user=new User();

    if(params.name&&
        params.adress&&
        params.email&&
        params.nickname&&
        params.password)
    {
            user.name=params.name;
            user.adress=params.adress;
            user.email=params.email;
            user.nickname=params.nickname;
            user.image=null;

            //Saber si el usuario ya esta registrado o no
            User.find({$or:[
                {email:user.email},
                {nickname:user.nick}
            ]})//toLowerCase es para pasarlo a minusculas
            .exec((err,users)=>{
                if(err)return res.status(500).send({message:"Error en la peticion de usuario"});
                
                if(users&&users.length>=1)
                {
                    return res.status(200).send({user:"el usuario ya existe"});
                }
                else{
                        //enciptacion de la contraseña y guarda los datos
                         bcrypt.hash(params.password,null,null,(err,hash)=>{
                        user.password=hash;

                        user.save((err,userStored)=>{
                        if(err)return res.status(500).send({message:"Error al guardar el usuario"});
                        if(userStored){
                         res.status(200).send({user:userStored});
                        }else{
                             res.status(404).send({message:"no se ha registrado el usuario"});
                             }
                        });
                    });
                }
            });            
    }
    else{
        res.status(200).send({
            message:"llena todos los campos necesarios"
        });
    }
}

//LOGIN
function loginUser(req,res){
    const params=req.body;
    const email=params.email;
    const password=params.password;

    User.findOne({email:email},(err,user)=>{
        if(err)return res.status(500).send({message:"error en la peticion"});
        if(user){
            bcrypt.compare(password,user.password,(err,check)=>{//comprobar si las contraseñas son iguales
                if(check){
                    if(params.gettoken){                    
                        //devolver un token
                        return res.status(200).send({
                            token:jwt.createToken(user) 
                        });
                    }
                    else{                  
                        user.password=undefined;//ya no se devulve el password
                    return res.status(200).send({user});
                    }                    
                }
                else{
                    return res.status(404).send({message:"contraseña incorrecta"});
                }
            });
        }
        else{
            return res.status(404).send({message:"el usuario no se ha podido identificar"});
        }
    });
}

//FAIND USER
function getUser(req,res){
    const userId=req.params.id;

    User.findById(userId,(err,user)=>{
        if(err)return res.status(500).send({message:"Error en la peticion"});

        if(!user)return res.status(404).send({message:"el usuario no existe"});
        followThisUser(req.user.sub,userId)
        .then((value)=>{
            user.password=undefined;
            return res.status(200).send({user,
                following:value.following,
                followed:value.followed});
        });           
    });
}

//function asin
async function followThisUser(identity_user_id,user_id){
    var following= await Follow.findOne({"user":identity_user_id,"followed":user_id}).exec((err,follow)=>{
        if(err) returnhandleError(err);
        return follow;
    });

    var followed=await Follow.findOne({"user":user_id,"followed":identity_user_id}).exec((err,follow)=>{
        if(err) returnhandleError(err);
        return follow;
    });

    return{
        following:following,
        followed:followed
    }
}

//FIND USERS
function getUsers(req,res){
    const identity_user_id = req.user.sub;  //recoger el id del usuario que este logeado

    var page=1

    if(req.params.page){
        page=req.params.page;
    }
    
    var itemsPerPage=5;

    User.find().sort('_id').paginate(page,itemsPerPage, (err,users,total)=>{//ESta funcion de paginate es acomodarlos por pagina primer valor pagina, segundo valor cuantos por pagina
        if(err)return res.status(500).send({message:"Error en la peticion"});

        if(!users)return res.status(404).send({message:"no hay usuarios disponibles en la plataforma"});

        followUserIds(identity_user_id)
        .then((value)=>{
            return res.status(200).send({
                users,
                users_following:value.following,
                users_follow_me:value.followed,
                total,
                pages:Math.ceil(total/itemsPerPage)
            });
        }) ;        
    });
    
}

async function followUserIds(user_id){
    var following= await Follow.find({"user":user_id}).select({'_id':0,'__v':0,'user':0}).exec((err,follows)=>{
       return follows;
    });

    var followed= await Follow.find({"followed":user_id}).select({'_id':0,'__v':0,'followed':0}).exec((err,follows)=>{
       return follows;
    });
    var following_clean=[];

    following.forEach((follow)=>{
        following_clean.push(follow.followed);
    });
    
    var followed_clean=[];

    followed.forEach((follow)=>{
        followed_clean.push(follow.user);
    });
    

    return{
         following:following_clean,
         followed:followed_clean
    }
}

function getCounters(req,res){
    var userId=req.user.sub;
    if(req.params.id){
        userId=req.params.id;
    }
    
        getCountFollow(userId)
        .then((value)=>{
            return res.status(200).send(value);
        });
    
}

async function getCountFollow(user_id){
    var following=await Follow.count({"user":user_id}).exec((err,count)=>{
        if(err)return handleError(err);
        return count;
    });

    var followed=await Follow.count({"followed":user_id}).exec((err,count)=>{
        if(err)return handleError(err);
        return count;
    });
    return{
        following:following,
        followed:followed
    }
}

//UPDATE DATE OF ONE USER
function updateUser(req,res){
    const userId=req.params.id;//se obtiene por la url
    const update =req.body;

    //DELETE PROPITARY THE PASSWORD
    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({message:"no tienes permiso de modificar los datos"});
    }

    User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdate)=>{
        if(err)return res.status(500).send({message:"Error en la peticion"});

        if(!userUpdate) res.status(404).send({message:"no se ha podido actualizar"});

        return res.status(200).send({user:userUpdate});
    })
}

//update files images
function uploadImage(req,res){
    const userId=req.params.id;

    if(req.files){
        const file_path=req.files.image.path;
        const file_split=file_path.split('\\')
        const file_name=file_split[2];//es lo que se va enviar a la base de datos
        const ext_split=file_name.split('\.');
        const file_ext=ext_split[1];

        if(userId != req.user.sub){
           return removeFilesOfUploads(res,file_path,"o tienes permiso de modificar los datos")
        }

        if(file_ext=='png'|| file_ext=='jpg'||file_ext=='jpeg'||file_ext=='gif'){
            //update document the user login
            User.findByIdAndUpdate(userId,{image:file_name},{new:true},(err,userUpdated)=>{
                
                if(err)return res.status(500).send({message:"Error en la peticion"});

                if(!userUpdate) res.status(404).send({message:"no se ha podido actualizar"});

                return res.status(200).send({user:userUpdate}); 
            });
        }
        else{
           return removeFilesOfUploads(res,file_path, "extencion no valida")
        }
    }
    else{
        return res.status(200).send({message:"no se han subido imagen"});
    }
}

//IMAGES THE USER
function getImageFile(req,res){
    const image_file=req.params.imageFile;
    const path_file='./uploads/users/'+image_file;

    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }
        else{
            res.status(200).send({message:'No existe la imagen'});
        }
    });
}
//FUNCTIONS AUXILIARS  
function removeFilesOfUploads(res,file_path, message){
    fs.unlink(file_path, (err)=>{
        if(err)return res.status(200).send({message:message});
    });
}

//las function export
module.exports={
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
}