var table = require("./library/table.js");
var nav = require('./library/nav.js');
var initcookies = require('./library/usecookies.js');


$(document).ready(function() {
  var previousItem;
  initcookies();

  nav($);

  if (user == "manual") {
    table.createTable("#jsGrid","search_enrollment_manual");
  } else {
    table.createTable("#jsGrid","search_enrollment_automation");
  }
  $('#home').click(function() {window.location.href = "./";});
});
