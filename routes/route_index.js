var express = require('express');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    console.log(req.method+" "+req.url+" ENV: TST");
    res.render('pages/page_index', {data: {"env": "TST"}});
  });

module.exports = router;
