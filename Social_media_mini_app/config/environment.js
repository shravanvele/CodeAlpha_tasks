const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");
require("dotenv/config");

const logDirectory = path.join(__dirname, '../production_logs'); // when the server runs a folder named production_logs will be created with access.log inside it 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',   // all the logs will be deleted after 1 Day(rotate daily)
    path: logDirectory
});

const development = {
name: 'development',
asset_path: './assets',
session_cookie_key: 'somethingblabla',
db: process.env.MONGO_URI,
smtp: {
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: process.env.API_USER,
      pass: process.env.API_PASS,
    },
  },

  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  jwt_secret: "codeial",
  morgan: {
    mode: 'dev',
    options: {stream: accessLogStream}
}
}


const production = {
name: 'production',
asset_path: './public/assets',
session_cookie_key: process.env.SESSION_COOKIE_KEY,
db: process.env.MONGO_URI,
smtp: {
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: process.env.API_USER,
      pass: process.env.API_PASS,
    },
  },

  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  jwt_secret: process.env.JWT_SECRET,
  morgan: {
    mode: 'combined',
    options: {stream: accessLogStream}
}
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);