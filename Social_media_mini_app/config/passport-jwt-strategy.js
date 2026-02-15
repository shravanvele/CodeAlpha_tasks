const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt; // helps to extract token from header
const User = require("../models/user");
const environment = require("./environment");

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: environment.jwt_secret
}

passport.use(new JWTStrategy(opts, async function(JWTPayload, done) {
    try {
        const user = await User.findById(JWTPayload._id);
        
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        console.log("Error in finding user from JWT:", err);
        return done(err, false);
    }
}));

module.exports = passport;