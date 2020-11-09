var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')

var usersRouter = require('./routes/users.routes');
var customersRouter = require('./routes/customer.routes');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jsx');
// var options = { beautify: true };
// app.engine('jsx', require('express-react-views').createEngine(options));

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(logger('dev'));
// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', usersRouter);
app.use('/api', customersRouter);

if (process.env.NODE_ENV && process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/*', (req, res) => {
      res.sendFile('build/index.html', { root: __dirname })
  })
}else{
  app.use(express.static(path.join(__dirname, '../public')));
  app.get('/*', (req, res) => {
      res.sendFile('../public/index.html', { root: __dirname })
  })
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('err', err);
  res.sendFile('views/error.html', { root: __dirname })
});

module.exports = app;
