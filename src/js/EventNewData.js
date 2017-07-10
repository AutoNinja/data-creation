var util = require("./library/table-util.js");
var table = require("./library/table.js");
var initcookies = require('./library/usecookies.js');
var fields = require('./library/table_fields').defaults;

var step = 1;

//ID Modal and Related Functions
$(document).ready(function() {
  $( "#ID-modal" ).dialog({
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

//Generate Source Data Modal and Related Functions
$(document).ready(function() {
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

  $('#submitSDYears').click(function () {
    table.createTable("#jsGrid","newdata_sourcedata");
    generateSDRows();
  });


  function generateSDRows () {
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
      $("#jsGrid").jsGrid("insertItem", newData);

      newData = $.extend({},modalFields[1]);
      newData.StartDate = moment(startDate).format('MM/DD/YYYY').toString();
      newData.EndDate = moment(endDate).format('MM/DD/YYYY').toString();
      $("#jsGrid").jsGrid("insertItem", newData);
      ++startYear;
    }
    $( "#sd-modal" ).dialog("close");
  };
});

//Confirm Modal and Related Functions
$(document).ready(function() {
  $( "#confirm-modal" ).dialog({
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
    title: "Do You Want to Create "+getTypeFromStep(step)+" Data Or Stop Here?"
  });
  $("#next").click(showStepContent);


  function showStepContent () {
    $('#confirm-modal').dialog('close');
    switch (step) {
      case 1:
      //table.createTable("#jsGrid","newdata_sourcedata");
      //newDataModal.createModal("#newdata-modal", "sourcedata");
      $('#sd-modal').dialog("open");
      break;
      case 2:
      table.createTable("#jsGrid","newdata_reporting");
      newDataModal.createModal("#newdata-modal", "reporting");
      break;
      case 3:
      table.createTable("#jsGrid","newdata_election");
      newDataModal.createModal("#newdata-modal", "election");
      break;
      case 4:

      break;
    }
  }
});

// Newdata Modal and Related Functions
$(document).ready(function() {
  var modalFields = fields(getTypeFromStep(step));
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
    close: function() {resetModal(modalFields);}
  });

  //dynamically add elements to newdata modal content
  (function (fields) {

    for (var name in fields) {

      $("#detailsForm")
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
        value: fields[name]
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
  })(modalFields);

  //reset fields to default
  //reset error messages
  var resetModal = function (fields) {
    for (var name in fields) {
      $('#'+name).val(fields[name]);
    }
  };

});

// Main
$(document).ready(function() {
  initcookies();
  $("[data-toggle='tooltip']").tooltip();
});

function getTypeFromStep (step) {
  switch (step) {
    case 1:
      return 'sourcedata';
    case 2:
      return 'reporting';
    case 3:
      return 'election';
  }
}
/*
function sourceDataSave () {
  var items = $.extend([],$("#jsGrid").jsGrid("option", "data"));
  console.log(items);
  var combined = {};
  for (var name in items[0]) {
    combined[name]= items.map(function(elem) {
      return elem[name];
    }).join(',');
  }
  combined.Progress = items[0].Progress;
  combined.ID = items[0].ID;
  combined.SubmissionDate = items[0].SubmissionDate;
  combined.SDStatus = items[0].SDStatus;
  combined.ClientID = items[0].ClientID;

  items = combined;

  $("#save").hide();
  $("#home").hide();
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "/db/update",
    data: JSON.stringify(items),
    dataType: "json"
  })
  .done(function(response){
    alert("New Data Successfully Added");
    table.setTableColumnVisible([
      "ID",
      "SDStatus",
      "ClientID",
      "SubmissionDate"
    ], true);
    table.setTableColumnVisible([
      "Control"
    ], false);
    $("#home").show();
  })
  .fail(function() {
    alert("Internal Server Error, Please Resubmit Data");
    location.reload();
  });
}

function reportingSave() {
  var items = $.extend([],$("#jsGrid").jsGrid("option", "data"));

  if (items.length==0) {
    alert("Nothing to submit!")
    return;
  }

  $("#save").hide();
  $("#home").hide();

  console.log(items);

  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "/db/update_multiple",
    data: JSON.stringify(items),
    dataType: "json"
  })
  .done(function(response){
    alert("New Data Successfully Added");
    table.setTableColumnVisible([
      "EventStatus",
      "UserID",
      "SubmissionDate",
    ], true);
    table.setTableColumnVisible([
      "Control"
    ], false);
    $("#home").show();
  })
  .fail(function() {
    alert("Internal Server Error, Please Resubmit Data");
    location.reload();
  });

}

function electionSave() {
  var items = $.extend([],$("#jsGrid").jsGrid("option", "data"));

  if (items.length==0) {
    alert("Nothing to submit!")
    return;
  }

  $("#save").hide();
  $("#home").hide();

  console.log(items);

  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "/db/update_multiple",
    data: JSON.stringify(items),
    dataType: "json"
  })
  .done(function(response){
    alert("New Data Successfully Added");
    table.setTableColumnVisible([
      "ElectionStatus",
      "UserID",
      "SubmissionDate",
    ], true);
    table.setTableColumnVisible([
      "Control"
    ], false);
    $("#home").show();
  })
  .fail(function() {
    alert("Internal Server Error, Please Resubmit Data");
    location.reload();
  });

}
*/



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
