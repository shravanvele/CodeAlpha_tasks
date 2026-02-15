const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use("/posts", require("./post"));
router.use("/comments", require("./comment"));
router.use('/likes', require('./likes'));

router.use("/api", require("./api"));

module.exports = router;