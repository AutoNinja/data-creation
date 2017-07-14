var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/event/index', {user: 'manual', page: "event" });
});

router.get('/newdata', function(req, res) {
    res.render('pages/event/newdata', {user: 'manual', page: "Event New Data"});
});

/*
router.get('/search', function(req, res) {
    res.render('pages/search', {user: 'manual', page: req.baseUrl.replace(/\//g, "")});
});

router.get('/help', function(req, res) {
    res.render('pages/help', {user: 'manual', page: req.baseUrl.replace(/\//g, "")});
});

*/
module.exports = router;
