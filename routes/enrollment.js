var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/page_index', {user: 'manual', page: 'enrollment'});
});

router.get("/newdata", function(req, res) {
    res.render('pages/page_enrollment_newdata', {user: 'manual'});
});

router.get("/help", function(req, res) {
    res.render('pages/page_enrollment_help', {user: 'manual'});
});

router.get("/search", function(req, res) {
    res.render('pages/page_enrollment_search', {user: 'manual'});
});


module.exports = router;
