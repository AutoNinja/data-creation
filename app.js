var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var PORT = process.env.port || 3000;
var NODE_ENV = process.env.NODE_ENV || 'development';


// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'));


//middleware setup
app.use(logger(NODE_ENV==="development" ? 'dev' : "common"));
app.use(cookieParser());
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auto',express.static(path.join(__dirname, 'public')));

//routes
app.use('/', require('./routes/pages'));
app.use('/auto', require('./routes/autopages'));
app.use('/db',require('./routes/db'));

//throw error if page not found
app.use(function(req,res,next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

//handle errors
app.use(function (err, req, res, next) {
  if (err.status != 404)
    res.render('pages/500');
  else
    res.render('pages/404');
});

app.listen(PORT, function () {
  console.log('Magic Happens on Port '+PORT);
});
