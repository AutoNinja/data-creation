var table = require("./library/table.js");
var fields = require("./library/fields.js");

$(document).ready(function() {
  table.createTable("result", fields.getFields("result"));

  $('#home').click(function() {window.location.replace("/");});
});
