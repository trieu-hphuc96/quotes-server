var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// database libs
var bodyParser = require('body-parser');

// custtom libs

// my
var consoleFontColors = require('./variables/console-font-colors');

// routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var quotesRouter = require('./routes/quotes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
var dbConfig = require('./config/database.config.js');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true
}).then(() => {
  // eslint-disable-next-line no-console
  console.log(consoleFontColors['bright-green'] + 'Successfully connected to the database!' + '\n' + consoleFontColors['default']);
}).catch(err => {
  // eslint-disable-next-line no-console
  
  console.log(consoleFontColors['bright-red'] + err + '\n' + consoleFontColors['default']);
  process.exit();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quotes', quotesRouter);

// Require Notes routes
require('./src/app/routes/note.routes.js')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
