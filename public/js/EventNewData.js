(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var util = require("./library/table-util.js");
var initcookies = require('./library/usecookies.js');
var fields = require('./library/table_fields').defaults;
var columns = require("./library/table_fields").fields;
var buildQueryString = require('./library/build_Query_String.js');

var step = -1;
var ClientID;
var UserID;
var Employer;
var finalItem = {};

// Main
$(document).ready(function() {
  initcookies();
  //$("[data-toggle='tooltip']").tooltip();
});

//initialize bind buttons
$(document).ready(function() {

  $('#submit').click(submitToDB);

  $('#insertCancel, #sdCancel').click(function () {
    $("#newdata-modal").dialog("close");
    --step;
  });

  // 'no' button on confirm modal
  $("#noconfirm, #insertCancel, #sdCancel").click(function () {
    $('#confirm-modal').dialog('close');
    switch (step) {
      case -1:
        step = 0;
        $('#confirm-modal').dialog('option', 'title', 'Do You Want to Create Source Data?').dialog('open');
        break;
      case 0:
        $('#existing-SD-modal').dialog('open');
        break;
      case 1:
        step = 2;
        $('#confirm-modal').dialog('option', 'title', 'Do You Want to Create Election Data?').dialog('open');
        break;
      default:
        showReviewPage();
        break;
    }
  });



  // 'yes' button on confirm modal
  $("#next").click(nextStep);

  // ID submit
  $("#ID-modal").submit(function (e) {
    var ID = $("#IDInput").val();
    var uID = $("#UserIDInput").val()

    ClientID = ID;
    UserID = uID;

    $("#ID-modal").dialog('close');
    if (step === 1)
      $('#sd-modal').dialog('open');

    e.preventDefault();
  });

  // 'submit' button on sourcedata modal
  $('#submitExistingSD').click(function () {

    var startYear = $('#existingStartYear').val();
    var endYear = $('#existingEndYear').val();
    var startDate = new Date (startYear, 0, 1);
    var endDate = new Date (startYear, 11, 31);
    var serviceEarningsType = $('#existingServiceEarningsType').val();
    var contributionType = $('#existingContributionType').val();
    if (endYear < startYear) {
      alert("Error: Invalid Start and End Year");
      return;
    }

    var newData = {};
    Employer = $('#existingEmployer').val();
    newData.StartDate = moment(startDate).format('MM/DD/YYYY').toString();
    newData.EndDate = moment(endDate).format('MM/DD/YYYY').toString();
    newData.ServiceEarningsType = serviceEarningsType;
    newData.ContributionType = contributionType;

    console.log(newData)

    $("#step1-table")
      .jsGrid("fieldOption", "ServiceAmt", "visible", false)
      .jsGrid("fieldOption", "EarningsAmt", "visible", false)
      .jsGrid("fieldOption", "CarryForward", "visible", false)
      .jsGrid("fieldOption", "PostEvent", "visible", false)
      .jsGrid("fieldOption", "ContributionAmt", "visible", false)
      .jsGrid("fieldOption", "Control", "visible", false)
      .jsGrid("option", "editing", false)
      .jsGrid("insertItem", newData);
    $( "#existing-SD-modal" ).dialog("close");
    sourceDataSave();
    $('#confirm-modal').dialog('option', 'title', 'Do You Want to Create Reporting Data?').dialog('open');
    step = 1;
  });

  // 'submit' button on sourcedata modal
  $('#submitSDYears').click(function () {
    var modalFields = fields("sourcedata");
    var startYear = $('#masterStartYear').val();
    var endYear = $('#masterEndYear').val();
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
      var newData = $.extend({},modalFields[0]);
      var startDate = new Date (startYear, 0, 1);
      var endDate = new Date (startYear, 11, 31);
      newData.StartDate = moment(startDate).format('MM/DD/YYYY').toString();
      newData.EndDate = moment(endDate).format('MM/DD/YYYY').toString();
      $("#step1-table").jsGrid("insertItem", newData);

      newData = $.extend({},modalFields[1]);
      newData.StartDate = moment(startDate).format('MM/DD/YYYY').toString();
      newData.EndDate = moment(endDate).format('MM/DD/YYYY').toString();
      $("#step1-table").jsGrid("insertItem", newData);
      ++startYear;
    }
    $( "#sd-modal" ).dialog("close");
    Employer = $('#SDEmployer').val();
    sourceDataSave();
  });
});

/*Initialize all dialogs*/
$(document).ready(function() {
  $( "#existing-SD-modal" ).dialog({
    dialogClass: "no-close",
    autoOpen: false,
    draggable: false,
    width: "50%",
    height: $(window).height(),
    position: {
      my: "center",
      at: "center",
      of: window
    },
    modal: true,
    title: "Enter Search Criteria For Exisiting Source Data"
  });

  $( "#ID-modal" ).dialog({
    dialogClass: "no-close",
    autoOpen: false,
    draggable: false,
    width: "50%",
    height: $(window).height()/2,
    position: {
      my: "center",
      at: "center",
      of: window
    },
    modal: true,
    title: "Enter A Client ID"
  });

  $( "#confirm-modal" ).dialog({
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
    title: 'Do You Need to Create New Enrollment?'
  });

  $( "#sd-modal" ).dialog({
    dialogClass: "no-close",
    autoOpen: false,
    draggable: false,
    width: "50%",
    height: $(window).height()/2,
    position: {
      my: "center",
      at: "center",
      of: window
    },
    modal: true,
    title: "Input a Start and End Year For Source Data"
  });

  $( "#newdata-modal" ).dialog({
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
    close: function() {resetModal();}
  });
});

/*Initialize all tables*/
$(document).ready(function() {
  $("#step0-table").jsGrid({
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
          item.EnrollStatus = "submitted";
          item.Env = Cookies.get("env");
          item.ClientID = "";
          item.DepartmentCode = item.TypeDepartmentId;
          item.SubmissionDate = util.date();
          item.ID = util.guid();
        }
      },
      fields: columns("enrollment")
    });

  $("#step1-table").jsGrid({
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

      fields: columns('sourcedata')
  });

  $("#step2-table").jsGrid({
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

    fields: columns('reporting')
  });

  $("#step3-table").jsGrid({
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

      fields: columns('election')
  });

});

//********************SUPPORT FUNCTIONS*******************************

function submitToDB () {

  $(".table-buttons-wrapper").hide();

  enrollmentSave();
  reportingSave();
  sourceDataSave();
  electionSave();

  if (ClientID == 'existing enrollment')
    finalItem.ClientID = '';
  else
    finalItem.ClientID = ClientID;

  finalItem.ID = util.guid();
  finalItem.UserID = UserID;
  finalItem.SubmissionDate = util.date();
  finalItem.RequestType = 'R';
  finalItem.Env = Cookies.get('env');
  finalItem.OverallStatus = "submitted";
  finalItem.TypeDepartmentId = Employer || finalItem.TypeDepartmentId;

  $.post("/db/execute",{data: buildInsertQueryString(finalItem)})
  .done(function(response){
    window.location.href = '/event';
    alert("Data Submitted, Your request ID is "+finalItem.ID);
  })
  .fail(function() {
    alert("Internal Server Error, Please Resubmit Data");
    location.reload();
  });

}

function showReviewPage () {
  if ($.isEmptyObject(finalItem)) {
    alert('You Have Not Entered Any Data!');
    window.location.href = '/event';
    return;
  }

  if (step === 4)
    return;
  step = 4;
  $('.table-container').show();
  $('#submit').show();
  //$('#save').hide();
  $('#ClientIDDisplay').text(ClientID);
  $('#meta').show();
  $(".table").jsGrid("fieldOption", "Control", "deleteButton", false);
  $("#step1-table").jsGrid("fieldOption", "Control", "deleteButton", true);
  $("#step0-table")
    .jsGrid("option", "noDataContent", "ClientID = "+ClientID+", UserID = "+UserID)
    .jsGrid("fieldOption", "UserID", "visible", true);
  $('.control-btn').hide();
  $('#step1-table .control-btn').show();
  renderNewDataModalFields (1);
}

function nextStep() {

  $('#confirm-modal').dialog('close');

  renderNewDataModalFields (++step);
  $('#newdata-modal').dialog('open');


  switch (step) {
    case 0:
      break;
    case 1:
      $('#newdata-modal').dialog('close');
      if (!ClientID)
        $('#ID-modal').dialog('open');
      else
        $('#sd-modal').dialog('open');
      break;
    case 2:
      if (!ClientID)
        $('#ID-modal').dialog('open');
      break;
    case 3:
      if (!ClientID)
        $('#ID-modal').dialog('open');
      break;
  }
}

function renderNewDataModalFields (step) {
  $('.newdata-content').html('');
  var modalFields = fields(getTypeFromStep(step));
  if (step === 1) modalFields = modalFields[0];

  $('#insertNewRow').off("click").click(function() {
    if (step != 1)
      $("#step"+step+"-table").jsGrid("option", "data", []);
    var newData = {};
    for (var name in modalFields) {newData[name] =  $("#"+name).val();}
    $("#step"+step+"-table").jsGrid("insertItem", newData);
    resetModal();

    switch (step) {
      case 0:
        enrollmentSave();
        break;
      case 1:
        sourceDataSave();
        break;
      case 2:
        reportingSave();
        break;
      case 3:
        electionSave();
        break;
    }
  });

  for (var name in modalFields) {

    $(".newdata-content")
      .append("<div class='row r-"+name+"'></div>");

    $(".r-"+name)
      .append("<div class='col-xs-4 col-sm-4 c-1'></div>")
      .append("<div class='col-xs-8 col-sm-8 c-2'></div>");

    $('<label>', {
      for: name,
      text: name+":"
    }).appendTo(".r-"+name+" .c-1");

    $('<input>', {
      type: "text",
      name: name,
      id: name,
      value: modalFields[name]
    }).appendTo(".r-"+name+" .c-2");

  	$("#UserID").val(Cookies.get("UserID") || "");

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
}

function resetModal () {
  var modalFields = fields(getTypeFromStep(step));
  if (step === 1) modalFields = modalFields[0];
  for (var name in modalFields) {
    if (name === "UserID") continue;
    $('#'+name).val(modalFields[name]);
  }
  $( "#newdata-modal" ).dialog('close');
};

function enrollmentSave() {
  var item = $("#step0-table").jsGrid("option", "data")[0];

  if (!$.isEmptyObject(item)) {
    item.Progress = '1';
    ClientID = 'existing enrollment';
    $.extend(finalItem,item);

  }

  $("#SDEmployer, #existingEmployer").hide();

  if (step != 4)
    $('#confirm-modal').dialog('option', 'title', 'Do You Want to Create New Source Data?').dialog('open');
}

function sourceDataSave () {
  var items = $.extend([],$("#step1-table").jsGrid("option", "data"));

  console.log(items);

  if (items.length !== 0) {
    var combined = {};
    for (var name in items[0]) {
      combined[name]= items.map(function(elem) {
        return elem[name];
      }).join(',');
    }
    combined.SubmissionDate = util.date();
    combined.SDStatus = 'submitted';
    combined.Progress = '2';

    $.extend(finalItem,combined);
  }


  if (step != 4)
    $('#confirm-modal').dialog('option', 'title', 'Do You Want to Create Reporting Data?').dialog('open');

}

function reportingSave() {
  var item = $.extend([],$("#step2-table").jsGrid("option", "data"))[0];

  if (item) {
    item.Progress = '3';
    $.extend(finalItem,item);
  }

  if (step != 4)
    $('#confirm-modal').dialog('option', 'title', 'Do You Want to Create Election Data?').dialog('open');

}

function electionSave() {
  var item = $.extend([],$("#step3-table").jsGrid("option", "data"))[0];

  if (item) {
    item.Progress = '4';
    $.extend(finalItem,item);
  }

  showReviewPage();
}

function getTypeFromStep (step) {
  switch (step) {
    case 0:
      return 'enrollment';
    case 1:
      return 'sourcedata';
    case 2:
      return 'reporting';
    case 3:
      return 'election';
  }
}

function buildInsertQueryString (item) {
  var headings = Object.keys(item).join();
  var values = Object.keys(item).map(function(key){return "\""+item[key]+"\""});
  return 'INSERT INTO EventData ('+headings+') VALUES ('+values+');';
}

function buildUpdateQueryString (item) {
  var query = "UPDATE EventData SET ";
  var headings = Object.keys(item);
  var values = Object.keys(item).map(function(key){return "'"+item[key]+"'"});
  for (var i in headings) {
    query += headings[i] + " = " + values[i];
    if (i!=headings.length-1) query += ", ";
  }
  query += " WHERE ClientID = '"+item.ClientID+"';";
  return query;
}

},{"./library/build_Query_String.js":2,"./library/table-util.js":3,"./library/table_fields":4,"./library/usecookies.js":5}],2:[function(require,module,exports){

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

},{}],3:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
module.exports = function() {

	if (Cookies.get('env')==undefined || Cookies.get('env')==""  || !isValidEnv())
		Cookies.set('env', 'TST', { expires: 15 });
	};

function isValidEnv() {
	var validEnv = ["TST","OAT","SIT2"];
	var valid = false;
	for (var i = 0; i < validEnv.length; i++) {
		if (Cookies.get('env') === validEnv[i]) {
			valid = true;
			break;
		}
	}
	return valid;
}

},{}]},{},[1]);
