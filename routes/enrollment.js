var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/enrollment/index', {user: 'manual', page: "Enrollment"});
});

router.get('/newdata', function(req, res) {
    res.render('pages/enrollment/newdata', {user: 'manual', page: "Enrollment New Data"});
});

router.get('/search', function(req, res) {
    res.render('pages/enrollment/search', {user: 'manual', page: "Enrollment Search"});
});

router.get('/help', function(req, res) {
    res.render('pages/enrollment/help', {user: 'manual', page: "Enrollment Help"});
});


module.exports = router;
