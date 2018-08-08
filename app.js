require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
//require('./models/User')
//mongoose.model('User')
//const           =mongoose.model('User','./models/User');


mongoose.Promise=Promise;//promesa para conectar a mongodb
mongoose.connect('mongodb://admi:matchdogs2018@ds163781.mlab.com:63781/matchdogs',{useMongoClient: true})//coneccion a mongodb
.then(()=>{
    console.log('Connected to Mongo!')
})
.catch(err=>{
    console.error("Error connecting to mongo",err)
});

require('./models/User')
require('./models/Follow')

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));

app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
const follow=require('./routes/follow');
const user=require('./routes/user');
const publication=require('./routes/publication');
const message_routes=require('./routes/message')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/',follow);
app.use('/',user);
app.use('/',publication)
app.use('/',message_routes)


module.exports = app;
