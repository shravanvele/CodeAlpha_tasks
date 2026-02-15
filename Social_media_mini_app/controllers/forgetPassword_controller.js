const ForgetPassword = require("../models/forget_password");
const User = require("../models/user");
const send = require("../mailers/forgetPassword_mailer");
const crypto = require("crypto");

const tokenData = crypto.createHash("sha256").update("secret").digest("hex");

module.exports.forgetPassword = async function (req, res) {
  const isUserExist = await User.findOne({ email: req.body.email });
  try {
    if (isUserExist) {
      await ForgetPassword.create({
        user: isUserExist.id,
        access_token: tokenData,
      });
      send.sendMail(isUserExist);
      return {
        flashMessage: req.flash("success", "Link sent to your email!"),
        render: res.redirect("/users/sign-in"),
      };
    } else {
      req.flash("error", "Invalid Email!");
      res.redirect("back");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/users/sign-in");
  }
};

//render the page to insert the email to receive the password reset link
module.exports.renderForm = function (req, res) {
  return res.render("../views/mailers/forgetPassword/send_email", {
    title: "Codeial | Enter Email",
  });
};

//render the page to insert password and confirm password
module.exports.setPassword = function (req, res) {
  return res.render("mailers/forgetPassword/setPassword", {
    title: "Codeial | Set Password",
    token: tokenData,
  });
};

//update new password in db
module.exports.updatePassword = async function (req, res) {
  const resetToken = req.body.resetToken; // Get the reset token from the form
  if (req.body.password === req.body.confirm_password) {
    try {
      const resetPasswordEntry = await ForgetPassword.findOne({access_token: resetToken});
      if (resetPasswordEntry) {
        await User.findOneAndUpdate(
          { _id: resetPasswordEntry.user },
          { password: req.body.password },
          { new: true }
        );

        req.flash("success", "Password updated successfully");
        return res.redirect("/users/sign-in");
      } else {
        req.flash("error", "Invalid Request");
        return res.redirect("/users/sign-in");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    req.flash("error", "Passwords do not match");
    return res.redirect("back");
  }
};
