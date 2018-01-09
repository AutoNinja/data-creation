var columns = require('./library/table_fields').fields;
var initcookies = require('./library/usecookies.js');
var util = require("./library/table-util.js");
var buildQueryString = require('./library/build_Query_String.js');





/*Initialize all tables*/
function showRowDeatils (item) {
  $('#jsGrid').hide();
  $('#save, #back').show();
  $('.table-container').show();


  $("#step0-table").jsGrid({
      width: "100%",
      height: "auto",
      paging: true,
      autoload: true,
      autowidth: false,
      pageSize: 15,
      pageButtonCount: 5,
      deleteConfirm: "Confirm Delete Data?",
      noDataContent: "Using Existing Client",
      loadIndicationDelay: 0,
      controller: {
        insertItem: function (item) {
          item.RequestType = "R";
          item.Status = "submitted";
          item.Env = Cookies.get("env");
          item.ClientID = "";
          item.DepartmentCode = item.TypeDepartmentId;
          item.SubmissionDate = util.date();
          item.ID = util.guid();
        },

        loadData: function () {
          var d = $.Deferred();
          $.ajax({
            type: "POST",
            url: "/db/query",
            cache: false,
            data: {data: "SELECT * FROM EventData WHERE ID = '"+item.ID+"'"},
            dataType: "json"
          })
          .done(function(result) {
            d.resolve(result);
          })
          .fail(function() {
            alert("An Unexpected Error Has Occured");
            d.resolve();
          });
          return d.promise();
        }
      },
      fields: columns("enrollment")
    });

  $("#step1-table").jsGrid({
      width: "100%",
      paging: true,
      autoload: true,
      autowidth: false,
      sorting: true,

      pageSize: 15,
      pageButtonCount: 5,
      deleteConfirm: "Confirm Delete Data?",
      noDataContent: "Not Selected",
      loadIndicationDelay: 0,

      controller: {
        loadData: function () {
          var d = $.Deferred();
          $.ajax({
            type: "POST",
            url: "/db/query",
            cache: false,
            data: {data: "SELECT CarryForward, SDStatus, StartDate, EndDate, ServiceAmt, EarningsAmt, ServiceEarningsType, ContributionAmt, ContributionType, PostEvent FROM EventData WHERE ID = '"+item.ID+"'"},
            dataType: "json"
          })
          .done(function(res) {
            console.log(res);
            var splitResult = [];
            if (res[0].SDStatus) {

              var rowsCount = res[0].CarryForward.split(',').length;

              $.each(res[0], function(index, item) {
                res[0][index] = item.split(',');
              });

              for (var i = 0 ; i < rowsCount; i++) {
                var tempRow = $.extend({}, res[0]);
                $.each(tempRow, function(index, item) {
                  tempRow[index] = res[0][index][i];
                });
                tempRow.SDStatus = res[0].SDStatus[0];
                splitResult.push(tempRow);
              }
            }
            d.resolve(splitResult);
          })
          .fail(function() {
            alert("An Unexpected Error Has Occured");
            d.resolve();
          });
          return d.promise();
        }
      },

      fields: columns('sourcedata')
  });

  $("#step2-table").jsGrid({
    width: "100%",
    paging: true,
    autoload: true,
    autowidth: false,

    pageSize: 15,
    pageButtonCount: 5,
    deleteConfirm: "Confirm Delete Data?",
    noDataContent: "Not Selected",
    loadIndicationDelay: 0,

    controller: {
      loadData: function () {
        var d = $.Deferred();
        $.ajax({
          type: "POST",
          url: "/db/query",
          cache: false,
          data: {data: "SELECT * FROM EventData WHERE ID = '"+item.ID+"'"},
          dataType: "json"
        })
        .done(function(result) {
          if (!result[0].ReportingStatus)
            result = [];
          d.resolve(result);
        })
        .fail(function() {
          alert("An Unexpected Error Has Occured");
          d.resolve();
        });
        return d.promise();
      }
    },

    fields: columns('reporting')
  });

  $("#step3-table").jsGrid({
      width: "100%",
      paging: true,
      autoload: true,
      autowidth: false,

      pageSize: 15,
      pageButtonCount: 5,
      deleteConfirm: "Confirm Delete Data?",
      noDataContent: "Not Selected",
      loadIndicationDelay: 0,

      controller: {
        loadData: function () {
          var d = $.Deferred();
          $.ajax({
            type: "POST",
            url: "/db/query",
            cache: false,
            data: {data: "SELECT * FROM EventData WHERE ID = '"+item.ID+"'"},
            dataType: "json"
          })
          .done(function(result) {
            if (!result[0].ElectionStatus)
              result = [];
            d.resolve(result);
          })
          .fail(function() {
            alert("An Unexpected Error Has Occured");
            d.resolve();
          });
          return d.promise();
        }
      },

      fields: columns('election')
  });

  $("#step0-table")
    .jsGrid("option", "noDataContent", "ClientID = "+item.ClientID+", UserID = "+item.UserID)
    .jsGrid("fieldOption", "UserID", "visible", true)
    .jsGrid("fieldOption", "ClientID", "visible", true)
    .jsGrid("fieldOption", "EnrollStatus", "visible", true)
    .jsGrid("fieldOption", "ID", "visible", true);

  $("#step1-table").jsGrid("fieldOption", "SDStatus", "visible", true);
  $("#step2-table").jsGrid("fieldOption", "ReportingStatus", "visible", true);
  $("#step3-table").jsGrid("fieldOption", "ElectionStatus", "visible", true);

  $('.control-btn').hide();
  $('#step1-table .control-btn').show();

  $('.table').jsGrid("fieldOption", "Control", "visible", false);

};


$(document).ready(function() {
  var previousItem;
  initcookies();

  var newFields =
  $("#jsGrid").jsGrid({
    width: "100%",
    height: "auto",
    shrinkToFit: true,
    autoload: true,
    paging: true,
    filtering: true,
    editing: false,
    sorting: true,
    pageSize: 15,
    pageButtonCount: 5,
    noDataContent: "No Data In Database",
    loadIndicationDelay: 0,
    rowClick: function (args) {
      showRowDeatils(args.item);
    },

    controller: {
      loadData: function (filter) {
        var d = $.Deferred();
        $.ajax({
          type: "POST",
          url: "/db/query",
          cache: false,
          data: {data: "SELECT * FROM EventData"},
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
    },

    fields: columns("general")
  })
  .jsGrid("fieldOption", "ID", "visible", true)
  .jsGrid("fieldOption", "SubmissionDate", "visible", true)
  .jsGrid("fieldOption", "ClientID", "visible", true)
  .jsGrid("fieldOption", "UserID", "visible", true)
  .jsGrid("fieldOption", "OverallStatus", "visible", true)
  .jsGrid("fieldOption", "Control", "visible", false);


  $('.control-btn').hide();

});
