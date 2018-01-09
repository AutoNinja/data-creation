(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var buildQueryString = (function ($) {
  var updateOneRow = function (row) {
    var queryString = "UPDATE EnrollmentData SET ";
    var headings = Object.keys(row);
    var values = Object.keys(row).map(function(key){return "'"+row[key]+"'"});
    for (var i in headings) {
      queryString += headings[i] + " = " + values[i];
      if (i!=headings.length-1) queryString += ", ";
    }
    queryString += " WHERE ID = '"+row.ID+"';";
    return queryString;
  }


  return function (type, item) {
    switch (type) {
      case "loadAllData":
        return "SELECT * FROM EnrollmentData;";
      case "updateOneRow":
        return updateOneRow(item);
    }
  }


})(jQuery);


/*

router.use('/update', function(req,res,next){
  req.queryString = "UPDATE EnrollmentData SET ";
  var headings = Object.keys(req.body);
  var values = Object.keys(req.body).map(function(key){return "'"+req.body[key]+"'"});
  for (var i in headings) {
    req.queryString += headings[i] + " = " + values[i];
    if (i!=headings.length-1) req.queryString += ", ";
  }
  req.queryString += " WHERE ID = '"+req.body.ID+"';";
  console.log(req.queryString);
  next();
}, function(req,res,next) {
  dbConnection
    .execute(req.queryString)
    .on('done', function(data) {
      console.log("Update Success");
      req.queryResult = {};
      next('route');
    })
    .on('fail', function(error) {
      console.error(error);
      res.status(500);
      res.send(error);
    });
});

router.use('/update_multiple', function(req,res,next){
  console.log(req.body);
  req.queryString = [];
  for (var m = 0; m < req.body.length; m++) {
    var qStr = "UPDATE EnrollmentData SET ";
    var headings = Object.keys(req.body[m]);
    var values = Object.keys(req.body[m]).map(function(key){return "'"+req.body[m][key]+"'"});
    for (i in headings) {
      if (headings[i] === "ID") continue;
      qStr += headings[i] + " = " + values[i];
      if (i!=headings.length-1) qStr += ", ";
    }
    qStr += " WHERE ID = '"+req.body[m].ID+"';";
    req.queryString.push(qStr);
  }
  next();
  console.log(req.queryString);
}, function(req,res,next) {
  async.each(req.queryString,
    function (query, done) {
      dbConnection
        .execute(query)
        .on('done', function(data) {
          done();
        })
        .on('fail', function(error) {
          done(error);
        });
    }, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        console.log("Insertion Successful");
        req.queryResult = {};
        next('route');
      }
    }
  );
});

router.use('/insert', function(req,res,next){
  req.queryString = [];
  for (var i = 0 ; i < req.body.length; i++) {
    var headings = Object.keys(req.body[i]).join();
    var values = Object.keys(req.body[i]).map(function(key){return "\""+req.body[i][key]+"\""});
    req.queryString.push('INSERT INTO EnrollmentData ('+headings+') VALUES ('+values+');');
  }
  next();
}, function(req,res,next) {
  async.each(req.queryString,
    function (query, done) {
      dbConnection
        .execute(query)
        .on('done', function(data) {
          done();
        })
        .on('fail', function(error) {
           done(error);
        });
    }, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        console.log("Insertion Successful");
        req.queryResult = {};
        next('route');
      }
    }
  );
});

router.use('/execute', function(req,res,next){
  req.queryString = req.body.data;
  next();
}, function(req,res,next) {
  dbConnection
    .execute(req.queryString)
    .on('done', function(data) {
      req.queryResult = "Success";
      next('route');
    })
    .on('fail', function(error) {
      console.error(error);
      req.queryResult = error;
      next('route');
    });
});

router.use('/query', function(req,res,next){
  req.queryString = req.body.data;
  console.log(req.queryString);
  next();
}, function(req,res,next) {
  dbConnection
    .query(req.queryString)
    .on('done', function(data) {
      req.queryResult = data;
      next('route');
    })
    .on('fail', function(error) {
      console.error(error);
      req.queryResult = error;
      next('route');
    });
});

router.all('*',function(req, res) {
  res.end(JSON.stringify(req.queryResult, null, 2));
});


module.exports = router;
*/

},{}],2:[function(require,module,exports){
var exports = module.exports;

/******************************************************************************
Table-util API
******************************************************************************/

//get today's date (mmddyyyy)
exports.date = function () {
  var today = new Date();
  var dd = today.getDate();

  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  if(dd<10)
  {
    dd='0'+dd;
  }

  if(mm<10)
  {
    mm='0'+mm;
  }
  return mm+'/'+dd+'/'+yyyy;
}

//generate random 12 digit id
exports.guid = function () {
  return Math.round(Math.random() * (1000000000000 - 100000000000) + 100000000000);
}

},{}],3:[function(require,module,exports){
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

},{"./build_Query_String.js":1,"./table-util.js":2,"./table_fields.js":4}],4:[function(require,module,exports){
module.exports.fields = function (type) {
  var fields = general_fields.concat(getFieldsBasedOnType(type));
  for (var i = 1; i < fields.length; i++) {
    var item = fields[i];
    item.type = item.type || "text";
    item.align = item.align || "center";
    //item.validate = item.validate === "required" ? "required" : "none";
    item.title = item.title || trimItemName (item);
    item.width = item.width || calcColWidth (item);
    if (type === "enrollment_search" && (item.name === "ID" || item.name === "ClientID" || item.name === "SubmissionDate"))
      item.editTemplate = disabledEditTemplate;
    else if (type === "enrollment_search" && item.name !== "EnrollStatus")
      item.editTemplate = defaultEditTemplate;
  }
  return fields;
}

module.exports.defaults = function (type) {
  if (type.indexOf("enrollment") !== -1)
    return enrollment_defaults;
  else if(type.indexOf("sourcedata") !== -1)
    return [sourcedata_defaults_one, sourcedata_defaults_two];
  else if(type.indexOf("reporting") !== -1)
    return reporting_defaults;
  else if (type.indexOf("election") !== -1)
    return election_defaults;
}

function getFieldsBasedOnType (type) {
  if (type.indexOf("enrollment") !== -1)
    return enrollment_fields;
  else if(type.indexOf("sourcedata") !== -1)
    return sourcedata_fields;
  else if(type.indexOf("reporting") !== -1)
    return reporting_fields;
  else if (type.indexOf("election") !== -1)
    return election_fields;
  else if (type === "general")
    return [];

}



var enrollment_defaults = {
  UserID: '',
  Description: '',
  Comment: '',
  TypeDepartmentId: '',
  PhoneType: 'HOME',
  PhoneNumber: '413164369',
  BirthDate: '01/22/1970',
  EnrolmentDate: '01/01/2005',
  HireDate: '01/01/2005',
  FulltimePartTime: 'F',
  AddressCity: 'Toronto',
  AddressLine1: '1 University Ave',
  AddressPostalCode: 'M5J 2P1',
  AddressState: 'ON',
  Gender: 'M',
  CountryCode: 'CAN',
  NationalIdType: 'PR',
  BenefitProgramName: 'OMR',
  BenefitSystem: 'BN',
  EmpClass: '65',
  EmpRecordType: '1',
  Format: 'English',
  JobCode: 'Other',
  MemberClass: 'CL01',
  NotificationType: 'General',
  PensionPlanType: '80',
  RateCode: 'NAANNL',
  TypeCompRate: '75000',
  UnionCode: 'O01',
  ConsentIndicator: 'N'
};

var sourcedata_defaults_one = {
  StartDate: '',
  EndDate: '',
  ServiceAmt: '12',
  EarningsAmt: '120683.6',
  ServiceEarningsType: 'CR1',
  ContributionAmt: '15530.43',
  ContributionType: 'RPP1',
  CarryForward: 'N',
  PostEvent: 'N'
};

var sourcedata_defaults_two = {
  StartDate: '',
  EndDate: '',
  ServiceAmt: '0',
  EarningsAmt: '17867',
  ServiceEarningsType: 'PA1',
  ContributionAmt: '0',
  ContributionType: '',
  CarryForward: 'N',
  PostEvent: 'N'
};

var reporting_defaults = {
  EventSubTypeID: 'Termination',
  EventDate: '12/31/2014',
  NumberOfEventCalculations: '2'
};

var election_defaults = {
  EventOption: "Deferred Pension",
  EventComponent: "RPP Deferred Pension",
  DestinationType: "Non Tax Sheltered",
  BankAccountsType: "Bank Account",
  BankID: "001",
  BankBranchID: "00011",
  AccountNumber: "1234567",
  PaymentMethod: "Cheque",
  BankInfo: ""
};



var general_fields =
[
  {
    type: "control",
    name: "Control",
    width: "80px",
    modeSwitchButton: false,
    headerTemplate: function() {
        return $("<button>")
                .attr("type", "button")
                .attr("class","control-btn")
                .text("New data")
                .on("click", function () {
                    $(".newdata-modal").dialog("open");
                });
    }
  },
  { name: "ClientID", visible: false},
  { name: "UserID", visible: false},
  { name: "ID", width: "120px", visible: false},
  { name: "SubmissionDate", visible: false},
  { name: "RequestType", visible: false},
  { name: "OverallStatus", title: "Overall Status", type: "select",
    items: [
      {Id: ""},
      {Id: "submitted"},
      {Id: "new"},
      {Id: "used"},
      {Id: "failed"},
      {Id: "terminated"},
      {Id: "data issue"}],
    valueField: "Id",
    textField: "Id",
    editTemplate: statusEditTemplate,
    visible: false},
]

var enrollment_fields =
[
  { name: "EnrollStatus", title: "EnrollStatus", type: "select",
    items: [
      {Id: ""},
      {Id: "submitted"},
      {Id: "new"},
      {Id: "used"},
      {Id: "failed"},
      {Id: "terminated"},
      {Id: "data issue"}],
    valueField: "Id",
    textField: "Id",
    editTemplate: statusEditTemplate,
    visible: false},
  { name: "Comment"},
  { name: "Description"},
  { name: "Env", visible: false},
  { name: "TypeDepartmentId"},
  { name: "DepartmentCode", visible: false},
  { name: "PhoneType"},
  { name: "PhoneNumber"},
  { name: "BirthDate"},
  { name: "EnrolmentDate"},
  { name: "HireDate"},
  { name: "Gender"},
  { name: "FulltimePartTime"},
  { name: "AddressLine1"},
  { name: "AddressCity"},
  { name: "AddressState"},
  { name: "AddressPostalCode"},
  { name: "CountryCode"},
  { name: "NationalIdType"},
  { name: "Format"},
  { name: "EmpRecordType"},
  { name: "JobCode"},
  { name: "EmpClass"},
  { name: "UnionCode"},
  { name: "RateCode"},
  { name: "BenefitSystem"},
  { name: "TypeCompRate"},
  { name: "BenefitProgramName"},
  { name: "NotificationType"},
  { name: "PensionPlanType"},
  { name: "MemberClass"},
  { name: "ConsentIndicator"}
];

var sourcedata_fields =
[
  { name: "SDStatus", title: "Status", type: "select",
    items: [
      {Id: ""},
      {Id: "submitted"},
      {Id: "new"},
      {Id: "used"},
      {Id: "failed"},
      {Id: "terminated"},
      {Id: "data issue"}],
    valueField: "Id",
    textField: "Id",
    visible: false},
  { name: "StartDate"},
  { name: "EndDate"},
  { name: "ServiceAmt"},
  { name: "EarningsAmt"},
  { name: "ServiceEarningsType", type: "select",
    items: [
      {Id: ""},
      {Id: "CR1"},
      {Id: "PA1"}],
    valueField: "Id",
    textField: "Id"},
  { name: "ContributionAmt"},
  { name: "ContributionType"},
  { name: "CarryForward"},
  { name: "PostEvent"}
];

var reporting_fields =
[
  { name: "ReportingStatus", title: "Status", type: "select",
    items: [
      {Id: ""},
      {Id: "submitted"},
      {Id: "new"},
      {Id: "used"},
      {Id: "failed"},
      {Id: "terminated"},
      {Id: "data issue"}],
    valueField: "Id",
    textField: "Id",
    visible: false},
  { name: "EventSubTypeID"},
  { name: "NumberOfEventCalculations"},
  { name: "EventDate"}
];

var election_fields =
[
  { name: "ElectionStatus", title: "Status", type: "select",
    items: [
      {Id: ""},
      {Id: "submitted"},
      {Id: "new"},
      {Id: "used"},
      {Id: "failed"},
      {Id: "terminated"},
      {Id: "data issue"}],
    valueField: "Id",
    textField: "Id",
    visible: false},
  { name: "EventOption"},
  { name: "EventComponent"},
  { name: "DestinationType"},
  { name: "BankAccountsType"},
  { name: "BankID"},
  { name: "BankBranchID"},
  { name: "AccountNumber"},
  { name: "PaymentMethod"},
  { name: "BankInfo"},
];


function trimItemName (item) {
  return item.name.replace(/ID/g, "Id").replace(/([A-Z])/g, ' $1').trim();
}

function calcColWidth(item) {
  return (item.title.length*12+35).toString()+"px";
}

function statusEditTemplate(value, item) {
  var $select = this.__proto__.editTemplate.call(this);
  $select.val(value);
  $select.find("option[value='']").remove();
  if (item.EnrollStatus==="submitted") {
    $select.find("option[value='data issue'],option[value='new'],option[value='used'],option[value='failed']").remove();
  } else if (item.EnrollStatus==="failed") {
    $select.find("option[value='new'],option[value='used'],option[value='data issue']").remove();
  } else if (item.EnrollStatus==="new") {
    $select.find("option[value='data issue'],option[value='failed'],option[value='terminated'],option[value='submitted']").remove();
  } else if (item.EnrollStatus==="data issue") {
    $select.find("option[value='failed'],option[value='new'],option[value='used']").remove();
  } else if (item.EnrollStatus==="terminated") {
    $select.find("option").remove();
  } else if (item.EnrollStatus==="used") {
    $select.find("option[value='data issue'],option[value='failed'],option[value='submitted']").remove();
  }
  return $select;
}

function defaultEditTemplate(value, item) {
  var $input = this.__proto__.editTemplate.call(this);
  $input.prop("value",value);

  if (item.EnrollStatus==="submitted" || item.EnrollStatus==="new" || item.EnrollStatus==="used" || item.EnrollStatus === "terminated") {
    $input.prop('readonly', true).css('background-color', '#EBEBE4');
  }
  return $input;
}

function disabledEditTemplate (value, item) {
  var $input = this.__proto__.editTemplate.call(this);
  $input.prop("value",value).prop('readonly', true).css('background-color', '#EBEBE4');
  return $input;
}

},{}]},{},[3]);
