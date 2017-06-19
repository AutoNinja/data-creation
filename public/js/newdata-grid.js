(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var exports = module.exports;

//filters fields object based on discard array
exports.filter = function (fields, discard) {
  var newFields = fields;
  for (var i = 0; i < discard.length; i++) {
    delete newFields[discard[i]];
  }
  return newFields;
};

//move empty properties to the front
exports.placeEmptyFieldsFirst = function (fields) {

};

},{}],3:[function(require,module,exports){
var modal = require("./library/modal.js");
var util = require("./library/table-util.js");

$(document).ready(function() {

  initializeDataFields();

  createNewDataGrid();

  //set default visibility
  setColumnsVisibility([
    "DepartmentCode",
    "RequestType",
    "Status",
    "Env",
    "ClientID",
    "ID",
    "SubmissionDate"
  ], false);

  var modalFields = util.filter(defaults,[
    "DepartmentCode",
    "RequestType",
    "Status",
    "Env",
    "ClientID",
    "ID",
    "SubmissionDate"
  ]);

  modal.create("#detailsDialog",modalFields);



  $('body').on('click', '#home', function() {window.location.replace("/");});

  $('body').on('click', '#save', handleClickSave);

});


function initializeDataFields() {
  columns.forEach(function(item){



    //set alignment
    item.align = "center";

    //default type text field
    if (item.type===undefined || item.type==="")
      item.type="text";

    //set validate except for ClientID
    if (item.name !== "ClientID")
      item.validate = "required";

    //set display headings
    setTitle(item);

    //set width
    setColumnWidth(item);

    //initialize insert template
    setDefaultInsertTemplate(item);

  });
}

function setTitle (item) {
  //trim off 'Type'
  if (item.name.substring(0,4)==="Type") {
    item.title = item.name.substring(4,item.name.length);
  } else {
    item.title = item.name;
  }
  //change "ID" to "Id" for consistency
  item.title = item.title.replace(/ID/g, "Id");
  //insert space between capital letters
  item.title = item.title.replace(/([A-Z])/g, ' $1').trim()
}

function setColumnsVisibility(cols, visibility) {
  for (item in cols) {
    $("#jsGrid").jsGrid("fieldOption", cols[item], "visible", visibility);
  };
}

function setColumnWidth(item) {
  var baseWidth;
  if (item.title==="Id")
  baseWidth = 100;
  else
  baseWidth = 35;
  return item.width=(item.title.length*12+baseWidth).toString()+"px";
}

function setDefaultInsertTemplate (item) {
  var value = defaults[item.name];
  item.insertTemplate = function () {
    var input = this.__proto__.insertTemplate.call(this);
    input.val(value)
    return input;
  }
}


var submitData = [];

function createNewDataGrid () {


  $("#jsGrid").jsGrid({
    width: "100%",
    paging: true,
    autoload: true,
    autowidth: false,

    pageSize: 15,
    pageButtonCount: 5,

    deleteConfirm: "Confirm Delete Data?",
    noDataContent: "No New Data Added Yet",

    controller: {
      insertItem: function (item) {
        item.RequestType = "R";
        item.Status = "submitted";
        item.Env = Cookies.get("env");
        item.ClientID = "";
        item.DepartmentCode = item.TypeDepartmentId;
        item.SubmissionDate = getDateNow();
        item.ID = guid();
        submitData.push(item);
      },
      deleteItem: function (item) {
        var index = submitData.indexOf(item);
        submitData.splice(index,1);
      }
    },

    fields: columns
  });

}

function handleClickSave() {
  $("#save").hide();
  $("#home").hide();
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "/db/insert",
    data: JSON.stringify(submitData),
    dataType: "json"
  })
  .done(function(response){
    alert("New Data Successfully Added");
    setColumnsVisibility([
      "ClientID",
      "Status",
      "Env",
      "ID",
      "SubmissionDate",
    ], true);
    setColumnsVisibility([
      "Control"
    ], false);
    $("#home").show();
  });
}

function createResultGrid () {
  $("#jsGrid").jsGrid({
    width: "100%",
    shrinkToFit: true,
    inserting: false,
    autowidth: false,
    editing: false,
    sorting: false,
    paging: true,
    autoload: true,

    pageSize: 15,
    pageButtonCount: 5,
    controller: {

      loadData: function (filter) {
        var data = $.Deferred();
        $.ajax({
          type: "GET",
          url: "/db/load",
          cache: false,
          dataType: "JSON"
        }).done(function(result) {
          result = $.grep(result, function(item) {
            for (var row in submitData) {
              if (submitData[row].ID == item.ID) {
                return true;
              }
            }
            return false;
          });
          submitData = [];
          data.resolve(result);
        });
        return data.promise();
      }
    },
    fields: columns
  });
}


function getDateNow() {
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



function guid() {
  return Math.round(Math.random() * (1000000000000 - 100000000000) + 100000000000);
}







//***********************************************************************************************






var defaults = {
  UserID: '',
  Description: '',
  TypeDepartmentId: '',
  AddressCity: 'Toronto',
  AddressLine1: '1 University Ave',
  AddressPostalCode: 'M5J 2P1',
  AddressState: 'ON',
  BenefitProgramName: 'OMR',
  BenefitSystem: 'BN',
  BirthDate: '01/22/1970',
  ClientID: '',
  CountryCode: 'CAN',
  DepartmentCode: '',
  EmpClass: '65',
  EmpRecordType: '1',
  EnrolmentDate: '01/01/1963',
  Env: '',
  Format: 'English',
  FulltimePartTime: 'P',
  Gender: 'F',
  HireDate: '12/14/2014',
  ID: '',
  JobCode: 'Other',
  MemberClass: 'NRA65',
  NationalIdType: 'PR',
  NotificationType: 'General',
  PensionPlanType: '80',
  PhoneNumber: '413-164-369',
  PhoneType: 'HOME',
  RateCode: 'NAANNL',
  RequestType: 'R',
  Status: 'submitted',
  SubmissionDate: '',
  TypeCompRate: '75000',
  UnionCode: 'O02'
};

var columns = [
  {
      type: "control",
      name: "Control",
      modeSwitchButton: false,
      editButton: false,
      headerTemplate: function() {
          return $("<button>").attr("type", "button").text("New Data")
                  .on("click", function () {
                      modal.show("#detailsDialog");
                  });
      }
  },
  { name: "ClientID"},
  { name: "Status",
    type: "select",
    items: [
      {Id: ""},
      {Id: "submitted"},
      {Id: "new"},
      {Id: "used"},
      {Id: "failed"},
      {Id: "terminated"}
    ],
    valueField: "Id",
    textField: "Id"},
  { name: "UserID"},
  { name: "Description"},
  { name: "TypeDepartmentId"},
  { name: "DepartmentCode"},
  { name: "ID"},
  { name: "RequestType"},
  { name: "Env"},
  { name: "SubmissionDate"},
  { name: "Gender"},
  { name: "BirthDate"},
  { name: "NationalIdType"},
  { name: "CountryCode"},
  { name: "AddressLine1"},
  { name: "AddressCity"},
  { name: "AddressState"},
  { name: "AddressPostalCode"},
  { name: "Format"},
  { name: "PhoneType"},
  { name: "PhoneNumber"},
  { name: "EmpRecordType"},
  { name: "FulltimePartTime"},
  { name: "HireDate"},
  { name: "JobCode"},
  { name: "EmpClass"},
  { name: "UnionCode"},
  { name: "RateCode"},
  { name: "BenefitSystem"},
  { name: "TypeCompRate"},
  { name: "BenefitProgramName"},
  { name: "EnrolmentDate"},
  { name: "NotificationType"},
  { name: "PensionPlanType"},
  { name: "MemberClass"}
  ];

},{"./library/modal.js":1,"./library/table-util.js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL3N1bmpvL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9qcy9saWJyYXJ5L21vZGFsLmpzIiwic3JjL2pzL2xpYnJhcnkvdGFibGUtdXRpbC5qcyIsInNyYy9qcy9uZXdkYXRhLWdyaWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzO1xyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5NT0RBTCBBUElcclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuZXhwb3J0cy5jcmVhdGUgPSBmdW5jdGlvbiAodGFyZ2V0LCBmaWVsZHMpIHtcclxuICAkKHRhcmdldCkuZGlhbG9nKHtcclxuICAgICAgd2lkdGg6IFwiNzAlXCIsXHJcbiAgICAgIGF1dG9PcGVuOiBmYWxzZSxcclxuICAgICAgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCksXHJcbiAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgbXk6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgYXQ6IFwidG9wXCIsXHJcbiAgICAgICAgb2Y6IHdpbmRvd1xyXG4gICAgICB9LFxyXG4gICAgICBtb2RhbDogdHJ1ZSxcclxuICAgICAgdGl0bGU6IFwiQ3JlYXRlIE5ldyBEYXRhXCIsXHJcbiAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHtyZXNldE1vZGFsKHRhcmdldCwgZmllbGRzKTt9XHJcbiAgfSk7XHJcbiAgcmVuZGVyTW9kYWwoZmllbGRzKTtcclxuICBzZXR1cFZhbGlkYXRpb24odGFyZ2V0LCBmaWVsZHMpO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zaG93ID0gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgJCh0YXJnZXQpLmRpYWxvZyhcIm9wZW5cIik7XHJcbn07XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbk1PREFMIFBSSVZBVEUgRlVOQ1RJT05TXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLy90YWtlcyBpbiBmaWVsZHMgb2JqZWN0IGFuZCByZW5kZXIgbGFiZWxzIGFuZCB0ZXh0Ym94ZXMgb24gbW9kYWxcclxudmFyIHJlbmRlck1vZGFsID0gZnVuY3Rpb24gKGZpZWxkcykge1xyXG5cclxuICBmb3IgKHZhciBuYW1lIGluIGZpZWxkcykge1xyXG5cclxuICAgICQoXCIjZGV0YWlsc0Zvcm1cIilcclxuICAgICAgLmFwcGVuZChcIjxkaXYgY2xhc3M9J3JvdyByLVwiK25hbWUrXCInPjwvZGl2PlwiKTtcclxuXHJcbiAgICAkKFwiLnItXCIrbmFtZSlcclxuICAgICAgLmFwcGVuZChcIjxkaXYgY2xhc3M9J2NvbC14cy00IGNvbC1zbS00IGMtMSc+PC9kaXY+XCIpO1xyXG5cclxuICAgICQoXCIuci1cIituYW1lKVxyXG4gICAgICAuYXBwZW5kKFwiPGRpdiBjbGFzcz0nY29sLXhzLTggY29sLXNtLTggYy0yJz48L2Rpdj5cIik7XHJcblxyXG4gICAgJCgnPGxhYmVsPicsIHtcclxuICAgICAgZm9yOiBuYW1lLFxyXG4gICAgICB0ZXh0OiBuYW1lK1wiOlwiXHJcbiAgICB9KS5hcHBlbmRUbyhcIi5yLVwiK25hbWUrXCIgLmMtMVwiKTtcclxuXHJcbiAgICAkKCc8aW5wdXQ+Jywge1xyXG4gICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgaWQ6IG5hbWUsXHJcbiAgICAgIHZhbHVlOiBmaWVsZHNbbmFtZV1cclxuICAgIH0pLmFwcGVuZFRvKFwiLnItXCIrbmFtZStcIiAuYy0yXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vcmVzZXQgZmllbGRzIHRvIGRlZmF1bHRcclxuLy9yZXNldCBlcnJvciBtZXNzYWdlc1xyXG52YXIgcmVzZXRNb2RhbCA9IGZ1bmN0aW9uICh0YXJnZXQsIGZpZWxkcykge1xyXG5cclxuICBmb3IgKHZhciBuYW1lIGluIGZpZWxkcykge1xyXG4gICAgJCgnIycrbmFtZSkudmFsKGZpZWxkc1tuYW1lXSk7XHJcbiAgfVxyXG5cclxuICAkKHRhcmdldCtcIiBmb3JtXCIpLnZhbGlkYXRlKCkucmVzZXRGb3JtKCk7XHJcbiAgJCh0YXJnZXQrXCIgZm9ybVwiKS5maW5kKFwiLmVycm9yXCIpLnJlbW92ZUNsYXNzKFwiZXJyb3JcIik7XHJcbn07XHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkZPUk0gU1VCTUlTU0lPTiBWQUxJREFUSU9OXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLy9KUXVlcnkgVmFsaWRhdGlvbiBwbHVnIGluIHNldHVwXHJcbmZ1bmN0aW9uIHNldHVwVmFsaWRhdGlvbih0YXJnZXQsIGZpZWxkcykge1xyXG4gICQodGFyZ2V0K1wiIGZvcm1cIikudmFsaWRhdGUoe1xyXG4gICAgICBydWxlczogY3JlYXRlUnVsZXMoZmllbGRzKSxcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZm9ybVN1Ym1pdEhhbmRsZXIoZmllbGRzKTtcclxuICAgICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuLy9keW5hbWljYWxseSBzZXQgcnVsZXMgZm9yIGFsbCBmaWVsZHNcclxuZnVuY3Rpb24gY3JlYXRlUnVsZXMoZmllbGRzKSB7XHJcblxyXG4gIHZhciBydWxlcyA9IHt9O1xyXG5cclxuICBmb3IgKHZhciBuYW1lIGluIGZpZWxkcykge3J1bGVzW25hbWVdID0ge3JlcXVpcmVkOiB0cnVlfTt9XHJcblxyXG4gIHJldHVybiBydWxlcztcclxufTtcclxuXHJcbi8vZ2V0IHVzZXIgaW5wdXQgZGF0YSBmcm9tIG1vZGFsXHJcbmZ1bmN0aW9uIGZvcm1TdWJtaXRIYW5kbGVyKGZpZWxkcykge1xyXG4gIHZhciBuZXdEYXRhID0ge307XHJcblxyXG4gIGNvbnNvbGUubG9nKG5ld0RhdGEpO1xyXG5cclxuICBmb3IgKHZhciBuYW1lIGluIGZpZWxkcykge25ld0RhdGFbbmFtZV0gPSAgJChcIiNcIituYW1lKS52YWwoKTt9XHJcblxyXG5cclxuXHJcbiAgJChcIiNqc0dyaWRcIikuanNHcmlkKFwiaW5zZXJ0SXRlbVwiLCBuZXdEYXRhKTtcclxuXHJcbiAgJChcIiNkZXRhaWxzRGlhbG9nXCIpLmRpYWxvZyhcImNsb3NlXCIpO1xyXG59O1xyXG4iLCJ2YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzO1xyXG5cclxuLy9maWx0ZXJzIGZpZWxkcyBvYmplY3QgYmFzZWQgb24gZGlzY2FyZCBhcnJheVxyXG5leHBvcnRzLmZpbHRlciA9IGZ1bmN0aW9uIChmaWVsZHMsIGRpc2NhcmQpIHtcclxuICB2YXIgbmV3RmllbGRzID0gZmllbGRzO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzY2FyZC5sZW5ndGg7IGkrKykge1xyXG4gICAgZGVsZXRlIG5ld0ZpZWxkc1tkaXNjYXJkW2ldXTtcclxuICB9XHJcbiAgcmV0dXJuIG5ld0ZpZWxkcztcclxufTtcclxuXHJcbi8vbW92ZSBlbXB0eSBwcm9wZXJ0aWVzIHRvIHRoZSBmcm9udFxyXG5leHBvcnRzLnBsYWNlRW1wdHlGaWVsZHNGaXJzdCA9IGZ1bmN0aW9uIChmaWVsZHMpIHtcclxuXHJcbn07XHJcbiIsInZhciBtb2RhbCA9IHJlcXVpcmUoXCIuL2xpYnJhcnkvbW9kYWwuanNcIik7XHJcbnZhciB1dGlsID0gcmVxdWlyZShcIi4vbGlicmFyeS90YWJsZS11dGlsLmpzXCIpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblxyXG4gIGluaXRpYWxpemVEYXRhRmllbGRzKCk7XHJcblxyXG4gIGNyZWF0ZU5ld0RhdGFHcmlkKCk7XHJcblxyXG4gIC8vc2V0IGRlZmF1bHQgdmlzaWJpbGl0eVxyXG4gIHNldENvbHVtbnNWaXNpYmlsaXR5KFtcclxuICAgIFwiRGVwYXJ0bWVudENvZGVcIixcclxuICAgIFwiUmVxdWVzdFR5cGVcIixcclxuICAgIFwiU3RhdHVzXCIsXHJcbiAgICBcIkVudlwiLFxyXG4gICAgXCJDbGllbnRJRFwiLFxyXG4gICAgXCJJRFwiLFxyXG4gICAgXCJTdWJtaXNzaW9uRGF0ZVwiXHJcbiAgXSwgZmFsc2UpO1xyXG5cclxuICB2YXIgbW9kYWxGaWVsZHMgPSB1dGlsLmZpbHRlcihkZWZhdWx0cyxbXHJcbiAgICBcIkRlcGFydG1lbnRDb2RlXCIsXHJcbiAgICBcIlJlcXVlc3RUeXBlXCIsXHJcbiAgICBcIlN0YXR1c1wiLFxyXG4gICAgXCJFbnZcIixcclxuICAgIFwiQ2xpZW50SURcIixcclxuICAgIFwiSURcIixcclxuICAgIFwiU3VibWlzc2lvbkRhdGVcIlxyXG4gIF0pO1xyXG5cclxuICBtb2RhbC5jcmVhdGUoXCIjZGV0YWlsc0RpYWxvZ1wiLG1vZGFsRmllbGRzKTtcclxuXHJcblxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJyNob21lJywgZnVuY3Rpb24oKSB7d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoXCIvXCIpO30pO1xyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJyNzYXZlJywgaGFuZGxlQ2xpY2tTYXZlKTtcclxuXHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVEYXRhRmllbGRzKCkge1xyXG4gIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcclxuXHJcblxyXG5cclxuICAgIC8vc2V0IGFsaWdubWVudFxyXG4gICAgaXRlbS5hbGlnbiA9IFwiY2VudGVyXCI7XHJcblxyXG4gICAgLy9kZWZhdWx0IHR5cGUgdGV4dCBmaWVsZFxyXG4gICAgaWYgKGl0ZW0udHlwZT09PXVuZGVmaW5lZCB8fCBpdGVtLnR5cGU9PT1cIlwiKVxyXG4gICAgICBpdGVtLnR5cGU9XCJ0ZXh0XCI7XHJcblxyXG4gICAgLy9zZXQgdmFsaWRhdGUgZXhjZXB0IGZvciBDbGllbnRJRFxyXG4gICAgaWYgKGl0ZW0ubmFtZSAhPT0gXCJDbGllbnRJRFwiKVxyXG4gICAgICBpdGVtLnZhbGlkYXRlID0gXCJyZXF1aXJlZFwiO1xyXG5cclxuICAgIC8vc2V0IGRpc3BsYXkgaGVhZGluZ3NcclxuICAgIHNldFRpdGxlKGl0ZW0pO1xyXG5cclxuICAgIC8vc2V0IHdpZHRoXHJcbiAgICBzZXRDb2x1bW5XaWR0aChpdGVtKTtcclxuXHJcbiAgICAvL2luaXRpYWxpemUgaW5zZXJ0IHRlbXBsYXRlXHJcbiAgICBzZXREZWZhdWx0SW5zZXJ0VGVtcGxhdGUoaXRlbSk7XHJcblxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRUaXRsZSAoaXRlbSkge1xyXG4gIC8vdHJpbSBvZmYgJ1R5cGUnXHJcbiAgaWYgKGl0ZW0ubmFtZS5zdWJzdHJpbmcoMCw0KT09PVwiVHlwZVwiKSB7XHJcbiAgICBpdGVtLnRpdGxlID0gaXRlbS5uYW1lLnN1YnN0cmluZyg0LGl0ZW0ubmFtZS5sZW5ndGgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpdGVtLnRpdGxlID0gaXRlbS5uYW1lO1xyXG4gIH1cclxuICAvL2NoYW5nZSBcIklEXCIgdG8gXCJJZFwiIGZvciBjb25zaXN0ZW5jeVxyXG4gIGl0ZW0udGl0bGUgPSBpdGVtLnRpdGxlLnJlcGxhY2UoL0lEL2csIFwiSWRcIik7XHJcbiAgLy9pbnNlcnQgc3BhY2UgYmV0d2VlbiBjYXBpdGFsIGxldHRlcnNcclxuICBpdGVtLnRpdGxlID0gaXRlbS50aXRsZS5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKS50cmltKClcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0Q29sdW1uc1Zpc2liaWxpdHkoY29scywgdmlzaWJpbGl0eSkge1xyXG4gIGZvciAoaXRlbSBpbiBjb2xzKSB7XHJcbiAgICAkKFwiI2pzR3JpZFwiKS5qc0dyaWQoXCJmaWVsZE9wdGlvblwiLCBjb2xzW2l0ZW1dLCBcInZpc2libGVcIiwgdmlzaWJpbGl0eSk7XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0Q29sdW1uV2lkdGgoaXRlbSkge1xyXG4gIHZhciBiYXNlV2lkdGg7XHJcbiAgaWYgKGl0ZW0udGl0bGU9PT1cIklkXCIpXHJcbiAgYmFzZVdpZHRoID0gMTAwO1xyXG4gIGVsc2VcclxuICBiYXNlV2lkdGggPSAzNTtcclxuICByZXR1cm4gaXRlbS53aWR0aD0oaXRlbS50aXRsZS5sZW5ndGgqMTIrYmFzZVdpZHRoKS50b1N0cmluZygpK1wicHhcIjtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0RGVmYXVsdEluc2VydFRlbXBsYXRlIChpdGVtKSB7XHJcbiAgdmFyIHZhbHVlID0gZGVmYXVsdHNbaXRlbS5uYW1lXTtcclxuICBpdGVtLmluc2VydFRlbXBsYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGlucHV0ID0gdGhpcy5fX3Byb3RvX18uaW5zZXJ0VGVtcGxhdGUuY2FsbCh0aGlzKTtcclxuICAgIGlucHV0LnZhbCh2YWx1ZSlcclxuICAgIHJldHVybiBpbnB1dDtcclxuICB9XHJcbn1cclxuXHJcblxyXG52YXIgc3VibWl0RGF0YSA9IFtdO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlTmV3RGF0YUdyaWQgKCkge1xyXG5cclxuXHJcbiAgJChcIiNqc0dyaWRcIikuanNHcmlkKHtcclxuICAgIHdpZHRoOiBcIjEwMCVcIixcclxuICAgIHBhZ2luZzogdHJ1ZSxcclxuICAgIGF1dG9sb2FkOiB0cnVlLFxyXG4gICAgYXV0b3dpZHRoOiBmYWxzZSxcclxuXHJcbiAgICBwYWdlU2l6ZTogMTUsXHJcbiAgICBwYWdlQnV0dG9uQ291bnQ6IDUsXHJcblxyXG4gICAgZGVsZXRlQ29uZmlybTogXCJDb25maXJtIERlbGV0ZSBEYXRhP1wiLFxyXG4gICAgbm9EYXRhQ29udGVudDogXCJObyBOZXcgRGF0YSBBZGRlZCBZZXRcIixcclxuXHJcbiAgICBjb250cm9sbGVyOiB7XHJcbiAgICAgIGluc2VydEl0ZW06IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgaXRlbS5SZXF1ZXN0VHlwZSA9IFwiUlwiO1xyXG4gICAgICAgIGl0ZW0uU3RhdHVzID0gXCJzdWJtaXR0ZWRcIjtcclxuICAgICAgICBpdGVtLkVudiA9IENvb2tpZXMuZ2V0KFwiZW52XCIpO1xyXG4gICAgICAgIGl0ZW0uQ2xpZW50SUQgPSBcIlwiO1xyXG4gICAgICAgIGl0ZW0uRGVwYXJ0bWVudENvZGUgPSBpdGVtLlR5cGVEZXBhcnRtZW50SWQ7XHJcbiAgICAgICAgaXRlbS5TdWJtaXNzaW9uRGF0ZSA9IGdldERhdGVOb3coKTtcclxuICAgICAgICBpdGVtLklEID0gZ3VpZCgpO1xyXG4gICAgICAgIHN1Ym1pdERhdGEucHVzaChpdGVtKTtcclxuICAgICAgfSxcclxuICAgICAgZGVsZXRlSXRlbTogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICB2YXIgaW5kZXggPSBzdWJtaXREYXRhLmluZGV4T2YoaXRlbSk7XHJcbiAgICAgICAgc3VibWl0RGF0YS5zcGxpY2UoaW5kZXgsMSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZmllbGRzOiBjb2x1bW5zXHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDbGlja1NhdmUoKSB7XHJcbiAgJChcIiNzYXZlXCIpLmhpZGUoKTtcclxuICAkKFwiI2hvbWVcIikuaGlkZSgpO1xyXG4gICQuYWpheCh7XHJcbiAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcclxuICAgIHVybDogXCIvZGIvaW5zZXJ0XCIsXHJcbiAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShzdWJtaXREYXRhKSxcclxuICAgIGRhdGFUeXBlOiBcImpzb25cIlxyXG4gIH0pXHJcbiAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgYWxlcnQoXCJOZXcgRGF0YSBTdWNjZXNzZnVsbHkgQWRkZWRcIik7XHJcbiAgICBzZXRDb2x1bW5zVmlzaWJpbGl0eShbXHJcbiAgICAgIFwiQ2xpZW50SURcIixcclxuICAgICAgXCJTdGF0dXNcIixcclxuICAgICAgXCJFbnZcIixcclxuICAgICAgXCJJRFwiLFxyXG4gICAgICBcIlN1Ym1pc3Npb25EYXRlXCIsXHJcbiAgICBdLCB0cnVlKTtcclxuICAgIHNldENvbHVtbnNWaXNpYmlsaXR5KFtcclxuICAgICAgXCJDb250cm9sXCJcclxuICAgIF0sIGZhbHNlKTtcclxuICAgICQoXCIjaG9tZVwiKS5zaG93KCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVJlc3VsdEdyaWQgKCkge1xyXG4gICQoXCIjanNHcmlkXCIpLmpzR3JpZCh7XHJcbiAgICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgICBzaHJpbmtUb0ZpdDogdHJ1ZSxcclxuICAgIGluc2VydGluZzogZmFsc2UsXHJcbiAgICBhdXRvd2lkdGg6IGZhbHNlLFxyXG4gICAgZWRpdGluZzogZmFsc2UsXHJcbiAgICBzb3J0aW5nOiBmYWxzZSxcclxuICAgIHBhZ2luZzogdHJ1ZSxcclxuICAgIGF1dG9sb2FkOiB0cnVlLFxyXG5cclxuICAgIHBhZ2VTaXplOiAxNSxcclxuICAgIHBhZ2VCdXR0b25Db3VudDogNSxcclxuICAgIGNvbnRyb2xsZXI6IHtcclxuXHJcbiAgICAgIGxvYWREYXRhOiBmdW5jdGlvbiAoZmlsdGVyKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAkLkRlZmVycmVkKCk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXHJcbiAgICAgICAgICB1cmw6IFwiL2RiL2xvYWRcIixcclxuICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgIGRhdGFUeXBlOiBcIkpTT05cIlxyXG4gICAgICAgIH0pLmRvbmUoZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgICAgICByZXN1bHQgPSAkLmdyZXAocmVzdWx0LCBmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHJvdyBpbiBzdWJtaXREYXRhKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHN1Ym1pdERhdGFbcm93XS5JRCA9PSBpdGVtLklEKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBzdWJtaXREYXRhID0gW107XHJcbiAgICAgICAgICBkYXRhLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZGF0YS5wcm9taXNlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBmaWVsZHM6IGNvbHVtbnNcclxuICB9KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldERhdGVOb3coKSB7XHJcbiAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICB2YXIgZGQgPSB0b2RheS5nZXREYXRlKCk7XHJcblxyXG4gIHZhciBtbSA9IHRvZGF5LmdldE1vbnRoKCkrMTtcclxuICB2YXIgeXl5eSA9IHRvZGF5LmdldEZ1bGxZZWFyKCk7XHJcbiAgaWYoZGQ8MTApXHJcbiAge1xyXG4gICAgZGQ9JzAnK2RkO1xyXG4gIH1cclxuXHJcbiAgaWYobW08MTApXHJcbiAge1xyXG4gICAgbW09JzAnK21tO1xyXG4gIH1cclxuICByZXR1cm4gbW0rJy8nK2RkKycvJyt5eXl5O1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGd1aWQoKSB7XHJcbiAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqICgxMDAwMDAwMDAwMDAwIC0gMTAwMDAwMDAwMDAwKSArIDEwMDAwMDAwMDAwMCk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxudmFyIGRlZmF1bHRzID0ge1xyXG4gIFVzZXJJRDogJycsXHJcbiAgRGVzY3JpcHRpb246ICcnLFxyXG4gIFR5cGVEZXBhcnRtZW50SWQ6ICcnLFxyXG4gIEFkZHJlc3NDaXR5OiAnVG9yb250bycsXHJcbiAgQWRkcmVzc0xpbmUxOiAnMSBVbml2ZXJzaXR5IEF2ZScsXHJcbiAgQWRkcmVzc1Bvc3RhbENvZGU6ICdNNUogMlAxJyxcclxuICBBZGRyZXNzU3RhdGU6ICdPTicsXHJcbiAgQmVuZWZpdFByb2dyYW1OYW1lOiAnT01SJyxcclxuICBCZW5lZml0U3lzdGVtOiAnQk4nLFxyXG4gIEJpcnRoRGF0ZTogJzAxLzIyLzE5NzAnLFxyXG4gIENsaWVudElEOiAnJyxcclxuICBDb3VudHJ5Q29kZTogJ0NBTicsXHJcbiAgRGVwYXJ0bWVudENvZGU6ICcnLFxyXG4gIEVtcENsYXNzOiAnNjUnLFxyXG4gIEVtcFJlY29yZFR5cGU6ICcxJyxcclxuICBFbnJvbG1lbnREYXRlOiAnMDEvMDEvMTk2MycsXHJcbiAgRW52OiAnJyxcclxuICBGb3JtYXQ6ICdFbmdsaXNoJyxcclxuICBGdWxsdGltZVBhcnRUaW1lOiAnUCcsXHJcbiAgR2VuZGVyOiAnRicsXHJcbiAgSGlyZURhdGU6ICcxMi8xNC8yMDE0JyxcclxuICBJRDogJycsXHJcbiAgSm9iQ29kZTogJ090aGVyJyxcclxuICBNZW1iZXJDbGFzczogJ05SQTY1JyxcclxuICBOYXRpb25hbElkVHlwZTogJ1BSJyxcclxuICBOb3RpZmljYXRpb25UeXBlOiAnR2VuZXJhbCcsXHJcbiAgUGVuc2lvblBsYW5UeXBlOiAnODAnLFxyXG4gIFBob25lTnVtYmVyOiAnNDEzLTE2NC0zNjknLFxyXG4gIFBob25lVHlwZTogJ0hPTUUnLFxyXG4gIFJhdGVDb2RlOiAnTkFBTk5MJyxcclxuICBSZXF1ZXN0VHlwZTogJ1InLFxyXG4gIFN0YXR1czogJ3N1Ym1pdHRlZCcsXHJcbiAgU3VibWlzc2lvbkRhdGU6ICcnLFxyXG4gIFR5cGVDb21wUmF0ZTogJzc1MDAwJyxcclxuICBVbmlvbkNvZGU6ICdPMDInXHJcbn07XHJcblxyXG52YXIgY29sdW1ucyA9IFtcclxuICB7XHJcbiAgICAgIHR5cGU6IFwiY29udHJvbFwiLFxyXG4gICAgICBuYW1lOiBcIkNvbnRyb2xcIixcclxuICAgICAgbW9kZVN3aXRjaEJ1dHRvbjogZmFsc2UsXHJcbiAgICAgIGVkaXRCdXR0b246IGZhbHNlLFxyXG4gICAgICBoZWFkZXJUZW1wbGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4gJChcIjxidXR0b24+XCIpLmF0dHIoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpLnRleHQoXCJOZXcgRGF0YVwiKVxyXG4gICAgICAgICAgICAgICAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBtb2RhbC5zaG93KFwiI2RldGFpbHNEaWFsb2dcIik7XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgfSxcclxuICB7IG5hbWU6IFwiQ2xpZW50SURcIn0sXHJcbiAgeyBuYW1lOiBcIlN0YXR1c1wiLFxyXG4gICAgdHlwZTogXCJzZWxlY3RcIixcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHtJZDogXCJcIn0sXHJcbiAgICAgIHtJZDogXCJzdWJtaXR0ZWRcIn0sXHJcbiAgICAgIHtJZDogXCJuZXdcIn0sXHJcbiAgICAgIHtJZDogXCJ1c2VkXCJ9LFxyXG4gICAgICB7SWQ6IFwiZmFpbGVkXCJ9LFxyXG4gICAgICB7SWQ6IFwidGVybWluYXRlZFwifVxyXG4gICAgXSxcclxuICAgIHZhbHVlRmllbGQ6IFwiSWRcIixcclxuICAgIHRleHRGaWVsZDogXCJJZFwifSxcclxuICB7IG5hbWU6IFwiVXNlcklEXCJ9LFxyXG4gIHsgbmFtZTogXCJEZXNjcmlwdGlvblwifSxcclxuICB7IG5hbWU6IFwiVHlwZURlcGFydG1lbnRJZFwifSxcclxuICB7IG5hbWU6IFwiRGVwYXJ0bWVudENvZGVcIn0sXHJcbiAgeyBuYW1lOiBcIklEXCJ9LFxyXG4gIHsgbmFtZTogXCJSZXF1ZXN0VHlwZVwifSxcclxuICB7IG5hbWU6IFwiRW52XCJ9LFxyXG4gIHsgbmFtZTogXCJTdWJtaXNzaW9uRGF0ZVwifSxcclxuICB7IG5hbWU6IFwiR2VuZGVyXCJ9LFxyXG4gIHsgbmFtZTogXCJCaXJ0aERhdGVcIn0sXHJcbiAgeyBuYW1lOiBcIk5hdGlvbmFsSWRUeXBlXCJ9LFxyXG4gIHsgbmFtZTogXCJDb3VudHJ5Q29kZVwifSxcclxuICB7IG5hbWU6IFwiQWRkcmVzc0xpbmUxXCJ9LFxyXG4gIHsgbmFtZTogXCJBZGRyZXNzQ2l0eVwifSxcclxuICB7IG5hbWU6IFwiQWRkcmVzc1N0YXRlXCJ9LFxyXG4gIHsgbmFtZTogXCJBZGRyZXNzUG9zdGFsQ29kZVwifSxcclxuICB7IG5hbWU6IFwiRm9ybWF0XCJ9LFxyXG4gIHsgbmFtZTogXCJQaG9uZVR5cGVcIn0sXHJcbiAgeyBuYW1lOiBcIlBob25lTnVtYmVyXCJ9LFxyXG4gIHsgbmFtZTogXCJFbXBSZWNvcmRUeXBlXCJ9LFxyXG4gIHsgbmFtZTogXCJGdWxsdGltZVBhcnRUaW1lXCJ9LFxyXG4gIHsgbmFtZTogXCJIaXJlRGF0ZVwifSxcclxuICB7IG5hbWU6IFwiSm9iQ29kZVwifSxcclxuICB7IG5hbWU6IFwiRW1wQ2xhc3NcIn0sXHJcbiAgeyBuYW1lOiBcIlVuaW9uQ29kZVwifSxcclxuICB7IG5hbWU6IFwiUmF0ZUNvZGVcIn0sXHJcbiAgeyBuYW1lOiBcIkJlbmVmaXRTeXN0ZW1cIn0sXHJcbiAgeyBuYW1lOiBcIlR5cGVDb21wUmF0ZVwifSxcclxuICB7IG5hbWU6IFwiQmVuZWZpdFByb2dyYW1OYW1lXCJ9LFxyXG4gIHsgbmFtZTogXCJFbnJvbG1lbnREYXRlXCJ9LFxyXG4gIHsgbmFtZTogXCJOb3RpZmljYXRpb25UeXBlXCJ9LFxyXG4gIHsgbmFtZTogXCJQZW5zaW9uUGxhblR5cGVcIn0sXHJcbiAgeyBuYW1lOiBcIk1lbWJlckNsYXNzXCJ9XHJcbiAgXTtcclxuIl19
