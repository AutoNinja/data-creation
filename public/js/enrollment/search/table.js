
"use strict";

var searchTable = (function ($) {

  var initTable = function ($selector) {
    var previousItem;
    $($selector).jsGrid({
      width: "100%",
      height: "auto",
      shrinkToFit: true,
      autoload: true,
      paging: true,
      filtering: true,
      editing: true,
      sorting: true,
      pageSize: 10,
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
            data: {data: "SELECT * FROM EnrollmentData Where RequestType = 'R' AND Env = '"+Cookies.get('env')+"';"},
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
          item.SubmissionDate = moment().format('MM/DD/YYYY');
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

      fields: buildFields.buildSearch(enrollmentTableFields)
    })
    .jsGrid("fieldOption", "Control", "deleteButton", false)
    .jsGrid("fieldOption", "RequestType", "visible", false)
    .jsGrid("fieldOption", "Env", "visible", false)
    .jsGrid("fieldOption", "Control", "headerTemplate", null);
  }

  var init = function ($tableSelector) {
    initTable($tableSelector);
  };

  return { init: init };

$(document).ready(function() {
  var previousItem;

});

})(jQuery);
