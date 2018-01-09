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
          item.Env = Cookies.get("env_enroll");
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
  finalItem.Env = Cookies.get('env_enroll');
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
