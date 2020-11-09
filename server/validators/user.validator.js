const { check, validationResult} = require("express-validator/check");

exports.validateUserSingUp = [
    check("name", "Please Enter a Valid name")
    .not()
    .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
        min: 6
    })
];


exports.validateUserLogin = [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
        min: 6
    })
];