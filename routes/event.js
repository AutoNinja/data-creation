var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('common/index', {
    user: 'manual',
    page: "Event",
    newDataText: "New Event",
    newDataURL: "/event/newdata",
    searchText: "Search Events",
    searchURL: "/event/search"
  });
});

router.get('/newdata', function(req, res) {
  res.render('event/newdata', {user: 'manual', page: "Event New Data"});
});

router.get('/search', function(req, res) {
  res.render('event/search', {user: 'manual', page: "Event Search"});
});

router.get('/help', function(req, res) {
    res.render('event/help', {user: 'manual', page: "Event Help"});
});


module.exports = router;
