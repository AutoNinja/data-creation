var buildFields = (function () {
  var init = function (fields) {
    for (var i = 0; i < fields.length; i++) {
      var item = fields[i];
      if (item.name === "Control") continue;
      item.type = item.type || "text";
      item.align = item.align || "center";
      item.title = item.title || trimItemName (item);
      item.width = item.width || calcColWidth (item);
    }
  }

  var addValidation = function (fields) {
    for (var i = 0; i < fields.length; i++) {
      var item = fields[i];
      if (item.name === "Control") continue;
      if (item.name !== "Comment" && item.name !== "Description")
        item.validate = "required";
    }
  }

  var buildNoValidation = function (fields) {
    init(fields);
    return fields;
  }

  var buildNewData = function (fields)  {
    init(fields);
    //addValidation(fields);
    return fields;
  }

  var buildSearch = function (fields) {
    init(fields);
    //addValidation(fields);
    for (var i = 0; i < fields.length; i++) {
      var item = fields[i];
      if (item.name === "Control") continue;

      if (item.name.indexOf('Status') === -1) {
        if (item.name === "ID" || item.name === "ClientID" || item.name === "SubmissionDate")
          item.editTemplate = disabledEditTemplate;
        else
          item.editTemplate = defaultEditTemplate;
      } else {
          item.editTemplate = statusEditTemplate;
      }

    }
    return fields;
  }

  function statusEditTemplate(value, item) {
    var $select = this.__proto__.editTemplate.call(this);
    $select.val(value);
    $select.find("option[value='']").remove();
    if (item.Status==="submitted") {
      $select.find("option[value='data issue'],option[value='new'],option[value='used'],option[value='failed']").remove();
    } else if (item.Status==="failed") {
      $select.find("option[value='new'],option[value='used'],option[value='data issue']").remove();
    } else if (item.Status==="new") {
      $select.find("option[value='data issue'],option[value='failed'],option[value='terminated'],option[value='submitted']").remove();
    } else if (item.Status==="data issue") {
      $select.find("option[value='failed'],option[value='new'],option[value='used']").remove();
    } else if (item.Status==="terminated") {
      $select.find("option").remove();
    } else if (item.Status==="used") {
      $select.find("option[value='data issue'],option[value='failed'],option[value='submitted']").remove();
    }
    return $select;
  }

  function defaultEditTemplate(value, item) {
    var $input = this.__proto__.editTemplate.call(this);
    $input.prop("value",value);

    if (item.EnrollStatus==="submitted" || item.EnrollStatus==="new" || item.EnrollStatus==="used" || item.EnrollStatus === "terminated") {
      $input.prop('readonly', true).css('background-color', '#EBEBE4');
    }
    return $input;
  }

  function disabledEditTemplate (value, item) {
    var $input = this.__proto__.editTemplate.call(this);
    $input.prop("value",value).prop('readonly', true).css('background-color', '#EBEBE4');
    return $input;
  }


  function trimItemName (item) {
    return item.name.replace(/ID/g, "Id").replace(/([A-Z])/g, ' $1').trim();
  }

  function calcColWidth(item) {
    return (item.title.length*12+35).toString()+"px";
  }

  return {
    buildNewData: buildNewData,
    buildSearch: buildSearch
  }
})();
