var table = require("./library/table.js");
var fields = require("./library/fields.js");

$(document).ready(function() {

  table.createTable("search", fields.getFields("search"));

  $('#home').click(function() {window.location.replace("/");});
});
