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
