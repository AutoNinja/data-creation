"use strict";

var enrollmentTable = (function ($) {

  var bindEvents = function () {

  }

  var guid = function () {
    return Math.round(Math.random() * (1000000000000 - 100000000000) + 100000000000);
  }

  var initTable = function ($selector, tableFields) {
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
        noDataContent: "Not Selected",
        loadIndicationDelay: 0,
        controller: {
          insertItem: function (item) {
            item.RequestType = "R";
            item.EnrollStatus = "submitted";
            item.Env = Cookies.get("env");
            item.ClientID = "";
            item.DepartmentCode = item.TypeDepartmentId;
            item.SubmissionDate = moment().format('MM/DD/YYYY');
            item.ID = guid();
          }
        },
        fields: buildFields.buildNewData(enrollmentTableFields)
      })
      .jsGrid("fieldOption", "EnrollStatus", "visible", false);

  }

  var init = function ($tableSelector, tableFields) {
    initTable($tableSelector, tableFields);
    bindEvents();
  };

  return { init: init };

})(jQuery);

var sourceDataTable = (function ($) {

  var bindEvents = function () {

  }

  var initTable = function ($selector, tableFields) {
    $( $selector ).jsGrid({
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

        fields: buildFields.buildNewData(sourcedataTableFields)
    });
  }

  var init = function ($tableSelector, tableFields) {
    initTable($tableSelector, tableFields);
    bindEvents();
  };

  return { init: init };

})(jQuery);

var reportingTable = (function ($) {

  var bindEvents = function () {

  }

  var initTable = function ($selector, tableFields) {
    $( $selector ).jsGrid({
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
          item.SubmissionDate = moment().format('MM/DD/YYYY');
        }
      },

      fields: buildFields.buildNewData(reportingTableFields)
    });
  }

  var init = function ($tableSelector, tableFields) {
    initTable($tableSelector, tableFields);
    bindEvents();
  };

  return { init: init };

})(jQuery);

var electionTable = (function ($) {

  var bindEvents = function () {

  }

  var initTable = function ($selector, tableFields) {
    $( $selector ).jsGrid({
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
            item.SubmissionDate = moment().format('MM/DD/YYYY');
          }
        },

      fields: buildFields.buildNewData(electionTableFields)
    });
  }

  var init = function ($tableSelector, tableFields) {
    initTable($tableSelector, tableFields);
    bindEvents();
  };

  return { init: init };

})(jQuery);
