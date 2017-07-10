var modal = require("./library/newdata_modal.js");
var util = require("./library/table-util.js");
var table = require("./library/table.js");
var initcookies = require('./library/usecookies.js');

$(document).ready(function() {
  initcookies();

  table.createTable("#jsGrid","newdata_"+page);
  modal.createModal("#newdata-modal", page);

  $("[data-toggle='tooltip']").tooltip();
});


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
