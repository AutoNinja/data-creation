var modal = require("./library/modal.js");
var table = require("./library/table.js");
var nav = require('./library/nav.js');
var initcookies = require('./library/usecookies.js');

$(document).ready(function() {
  initcookies();
  nav($);

  $("#detailsDialog").hide();

  if (user === "manual") {
    table.createTable("#jsGrid","newdata");
    modal.createModal("#detailsDialog","defaults-manual");
    $('#home').click(function() {window.location.replace("/");});
  } else {
    table.createTable("#jsGrid", "newdata-automation");
    modal.createModal("#detailsDialog","defaults-automation");
    $('#home').click(function() {window.location.replace("/auto");});
  }

  $('#control-btn').click(function () {modal.show('#detailsDialog');});
  $('#save').click(handleClickSave);
});


function handleClickSave() {
  var items = $("#jsGrid").jsGrid("option", "data");

  if (items.length==0) {
    alert("Nothing to submit!")
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
