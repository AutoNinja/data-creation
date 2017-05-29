// server.js
// load the things we need
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//routes
var index = require ('./routes/index');
var table = require ('./routes/table');
var sideframe = require('./routes/sideframe');
var db = require('./routes/db')

var PORT = process.env.port || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'));

//static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/',index);
app.use('/table',table);
app.use('/sideframe',sideframe);
app.use('/db',db);

//error handler
app.use(function(req,res,next) {
  var err = new Error();
  err.status = 404;
  next(err);
}, function (err, req, res, next) {
  res.render('pages/404');
});

app.listen(PORT, function () {
  console.log('Magic Happens on Port '+PORT);
});
