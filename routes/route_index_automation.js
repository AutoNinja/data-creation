var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    console.log(req.method+" "+req.url);
    res.render('pages/page_index_automation');
});

module.exports = router;
