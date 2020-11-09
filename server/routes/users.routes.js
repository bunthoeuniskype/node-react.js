var express = require('express');
var router = express.Router();
const users = require("../controllers/user.controller.js");
const { validateUserLogin, validateUserSingUp } = require("../validators/user.validator")

// login user
router.post("/login", validateUserLogin, users.login);

//signUp  user
router.post("/signup", validateUserSingUp, users.signUp);

// Create a new user
router.post("/users", users.create);

// Retrieve all users
router.get("/users", users.findAll);

// Retrieve a single user with userId
router.get("/users/:userId", users.findOne);

// Update a user with userId
router.put("/users/:userId", users.update);

// Delete a user with userId
router.delete("/users/:userId", users.delete);

// Create a new user
router.delete("/users", users.deleteAll);

module.exports = router;
