var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/index', {user: 'manual', page: req.baseUrl.replace(/\//g, "")});
});

router.get('/newdata', function(req, res) {
    res.render('pages/newdata', {user: 'manual', page: req.baseUrl.replace(/\//g, "")});
});

router.get('/search', function(req, res) {
    res.render('pages/search', {user: 'manual', page: req.baseUrl.replace(/\//g, "")});
});

router.get('/help', function(req, res) {
    res.render('pages/help', {user: 'manual', page: req.baseUrl.replace(/\//g, "")});
});


module.exports = router;
