var table = require("./library/table.js");
var nav = require('./library/nav.js');
var initcookies = require('./library/usecookies.js');


$(document).ready(function() {
  var previousItem;
  initcookies();

  nav($);
  if (page === 'enrollment') {
    if (user === "manual") {
      table.createTable("#jsGrid","search_enrollment_manual");
    } else {
      table.createTable("#jsGrid","search_enrollment_automation");
    }
  } else if (page === 'sourcedata') {
    if (user === "manual") {
      table.createTable("#jsGrid","search_enrollment_manual");
    } else {
      table.createTable("#jsGrid","search_enrollment_manual");
    }
  } else if (page === 'reporting') {
    if (user === "manual") {
      table.createTable("#jsGrid","search_enrollment_manual");
    } else {
      table.createTable("#jsGrid","search_enrollment_manual");
    }
  } else if (page === 'election') {
    if (user === "manual") {
      table.createTable("#jsGrid","search_enrollment_manual");
    } else {
      table.createTable("#jsGrid","search_enrollment_manual");
    }
  }
  $('#home').click(function() {window.location.href = "./";});
});
