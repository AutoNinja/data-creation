
var exports = module.exports;

/******************************************************************************
MODAL API
******************************************************************************/


exports.createModal = function (target, fields) {
  modalId = target;
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

exports.show = function () {
    $(modalId).dialog("open");
};

/******************************************************************************
MODAL PRIVATE FUNCTIONS
******************************************************************************/

var modalId;

//takes in fields object and render labels and textboxes on modal
var renderModal = function (fields) {

  for (var name in fields) {

    $("#detailsForm")
      .append("<div class='row r-"+name+"'></div>");

    $(".r-"+name)
      .append("<div class='col-xs-4 col-sm-4 c-1'></div>");

    $(".r-"+name)
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

  for (var name in fields) {rules[name] = {required: true};}

  return rules;
};

//get user input data from modal
function formSubmitHandler(fields) {
  var newData = {};

  for (var name in fields) {newData[name] =  $("#"+name).val();}

  $("#jsGrid").jsGrid("insertItem", newData);

  $(modalId).dialog("close");
};
