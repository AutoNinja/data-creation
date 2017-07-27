var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('common/index', {
    user: 'manual',
    page: "Enrollment",
    newDataText: "New Enrollment",
    newDataURL: "/enrollment/newdata",
    searchText: "Search Enrollments",
    searchURL: "/enrollment/search"
  });
});


router.get('/newdata', function(req, res) {
    res.render('enrollment/newdata', {user: 'manual', page: "Enrollment New Data"});
});

router.get('/search', function(req, res) {
    res.render('enrollment/search', {user: 'manual', page: "Enrollment Search"});
});

router.get('/help', function(req, res) {
    res.render('enrollment/help', {user: 'manual', page: "Enrollment Help"});
});


module.exports = router;
