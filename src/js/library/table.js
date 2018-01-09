var util = require('./table-util.js');
var fields = require("./table_fields.js").fields;
var buildQueryString = require("./build_Query_String.js");

/******************************************************************************
Table API
******************************************************************************/

module.exports.createTable = function (targetID, type) {
    $(targetID).jsGrid(buildOptions(type));
}

function buildOptions (type) {
  var options;

  switch (type) {
  case "newdata_enrollment":
    options = {
      width: "100%",
      height: "auto",
      paging: true,
      autoload: true,
      autowidth: false,
      editing: true,
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
        }
      },
      fields: fields("enrollment")
    }

    break;
  case "search_enrollment":

    options = {
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
                if (filter[property]!=="" && item[property] !== filter[property])
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
            dataType: "json"
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

      fields: fields("enrollment")
    };


    break;
/*
  case "newdata_enrollment_automation":
    options = {
      width: "100%",
      paging: true,
      autoload: true,
      autowidth: false,

      pageSize: 15,
      pageButtonCount: 5,
      deleteConfirm: "Confirm Delete Data?",
      noDataContent: "No New Data Added Yet",
      loadIndicationDelay: 0,

      controller: {
        insertItem: function (item) {

          item.Status = "submitted";
          item.Env = Cookies.get("env");
          item.ClientID = "";
          item.DepartmentCode = item.TypeDepartmentId;
          item.SubmissionDate = util.date();

        }
      },

      fields: fields
    };
    break;
  case "search_enrollment_automation":

    $(target).jsGrid({
        width: "100%",
        height: "auto",
        shrinkToFit: true,
        autoload: true,
        paging: true,
        filtering: true,
        editing: true,
        sorting: true,
        pageSize: 13,
        pageButtonCount: 5,
        noDataContent: "No Data Found",
        loadIndicationDelay: 0,

        controller: {
          //get data from db
          loadData: function (filter) {
            var d = $.Deferred();

            $.ajax({
              type: "GET",
              url: "/db/load",
              cache: false,
              dataType: "json"
            })
            .done(function(result) {
              console.log(result);
              result = $.grep(result, function(item) {
                if (item["Env"] != Cookies.get("env")) {
                  return false;
                }
                for (var property in filter) {
                  if (filter[property]!=="" &&
                      item[property] !== filter[property])
                  {
                    return false;
                  }
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

          //submit updated data to db
          updateItem: function(item) {
            console.log(item);
            item.SubmissionDate = util.date();
            var d = $.Deferred();
            $.ajax({
              type: "POST",
              url: "/db/update",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              data: JSON.stringify(item)
            }).done(function(result) {
              d.resolve(item);
              alert('Update Success');
            })
            .fail(function() {
              d.resolve(previousItem);
              alert('Update Failed, An Unexpected Error Has Occured');
            });
            return d.promise();
          }
        },

        onItemUpdating: function(args) {
          previousItem = args.previousItem;
        },

        fields: fields
    });
    break;
*/
  case "newdata_sourcedata":
    var options = {
      width: "100%",
      paging: true,
      autoload: true,
      autowidth: false,
      editing: true,
      sorting: true,

      pageSize: 15,
      pageButtonCount: 5,
      deleteConfirm: "Confirm Delete Data?",
      noDataContent: "Not Selected",
      loadIndicationDelay: 0,

      controller: {

      },

      fields: fields('sourcedata')
    };
    break;
  case "search_sourcedata":
    option = {
        width: "100%",
        height: "auto",
        shrinkToFit: true,
        autoload: true,
        paging: true,
        editing: true,
        pageSize: 13,
        pageButtonCount: 5,
        noDataContent: "No Data Found",
        loadIndicationDelay: 0,

        controller: {


        },

        //disabled editing when status = used
        onItemEditing: function(args) {
          if (args.item.SDStatus === "used" || args.item.SDStatus === "terminated") {
            args.cancel = true;
          }
        },

        fields: fields('sourcedata')
    };
    break;
  case "newdata_reporting":
    options = {
      width: "100%",
      paging: true,
      autoload: true,
      editing: true,
      autowidth: false,

      pageSize: 15,
      pageButtonCount: 5,
      deleteConfirm: "Confirm Delete Data?",
      noDataContent: "Not Selected",
      loadIndicationDelay: 0,

      controller: {
        insertItem: function (item) {
          item.Progress = '3';
          item.ReportingStatus = "submitted";
          item.SubmissionDate = util.date();
        }
      },

      fields: fields('reporting')
    };
    break;
  case "search_reporting":
    var options = {
        width: "100%",
        height: "auto",
        shrinkToFit: true,
        autoload: true,
        paging: true,
        filtering: true,
        editing: true,
        sorting: true,
        pageSize: 13,
        pageButtonCount: 5,
        noDataContent: "No Data Found",
        loadIndicationDelay: 0,

        controller: {
          //get data from db
          loadData: function (filter) {
            var d = $.Deferred();

            $.ajax({
              type: "GET",
              url: "/db/load",
              cache: false,
              dataType: "json"
            })
            .done(function(result) {
              result = $.grep(result, function(item) {
                if (item.Env !== Cookies.get("env") || item.Progress !== '3' || item.RequestType !== "R") {
                  return false;
                }
                for (var property in filter) {
                  if (filter[property]!=="" &&
                      item[property] !== filter[property])
                  {
                    return false;
                  }
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

          //submit updated data to db
          updateItem: function(item) {
            item.SubmissionDate = util.date();
            var d = $.Deferred();
            $.ajax({
              type: "POST",
              url: "/db/update",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              data: JSON.stringify(item)
            }).done(function(result) {
              d.resolve(item);
              alert('Update Success');
            })
            .fail(function() {
              d.resolve(previousItem);
              alert("Update Failed, Unexpected Error");
            });
            return d.promise();
          }
        },

        //disabled editing when status = used
        onItemEditing: function(args) {
          if (args.item.EventStatus === "used" || args.item.EventStatus === "terminated") {
            args.cancel = true;
          }
        },

        onItemUpdating: function(args) {
          previousItem = args.previousItem;
        },

        fields: fields('reporting')
    };
    break;
  case "newdata_election":
    options = {
      width: "100%",
      paging: true,
      autoload: true,
      autowidth: false,
      editing: true,

      pageSize: 15,
      pageButtonCount: 5,
      deleteConfirm: "Confirm Delete Data?",
      noDataContent: "Not Selected",
      loadIndicationDelay: 0,

      controller: {
        insertItem: function (item) {
          item.Progress = '4';
          item.ElectionStatus = "submitted";
          item.SubmissionDate = util.date();
        }
      },

      fields: fields('election')
    };
    break;
  case "search_election":
    options = {
        width: "100%",
        height: "auto",
        shrinkToFit: true,
        autoload: true,
        paging: true,
        filtering: true,
        editing: true,
        sorting: true,
        pageSize: 13,
        pageButtonCount: 5,
        noDataContent: "No Data Found",
        loadIndicationDelay: 0,

        controller: {
          //get data from db
          loadData: function (filter) {
            var d = $.Deferred();

            $.ajax({
              type: "GET",
              url: "/db/load",
              cache: false,
              dataType: "json"
            })
            .done(function(result) {
              result = $.grep(result, function(item) {
                if (item.Env !== Cookies.get("env") || item.Progress !== '4' || item.RequestType !== "R") {
                  return false;
                }
                for (var property in filter) {
                  if (filter[property]!=="" &&
                      item[property] !== filter[property])
                  {
                    return false;
                  }
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

          //submit updated data to db
          updateItem: function(item) {
            item.SubmissionDate = util.date();
            var d = $.Deferred();
            $.ajax({
              type: "POST",
              url: "/db/update",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              data: JSON.stringify(item)
            }).done(function(result) {
              d.resolve(item);
              alert('Update Success');
            })
            .fail(function() {
              d.resolve(previousItem);
              alert("Update Failed, Unexpected Error");
            });
            return d.promise();
          }
        },

        //disabled editing when status = used
        onItemEditing: function(args) {
          if (args.item.ElectionStatus === "used" || args.item.ElectionStatus === "terminated") {
            args.cancel = true;
          }
        },

        onItemUpdating: function(args) {
          previousItem = args.previousItem;
        },

        fields: fields('election')
    };
    break;
  }

  return options;
}



module.exports.setTableColumnVisible = function (cols, visibility) {
  for (item in cols) {
    $("#jsGrid").jsGrid("fieldOption", cols[item], "visible", visibility);
  }
}
