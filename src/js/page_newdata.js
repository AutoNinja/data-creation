var modal = require("./library/modal.js");
var table = require("./library/table.js");
var defaults = require("./library/defaults.js");
var fields = require("./library/fields.js");
var nav = require('./library/nav.js');

$(document).ready(function() {

  nav($);

  $("#detailsDialog").hide();

  table.createTable("newdata", fields.getFields("newdata"));
  modal.createModal("#detailsDialog", defaults.getDefaults("modal"));

  $('#control-btn').click(function () {modal.show();});
  $('#home').click(function() {window.location.replace("/");});
  $('#save').click(handleClickSave);
});


function handleClickSave() {
  var items = $("#jsGrid").jsGrid("option", "data");

  if (items.length==0) location.replace('/');

  Cookies.set('UserID', items[0].UserID, { expires: 15 });

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
    alert("New Data Successfully Added");
    location.reload();
  });
}
