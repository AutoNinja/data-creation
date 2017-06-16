
$(document).ready(function() {

  initializeDataFields();

  createNewDataGrid();

  //set default visibility
  setColumnsVisibility([
    "RequestType",
    "Status",
    "Env",
    "ClientID",
    "ID",
    "SubmissionDate"
  ], false);

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

  var d = $.Deferred();
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "/db/insert",
    data: JSON.stringify(submitData),
    dataType: "json"
  })
  .done(function(response){

    d.resolve();

  });

  d.done(function() {
    createResultGrid();
    $("#jsGrid").jsGrid("fieldOption", "control", "visible", false);
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

var defaults = {
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
  Description: '',
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
  TypeDepartmentId: '',
  UnionCode: 'O02',
  UserID: ''
};

var saveClient = function(client) {
/*
    $.extend(client, {
        Name: $("#name").val(),
        Age: parseInt($("#age").val(), 10),
        Address: $("#address").val(),
        Country: parseInt($("#country").val(), 10),
        Married: $("#married").is(":checked")
    });
*/
    $("#jsGrid").jsGrid("insertItem", client);

    $("#detailsDialog").dialog("close");
};

function generateModalFields() {
  var data = columns;

  for (var i = 1; i < data.length; i++) {

    if (data[i].name==="RequestType" ||
        data[i].name==="Status" ||
        data[i].name==="Env" ||
        data[i].name==="ClientID" ||
        data[i].name==="SubmissionDate" ||
        data[i].name==="ID")
      continue;

    $("#dialog-textboxes")
      .append("<div class='row r-"+i+"'></div>");

    $(".r-"+i)
      .append("<div class='col-xs-4 col-sm-4 c-1'></div>");

    $(".r-"+i)
      .append("<div class='col-xs-8 col-sm-8 c-2'></div>");

    $('<p>', {
      text: data[i].title+":"
    }).appendTo(".r-"+i+" .c-1");

    $('<input>', {
      type: "text",
      id: data[i].name,
      value: defaults[data[i].name]
    }).appendTo(".r-"+i+" .c-2");
  }
}

function createModal() {
    //$("#name").val(client.Name);

    generateModalFields();

    $("#detailsDialog").dialog({
        width: "70%",
        height: $(window).height(),
        position: {
          my: "center",
          at: "top",
          of: window
        },
        modal: true,
        title: "Create New Data",
        buttons:{
          "Add":{
            text:'Add',
            className:''
          },
          "Cancel":{
            text:'Cancel',
            className:''
          }
        },
        close: function() {
            //$("#detailsForm").validate().resetForm();
            //$("#detailsForm").find(".error").removeClass("error");
        }
    });

/*
    formSubmitHandler = function() {
        saveClient(client);
    };
*/
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
                      createModal();
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
