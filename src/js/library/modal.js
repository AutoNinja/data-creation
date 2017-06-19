var exports = module.exports;

/******************************************************************************
MODAL API
******************************************************************************/

exports.create = function (target, fields) {
  $(target).dialog({
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
      close: function() {resetModal(target, fields);}
  });
  renderModal(fields);
  setupValidation(target, fields);
};

exports.show = function (target) {
    $(target).dialog("open");
};

/******************************************************************************
MODAL PRIVATE FUNCTIONS
******************************************************************************/
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
var resetModal = function (target, fields) {

  for (var name in fields) {
    $('#'+name).val(fields[name]);
  }

  $(target+" form").validate().resetForm();
  $(target+" form").find(".error").removeClass("error");
};

/******************************************************************************
FORM SUBMISSION VALIDATION
******************************************************************************/
//JQuery Validation plug in setup
function setupValidation(target, fields) {
  $(target+" form").validate({
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

  console.log(newData);

  for (var name in fields) {newData[name] =  $("#"+name).val();}



  $("#jsGrid").jsGrid("insertItem", newData);

  $("#detailsDialog").dialog("close");
};
