const User = require("../models/user");
const fs = require('fs');
const path = require('path');

module.exports.profile = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if(user) {
      return res.render("User_profile", {
        title: "User",
        profile_user: user
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: error.message });
  }
};

// update user profile-image and name and email
module.exports.update = async (req, res) => {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, async function (err) {
        if (err) {
          console.log("multer Error", err);
        }
        user.name = req.body.name;
        user.email = req.body.email;

        if(req.file) {
          if (user.avatar) {
            const avatarFilePath = path.join(__dirname, '..', user.avatar);
            if (fs.existsSync(avatarFilePath)) {
              try {
                fs.unlinkSync(avatarFilePath);
                console.log("Previous avatar deleted:", avatarFilePath);
              } catch (unlinkErr) {
                console.error("Error deleting previous avatar:", unlinkErr);
              }
            } else {
              console.log("Previous avatar does not exist:", avatarFilePath);
            }
          }
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        await user.save();
        req.flash("success", "Profile updated successfully");
        return res.redirect("back");
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "An error occurred");
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized");
    return res.status(401).send("Unauthorized");
  }
}


//render the signUp page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

//render the signIn page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

//get the signup data
module.exports.create = async (req, res) => {
  try {
    if (req.body.password != req.body.confirm_password) {
      req.flash('error', 'Password and confirm password should be same')
      return res.redirect("back");
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      await User.create(req.body);
      return res.redirect("/users/sign-in");
    } else {
      req.flash('error', 'Email Already Registered');
      return res.redirect("back");
    }
  } catch (error) {
    if (error.name.toLowerCase() === "validationerror") {
      return res.status(500).json({ Error: error.message });
    }
    return error;
  }
};

//sign in and create session for the user
module.exports.createSession = async function (req, res) {
  req.flash('success', 'Logged In Successfully');
  return res.redirect('/'); 
};

// sign-out the session
module.exports.destroySession = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logged Out Successfully');
    return res.redirect("/");
  });
};
