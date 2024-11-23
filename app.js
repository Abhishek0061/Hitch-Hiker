var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var logger = require('morgan');
var cors = require('cors');
var session = require('express-session');

let indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const bodyParser = require('body-parser');
// var empRouter = require('./routes/employee');
// var twtRouter = require("./routes/tweets");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'Minal',
  resave: true,
  saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads",express.static(path.join(__dirname, 'uploads')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;