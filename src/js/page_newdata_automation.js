var modal = require("./library/modal.js");
var table = require("./library/table.js");
var defaults = require("./library/defaults.js");
var fields = require("./library/fields.js");
var nav = require('./library/nav.js');

$(document).ready(function() {

  nav($);

  $("#detailsDialog").hide();

  table.createTable("newdata-automation", fields.getFields("newdata-automation"));
  modal.createModal("#detailsDialog", defaults.getDefaults("newdata-automation-modal"));

  $('#control-btn').click(function () {modal.show();});
  $('#home').click(function() {window.location.replace("/automation");});
  $('#save').click(handleClickSave);
});


function handleClickSave() {
  var items = $("#jsGrid").jsGrid("option", "data");

  if (items.length===0)
    location.replace('/');

  Cookies.set('UserID', items[0].UserID, { expires: 1 });

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
      "Control"
    ], false);
    $("#home").show();
  })
  .fail(function() {
    alert("Internal Server Error, Please Resubmit Data");
    location.reload();
  });
}
