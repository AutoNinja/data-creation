var modal = require("./library/modal.js");
var util = require("./library/table-util.js");
var table = require("./library/table.js");
var nav = require('./library/nav.js');
var initcookies = require('./library/usecookies.js');

$(document).ready(function() {
  initcookies();
  nav($);

  $("#detailsDialog").hide();

  if (page === 'enrollment') {
    $('#save').click(enrollmentSave);
    if (user === "manual") {
      table.createTable("#jsGrid","newdata_enrollment_manual");
      modal.createModal("#detailsDialog","modal_enrollment_manual");
    } else {
      table.createTable("#jsGrid", "newdata_enrollment_automation");
      modal.createModal("#detailsDialog","modal_enrollment_automation");
    }
  } else if (page === 'sourcedata') { //NEED FIX!!!

    if (user === "manual") {
      modal.createIDModal('#IDModal',"modal_sourcedata_manual");
      table.createTable("#jsGrid","newdata_sourcedata_manual");
      modal.createModal("#detailsDialog","modal_sourcedata_manual");
    } else {

    }
  } else if (page === 'reporting') {
    $('#save').click(reportingSave);
    if (user === "manual") {
      table.createTable("#jsGrid","newdata_reporting_manual");
      modal.createModal("#detailsDialog","modal_reporting_manual");
    } else {

    }
  } else if (page === 'election') {
    $('#save').click(electionSave);
    if (user === "manual") {
      table.createTable("#jsGrid","newdata_election_manual");
      modal.createModal("#detailsDialog","modal_election_manual");
    } else {

    }
  }
  $("[data-toggle='tooltip']").tooltip();
  $('#control-btn').click(function () {modal.show('#detailsDialog');});
  $('#home').click(function() {document.location.href = "./";});
});

function sourceDataSave () {
  var items = $.extend([],$("#jsGrid").jsGrid("option", "data"));
  console.log(items);
  var combined = {};
  for (var name in items[0]) {
    combined[name]= items.map(function(elem) {
      return elem[name];
    }).join(',');
  }
  combined.Progress = items[0].Progress;
  combined.ID = items[0].ID;
  combined.SubmissionDate = items[0].SubmissionDate;
  combined.SDStatus = items[0].SDStatus;
  combined.ClientID = items[0].ClientID;

  items = combined;

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
      "ClientID",
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

function enrollmentSave() {
  var items = $.extend([],$("#jsGrid").jsGrid("option", "data"));

  if (items.length==0) {
    alert("Nothing to submit!")
    return;
  }

  Cookies.set('UserID', items[0].UserID, { expires: 5 });
  $("#save").hide();
  $("#home").hide();
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "/db/insert",
    data: JSON.stringify(items),
    dataType: "json"
  })
  .done(function(response){
    alert("New Data Successfully Added");
    table.setTableColumnVisible([
      "ClientID",
      "Status",
      "Env",
      "ID",
      "SubmissionDate",
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

function reportingSave() {
  var items = $.extend([],$("#jsGrid").jsGrid("option", "data"));

  if (items.length==0) {
    alert("Nothing to submit!")
    return;
  }

  $("#save").hide();
  $("#home").hide();

  console.log(items);

  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "/db/update_multiple",
    data: JSON.stringify(items),
    dataType: "json"
  })
  .done(function(response){
    alert("New Data Successfully Added");
    table.setTableColumnVisible([
      "EventStatus",
      "UserID",
      "SubmissionDate",
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

function electionSave() {
  var items = $.extend([],$("#jsGrid").jsGrid("option", "data"));

  if (items.length==0) {
    alert("Nothing to submit!")
    return;
  }

  $("#save").hide();
  $("#home").hide();

  console.log(items);

  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "/db/update_multiple",
    data: JSON.stringify(items),
    dataType: "json"
  })
  .done(function(response){
    alert("New Data Successfully Added");
    table.setTableColumnVisible([
      "ElectionStatus",
      "UserID",
      "SubmissionDate",
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
