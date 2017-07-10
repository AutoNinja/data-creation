var table = require("./library/table.js");
var modal = require("./library/id_modal.js");
var initcookies = require('./library/usecookies.js');
var util = require("./library/table-util.js");


$(document).ready(function() {
  var previousItem;
  initcookies();

  table.createTable("#jsGrid","search_"+page);

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
    combined.ClientID = items[0].ClientID;
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
