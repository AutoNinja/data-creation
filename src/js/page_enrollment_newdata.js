var modal = require("./library/modal.js");
var table = require("./library/table.js");
var nav = require('./library/nav.js');
var initcookies = require('./library/usecookies.js');

$(document).ready(function() {
  initcookies();
  nav($);

  $("#detailsDialog").hide();

  if (user === "manual") {
    table.createTable("#jsGrid","newdata_enrollment_manual");
    modal.createModal("#detailsDialog","defaults-manual");

  } else {
    table.createTable("#jsGrid", "newdata_enrollment_automation");
    modal.createModal("#detailsDialog","defaults-automation");
  }
  $("[data-toggle='tooltip']").tooltip();
  $('#control-btn').click(function () {modal.show('#detailsDialog');});
  $('#save').click(handleClickSave);
  $('#home').click(function() {document.location.href = "./";});
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
