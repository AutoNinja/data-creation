(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/******************************************************************************
Fields
******************************************************************************/

var exports = module.exports;

exports.getDefaults = function (type) {

  if (type == "modal") {
    return filterDefaultFields([
      "DepartmentCode",
      "RequestType",
      "Status",
      "Env",
      "ClientID",
      "ID",
      "SubmissionDate"
    ]);
  } else {
    return filterDefaultFields();
  }

}


/******************************************************************************
Private Functions
******************************************************************************/


//filters fields object based on discard array
function filterDefaultFields (discard) {
  var newDefaults = defaults;
  if (discard == undefined || discard == null) return newDefaults;

  for (var i = 0; i < discard.length; i++) {
    delete newDefaults[discard[i]];
  }
  return newDefaults;
};


var defaults = {
  UserID: '',
  Description: '',
  TypeDepartmentId: '',
  AddressCity: 'Toronto',
  AddressLine1: '1 University Ave',
  AddressPostalCode: 'M5J 2P1',
  AddressState: 'ON',
  BenefitProgramName: 'OMR',
  BenefitSystem: 'BN',
  BirthDate: '01/22/1970',
  ClientID: '',
  CountryCode: 'CAN',
  DepartmentCode: '',
  EmpClass: '65',
  EmpRecordType: '1',
  EnrolmentDate: '01/01/1963',
  Env: '',
  Format: 'English',
  FulltimePartTime: 'P',
  Gender: 'F',
  HireDate: '12/14/2014',
  ID: '',
  JobCode: 'Other',
  MemberClass: 'NRA65',
  NationalIdType: 'PR',
  NotificationType: 'General',
  PensionPlanType: '80',
  PhoneNumber: '413-164-369',
  PhoneType: 'HOME',
  RateCode: 'NAANNL',
  RequestType: 'R',
  Status: 'submitted',
  SubmissionDate: '',
  TypeCompRate: '75000',
  UnionCode: 'O02'
};

},{}],2:[function(require,module,exports){
/******************************************************************************
Fields
******************************************************************************/
var defaults = require('./defaults.js').getDefaults();

var exports = module.exports;

//type = ["newdata","search"]
exports.getFields = function (type) {

  var newFields = fields;

  for (var i = 0; i < newFields.length; i++) {

    var item = newFields[i];

    //set type
    if (item.type == undefined || item.type.type == "")
      item.type = "text";

    //set alignment
    item.align = "center";

    //set validate except for ClientID
    //if (item.name !== "ClientID")
    item.validate = "required";

    //set display headings
    setTitle(item);

    //set width
    setColumnWidth(item);
  }

  var control = {};

  if (type === "newdata") {

    var hideColumns = [
      "DepartmentCode",
      "RequestType",
      "Status",
      "Env",
      "ClientID",
      "ID",
      "SubmissionDate"
    ];

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      if (hideColumns.indexOf(item.name)>-1)
        item.visible = false;


    }

    //add control column
    control = {
        type: "control",
        name: "Control",
        width: "80px",
        modeSwitchButton: false,
        editButton: false,
        headerTemplate: function() {
            return $("<button>").attr("type", "button").attr("id","control-btn").text("New Data");
        }
    };

  } else if (type === "search") {

    var hideColumns = [
      "RequestType",
      "Env",
      "DepartmentCode"
    ];

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      setEditTemplate(item);

      if (hideColumns.indexOf(item.name)>-1)
        item.visible = false;

      if (item.name==="ClientID")
        item.validate = "";

      //initialize insert template
      setDefaultInsertTemplate(item);

    }

    control = {
      name: "control",
      type: "control",
      deleteButton: false,
      editButton: false,
      width:"80px"
    }

  } else if (type === "result") {
    var hideColumns = [
      "DepartmentCode",
      "RequestType",
    ];

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      if (hideColumns.indexOf(item.name)>-1)
        item.visible = false;
    }
  } else {

  }

  if (control !== {})
    newFields.unshift(control);

  return newFields;
}



/******************************************************************************
Private functions
******************************************************************************/



function setTitle (item) {
  //trim off 'Type'
  if (item.name.substring(0,4)==="Type") {
    item.title = item.name.substring(4,item.name.length);
  } else {
    item.title = item.name;
  }
  //change "ID" to "Id" for consistency
  item.title = item.title.replace(/ID/g, "Id");
  //insert space between capital letters
  item.title = item.title.replace(/([A-Z])/g, ' $1').trim()
}

function setColumnWidth(item) {
  var baseWidth;
  if (item.title==="Id")
    baseWidth = 100;
  else
    baseWidth = 35;
  return item.width=(item.title.length*12+baseWidth).toString()+"px";
}

function setDefaultInsertTemplate (item) {
  var value = defaults[item.name];
  item.insertTemplate = function () {
    var input = this.__proto__.insertTemplate.call(this);
    input.val(value)
    return input;
  }
}

function setEditTemplate(col) {
  if (col.name === "Status") {
    col.editTemplate = function (value, item) {
      var $select = this.__proto__.editTemplate.call(this);
      $select.val(value);
      $select.find("option[value='']").remove();
      if (item.Status==="submitted") {
        $select.find("option[value='new']").remove();
        $select.find("option[value='used']").remove();
        $select.find("option[value='failed']").remove();
      } else if (item.Status==="failed") {
        $select.find("option[value='new']").remove();
        $select.find("option[value='used']").remove();
      } else if (item.Status==="new") {
        $select.find("option[value='failed']").remove();
        $select.find("option[value='terminated']").remove();
        $select.find("option[value='submitted']").remove();
      }
      return $select;
    }
  } else {

    col.editTemplate = function (value, item) {
      var $input = this.__proto__.editTemplate.call(this);
      $input.prop("value",value);
      if (item.Status==="submitted" || item.Status==="failed") {
        if (col.name === "ClientID" ||
            col.name === "UserID" ||
            col.name === "ID" ||
            col.name === "SubmissionDate")
        {
          $input.prop('readonly', true);
          $input.css('background-color' , '#EBEBE4');
        }
      } else {
        $input.prop('readonly', true);
        $input.css('background-color' , '#EBEBE4');
      }
      return $input;
    }

  }
}


var fields =
[
  { name: "ClientID"},
  { name: "Status", type: "select",
    items: [
      {Id: ""},
      {Id: "submitted"},
      {Id: "new"},
      {Id: "used"},
      {Id: "failed"},
      {Id: "terminated"}],
    valueField: "Id",
    textField: "Id"},
  { name: "UserID"},
  { name: "Description"},
  { name: "TypeDepartmentId"},
  { name: "DepartmentCode"},
  { name: "ID"},
  { name: "RequestType"},
  { name: "Env"},
  { name: "SubmissionDate"},
  { name: "Gender"},
  { name: "BirthDate"},
  { name: "NationalIdType"},
  { name: "CountryCode"},
  { name: "AddressLine1"},
  { name: "AddressCity"},
  { name: "AddressState"},
  { name: "AddressPostalCode"},
  { name: "Format"},
  { name: "PhoneType"},
  { name: "PhoneNumber"},
  { name: "EmpRecordType"},
  { name: "FulltimePartTime"},
  { name: "HireDate"},
  { name: "JobCode"},
  { name: "EmpClass"},
  { name: "UnionCode"},
  { name: "RateCode"},
  { name: "BenefitSystem"},
  { name: "TypeCompRate"},
  { name: "BenefitProgramName"},
  { name: "EnrolmentDate"},
  { name: "NotificationType"},
  { name: "PensionPlanType"},
  { name: "MemberClass"}
];

},{"./defaults.js":1}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
var util = require('./table-util.js');

/******************************************************************************
Table API
******************************************************************************/



module.exports.createTable = function (type, fields) {

  //base options
  var options = {};


  if (type === "newdata") {
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
    }
  } else if (type === "search") {

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
            });

            return d.promise();
          },

          //submit updated data to db
          updateItem: function(item) {
            console.log(item);
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

        fields: fields
    };

  } else if (type === "result") {
    options = {
      width: "100%",
      paging: true,
      autoload: true,
      autowidth: false,

      pageSize: 15,
      pageButtonCount: 5,
      noDataContent: "No Data",
      loadIndicationDelay: 0,

      fields: fields
    }
  }


  $("#jsGrid").jsGrid(options);
}

module.exports.setTableColumnVisible = function (cols, visibility) {
  for (item in cols) {
    $("#jsGrid").jsGrid("fieldOption", cols[item], "visible", visibility);
  }
}

/******************************************************************************
Private functions
******************************************************************************/

},{"./table-util.js":3}],5:[function(require,module,exports){
var table = require("./library/table.js");
var fields = require("./library/fields.js");

$(document).ready(function() {

  table.createTable("search", fields.getFields("search"));

  $('#home').click(function() {window.location.replace("/");});
});

},{"./library/fields.js":2,"./library/table.js":4}]},{},[5]);
