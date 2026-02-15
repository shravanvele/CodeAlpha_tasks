const express = require("express");
const router = express.Router();
const passport = require('passport');
const userController = require("../controllers/users_controller");
const passwordController = require("../controllers/forgetPassword_controller");

// profile  routes
router.get("/profile/:id", passport.checkAuthentication, userController.profile);
router.post("/update/:id", passport.checkAuthentication, userController.update);

// sign-in routes
router.get("/sign-in", userController.signIn);

// sign-up routes
router.get("/sign-up", userController.signUp);

//  routes for create a new user
router.post("/create", userController.create);

// router for user login and create session 
router.post("/create-session",passport.authenticate('local',{failureRedirect: '/users/sign-in',}),userController.createSession);

router.get("/sign-out", userController.destroySession);

router.get("/auth/google", passport.authenticate('google', {scope: ['profile', 'email']}));  // expecting profile and email from google when google hit this route
router.get("/auth/google/callback", passport.authenticate('google', {failureRedirect: 'users/sign-in'}), userController.createSession); // we get the actual expected profile and email at this route

router.get("/forget", passwordController.renderForm);
router.post("/forgetPassword", passwordController.forgetPassword);
router.get("/setPassword", passwordController.setPassword);
router.post("/updatePassword", passwordController.updatePassword);

module.exports = router;