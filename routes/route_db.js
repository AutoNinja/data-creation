var express = require('express');
var router = express.Router();
var dbConnection = require ('node-adodb')
      .open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=../Access/database.mdb;');

//dev variables
const table = 'EnrollmentData';
const statusColumn = 'Status';
const clientID = 'ClientID';
const reqType = '"R"';

router.use(function(req,res,next){
  console.log(req.method+" db"+req.url);
  next();
});

router.use('/load', function(req,res,next){
  req.queryString = "SELECT * FROM EnrollmentData WHERE RequestType = 'R';";
  next();
}, function(req,res,next) {
  dbConnection
    .query(req.queryString)
    .on('done', function(data) {
      req.queryResult = data;
      next('route');
    })
    .on('fail', function(error) {
      console.log(error);
      var err = new Error();
      err.status = 500;
      next(err);
    });
});

router.use('/update', function(req,res,next){
  req.queryString = "UPDATE EnrollmentData SET ";
  var headings = Object.keys(req.body);
  var values = Object.keys(req.body).map(function(key){return "'"+req.body[key]+"'"});
  for (i in headings) {
    req.queryString += headings[i] + " = " + values[i];
    if (i!=headings.length-1) req.queryString += ", ";
  }
  req.queryString += " WHERE ID = '"+req.body.ID+"';";
  next();
}, function(req,res,next) {
  dbConnection
    .execute(req.queryString)
    .on('done', function(data) {
      console.log("Update Success");
      req.queryResult = {};
      next('route');
    })
    .on('fail', function(error) {
      console.log(error);
      var err = new Error();
      err.status = 500;
      next(err);
    });
});

router.use('/insert', function(req,res,next){
  req.queryString = [];
  for (var i = 0 ; i < req.body.length; i++) {
    var headings = Object.keys(req.body[i]).join();
    var values = Object.keys(req.body[i]).map(function(key){return "\""+req.body[i][key]+"\""});
    req.queryString.push('INSERT INTO '+table+'('+headings+') VALUES ('+values+');');
  }
  next();
}, function(req,res,next) {
  for (var i = 0; i < req.queryString.length; i++) {
    executeInsertQuery(req.queryString[i]);
  }
  setTimeout(function(){
    req.queryResult = {};
    next('route');
  }, req.queryString.length*500);
});

router.use('/execute', function(req,res,next){
  req.queryString = req.body.data;
  console.log(req.body);
  next();
}, function(req,res,next) {
  dbConnection
    .execute(req.queryString)
    .on('done', function(data) {
      req.queryResult = "Execution Success";
      next('route');
    })
    .on('fail', function(error) {
      req.queryResult = error;
      next('route');
    });
});

router.use('/query', function(req,res,next){
  req.queryString = req.body.data;
  console.log(req.body);
  next();
}, function(req,res,next) {
  dbConnection
    .query(req.queryString)
    .on('done', function(data) {
      req.queryResult = data;
      next('route');
    })
    .on('fail', function(error) {
      req.queryResult = error;
      next('route');
    });
});

router.all('*',function(req, res) {
  res.end(JSON.stringify(req.queryResult, null, 2));
});

function executeInsertQuery (queryString) {
  dbConnection
    .execute(queryString)
    .on('done', function(data) {
      console.log("Row Insert Success");
    })
    .on('fail', function(error) {
      console.log(error);
      executeInsertQuery(queryString);
      setTimeout(function(){}, 1000);
    });
}

module.exports = router;
