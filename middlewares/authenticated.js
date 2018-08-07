const jwt=require('jwt-simple');
const moment=require('moment');
const secret="bliss";

exports.ensureAuth=function(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message:"la peticion no tiene la cabecera de autentificacion"})
    }

    const token=req.headers.authorization.replace(/['"]+/g,'');     

    try {
        var payload=jwt.decode(token,secret);

        if(payload.exp<=moment().unix()){
            return res.status(401).send({
                message:"el token ha expirado"
            });
        }
    } catch (error) {
        return res.status(404).send({
            message:"el token no es valido"
        });
    }

    req.user=payload;

    next();
}