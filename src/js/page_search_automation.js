var table = require("./library/table.js");
var fields = require("./library/fields.js");
var nav = require('./library/nav.js');

$(document).ready(function() {

  var previousItem;

  nav($);

  table.createTable("search_automation", fields.getFields("search_automation"));

  $('#home').click(function() {window.location.replace("/automation");});
});
