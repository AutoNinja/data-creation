var express = require('express');
var router = express.Router();


router.get("/", function(req, res) {
    res.render('pages/result_table');
});

module.exports = router;
