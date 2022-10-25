require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cookieSession = require('./middlewares/cookieSession');

var app = express();

const methoOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'..', 'public')));

app.use(methoOverride('_method'));
app.use(session({
  secret : 'HacheQ@poyoUNiV€rsiT@rio',
  resave: false,
  saveUninitialized : true
}))
app.use(cookieSession);
app.use(passport.initialize());
app.use(passport.session());


/* ROUTES */
app
  .use('/', require('./routes/main'))
  .use('/faculties', require('./routes/faculties'))
  .use('/careers', require('./routes/careers'))
  .use('/categories', require('./routes/categories'))
  .use('/universities', require('./routes/universities'))
  .use('/courses', require('./routes/courses'))
  .use('/genders', require('./routes/genders'))
  .use('/memberships', require('./routes/memberships'))
  .use('/teachers', require('./routes/teachers'))
  .use('/tests', require('./routes/tests'))
  .use('/users', require('./routes/users'))
  .use('/videos', require('./routes/videos'))
  .use('/notes', require('./routes/notes'))
  .use('/turns', require('./routes/turns'))
  .use('/units', require('./routes/units'))
  /* Final user routes */
  .use('/api', require('./routes/finalUser/api'))
  .use('/universidad', require('./routes/finalUser/university'))
  .use('/materia', require('./routes/finalUser/course'))
  .use('/examen', require('./routes/finalUser/test'))
  .use('/usuario', require('./routes/finalUser/user'))
  .use('/referidos', require('./routes/finalUser/referred'))
  .use('/membresias', require('./routes/finalUser/membership'))
  .use('/userCourses', require('./routes/finalUser/userCourses'))
  /* Payment routes */
  .use('/subscription', require('./routes/mercadoPago'))


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
  res.render('error');
});

module.exports = app;
