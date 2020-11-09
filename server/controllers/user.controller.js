const User = require("../models/user.model.js");
const { check, validationResult} = require("express-validator/check");

// Create and Save a new user
exports.create =  async (req, res) => {
   // Validate request
   if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a user
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
    active: req.body.active
  });

  
  // Save user in the database
  await User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the user."
      });
    else res.send(data);
  });
};

// Retrieve all users from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving users."
          });
        else res.send(data);
        // res.render('users/index', { data: data });
      });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found user with id ${req.params.userId}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving user with id " + req.params.userId
            });
          }
        } else res.send(data);
      });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  User.updateById(
    req.params.userId,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found user with id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating user with id " + req.params.userId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  User.remove(req.params.userId, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found user with id ${req.params.userId}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete user with id " + req.params.userId
            });
          }
        } else res.send({ message: `user was deleted successfully!` });
    });
};

// Delete all users from the database.
exports.deleteAll = (req, res) => {
  User.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all users."
          });
        else res.send({ message: `All users were deleted successfully!` });
      });
};

exports.signUp =  async (req, res) => {
  // Validate request
  if (!req.body) {
   res.status(400).send({
     message: "Content can not be empty!"
   });
 }

 const errors = validationResult(req);
 if (!errors.isEmpty()) {
     return res.status(400).json({
         errors: errors.array()
     });
 }

 // Create a user
 const user = new User({
   email: req.body.email,
   name: req.body.name,
   password: req.body.password,
   isAdmin: req.body.isAdmin,
   active: req.body.active
 });

 
 // Save user in the database
 await User.signUp(user, (err, data) => {
   if (err)
     res.status(500).send({
       message:
         err.message || "Some error occurred while creating the user."
     });
   else res.send(data);
 });
};


exports.login = async (req, res) => {

    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({
          errors: errors.array()
      });
  }
  
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  await User.login(user, (err, data) => {
    if (err) {
      if (err.kind) {
        res.status(401).send({
          message: `${err.kind}.`
        });
      } else {
        res.status(500).send({
          message: "Interal Server Error"
        });
      }
    } else res.send(data);
  });
};
