var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('page_index', {user: 'auto', page: 'enrollment'});
});

router.get("/newdata", function(req, res) {
    res.render('page_enrollment_newdata', {user: 'auto'});
});

router.get("/help", function(req, res) {
    res.render('page_enrollment_help', {user: 'auto'});
});

router.get("/console", function(req, res) {
    res.render('page_enrollment_console', {user: 'auto'});
});

router.get("/search", function(req, res) {
    res.render('page_enrollment_search', {user: 'auto'});
});


module.exports = router;
