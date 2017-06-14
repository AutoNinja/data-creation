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

var columns = [
  {
    name: "control",
    type: "control",
    width:"30px",
    editButton: false,
  },
  { name: "ClientID"},
  { name: "Status",
  type: "select",
  items: [
    {Id: ""},
    {Id: "submitted"},
    {Id: "new"},
    {Id: "used"},
    {Id:"failed"},
    {Id:"terminated"}],
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
    { name: "MemberClass"},
  ];

  var submitData = [];

  $(document).ready(function() {

    initializeDataFields();

    $('.table-btn').on('click', function(){$(".main-content-container").hide();});

    $('body').on('click', '.addrow', handleClickNewData);

    $('body').on('click', '.save', handleClickSave);

    $('body').on('click', '.search', handleClickSearch);

    $('body').on('click', '.submitStatus', handeClickNewStatus);

    $('body').on('click', '.cancel', function() {location.reload();});

    $('body').on('click', '.home', function() {location.reload();});

  });

  function createSearchGrid () {
    $("#jsGrid").jsGrid({

      fields: columns,

      //grid configuration
      width: "100%",
      height: "auto",
      shrinkToFit: true,
      autoload: true,
      paging: true,
      filtering: true,
      editing: true,
      sorting: true,
      pageSize: 15,
      pageButtonCount: 5,
      noDataContent: "No Data to be Displayed",
      loadIndicationDelay: 0,
      controller: {
        loadData: function (filter) {
          var d = $.Deferred();
          // send request to the server and filter data there
          $.ajax({
            type: "GET",
            url: "/db/load",
            cache: false,
            dataType: "json"
          }).done(function(result) {
            $("#home").prop("type","button");
            $("#submitStatus").prop("type","button");
            result = $.grep(result, function(item) {
              for (var property in filter) {
                if (filter[property]!=="" &&
                item[property] !== filter[property])
                {
                  return false;
                }
              }
              return true;
            });
            d.resolve(result);
          });
          return d.promise();
        },


        updateItem: function(item) {
          submitData.push(item);
        }
      },

      onItemEditing: function(args) {
        if (args.item.Status == "used") {
          args.cancel = true;
        }
      },

      onItemUpdating: function(args) {
        if (args.previousItem.Status==="new") {
          //check if changed status is valid
          if (args.item.Status != "used" && args.item.Status != "new") {
            args.cancel = true;
            alert("You can only change 'Status' to 'new' or 'used'!");
            return;
          }
          //check if any other field is changed
          for (property in args.item) {
            if (args.item[property] !== args.previousItem[property] && property!="Status") {
              args.cancel = true;
              alert("You can only change the 'Status' field!");
              return;
            }
          }
        }
      }
    });
  }


  function handeClickNewStatus() {
    $.ajax({
      type: "POST",
      url: "/db/update",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(submitData)
    }).done(function(result) {
      alert('New Status Successfully Submitted');
    });
  }

  function handleClickSearch() {
    $("input[type='button']").prop("type","hidden");
    $("#msg").prop("type","hidden");
    createSearchGrid();
    /*
    $("#jsGrid").jsGrid({
    width: "100%",
    shrinkToFit: true,
    inserting: false,
    autowidth: false,
    filtering: true,
    sorting: true,
    paging: true,
    autoload: true,
    editing: true,

    pageSize: 15,
    pageButtonCount: 5,

    onItemEditing: function(args) {
    if (args.item.Status != "new" || args.item.ClientID == "") {
    args.cancel = true;
  }
},

onItemUpdating: function(args) {
if (args.item.Status != "used" && args.item.Status != "new") {
args.cancel = true;
alert("You can only change 'Status' to 'new' or 'used'!");
return;
}
for (property in args["item"]) {
if (args.item[property] !== args.previousItem[property] && property!="Status") {
args.item[property] = args.previousItem[property]
args.cancel = true;
alert("You can only change the 'Status' field!");
return;
}
}
if (args.previousItem.Status === args.item.Status) {
args.cancel = true;
alert("Nothing changed");
return;
}
},

controller: {
loadData: function (filter) {
var d = $.Deferred();
// send request to the server and filter data there
$.ajax({
type: "GET",
url: "/db/load",
cache: false,
dataType: "json"
}).done(function(result) {
$("#home").prop("type","button");
$("#submitStatus").prop("type","button");
result = $.grep(result, function(item) {
var isEmpty = true;
for (var property in filter) {
if (filter[property]!=="") {
isEmpty = false;
break;
}
}

if (isEmpty)
return false;

var match = true;
// some client-side filtering below
for (var property in item) {
if (item.hasOwnProperty(property)) {
if (filter[property]!=="" && item[property] !== filter[property] && property != "RequestType") {
match = false;
}
}
}
return match;
});

d.resolve(result);
});
return d.promise();
},


updateItem: function(item) {
submitData.push(item);
}
},

fields: columns
});
*/
$("#jsGrid").jsGrid("fieldOption", "control", "deleteButton", false);
$("#jsGrid").jsGrid("fieldOption", "RequestType", "visible", false);
$("#jsGrid").jsGrid("fieldOption", "Status", "visible", true);
$("#jsGrid").jsGrid("fieldOption", "Env", "visible", true);
$("#jsGrid").jsGrid("fieldOption", "ClientID", "visible", true);
$("#jsGrid").jsGrid("fieldOption", "ID", "visible", true);
$("#jsGrid").jsGrid("fieldOption", "SubmissionDate", "visible", true);

}

function handleClickSave() {

  $("input[type='button']").prop("type","hidden");
  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "/db/insert",
    data: JSON.stringify(submitData),
    dataType: "json"
  })
  .done(function(response){
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
            $("#search").prop("type","button");
            $("#home").prop("type","button");
            $("#msg").prop("type","text");
            data.resolve(result);
          });
          return data.promise();
        }
      },
      fields: columns
    });
    $("#jsGrid").jsGrid("fieldOption", "control", "visible", false);
  })
  .fail(function(error) {
    //console.log(error);
  });
}

function handleClickNewData () {

  //button visibility
  $("input[type='button']").prop("type","hidden");
  $("#save").prop("type","button");
  $("#home").prop("type","button");

  $("#jsGrid").jsGrid({
    width: "100%",
    inserting: true,
    editing: false,
    sorting: false,
    paging: true,
    autoload: true,
    autowidth: false,

    pageSize: 15,
    pageButtonCount: 5,

    deleteConfirm: "Confirm Delete Client?",


    controller: {
      insertItem: function (item) {
        item.RequestType = "R";
        item.Status = "submitted";
        item.Env = $("#envValue").val()
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
  $("#jsGrid").jsGrid("fieldOption", "RequestType", "visible", false);
  $("#jsGrid").jsGrid("fieldOption", "Status", "visible", false);
  $("#jsGrid").jsGrid("fieldOption", "Env", "visible", false);
  $("#jsGrid").jsGrid("fieldOption", "ClientID", "visible", false);
  $("#jsGrid").jsGrid("fieldOption", "ID", "visible", false);
  $("#jsGrid").jsGrid("fieldOption", "SubmissionDate", "visible", false);
}


function initializeDataFields() {

  columns.forEach(function(item){
    //set alignment
    item.align = "center";

    //set validate
    item.validate = "required";

    //default type text field
    if (item.type===undefined || item.type==="")
    item.type="text";

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


function setColumnWidth(item) {
  var baseWidth;
  if (item.title==="Id")
  baseWidth = 100;
  else
  baseWidth = 35;
  return item.width=(item.title.length*12+baseWidth).toString()+"px";
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

function setDefaultInsertTemplate (item) {
  var value = defaults[item.name];
  item.insertTemplate = function () {
    var input = this.__proto__.insertTemplate.call(this);
    input.val(value)
    return input;
  }
}

function guid() {
  return Math.round(Math.random() * (1000000000000 - 100000000000) + 100000000000);
}
