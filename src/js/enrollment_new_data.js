"use strict";

var fields = require('./library/table_fields').defaults;
var columns = require('./library/table_fields').fields;
var util = require("./library/table-util.js");
var table = require("./library/table.js");
var initcookies = require('./library/usecookies.js');

(function ($) {

  var enrollmentSave = function () {
    var items = $.extend([],$("#jsGrid").jsGrid("option", "data"));
    $('#jsGrid').jsGrid("option", "editing", false);
    if (items.length==0) {
      alert("Nothing to submit!")
      return;
    }


    Cookies.set('UserID', items[0].UserID, { expires: 5 });
    $("#save").hide();
    $("#home").hide();

    console.log(items);
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/db/insert",
      data: JSON.stringify(items),
      dataType: "json"
    })
    .done(function(response){
      alert("New Data Successfully Added");
      $('#home').show();
      $("#jsGrid")
        .jsGrid("fieldOption", "Control", "visible", false)
        .jsGrid("fieldOption", "ID", "visible", true)
        .jsGrid("fieldOption", "EnrollStatus", "visible", true)
        .jsGrid("fieldOption", "SubmissionDate", "visible", true)
        .jsGrid("option", 'editing', false);
    })
    .fail(function() {
      alert("Internal Server Error, Please Resubmit Data");
      location.reload();
    });

  }

  var renderNewDataModalFields = function (step) {
    var modalFields = fields("enrollment");

    $('#insertNewRow').click(function() {
      var newData = {};
      for (var name in modalFields) {newData[name] =  $("#"+name).val();}
      $("#jsGrid").jsGrid("insertItem", newData);
      resetModal();
    });

    $('#cancel').click(function() {
      $('#newdata-modal').dialog('close');
      resetModal();
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

  var resetModal = function () {
    var modalFields = fields("enrollment");
    for (var name in modalFields) {
      if (name === "UserID") continue;
      $('#'+name).val(modalFields[name]);
    }
  };

  var bindEvents = function () {
    $('#save').click(enrollmentSave);
  }

  var initTable = function ($selector) {
    $( $selector ).jsGrid({
        width: "100%",
        height: "auto",
        paging: true,
        autoload: true,
        autowidth: false,
        editing: true,
        pageSize: 15,
        pageButtonCount: 5,
        deleteConfirm: "Confirm Delete Data?",
        noDataContent: "No Data Entered!",
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
      })
      .jsGrid("fieldOption", "UserID", "visible", true);
  }

  var initDialog = function ($selector) {
    $( $selector ).dialog({
      width: "70%",
      autoOpen: true,
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

    renderNewDataModalFields();
  };

  var init = function ($tableSelector, $dialogSelector) {
    initcookies();
    initTable($tableSelector);
    initDialog($dialogSelector);
    bindEvents();
  };

  return init;

})(jQuery)("#jsGrid","#newdata-modal");
