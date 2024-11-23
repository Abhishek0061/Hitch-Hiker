var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const database = require("../models");

const multer = require('multer');
const uploader = multer({dest: "uploads"});

/* TO SYNC OUR DATABASE TO ALL THE MODELS */
database.sequelize.sync();

/* GET USERS LISTING. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
