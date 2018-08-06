//AQUI SE VA CONFIGURAR TODO LO DE EXPRESS

const express=require('express')
const bodyParser=require('body-parser')//convierte a un objeto de js
const cors=require('cors')

const app=express();//aqui nos carga el framework

//cargar rutas
const user_routes=require('./routes/user');
const follow_routes=require('./routes/follow');

//cargar middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());//convertir lo que llegue a json

//cors
app.use(cors());
//rutas
app.use('/',user_routes);
app.use('/',follow_routes);

//exportar confi
module.exports=app;