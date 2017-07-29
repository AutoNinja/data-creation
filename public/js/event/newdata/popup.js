"use strict";

var newDataPopup = (function ($) {
  var $selector;
  var initDialog = function () {
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
  };

  var bindEvents = function ($tableSelector, popupFields) {

    $($tableSelector+" .control-btn").off("click").on("click", function () {
        $($selector).dialog("open");
    });

    $($selector+' #insertNewRow').off("click").click(function() {
      var newData = {};
      for (var name in popupFields) {newData[name] =  $("#"+name).val();}
      $($tableSelector).jsGrid("insertItem", newData);
      resetModal($selector, popupFields);
      $($selector).dialog('close');
      page.nextPage();
    });


    $($selector+' #cancel').off("click").click(function() {
      $($selector).dialog('close');
      resetModal($selector, popupFields);
    });
  }

  var renderInputFields = function (fields, popupFields) {

    for (var name in popupFields) {

      $($selector+" .newdata-content")
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
        value: popupFields[name]
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

  var resetModal = function (popupFields) {
    for (var name in popupFields) {
      if (name === "UserID") continue;
      $($selector+' #'+name).val(popupFields[name]);
    }
  };

  var destory = function () {
    $($selector).dialog('destroy');
    $( $selector + " .dialog-content").children().remove();
  }

  var init = function ($popUpSelector, $tableSelector, popupFields) {
    $selector = $popUpSelector;
    if ($($selector).hasClass("ui-dialog-content"))
      destory();
    initDialog();
    renderInputFields($tableSelector, popupFields);
    bindEvents ($tableSelector, popupFields);
  }

  return {
    init: init,
    refresh: renderInputFields
  };
})(jQuery);

var confirmPopup = (function ($) {

  var $selector;

  var initDialog = function (title) {
    $( $selector ).dialog({
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
      title: title
    });
  };

  var updateTitleAndShow = function (title) {
    bindEvents();
    $( $selector ).dialog('option', 'title', title).dialog('open');
  }

  var bindEvents = function () {

    $($selector+" #yes").off('click').click(function () {
      $($selector).dialog('close');
      page.showPageContent();
    });

    $($selector+" #no").off('click').click(function () {
      $($selector).dialog('close');
      page.nextPage();
    });


  }

  var destory = function () {
    $($selector).dialog('destroy');
  }

  var init = function ($popupSelector, title) {
    $selector = $popupSelector;
    if ($($selector).hasClass("ui-dialog-content"))
      destory();
    initDialog (title);
    bindEvents ();
  }

  return {
    init: init,
    updateTitleAndShow: updateTitleAndShow
  };
})(jQuery);

var exisitingSDPopup = (function ($) {

  var $selector;
  var $table;

  var initDialog = function () {
    $( $selector ).dialog({
      dialogClass: "no-close",
      autoOpen: true,
      draggable: false,
      width: "50%",
      height: $(window).height()*2/3,
      position: {
        my: "center",
        at: "center",
        of: window
      },
      modal: true,
      title: "Enter Search Criteria For Exisiting Source Data"
    });
  };

  var concatSDArrayToString = function () {
    var startYear = $('#existingStartYear').val();
    var endYear = $('#existingEndYear').val();
    var startDate = new Date (startYear, 0, 1);
    var endDate = new Date (startYear, 11, 31);
    var serviceEarningsType = $('#existingServiceEarningsType').val();
    var contributionType = $('#existingContributionType').val();
    if (endYear < startYear) {
      alert("Error: Invalid Start and End Year");
      return;
    }

    var newData = {};
    newData.StartDate = moment(startDate).format('MM/DD/YYYY').toString();
    newData.EndDate = moment(endDate).format('MM/DD/YYYY').toString();
    newData.ServiceEarningsType = serviceEarningsType;
    newData.ContributionType = contributionType;

    $($table)
      .jsGrid("fieldOption", "ServiceAmt", "visible", false)
      .jsGrid("fieldOption", "EarningsAmt", "visible", false)
      .jsGrid("fieldOption", "CarryForward", "visible", false)
      .jsGrid("fieldOption", "PostEvent", "visible", false)
      .jsGrid("fieldOption", "ContributionAmt", "visible", false)
      .jsGrid("fieldOption", "Control", "visible", false)
      .jsGrid("option", "editing", false)
      .jsGrid("insertItem", newData);

    $($selector).dialog('close');
    page.nextPage();
  }

  var bindEvents = function () {
    $('#submitExistingSD').click(concatSDArrayToString);
  }


  var init = function ($popupSelector, $tableSelector) {
    $selector = $popupSelector;
    $table = $tableSelector;
    initDialog();
    bindEvents ();

  }

  return { init: init };
})(jQuery);

var newSDPopup = (function ($) {

  var initDialog = function ($selector) {
    $( $selector ).dialog({
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
      title: "Enter Start and End Year For Source Data"
    });
  };

  var bindEvents = function ($selector, $tableSelector) {
    // 'submit' button on sourcedata modal
    $('#submitSDYears').click(function () {
      var modalFields = [];
      modalFields.push(sourcedataPopupFieldsOne);
      modalFields.push(sourcedataPopupFieldsTwo);
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
        $($tableSelector).jsGrid("insertItem", newData);

        newData = $.extend({},modalFields[1]);
        newData.StartDate = moment(startDate).format('MM/DD/YYYY').toString();
        newData.EndDate = moment(endDate).format('MM/DD/YYYY').toString();
        $($tableSelector).jsGrid("insertItem", newData);
        ++startYear;
      }
      $($selector).dialog('close');
      page.nextPage();
    });

  }


  var init = function ($selector, $tableSelector) {
    console.log($selector);
    initDialog($selector);
    bindEvents ($selector, $tableSelector);

  }

  return { init: init };
})(jQuery);

var iDPopup = (function ($) {

  var initDialog = function ($selector) {
    $( $selector ).dialog({
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
      title: "Enter Your Client ID and User ID"
    });
  };

  var bindEvents = function ($selector, $tableSelector) {
    // ID submit
    $("#submitEnrollmentID").click(function (e) {
      $($selector).dialog('close');
      page.nextPage();
    });

  }
  var init = function ($selector, $tableSelector) {
    initDialog($selector);
    bindEvents ($selector, $tableSelector);
  }

  return { init: init };
})(jQuery);
