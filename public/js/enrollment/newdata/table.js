"use strict";

var newDataTable = (function ($) {

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
    });

  }

  var bindEvents = function () {
    $('#save').click(enrollmentSave);
  }

  var guid = function () {
    return Math.round(Math.random() * (1000000000000 - 100000000000) + 100000000000);
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
            item.Status = "submitted";
            item.Env = Cookies.get("env");
            item.ClientID = "";
            item.DepartmentCode = item.TypeDepartmentId;
            item.SubmissionDate = moment().format('MM/DD/YYYY');
            item.ID = guid();
          }
        },
        fields: buildFields.buildNewData(enrollmentTableFields)
      })
      .jsGrid("fieldOption", "ID", "visible", false)
      .jsGrid("fieldOption", "Status", "visible", false)
      .jsGrid("fieldOption", "SubmissionDate", "visible", false)
      .jsGrid("fieldOption", "RequestType", "visible", false)
      .jsGrid("fieldOption", "Env", "visible", false)
      .jsGrid("fieldOption", "ClientID", "visible", false);

  }

  var init = function ($tableSelector) {
    initTable($tableSelector);
    bindEvents();
  };

  return { init: init };

})(jQuery);
