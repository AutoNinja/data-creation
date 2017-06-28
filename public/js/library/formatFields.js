(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports =
[
  { name: "ClientID"},
  { name: "Status", type: "select",
    items: [
      {Id: ""},
      {Id: "submitted"},
      {Id: "new"},
      {Id: "used"},
      {Id: "failed"},
      {Id: "terminated"},
      {Id: "data issue"}],
    valueField: "Id",
    textField: "Id"},
  { name: "UserID"},
  { name: "Description"},
  { name: "Comment"},
  { name: "ID"},
  { name: "RequestType"},
  { name: "Env"},
  { name: "SubmissionDate"},
  { name: "TypeDepartmentId"},
  { name: "DepartmentCode"},
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
  { name: "MemberClass"}
];

},{}],2:[function(require,module,exports){
module.exports =
[
  { name: "EventSubTypeID"},
  { name: "NumberOfEventCalculations"},
  { name: "EventDate"},
  { name: "IsElectionRequired"},
  { name: "EventOption_Election"},
  { name: "EventComponent_Election"},
  { name: "BankAccountsType"},
  { name: "BankID"},
  { name: "BankBranchID"},
  { name: "AccountNumber"},
  { name: "PaymentMethod"},
  { name: "BankInfo"}
];

},{}],3:[function(require,module,exports){
var exports = module.exports;

//import fields(columns) for different tables
var enrollment_fields = require("./enrollment_fields.js");
var event_fields = require("./event_fields.js");
var sourcedata_fields = require("./sourcedata_fields.js");

//format fields according to rules for each table
exports.getFields = function (type) {

  var newFields = [];

  if (type === "newdata_enrollment_manual") {

    newFields = enrollment_fields;

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
    var control = {
        type: "control",
        name: "Control",
        width: "80px",
        modeSwitchButton: false,
        editButton: false,
        headerTemplate: function() {
            return $("<button>").attr("type", "button").attr("id","control-btn").text("New Data");
        }
    };

    newFields.unshift(control);

  } else if (type === "search_enrollment_manual") {

    newFields = enrollment_fields;

    var hideColumns = [
      "RequestType",
      "Env",
      "DepartmentCode"
    ];

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      setEnrollmentEditTemplate(item);

      if (hideColumns.indexOf(item.name)>-1)
        item.visible = false;

      if (item.name==="ClientID" || item.name==="Comment")
        item.validate = "";

    }

    var control = {
      name: "control",
      type: "control",
      deleteButton: false,
      editButton: false,
      width:"80px"
    }

    newFields.unshift(control);

  } else if (type==="newdata_enrollment_automation"){

    newFields = enrollment_fields;

    var hideColumns = [
      "DepartmentCode",
      "Status",
      "Env",
      "ClientID",
      "SubmissionDate"
    ];

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      if (hideColumns.indexOf(item.name)>-1)
        item.visible = false;
    }

    //add control column
    var control = {
        type: "control",
        name: "Control",
        width: "80px",
        modeSwitchButton: false,
        editButton: false,
        headerTemplate: function() {
            return $("<button>").attr("type", "button").attr("id","control-btn").text("New Data");
        }
    };

    newFields.unshift(control);

  } else if (type === "search_enrollment_automation") {

    newFields = enrollment_fields;

    var hideColumns = [
      "DepartmentCode",
      "Env",
    ];

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      if (hideColumns.indexOf(item.name)>-1)
        item.visible = false;

      if (item.name==="ClientID" || item.name==="Comment")
        item.validate = "";

    }

    var control = {
      name: "control",
      type: "control",
      deleteButton: false,
      editButton: false,
      width:"80px"
    };

    newFields.unshift(control);

  }

  for (var i = 0; i < newFields.length; i++) {

    var item = newFields[i];

    //set type
    if (item.type == undefined || item.type == "")
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

function setEnrollmentEditTemplate(col) {
  if (col.name === "Status") {
    col.editTemplate = function (value, item) {
      var $select = this.__proto__.editTemplate.call(this);
      $select.val(value);
      $select.find("option[value='']").remove();
      if (item.Status==="submitted") {
        $select.find("option[value='data issue']").remove();
        $select.find("option[value='new']").remove();
        $select.find("option[value='used']").remove();
        $select.find("option[value='failed']").remove();
      } else if (item.Status==="failed") {
        $select.find("option[value='new']").remove();
        $select.find("option[value='used']").remove();
      } else if (item.Status==="new") {
        $select.find("option[value='data issue']").remove();
        $select.find("option[value='failed']").remove();
        $select.find("option[value='terminated']").remove();
        $select.find("option[value='submitted']").remove();
      } else if (item.Status==="data issue") {
        $select.find("option[value='failed']").remove();
        $select.find("option[value='new']").remove();
        $select.find("option[value='used']").remove();
      }
      return $select;
    }
  } else {

    col.editTemplate = function (value, item) {
      var $input = this.__proto__.editTemplate.call(this);
      $input.prop("value",value);
      if (item.Status==="submitted" || item.Status==="failed" || item.Status==="data issue") {
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

},{"./enrollment_fields.js":1,"./event_fields.js":2,"./sourcedata_fields.js":4}],4:[function(require,module,exports){
module.exports = 
[
  { name: "StartDate"},
  { name: "EndDate"},
  { name: "ServiceAMT"},
  { name: "EarningsAMT"},
  { name: "ServiceEarningsType"},
  { name: "ContributionAMT"},
  { name: "ContributionType"},
  { name: "CarryForward"},
  { name: "PostEvent"}
];

},{}]},{},[3]);
