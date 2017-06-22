var table = require("./library/table.js");
var fields = require("./library/fields.js");
var nav = require('./library/nav.js');

var previousItem;

$(document).ready(function() {

  nav($);

  table.createTable("search", fields.getFields("search"));

  $('#home').click(function() {window.location.replace("/");});
});
