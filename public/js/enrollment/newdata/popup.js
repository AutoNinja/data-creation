"use strict";

var newDataPopup = (function ($) {
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
  };

  var bindEvents = function ($selector, $tableSelector, popupFields) {

    $($tableSelector+" .control-btn").on("click", function () {
        $($selector).dialog("open");
    });

    $($selector+' #dialog-textboxes').submit(function(e) {
        e.preventDefault();
        var newData = {};
        for (var name in popupFields) {newData[name] =  $("#"+name).val();}
        $($tableSelector).jsGrid("insertItem", newData);
        resetModal($selector, popupFields);
    });


    $($selector+' #cancel').click(function() {
      $($selector).dialog('close');
      resetModal($selector, popupFields);
    });
  }

  var renderInputFields = function ($selector, fields, popupFields) {

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

      var $input = $('<input>', {
        type: "text",
        name: name,
        id: name,
        value: popupFields[name]
      }).appendTo(".r-"+name+" .c-2");

      if (name !== "Comment" && name !== "Description")
        $input.prop("required", true);

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

  var resetModal = function ($selector, popupFields) {
    for (var name in popupFields) {
      if (name === "UserID") continue;
      $($selector+' #'+name).val(popupFields[name]);
    }
  };

  var init = function ($selector, $tableSelector, popupFields) {
    initDialog($selector);
    renderInputFields($selector, $tableSelector, popupFields);
    bindEvents ($selector, $tableSelector, popupFields);

  }

  return { init: init };
})(jQuery);
