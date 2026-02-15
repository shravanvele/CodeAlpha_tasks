const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const environment = require("./environment")

// tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID: environment.clientID,
      clientSecret: environment.clientSecret,
      callbackURL: environment.callbackURL,
    },

    async function (accessToken, refreshToken, profile, done) {
      try {
        // find a user
        let user = await User.findOne({ email: profile.emails[0].value }).exec();

        console.log(accessToken, refreshToken);
        console.log(profile);

        if (user) {
          // if found, set this user as req.user
          return done(null, user);
        } else {
          // if not found, create the user and set it as req.user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          });

          return done(null, user);
        }
      } catch (err) {
        console.log("Error:", err);
        return done(err);
      }
    }
  )
);
module.exports = passport;
