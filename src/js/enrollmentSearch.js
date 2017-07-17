var columns = require('./library/table_fields').fields;
var initcookies = require('./library/usecookies.js');
var util = require("./library/table-util.js");
var buildQueryString = require('./library/buildQueryString.js');


$(document).ready(function() {
  var previousItem;
  initcookies();


  $("#jsGrid").jsGrid({
    width: "100%",
    height: "auto",
    shrinkToFit: true,
    autoload: true,
    paging: true,
    filtering: true,
    editing: true,
    sorting: true,
    pageSize: 15,
    pageButtonCount: 5,
    noDataContent: "No Data Found",
    loadIndicationDelay: 0,
    controller: {
      loadData: function (filter) {
        var d = $.Deferred();
        $.ajax({
          type: "POST",
          url: "/db/query",
          cache: false,
          data: {data: buildQueryString("loadAllData", {})},
          dataType: "json"
        })
        .done(function(result) {
          result = $.grep(result, function(item) {
            for (var property in filter) {
              if (filter[property]!=="" && item[property].indexOf(filter[property]) === -1)
                return false;
            }
            return true;
          });
          d.resolve(result);
        })
        .fail(function() {
          alert("An Unexpected Error Has Occured");
          d.resolve();
        });
        return d.promise();
      },

      updateItem: function (item) {
        item.SubmissionDate = util.date();
        var d = $.Deferred();
        $.ajax({
          type: "POST",
          url: "/db/execute",
          data: {data: buildQueryString("updateOneRow", item)},
        }).done(function(result) {
          d.resolve(item);
          alert('Update Success');
        })
        .fail(function() {
          d.resolve();
          alert("Update Failed, Unexpected Error");
        });
        return d.promise();
      }
    },

    onItemEditing: function(args) {
        if (args.item.Status === "used" || args.item.Status === "terminated") args.cancel = true;
    },

    onItemUpdating: function(args) {
        previousItem = args.previousItem;
    },

    fields: columns("enrollment_search")
  })
  .jsGrid("fieldOption", "ID", "visible", true)
  .jsGrid("fieldOption", "Status", "visible", true)
  .jsGrid("fieldOption", "SubmissionDate", "visible", true)
  .jsGrid("fieldOption", "ClientID", "visible", true)
  .jsGrid("fieldOption", "Control", "deleteButton", false);

  $('.control-btn').hide();

});
