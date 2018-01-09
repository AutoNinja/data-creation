var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', {user: 'manual', page: "Data Creation"});
});

module.exports = router;
