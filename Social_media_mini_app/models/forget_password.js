const mongoose = require("mongoose");

const forgetPasswordSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    access_token:{
        type: String,
        required: true
    }
},{
    timestamps: true
});

const ForgetPassword = mongoose.model('ForgetPassword', forgetPasswordSchema);
module.exports = ForgetPassword;