var table = require("./library/table.js");
var modal = require("./library/id_modal.js");
var initcookies = require('./library/usecookies.js');
var util = require("./library/table-util.js");


$(document).ready(function() {
  var previousItem;
  initcookies();

  table.createTable("#jsGrid","search_enrollment");

});
