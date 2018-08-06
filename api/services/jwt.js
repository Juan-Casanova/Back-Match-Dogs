const jwt = require('jwt-simple');
const moment=require('moment');
const secret="bliss";

exports.createToken = function(user){
    var payload={
        sub:user._id,
        name:user.name,
        nickname:user.nickname,
        email:user.email,
        image:user.image,
        iat:moment().unix(),
        exp:moment().add(30,'days').unix
    };
    return jwt.encode(payload, secret);
};