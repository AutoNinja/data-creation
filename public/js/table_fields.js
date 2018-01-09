(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  EmpClass: '65',
  EmpRecordType: '1',
  Format: 'English',
  JobCode: 'Other',
  MemberClass: 'NRA65',
  NotificationType: 'General',
  PensionPlanType: '80',
  RateCode: 'NAANNL',
  TypeCompRate: '75000',
  UnionCode: 'O02',
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
  ContributionType: 'RPP1',
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

},{}]},{},[1]);
