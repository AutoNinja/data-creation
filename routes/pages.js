var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    console.log(req.method+" "+req.url);
    res.render('pages/page_index', {user: 'manual'});
});

router.get("/newdata", function(req, res) {
    res.render('pages/page_newdata', {user: 'manual'});
});

router.get("/help", function(req, res) {
    res.render('pages/page_help', {user: 'manual'});
});

router.get("/search", function(req, res) {
    res.render('pages/page_search', {user: 'manual'});
});


module.exports = router;
