var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/index', {user: 'manual', page: req.baseUrl.replace(/\//g, "")});
});


module.exports = router;
