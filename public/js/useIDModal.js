(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var fields = require("./table_fields.js").defaults;
var exports = module.exports;

/******************************************************************************
MODAL API
******************************************************************************/


exports.createModal = function (target) {
  $( target ).dialog({
    dialogClass: "no-close",
    autoOpen: true,
    draggable: false,
    width: "50%",
    height: $(window).height()/2,
    position: {
      my: "center",
      at: "center",
      of: window
    },
    modal: true,
    title: "Enter Either The Enrollment ID or Client ID"
  });
}

},{"./table_fields.js":2}],2:[function(require,module,exports){
module.exports.fields = function (type) {
  var fields = general_fields.concat(getFieldsBasedOnType(type));
  for (var i = 1; i < fields.length; i++) {
    var item = fields[i];
    item.type = item.type || "text";
    item.align = item.align || "center";
    //item.validate = item.validate || "required";
    item.title = item.title || trimItemName (item);
    item.width = item.width || calcColWidth (item);
    item.editTemplate = item.editTemplate || defaultEditTemplate;
  }
  return fields;
}

module.exports.defaults = function (type) {
  switch (type) {
    case "enrollment":
      return enrollment_defaults;
    case "sourcedata":
      return [sourcedata_defaults_one, sourcedata_defaults_two];
    case "reporting":
      return reporting_defaults;
    case "election":
      return election_defaults;
  }
}


function getFieldsBasedOnType (type) {
  switch (type) {
    case "enrollment":
      return enrollment_fields;
    case "sourcedata":
      return sourcedata_fields;
    case "reporting":
      return reporting_fields;
    case "election":
      return election_fields;
  }
}

var enrollment_defaults = {
  UserID: '',
  Description: '',
  Comment: '',
  ID: '',
  PhoneType: 'HOME',
  PhoneNumber: '413-164-369',
  BirthDate: '01/22/1970',
  EnrolmentDate: '01/01/1963',
  HireDate: '12/14/2014',
  FulltimePartTime: 'P',
  AddressCity: 'Toronto',
  AddressLine1: '1 University Ave',
  AddressPostalCode: 'M5J 2P1',
  AddressState: 'ON',
  Gender: 'F',
  CountryCode: 'CAN',
  NationalIdType: 'PR',
  BenefitProgramName: 'OMR',
  BenefitSystem: 'BN',
  ClientID: '',
  DepartmentCode: '',
  EmpClass: '65',
  EmpRecordType: '1',
  Env: '',
  Format: 'English',
  JobCode: 'Other',
  MemberClass: 'NRA65',
  NotificationType: 'General',
  PensionPlanType: '80',
  RateCode: 'NAANNL',
  Status: 'submitted',
  SubmissionDate: '',
  TypeCompRate: '75000',
  UnionCode: 'O02'
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
  ContributionType: 'RPP1',
  CarryForward: 'N',
  PostEvent: 'N'
};

var reporting_defaults = {
  ID: '',
  EventSubTypeID: 'Termination',
  NumberOfEventCalculations: '9',
  EventDate: '12/31/2014'
};

var election_defaults = {
  ID: '',
  EventOption: "Normal Retirement Pension",
  EventComponent: "RPP Pension",
  DestinationType: "",
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
    editButton: false,
    headerTemplate: function() {
        return $("<button>")
                .attr("type", "button")
                .attr("id","control-btn")
                .text("New data")
                .on("click", function () {
                    $(".newdata-modal").dialog("open");
                });
    }
  },
  { name: "ID", width: "120px", editTemplate: disabledEditTemplate},
  { name: "UserID", editTemplate: disabledEditTemplate},
  { name: "ClientID", editTemplate: disabledEditTemplate},
  { name: "SubmissionDate", editTemplate: disabledEditTemplate}
]

var enrollment_fields =
[
  { name: "Status", title: "EnrollStatus", type: "select",
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
    editTemplate: statusEditTemplate},
  { name: "Description"},
  { name: "Comment"},
  { name: "RequestType"},
  { name: "Env"},
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
    textField: "Id"},
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
    textField: "Id",
    editTemplate: statusEditTemplate},
  { name: "ContributionAmt"},
  { name: "ContributionType"},
  { name: "CarryForward"},
  { name: "PostEvent"}
];

var reporting_fields =
[
  { name: "EventStatus", title: "Status", type: "select",
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
    editTemplate: statusEditTemplate},
  { name: "EventSubTypeID"},
  { name: "NumberOfEventCalculations"},
  { name: "EventDate"}
];

var election_fields =
[
  { name: "ID"},
  { name: "UserID"},
  { name: "ClientID"},
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
    editTemplate: statusEditTemplate},
  { name: "SubmissionDate"},
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
  if (item.Status==="submitted") {
    $select.find("option[value='data issue'],option[value='new'],option[value='used'],option[value='failed']").remove();
  } else if (item.Status==="failed") {
    $select.find("option[value='new'],option[value='used']").remove();
  } else if (item.Status==="new") {
    $select.find("option[value='data issue'],option[value='failed'],option[value='terminated'],option[value='submitted']").remove();
  } else if (item.Status==="data issue") {
    $select.find("option[value='failed'],option[value='new'],option[value='used']").remove();
  }
  return $select;
}

function defaultEditTemplate(value, item) {
  var $input = this.__proto__.editTemplate.call(this);
  $input.prop("value",value);
  if (item.Status==="submitted" || item.Status==="failed" || item.Status==="data issue") {
    $input.prop('readonly', true).css('background-color', '#EBEBE4');
  }
  return $input;
}

function disabledEditTemplate (value, item) {
  var $input = this.__proto__.editTemplate.call(this);
  $input.prop("value",value).prop('readonly', true).css('background-color', '#EBEBE4');
  return $input;
}

},{}],3:[function(require,module,exports){
var modal = require("./library/id_modal.js");

$(document).ready(function() {

  modal.createModal("#ID-modal");


  $("#ID-modal").submit(function (e) {
    var ID = $("#IDInput").val();
    var IDType = $("#IDType").val();

    $.post("/db/query",{data: "SELECT * FROM EnrollmentData WHERE "+IDType+" = '"+ID+"';"})
    .done(function (res) {
      res = JSON.parse(res);
      if (!res.length && IDType === "ID") {
        alert('The Enrollment ID You Entered Does Not Exist! Try a different ID.');
        return;
      }
      if (res.length && res[0].Progress != '1') {
        alert("You Have Already Initiated An Event Creation! Try a different ID.");
        return;
      }

      $("#ID-modal").dialog('close');
      $("#confirm-modal").dialog('open');
    })
    .fail(function() {
      alert("Internal Server Error");
      window.location.reload();
    });
    e.preventDefault();
  });
});

},{"./library/id_modal.js":1}]},{},[3]);
