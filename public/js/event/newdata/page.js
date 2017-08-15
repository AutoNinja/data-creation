'use strict';

var page = (function ($) {
  const ENROLLMENT_PAGE = 0;
  const SOURCE_DATA_PAGE = 1;
  const REPORTING_PAGE = 2;
  const ELECTION_PAGE = 3;
  const REVIEW_PAGE = 4;

  var $enrollmentTableSelector;
  var $sourceDataTableSelector;
  var $reportingTableSelector;
  var $electionTableSelector;
  var $newDataPopupSelector
  var $exisitingSDPopupSelector;
  var $newSDPopupSelector;
  var $confirmPopupSelector;
  var $iDPopupSelector;

  var currPage = 0;

  var confirmPage = function () {
    switch (currPage) {
      case ENROLLMENT_PAGE:
        confirmPopup.updateTitleAndShow("Do You Want To Create New Enrollment?");
        $("#no").off('click').click(function () {
          $("#existingEmployer, #SDEmployer").prop("type","number");
          iDPopup.init($iDPopupSelector, $enrollmentTableSelector);
        });
        break;
      case SOURCE_DATA_PAGE:
        confirmPopup.updateTitleAndShow("Do You Want To Create New Source Data?");
        $("#no").off('click').click(function () {
          exisitingSDPopup.init($exisitingSDPopupSelector, $sourceDataTableSelector);
        });
        break;
      case REPORTING_PAGE:
        confirmPopup.updateTitleAndShow("Do You Want To Create New Event Reporting Data?");
        break;
      case ELECTION_PAGE:
        confirmPopup.updateTitleAndShow("Do You Want To Create New Event Election Data?");
        break;
      case REVIEW_PAGE:
        showPageContent();
    }
  }

  var showPageContent = function () {
    switch (currPage) {
      case ENROLLMENT_PAGE:
        newDataPopup.init($newDataPopupSelector, $enrollmentTableSelector, enrollmentPopupFields);
        break;
      case SOURCE_DATA_PAGE:
        newSDPopup.init($newSDPopupSelector, $sourceDataTableSelector);
        break;
      case REPORTING_PAGE:
        newDataPopup.init($newDataPopupSelector, $reportingTableSelector, reportingPopupFields);
        break;
      case ELECTION_PAGE:
        newDataPopup.init($newDataPopupSelector, $electionTableSelector, electionPopupFields);
        break;
      case REVIEW_PAGE:
        $('.table-container, .table-buttons-wrapper').show();
        $(".table").jsGrid("fieldOption", "Control", "deleteButton", false);
        $($sourceDataTableSelector).jsGrid("fieldOption", "Control", "deleteButton", true);
        $('.control-btn').hide();
        $($sourceDataTableSelector+' .control-btn').show();
        bindEvents();
        break;
    }
  }


  var submitToDB = function () {



    $(".table-buttons-wrapper").hide();

    var finalItem = {};

    var ClientID;


    var enrollmentItem = $($enrollmentTableSelector).jsGrid("option", "data")[0];
    if ($.isEmptyObject(enrollmentItem)) {
      finalItem.ClientID = $('#IDInput').val();
      finalItem.UserID = $('#UserIDInput').val();
      finalItem.TypeDepartmentId = $('#SDEmployer').val() || $('#existingEmployer').val();;
    } else {
      $.extend(finalItem,enrollmentItem);
    }

    var sdItems = $($sourceDataTableSelector).jsGrid("option", "data");
    if (sdItems.length !== 0) {
      var combined = {};
      for (var name in sdItems[0]) {
        combined[name]= sdItems.map(function(elem) {
          return elem[name];
        }).join(',');
      }
      combined.SDStatus = 'submitted';
      combined.Progress = '2';
      $.extend(finalItem,combined);
    } else {
      sdItems = sdItems[0];
      $.extend(finalItem,sdItems);
    }

    var reportingItem = $($reportingTableSelector).jsGrid("option", "data")[0];
    if (!$.isEmptyObject(reportingItem)) {
      $.extend(finalItem,reportingItem);
    }

    var electionItem = $($electionTableSelector).jsGrid("option", "data")[0];
    if (!$.isEmptyObject(electionItem)) {
      $.extend(finalItem,electionItem);
    }

    finalItem.ID = guid();
    finalItem.SubmissionDate = moment().format('MM/DD/YYYY');
    finalItem.RequestType = 'R';
    finalItem.Env = Cookies.get('env');
    finalItem.OverallStatus = "submitted";

    $.post("/db/execute",{data: buildInsertQueryString(finalItem)})
    .done(function(response){
      window.location.href = '/event';
      alert("Data Submitted, Your request ID is "+finalItem.ID);
    })
    .fail(function() {
      alert("Internal Server Error, Please Resubmit Data");
      location.reload();
    });
  }

  var buildInsertQueryString = function (item) {
    var headings = Object.keys(item).join();
    var values = Object.keys(item).map(function(key){return "\""+item[key]+"\""});
    return 'INSERT INTO EventData ('+headings+') VALUES ('+values+');';
  }

  var guid = function () {
    return Math.round(Math.random() * (1000000000000 - 100000000000) + 100000000000);
  }

  var hidePageContent = function () {
    $(".popup").dialog('close');
  }

  var nextPage = function () {
    ++currPage
    //hidePageContent();
    confirmPage();
  }

  var bindEvents = function () {
    $($sourceDataTableSelector+" button").click(function() {
      console.log('gg');
      newDataPopup.init($newDataPopupSelector, $sourceDataTableSelector, sourcedataPopupFieldsOne);
    });

    $("#submit").click(function() {
      submitToDB();
    })
  }

  var init = function ($enrollmentTable, $sourceDataTable, $reportingTable, $electionTable,
    $confirmPopup, $exisitingSDPopup, $newSDPopup, $newDataPopup, $iDPopup) {
    $(".popup").hide();
    $enrollmentTableSelector = $enrollmentTable;
    $sourceDataTableSelector = $sourceDataTable;
    $reportingTableSelector = $reportingTable;
    $electionTableSelector = $electionTable;

    $confirmPopupSelector = $confirmPopup;
    $exisitingSDPopupSelector = $exisitingSDPopup;
    $newSDPopupSelector = $newSDPopup;
    $newDataPopupSelector = $newDataPopup;
    $iDPopupSelector = $iDPopup;

    enrollmentTable.init($enrollmentTableSelector, buildFields.buildNewData(enrollmentTableFields));
    sourceDataTable.init($sourceDataTableSelector, buildFields.buildNewData(sourcedataTableFields));
    reportingTable.init($reportingTableSelector, buildFields.buildNewData(reportingTableFields));
    electionTable.init($electionTableSelector, buildFields.buildNewData(electionTableFields));

    confirmPopup.init($confirmPopupSelector,"");
    confirmPage();
  }

  return {
    init: init,
    nextPage: nextPage,
    showPageContent: showPageContent
  }
})(jQuery);
