var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/index', {user: 'manual', page: 'main'});
});


module.exports = router;
