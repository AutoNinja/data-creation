var table = require("./library/table.js");
var fields = require("./library/fields.js");
var nav = require('./library/nav.js');
var initcookies = require('./library/usecookies.js');

$(document).ready(function() {
  initcookies();
  nav($);


  table.createTable("result", fields.getFields("result"));

  $('#home').click(function() {window.location.replace("/");});
});
