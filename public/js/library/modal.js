(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/******************************************************************************
Fields
******************************************************************************/

var exports = module.exports;

exports.getDefaults = function (type) {

  if (type == "defaults-manual") {
    return filterDefaultFields([
      "DepartmentCode",
      "RequestType",
      "Status",
      "Env",
      "ClientID",
      "ID",
      "SubmissionDate"
    ]);
  } else if (type == "defaults-automation"){
    return filterDefaultFields([
      "DepartmentCode",
      "Status",
      "Env",
      "ClientID",
      "SubmissionDate"
    ]);
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

},{}],2:[function(require,module,exports){
var defaults = require("./defaults.js");
var exports = module.exports;

/******************************************************************************
MODAL API
******************************************************************************/


exports.createModal = function (target, type) {
  modalId = target;
  var fields = defaults.getDefaults(type);
  $(modalId).dialog({
      width: "70%",
      autoOpen: false,
      height: $(window).height(),
      position: {
        my: "center",
        at: "top",
        of: window
      },
      modal: true,
      title: "Create New Data",
      close: function() {resetModal(fields);}
  });
  renderModal(fields);
  setupValidation(fields);
};

exports.show = function (target) {
    $(target).dialog("open");
};

/******************************************************************************
MODAL PRIVATE FUNCTIONS
******************************************************************************/

var modalId;

//takes in fields object and render labels and textboxes on modal
var renderModal = function (fields) {

  for (var name in fields) {

    var displayText = name;


    if (Cookies.get('UserID')!==undefined && Cookies.get('UserID')!=="") {
  		fields.UserID = Cookies.get("UserID");
  	}

    if (name != "RequestType")
     displayText = name.replace("Type","");

    $("#detailsForm")
      .append("<div class='row r-"+name+"'></div>");

    $(".r-"+name)
      .append("<div class='col-xs-4 col-sm-4 c-1'></div>");

    $(".r-"+name)
      .append("<div class='col-xs-8 col-sm-8 c-2'></div>");

    $('<label>', {
      for: name,
      text: displayText+":"
    }).appendTo(".r-"+name+" .c-1");

    $('<input>', {
      type: "text",
      name: name,
      id: name,
      value: fields[name]
    }).appendTo(".r-"+name+" .c-2");

    if (name.indexOf("Date") !== -1) {
      if (name.indexOf("Enrolment") !== -1) {
        $( "#"+name ).datepicker({ dateFormat: 'dd/mm/yy', yearRange: "-80:+50", changeYear: true, changeMonth: true});
        $( "#"+name ).tooltip({placement: "top", title:"Format: dd/mm/yy"});
      } else {
        $( "#"+name ).datepicker({ dateFormat: 'mm/dd/yy', yearRange: "-80:+50", changeYear: true, changeMonth: true });
        $( "#"+name ).tooltip({placement: "top", title:"Format: mm/dd/yy"});
      }
    }
  }
};

//reset fields to default
//reset error messages
var resetModal = function (fields) {

  for (var name in fields) {
    $('#'+name).val(fields[name]);
  }

  $(modalId+" form").validate().resetForm();
  $(modalId+" form").find(".error").removeClass("error");
};

/******************************************************************************
FORM SUBMISSION VALIDATION
******************************************************************************/
//JQuery Validation plug in setup
function setupValidation(fields) {
  $(modalId+" form").validate({
      rules: createRules(fields),
      submitHandler: function() {
        formSubmitHandler(fields);
      }
  });
};

//dynamically set rules for all fields
function createRules(fields) {

  var rules = {};

  for (var name in fields) {
    if (name!="ClientID" && name!="Comment")
      rules[name] = {required: true};
  }

  return rules;
};

//get user input data from modal
function formSubmitHandler(fields) {
  var newData = {};

  for (var name in fields) {newData[name] =  $("#"+name).val();}

  $("#jsGrid").jsGrid("insertItem", newData);

  resetModal(fields);

  //$(modalId).dialog("close");
};

},{"./defaults.js":1}]},{},[2]);
