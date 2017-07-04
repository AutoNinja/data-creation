var table = require("./library/table.js");
var modal = require("./library/modal.js");
var nav = require('./library/nav.js');
var initcookies = require('./library/usecookies.js');
var util = require("./library/table-util.js");


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
    $('#save').show().click(sourceDataSave);;
    if (user === "manual") {
      modal.createIDSearchModal('#IDModal',"modal_sourcedata_search");
      table.createTable("#jsGrid","search_sourcedata_manual");
    } else {
      //table.createTable("#jsGrid","search_enrollment_manual");
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


  function sourceDataSave () {
    var items = $.extend([],$("#jsGrid").jsGrid("option", "data"));
    console.log(items);
    var combined = {};
    for (var name in items[0]) {
      combined[name]= items.map(function(elem) {
        return elem[name];
      }).join(',');
    }
    combined.Progress = '2';
    combined.ID = items[0].ID;
    combined.UserID = items[0].UserID;
    combined.SubmissionDate = util.date();
    combined.SDStatus = 'submitted';

    items = combined;
    console.log(combined);

    $("#save").hide();
    $("#home").hide();
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/db/update",
      data: JSON.stringify(items),
      dataType: "json"
    })
    .done(function(response){
      alert("New Data Successfully Added");
      table.setTableColumnVisible([
        "ID",
        "SDStatus",
        "SubmissionDate"
      ], true);
      table.setTableColumnVisible([
        "Control"
      ], false);
      $("#home").show();
    })
    .fail(function() {
      alert("Internal Server Error, Please Resubmit Data");
      location.reload();
    });
  }
});
