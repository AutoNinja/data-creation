var express = require('express');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    console.log(req.method+" "+req.url+" ENV: TST");
    res.render('pages/index', {data: {"env": "TST"}});
  })
  .post(function(req,res) {
    console.log(req.method+" "+req.url+" ENV: "+req.body['env']);
    res.render('pages/index',{data: req.body});
  });

module.exports = router;
