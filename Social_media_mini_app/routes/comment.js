const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comments_controller");
const passport = require("passport");

router.post("/create", passport.checkAuthentication, commentController.create);
router.get("/delete/:id",passport.checkAuthentication,commentController.destroy);
  

module.exports = router;