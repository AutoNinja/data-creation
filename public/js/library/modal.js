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

},{"./modal_fields.js":3}],2:[function(require,module,exports){
var formatFields = require("./formatModalFields.js");
var exports = module.exports;

/******************************************************************************
MODAL API
******************************************************************************/


exports.createModal = function (target, type) {
  modalId = target;
  var fields = formatFields.getDefaults(type);
  if (type.indexOf('sourcedata') > -1) fields = fields[0];
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

exports.createIDSearchModal = function (target, type) {
  var fields = formatFields.getDefaults(type);
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
    title: "You Must Provide The Following Information Before Proceeding"
  });

  $(target).submit(function (e) {
    $('.lock').show();
    var ID = $("#enrollmentID").val();

    var query;

    $.post("/db/query",{data: "SELECT Progress, UserID, SubmissionDate, SDStatus, StartDate, EndDate, ServiceAmt, EarningsAmt, ServiceEarningsType, ContributionAmt, ContributionType, PostEvent, CarryForward FROM EnrollmentData WHERE ID = '"+ID+"';"})
    .done(function (res) {
      $('.lock').hide();
      res = JSON.parse(res);
      console.log(res);
      if (res.length === 0) {
        alert('The Enrollment ID You Entered Does Not Exist');
        return;
      }
      if (type === "modal_sourcedata_search" && res[0].Progress != '2')
      {
        alert("The Enrollment ID You Entered Is Not Available For The Current Step");
        return;
      }

      var rowsCount;

      $.each(res[0], function(index, item) {
        if (index !== "SDStatus" && index !== "Progress" && index !== "UserID" && index !== "SubmissionDate" && index !== "ClientID") {
          res[0][index] = item.split(',');
          rowsCount = res[0][index].length;
        }
      });


      for (var i = 0 ; i < rowsCount; i++) {
        var tempRow = $.extend({}, res[0]);
        $.each(tempRow, function(index, item) {
          if (index !== "SDStatus" && index !== "Progress" && index !== "UserID" && index !== "SubmissionDate"  && index !== "ClientID")
            tempRow[index] = res[0][index][i];
          tempRow.ID = ID;
        });
        $("#jsGrid").jsGrid("insertItem", tempRow);
      }

      $(target).dialog('close');
    })
    .fail(function() {
      alert("Internal Server Error");
      window.location.reload();
    });
    e.preventDefault();
  });
}

exports.createIDModal = function (target, type) {
  var fields = formatFields.getDefaults(type);
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
    title: "You Must Provide The Following Information Before Proceeding"
  });

  $(target).submit(function (e) {
    $('.lock').show();
    var ID = $("#enrollmentID").val();

    var query;

    $.post("/db/query",{data: "SELECT * FROM EnrollmentData WHERE ID = '"+ID+"';"})
    .done(function (res) {
      $('.lock').hide();
      res = JSON.parse(res);
      if (res.length === 0) {
        alert('The Enrollment ID You Entered Does Not Exist');
        return;
      }
      if ((type === "modal_sourcedata_manual" && res[0].Progress != '1') ||
        (type === "modal_reporting_manual" && res[0].Progress != '2')  ||
        (type === "modal_election_manual" && res[0].Progress != '3'))
      {
        alert("The Enrollment ID You Entered Is Not Available For The Current Step");
        return;
      }
      if (type === "modal_sourcedata_manual") {
        initSourceDataTable (target,fields)
      }
      $(target).dialog('close');
    })
    .fail(function() {
      alert("Internal Server Error");
      window.location.reload();
    });
    e.preventDefault();
  });
}

exports.show = function (target) {
    $(target).dialog("open");
};

/******************************************************************************
MODAL PRIVATE FUNCTIONS
******************************************************************************/

var modalId;

var initSourceDataTable = function (target, fields) {
  var startYear = $(target + " #masterStartYear").val();
  var endYear = $(target + " #masterEndYear").val();
  var numOfRows = endYear - startYear + 1;
  if (numOfRows > 200) {
    alert("Error: Maximum Number Of Year Limit Exceeded");
    return;
  }
  if (endYear < startYear) {
    alert("Error: Invalid Start and End Year");
    return;
  }
  while (startYear <= endYear) {
    var newData = $.extend({},fields[0]);
    var startDate = new Date (startYear, 0, 1);
    var endDate = new Date (startYear, 11, 31);
    newData.StartDate = moment(startDate).format('MM/DD/YYYY').toString();
    newData.EndDate = moment(endDate).format('MM/DD/YYYY').toString();
    $("#jsGrid").jsGrid("insertItem", newData);

    newData = $.extend({},fields[1]);
    newData.StartDate = moment(startDate).format('MM/DD/YYYY').toString();
    newData.EndDate = moment(endDate).format('MM/DD/YYYY').toString();
    $("#jsGrid").jsGrid("insertItem", newData);


    ++startYear;
  }
}
//takes in fields object and render labels and textboxes on modal
var renderModal = function (fields) {

  for (var name in fields) {

    var displayText = name;

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

    if (Cookies.get('UserID')!==undefined && Cookies.get('UserID')!=="") {
  		$("#UserID").val(Cookies.get("UserID"));
  	}

    if (name.indexOf("Date") !== -1) {
      $( "#"+name ).attr('data-toggle','tooltip');
      if (name.indexOf("Enrolment") !== -1) {
        $( "#"+name ).datepicker({ dateFormat: 'dd/mm/yy', yearRange: "-80:+50", changeYear: true, changeMonth: true});
        $( "#"+name ).attr('title','dd/mm/yy');
      } else {
        $( "#"+name ).datepicker({ dateFormat: 'mm/dd/yy', yearRange: "-80:+50", changeYear: true, changeMonth: true });
        $( "#"+name ).attr('title','mm/dd/yy');
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

},{"./formatModalFields.js":1}],3:[function(require,module,exports){
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

},{}]},{},[2]);
