var util = require("./library/table-util.js");
var table = require("./library/table.js");
var initcookies = require('./library/usecookies.js');
var fields = require('./library/table_fields').defaults;
var buildQueryString = require('./library/buildQueryString.js');

var step = -1;
var ClientID;
var finalItem = {};

// Main
$(document).ready(function() {
  initcookies();
  $("[data-toggle='tooltip']").tooltip();
    table.createTable("#step0-table","newdata_enrollment");
    table.createTable("#step1-table","newdata_sourcedata");
    table.createTable("#step2-table","newdata_reporting");
    table.createTable("#step3-table","newdata_election");
});

//initialize bind buttons
$(document).ready(function() {

  $('#submit').click(submitToDB);

  // 'no' button on confirm modal
  $("#noconfirm").click(function () {
    $('#confirm-modal').dialog('close');
    switch (step) {
      case -1:
        step = 0;
        $('#confirm-modal').dialog('option', 'title', 'Do You Want to Create Source Data?').dialog('open');
        break;
      case 0:
        step = 1;
        $('#confirm-modal').dialog('option', 'title', 'Do You Want to Create Reporting Data?').dialog('open');
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

    $.post("/db/query",{data: "SELECT * FROM EventData WHERE ClientID = '"+ID+"';"})
    .done(function (res) {
      if (res.length > 1 && res[0].Progress != '1') {
        alert("You Have Already Initiated An Event Creation! Try a different ID.");
        return;
      }

      ClientID = ID;

      $("#ID-modal").dialog('close');
      if (step === 1)
        $('#sd-modal').dialog('open');
    })
    .fail(function() {
      alert("Internal Server Error");
      window.location.reload();
    });
    e.preventDefault();
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
  });
});

/*Initialize all dialogs
*/
$(document).ready(function() {
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
    title: "Enter An Enrollment ID or A Client ID"
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
    title: 'Do Need to Create New Enrollment?'
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

//********************SUPPORT FUNCTIONS*******************************

function submitToDB () {

  enrollmentSave();
  reportingSave();
  sourceDataSave();
  electionSave();

  if (ClientID == 'enrollment')
    finalItem.ClientID = '';
  else
    finalItem.ClientID = ClientID;

  finalItem.ID = util.guid();
  finalItem.SubmissionDate = util.date();
  finalItem.RequestType = 'R';
  finalItem.Env = Cookies.get('env');


  console.log(finalItem);

  $.post("/db/execute",{data: buildInsertQueryString(finalItem)})
  .done(function(response){
    window.location.href = '/';
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
    window.location.href = '/';
    return;
  }

  if (step === 4)
    return;
  step = 4;
  alert("please review your data before submitting");
  $('.table-container').show();
  $('#submit').show();
  $('#save').hide();

  $(".table").jsGrid("fieldOption", "Control", "deleteButton", false);
  $("#step1-table").jsGrid("fieldOption", "Control", "deleteButton", true);
  $('.control-btn').hide();
  $('#step1-table .control-btn').show();
  renderNewDataModalFields (1);
}


function nextStep() {
  $("[step='%s']".replace(/%s/g, step++)).hide();
  $("[step='%s']".replace(/%s/g, step)).show();

  $('#confirm-modal').dialog('close');

  renderNewDataModalFields (step);
  $('#newdata-modal').dialog('open');


  switch (step) {
    case 0:
      $('#save').off("click").click(enrollmentSave);
      break;
    case 1:
      $('#save').off("click").click(sourceDataSave);
      $('#newdata-modal').dialog('close');
      if (!ClientID)
        $('#ID-modal').dialog('open');
      else
        $('#sd-modal').dialog('open');
      break;
    case 2:
      if (!ClientID)
        $('#ID-modal').dialog('open');
      $('#save').off("click").click(reportingSave);
      break;
    case 3:
      if (!ClientID)
        $('#ID-modal').dialog('open');
      $('#save').off("click").click(electionSave);
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
  });

  for (var name in modalFields) {

    if (name === "UserID")
      continue;

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
    ClientID = 'enrollment';
    $.extend(finalItem,item);

  }

  if (step != 4)
    $('#confirm-modal').dialog('option', 'title', 'Do You Want to Create Source Data?').dialog('open');
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
    combined.SubmissionDate = util.date();;
    combined.SDStatus = 'submitted';
    combined.Progress = '2';

    $.extend(finalItem,combined);
  }


  if (step != 4)
    $('#confirm-modal').dialog('option', 'title', 'Do You Want to Create Reporting Data?').dialog('open');

}

function reportingSave() {
  var item = $.extend([],$("#step1-table").jsGrid("option", "data"))[0];

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


/* SEARCH
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
*/
