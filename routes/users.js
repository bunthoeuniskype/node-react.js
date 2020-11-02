var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/index', { title: 'List user' });
});

router.post('/', function(req, res, next) {
  
  res.render('users/index', { title: 'List user' });
});

module.exports = router;
