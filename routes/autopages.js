var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    console.log(req.method+" "+req.url);
    res.render('pages/page_index', {user: 'auto'});
});

router.get("/newdata", function(req, res) {
    res.render('pages/page_newdata', {user: 'auto'});
});

router.get("/help", function(req, res) {
    res.render('pages/page_help', {user: 'auto'});
});

router.get("/console", function(req, res) {
    res.render('pages/page_console', {user: 'auto'});
});

router.get("/search", function(req, res) {
    res.render('pages/page_search', {user: 'auto'});
});


module.exports = router;
