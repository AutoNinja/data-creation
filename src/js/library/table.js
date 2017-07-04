var util = require('./table-util.js');
var cols = require("./formatTableFields.js");

/******************************************************************************
Table API
******************************************************************************/

module.exports.createTable = function (target, type) {

  var fields = cols.getFields(type);

  if (type === "newdata_enrollment_manual") {

    $(target).jsGrid({
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
          item.Progress = '1';
          item.RequestType = "R";
          item.Status = "submitted";
          item.Env = Cookies.get("env");
          item.ClientID = "";
          item.DepartmentCode = item.TypeDepartmentId;
          item.SubmissionDate = util.date();
          item.ID = util.guid();

        }
      },

      fields: fields
    });
  } else if (type === "search_enrollment_manual") {
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
              result = $.grep(result, function(item) {
                if (item.Env !== Cookies.get("env") || item.Progress !== '1' || item.RequestType !== "R") {
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
          if (args.item.Status === "used" || args.item.Status === "terminated") {
            args.cancel = true;
          }
        },

        onItemUpdating: function(args) {
          previousItem = args.previousItem;
        },

        fields: fields
    });

  } else if (type === "newdata_enrollment_automation") {
    $(target).jsGrid({
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
    });
  } else if (type === "search_enrollment_automation") {

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

  } else if (type === "newdata_sourcedata_manual") {
    $(target).jsGrid({
      width: "100%",
      paging: true,
      autoload: true,
      autowidth: false,
      editing: true,
      sorting: true,

      pageSize: 15,
      pageButtonCount: 5,
      deleteConfirm: "Confirm Delete Data?",
      noDataContent: "No New Data Added Yet",
      loadIndicationDelay: 0,

      controller: {
        insertItem: function (item) {
          item.ID = $("#enrollmentID").val();
          item.SDStatus = 'submitted';
          item.SubmissionDate = util.date();
          item.Progress = "2";
        }

      },

      fields: fields
    });
  } else if ( type === "search_sourcedata_manual" ) {
    $(target).jsGrid({
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

        fields: fields
    });
  }
}

module.exports.setTableColumnVisible = function (cols, visibility) {
  for (item in cols) {
    $("#jsGrid").jsGrid("fieldOption", cols[item], "visible", visibility);
  }
}
