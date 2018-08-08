var path=require('path');
var fs=require('fs');
var moment=require('moment');
var mongoosePaginate=require('mongoose-pagination');

var Publication=require('../models/Publication');
var User=require('../models/User');
var Follow=require('../models/Follow');

function probando(req,res){
    res.status(200).send({
        message:"HOLA VAMOS VAMOS"
    });
}

function savePublication(req,res){
    var params=req.body;
    if(!params.text){
        return res.status(200).send({message:"debes ingresar un texto"});
    }

    var publication=new Publication();
    publication.text=params.text;
    publication.file='null';
    publication.user=req.user.sub;
    publication.created_at=moment().unix();

    publication.save((err,publicationStored)=>{

        console.log(publicationStored) 

        if(err) return res.status(500).send({message:'Error al guardar la publicacion'});

        if(!publicationStored){
           
            return res.status(404).send({message:"la publicacion no ha sido guardada"});
        }

        return res.status(200).send({publication:publicationStored});
    })

}

function getPublications(req,res){
    var page=1;
    if(req.params.page){
        page=req.params.page;
    }
    
    var itemsPerPage=4;

    Follow.find({user:req.user.sub}).populate('followed').exec((err,follows)=>{

        if(err) return res.status(500).send({message:'Error añl devolver el publicacion'});

        var follows_clean=[];

        follows.forEach((follow)=>{
            follows_clean.push(follow.followed);
        });

        Publication.find({user:{"$in":follows_clean}}).sort('-created_at').populate('user')
        .paginate(page,itemsPerPage,(err,publications,total)=>{
            if(err) return res.status(500).send({message:'Error añl devolver'});
            if(!publications)return res.status(404).send({message:"la publicacion no ha sido guardada"});

            return res.status(200).send({
                total_items:total,
                pages:Math.ceil(total/itemsPerPage),
                page:page,
                publications
            });
        });

    });
}

function getPublication(req,res){
    var publicationId=req.params.id;

    Publication.findById(publicationId,(err,publication)=>{
       if(err) return res.status(500).send({message:'Error añl devolver'}); 
       if(!publication)return res.status(404).send({message:"no existe la publicacion"});
       return res.status(200).send({publication});
    });
}

function deletePublication(req,res){
    var publicationId=req.params.id;

    Publication.find({'user':req.user.sub, '_id':publicationId}).remove(err=>{
        if(err) return res.status(500).send({message:'Error borrar la publi'});
        //if(!publicationremove)return res.status(404).send({message:'no se ha borrado el mensaje'});

        return res.status(200).send({message:"publicacion eliminada"});
    });
}
//update files images
function uploadImage(req,res){
    const publicationId=req.params.id;

    if(req.files){
        var file_path=req.files.image.path;
        console.log(file_path)
        var file_split=file_path.split('\/')
        //console.log(file_split)
        var file_name=file_split[2];//es lo que se va enviar a la base de datos
        //console.log(file_name)
        var ext_split=file_name.split('\.');
        var file_ext=ext_split[1];
        //console.log(file_ext)

        if(file_ext=='png'|| file_ext=='jpg'||file_ext=='jpeg'||file_ext=='gif'){

            Publication.findOne({'user':req.user.sub,'_id':publicationId}).exec((err,publication)=>{
                if(publication){
                     //update document the user login
                Publication.findByIdAndUpdate(publicationId,{file:file_name},{new:true},(err,publicationUpdated)=>{
                
                if(err)return res.status(500).send({message:"Error en la peticion"});

                if(!publicationUpdated) res.status(404).send({message:"no se ha podido actualizar"});

                return res.status(200).send({publication:publicationUpdated}); 
            });
                }
                else{
                    return removeFilesOfUploads(res,file_path, "no tienes permiso para actualizar esta publicacion")
                }
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
    const path_file='./uploads/publication/'+image_file;

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

module.exports={
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}