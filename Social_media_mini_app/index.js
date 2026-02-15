const express = require('express');
const app = express();
const environment = require("./config/environment");
require('./config/view-helpers')(app);
const logger = require("morgan");
const path = require("path");
const uploads=path.join(__dirname,'uploads');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require("connect-mongo");
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets =  require('./config/chat_sockets').chatSockets(chatServer);

const io = require("socket.io")(chatServer, {
  cors: {
    origin: process.env.PORT ? `https://codeial-gu73.onrender.com/users/setPassword` : 'http://localhost:8000/users/setPassword',
    methods: ["GET", "POST"]
  }
});
chatServer.listen('5000').close();
console.log("Chat server is listening on port 5000");

if(environment.name == 'development') {
  app.use(sassMiddleware({
    src: path.join(__dirname, environment.asset_path, 'scss'),
    dest: path.join(__dirname, environment.asset_path, 'css'),
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css' 
  }));
}

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(environment.asset_path));
//make the uploads path available to the browser
app.use("/uploads",express.static(__dirname + "/uploads"));
app.use(logger(environment.morgan.mode, environment.morgan.options));
app.use(expressLayouts);
//extract style and script from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(
  session({
    name: 'codeial',
    secret: environment.session_cookie_key,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // cookie valid for 24 hours
    store:MongoStore.create({mongoUrl:process.env.MONGO_URI}),
  })
);

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(passport.setAuthenticatedUser);
  app.use(flash());
  app.use(customMware.setFlash);

  //use express route
  app.use('/', require('./routes'));
  
app.listen(port, function(err) {
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on the port: ${port}`);
});