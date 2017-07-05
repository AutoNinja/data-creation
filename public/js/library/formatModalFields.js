(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/******************************************************************************
Modal Fields API
******************************************************************************/
var exports = module.exports;

//import fields(columns) for different tables
var fields = require("./modal_fields.js");

exports.getDefaults = function (type) {
  if (type === "modal_enrollment_manual") {
    return filterDefaultFields(fields.enrollment, [
      "DepartmentCode",
      "RequestType",
      "Status",
      "Env",
      "ClientID",
      "ID",
      "SubmissionDate"
    ]);
  } else if (type === "modal_enrollment_automation") {
    return filterDefaultFields(fields.enrollment, [
      "DepartmentCode",
      "Status",
      "Env",
      "ClientID",
      "SubmissionDate"
    ]);
  } else if  (type === "modal_sourcedata_manual") {
    return [fields.sourcedata1, fields.sourcedata2];
  } else if  (type === "modal_reporting_manual") {
    return fields.reporting;
  } else if  (type === "modal_election_manual") {
    return fields.election;
  }




}


/******************************************************************************
Private Functions
******************************************************************************/


//filters fields object based on discard array
function filterDefaultFields (fields, discard) {
  if (discard == undefined || discard == null) return fields;

  for (var i = 0; i < discard.length; i++) {
    delete fields[discard[i]];
  }
  return fields;
};

},{"./modal_fields.js":2}],2:[function(require,module,exports){
module.exports.enrollment = {
  UserID: '',
  Description: '',
  Comment: '',
  TypeDepartmentId: '',
  RequestType: '',
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

module.exports.sourcedata1 = {
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

module.exports.sourcedata2 = {
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

module.exports.reporting = {
  ID: '',
  EventSubTypeID: 'Termination',
  NumberOfEventCalculations: '9',
  EventDate: '12/31/2014'
};

module.exports.election = {
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

},{}]},{},[1]);
