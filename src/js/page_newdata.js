var modal = require("./library/modal.js");
var table = require("./library/table.js");
var defaults = require("./library/defaults.js");
var fields = require("./library/fields.js");

$(document).ready(function() {

  $("#detailsDialog").hide();

  table.createTable("newdata", fields.getFields("newdata"));
  modal.createModal("#detailsDialog", defaults.getDefaults("modal"));

  $('#control-btn').click(function () {modal.show();});
  $('#home').click(function() {window.location.replace("/");});
  $('#save').click(handleClickSave);
});


function handleClickSave() {
  var items = $("#jsGrid").jsGrid("option", "data");

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
  });
}
