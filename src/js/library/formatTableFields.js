var exports = module.exports;

//import fields(columns) for different tables
var fields = require("./table_fields.js");


//format fields according to rules for each table
exports.getFields = function (type) {

  var newFields = [];

  if (type === "newdata_enrollment_manual") {

    newFields = fields.enrollment;

    var hideColumns = [
      "DepartmentCode",
      "RequestType",
      "Status",
      "Env",
      "ClientID",
      "ID",
      "SubmissionDate"
    ];

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      if (hideColumns.indexOf(item.name)>-1)
        item.visible = false;

    }

    //add control column
    var control = {
        type: "control",
        name: "Control",
        width: "80px",
        modeSwitchButton: false,
        editButton: false,
        headerTemplate: function() {
            return $("<button>").attr("type", "button").attr("id","control-btn").text("New Data");
        }
    };

    newFields.unshift(control);

  } else if (type === "search_enrollment_manual") {

    newFields = fields.enrollment;

    var hideColumns = [
      "RequestType",
      "Env",
      "DepartmentCode"
    ];

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      setEnrollmentEditTemplate(item);

      if (hideColumns.indexOf(item.name)>-1)
        item.visible = false;

      if (item.name==="ClientID" || item.name==="Comment")
        item.validate = "";

    }

    var control = {
      name: "control",
      type: "control",
      deleteButton: false,
      editButton: false,
      width:"80px"
    }

    newFields.unshift(control);

  } else if (type==="newdata_enrollment_automation"){

    newFields = fields.enrollment;

    var hideColumns = [
      "DepartmentCode",
      "Status",
      "Env",
      "ClientID",
      "SubmissionDate"
    ];

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      if (hideColumns.indexOf(item.name)>-1)
        item.visible = false;
    }

    //add control column
    var control = {
        type: "control",
        name: "Control",
        width: "80px",
        modeSwitchButton: false,
        editButton: false,
        headerTemplate: function() {
            return $("<button>").attr("type", "button").attr("id","control-btn").text("New Data");
        }
    };

    newFields.unshift(control);

  } else if (type === "search_enrollment_automation") {

    newFields = fields.enrollment;

    var hideColumns = [
      "DepartmentCode",
      "Env",
    ];

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      if (hideColumns.indexOf(item.name)>-1)
        item.visible = false;

      if (item.name==="ClientID" || item.name==="Comment")
        item.validate = "";

    }

    var control = {
      name: "control",
      type: "control",
      deleteButton: false,
      editButton: false,
      width:"80px"
    };

    newFields.unshift(control);

  } else if (type === "newdata_sourcedata_manual") {

    newFields = fields.sourcedata;

    var hideColumns = [
      "SDStatus",
      "ID",
      "SubmissionDate",
      "UserID",
    ];

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      if (hideColumns.indexOf(item.name)>-1)
        item.visible = false;

    }

    //add control column
    var control = {
        type: "control",
        name: "Control",
        width: "80px",
        modeSwitchButton: false,
        headerTemplate: function() {
            return $("<button>").attr("type", "button").attr("id","control-btn").text("New Data");
        }
    };

    newFields.unshift(control);
  } else if (type === "search_sourcedata_manual") {

    newFields = fields.sourcedata;

    for (var i = 0; i < newFields.length; i++) {

      var item = newFields[i];

      setSourceDataEditTemplate(item);
    }

    //add control column
    var control = {
        type: "control",
        name: "Control",
        width: "80px",
        modeSwitchButton: false,
        deleteButton: false
    };

    newFields.unshift(control);
  }

  for (var i = 0; i < newFields.length; i++) {

    var item = newFields[i];

    //set type
    if (item.type == undefined || item.type == "")
      item.type = "text";

    //set alignment
    item.align = "center";

    //set validate except for ClientID
    //if (item.name !== "ClientID")
    item.validate = "required";

    //set display headings
    setTitle(item);

    //set width
    setColumnWidth(item);
  }

  return newFields;
}



/******************************************************************************
Private functions
******************************************************************************/

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

function setColumnWidth(item) {
  var baseWidth;
  if (item.title==="Id")
    baseWidth = 100;
  else
    baseWidth = 35;
  return item.width=(item.title.length*12+baseWidth).toString()+"px";
}

function setEnrollmentEditTemplate(col) {
  if (col.name === "Status") {
    col.editTemplate = function (value, item) {
      var $select = this.__proto__.editTemplate.call(this);
      $select.val(value);
      $select.find("option[value='']").remove();
      if (item.Status==="submitted") {
        $select.find("option[value='data issue']").remove();
        $select.find("option[value='new']").remove();
        $select.find("option[value='used']").remove();
        $select.find("option[value='failed']").remove();
      } else if (item.Status==="failed") {
        $select.find("option[value='new']").remove();
        $select.find("option[value='used']").remove();
      } else if (item.Status==="new") {
        $select.find("option[value='data issue']").remove();
        $select.find("option[value='failed']").remove();
        $select.find("option[value='terminated']").remove();
        $select.find("option[value='submitted']").remove();
      } else if (item.Status==="data issue") {
        $select.find("option[value='failed']").remove();
        $select.find("option[value='new']").remove();
        $select.find("option[value='used']").remove();
      }
      return $select;
    }
  } else {
    col.editTemplate = function (value, item) {
      var $input = this.__proto__.editTemplate.call(this);
      $input.prop("value",value);
      if (item.Status==="submitted" || item.Status==="failed" || item.Status==="data issue") {
        if (col.name === "ClientID" ||
            col.name === "UserID" ||
            col.name === "ID" ||
            col.name === "SubmissionDate")
        {
          $input.prop('readonly', true);
          $input.css('background-color' , '#EBEBE4');
        }
      } else {
        $input.prop('readonly', true);
        $input.css('background-color' , '#EBEBE4');
      }
      return $input;
    }
  }
}

function setSourceDataEditTemplate(col) {
  if (col.name === "SDStatus") {
    col.editTemplate = function (value, item) {
      var $select = this.__proto__.editTemplate.call(this);
      $select.val(value);
      $select.find("option[value='']").remove();
      if (item.SDStatus==="submitted") {
        $select.find("option[value='data issue']").remove();
        $select.find("option[value='new']").remove();
        $select.find("option[value='used']").remove();
        $select.find("option[value='failed']").remove();
      } else if (item.SDStatus==="failed") {
        $select.find("option[value='new']").remove();
        $select.find("option[value='used']").remove();
      } else if (item.SDStatus==="new") {
        $select.find("option[value='data issue']").remove();
        $select.find("option[value='failed']").remove();
        $select.find("option[value='terminated']").remove();
        $select.find("option[value='submitted']").remove();
      } else if (item.SDStatus==="data issue") {
        $select.find("option[value='failed']").remove();
        $select.find("option[value='new']").remove();
        $select.find("option[value='used']").remove();
      }
      return $select;
    }
  } else {
    col.editTemplate = function (value, item) {
      var $input = this.__proto__.editTemplate.call(this);
      $input.prop("value",value);
      if (item.SDStatus==="submitted" || item.SDStatus==="failed" || item.SDStatus==="data issue") {
        if (col.name === "ClientID" ||
            col.name === "UserID" ||
            col.name === "ID" ||
            col.name === "SubmissionDate")
        {
          $input.prop('readonly', true);
          $input.css('background-color' , '#EBEBE4');
        }
      } else {
        $input.prop('readonly', true);
        $input.css('background-color' , '#EBEBE4');
      }
      return $input;
    }
  }
}
