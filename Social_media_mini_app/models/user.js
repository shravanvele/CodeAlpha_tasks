const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type:String
    }
}, {
    timestamps: true
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();   // if two or more users uploads the file by same name , this will append date in milliseconds to differentiate
      cb(null, file.fieldname + '-' + uniqueSuffix) // fieldname store every file that is being uploaded as avatar-uniqueSuffix(avatar is the column name)
    }
  });

  //static methods
  userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar'); 
  userSchema.statics.avatarPath = AVATAR_PATH; // making avatarPath public/globally accessible  

const User = mongoose.model('User', userSchema);

module.exports = User;