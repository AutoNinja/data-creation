var fields = require("./table_fields.js").defaults;
var exports = module.exports;

/******************************************************************************
MODAL API
******************************************************************************/

exports.createModal = function (target, type) {
  var options = {
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
  };

  var modalFields = fields(type);
  renderModalFields(modalFields);

  $('#detailsForm').submit(function(e) {
    e.preventDefault();
    var newData = {};
    for (var name in modalFields) {newData[name] =  $("#"+name).val();}
    $("#jsGrid").jsGrid("insertItem", newData);
    resetModal(modalFields);
  });

  $(target).dialog(options);
}

/******************************************************************************
MODAL PRIVATE FUNCTIONS
******************************************************************************/

//takes in fields object and render labels and textboxes on modal
var renderModalFields = function (fields) {

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
};

//reset fields to default
//reset error messages
var resetModal = function (fields) {
  for (var name in fields) {
    $('#'+name).val(fields[name]);
  }
};
