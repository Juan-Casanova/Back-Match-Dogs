const mongoose=require('mongoose');//conecccion a mongoose
const app=require('./app')//aqui se encuentra express
const PORT=3000;

//CONEXION DATABASE
mongoose.Promise=Promise;//promesa para conectar a mongodb
mongoose.connect('mongodb://localhost:27017/MatchDogs',{ useNewUrlParser: true })//coneccion a mongodb
.then(()=>{
    console.log('Connected to Mongo!')

    //CREAR SERVIDOR
    app.listen(PORT,()=>{
        console.log("TE ESCUHO EN EL PUERTO 3000");
    });
})
.catch(err=>console.log(err))

