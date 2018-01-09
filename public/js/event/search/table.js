
var searchTable = (function($) {

  var $enrollmentSelector, $sourcedataSelector, $reportingSelector, $electionSelector;

  var showRowDeatils = function (item) {
    $('.table-container').show();
    $($enrollmentSelector).jsGrid({
        width: "100%",
        height: "auto",
        paging: true,
        autoload: true,
        autowidth: false,
        pageSize: 10,
        pageButtonCount: 5,
        deleteConfirm: "Confirm Delete Data?",
        noDataContent: "Using Existing Client",
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
              d.resolve(result);
            })
            .fail(function() {
              $($enrollmentSelector).jsGrid("option","noDataContent","Error Retriving Data, Please Refresh Page");
              d.resolve();
            });
            return d.promise();
          }
        },
        fields: buildFields.buildNewData(enrollmentTableFields)
      })
      .jsGrid("fieldOption", "EnrollStatus", "visible", true);

    $($sourcedataSelector).jsGrid({
        width: "100%",
        paging: true,
        autoload: true,
        autowidth: false,
        sorting: true,

        pageSize: 10,
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
              $($sourcedataSelector).jsGrid("option","noDataContent","Error Retriving Data, Please Refresh Page");
              d.resolve();
            });
            return d.promise();
          }
        },

        fields: buildFields.buildNewData(sourcedataTableFields)
    })
    .jsGrid("fieldOption", "SDStatus", "visible", true);
    $($reportingSelector).jsGrid({
      width: "100%",
      paging: true,
      autoload: true,
      autowidth: false,

      pageSize: 10,
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
            $($reportingSelector).jsGrid("option","noDataContent","Error Retriving Data, Please Refresh Page");
            d.resolve();
          });
          return d.promise();
        }
      },

      fields: buildFields.buildNewData(reportingTableFields)
    })
    .jsGrid("fieldOption", "ReportingStatus", "visible", true);
    $($electionSelector).jsGrid({
        width: "100%",
        paging: true,
        autoload: true,
        autowidth: false,

        pageSize: 10,
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
              $($electionSelector).jsGrid("option","noDataContent","Error Retriving Data, Please Refresh Page");
              d.resolve();
            });
            return d.promise();
          }
        },

        fields: buildFields.buildNewData(electionTableFields)
    })
    .jsGrid("fieldOption", "ElectionStatus", "visible", true);
    $('.table').jsGrid("fieldOption", "Control", "visible", false);
  };

  var initSummaryTable = function ($selector) {
    $($selector).jsGrid({
      width: "100%",
      height: "auto",
      shrinkToFit: true,
      autoload: true,
      paging: true,
      filtering: true,
      editing: false,
      sorting: true,
      pageSize: 10,
      pageButtonCount: 5,
      noDataContent: "No Data In Database",
      loadIndicationDelay: 0,
      rowClick: function (args) {
        $($selector).hide();
        showRowDeatils(args.item);
      },

      controller: {
        loadData: function (filter) {
          var d = $.Deferred();
          $.ajax({
            type: "POST",
            url: "/db/query",
            cache: false,
            data: {data: "SELECT * FROM EventData WHERE RequestType = 'R' AND Env ='"+Cookies.get('env')+"';"},
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

      fields: buildFields.buildSearch(searchTableFields)
    })
    .jsGrid("fieldOption", "OverallStatus", "visible", true);
  }

  var init = function ($summary, $enrollment, $sourcedata, $reporting, $election) {
    $enrollmentSelector = $enrollment;
    $sourcedataSelector = $sourcedata;
    $reportingSelector = $reporting;
    $electionSelector = $election;
    initSummaryTable($summary);
  }

  return {
    init: init
  };

})(jQuery);
