var path=require('path');
var fs=require('fs');
var moment=require('moment');
var mongoosePaginate=require('mongoose-pagination');

var Publication=require('../models/Publication');
var User=require('../models/User');
var Follow=require('../models/Follow');
var Dog=require('../models/Dog');

function probando(req,res){
    res.status(200).send({
        message:"HOLA VAMOS VAMOS"
    });
}

function saveDog(req,res){
    var params=req.body;
    if(!params.text){
        return res.status(200).send({message:"debes ingresar un nombre"});
    }

    var dog=new Dog();
    dog.name=params.text;
    dog.image='null';
    dog.user=req.user.sub;
    dog.raze=params.raze;
    dog.vaccinated='false';
    dog.pedigree='false';
    dog.created_at=moment().unix();


    dog.save((err,dogStored)=>{

        console.log(dogStored) 

        if(err) return res.status(500).send({message:'Error al guardar el perrito'});

        if(!dogStored){
           
            return res.status(404).send({message:"el perrito no ha sido guardada"});
        }

        return res.status(200).send({dog:dogStored});
    })

}

function getDogs(req,res){
    var page=1;
    if(req.params.page){
        page=req.params.page;
    }
    
    var itemsPerPage=4;

    Dog.find({user:req.user.sub}).populate('user').paginate(page,itemsPerPage,(err,publications,total)=>{
        if(err){ 
            console.log(err)
        return res.status(500).send({message:'Error añl devolver'});
        }
        if(!publications){
            console.log(publications)
            return res.status(404).send({message:"la publicacion no ha sido guardada"});
        }

        return res.status(200).send({
            total_items:total,
            pages:Math.ceil(total/itemsPerPage),
            page:page,
            publications
        });
        
    });
}

function getDog(req,res){
    var dogId=req.params.id;

    Dog.findById(dogId,(err,dog)=>{
       if(err) return res.status(500).send({message:'Error añl devolver'}); 
       if(!dog)return res.status(404).send({message:"no existe la publicacion"});
       return res.status(200).send({dog});
    });
}

function deletedog(req,res){
    var dogId=req.params.id;

    Dog.find({'user':req.user.sub, '_id':dogId}).remove(err=>{
        if(err) return res.status(500).send({message:'Error borrar la publi'});
        //if(!publicationremove)return res.status(404).send({message:'no se ha borrado el mensaje'});

        return res.status(200).send({message:"perro eliminada"});
    });
}
//update files images
function uploadImage(req,res){
    const dogId=req.params.id;

    if(req.files){
        var file_path=req.files.image.path;
        console.log(file_path)
        var file_split=file_path.split('\/')
        //console.log(file_split)
        var file_name=file_split[2];//es lo que se va enviar a la base de datos
        console.log(file_name)
        var ext_split=file_name.split('\.');
        var file_ext=ext_split[1];
        console.log(file_ext)

        if(file_ext=='png'|| file_ext=='jpg'||file_ext=='jpeg'||file_ext=='gif'){

            Dog.findOne({'user':req.user.sub,'_id':dogId}).exec((err,dog)=>{
                if(dog){
                     //update document the user login
                Dog.findByIdAndUpdate(dogId,{image:file_name},{new:true},(err,dogimUpdated)=>{
                
                if(err)return res.status(500).send({message:"Error en la peticion"});

                if(!dogimUpdated) res.status(404).send({message:"no se ha podido actualizar"});

                return res.status(200).send({dog:dogimUpdated}); 
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
    const path_file='./uploads/dogs/'+image_file;

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
    saveDog,
    getDogs,
    getDog,
    deletedog,
    uploadImage,
    getImageFile
}