var columns = [
  {
    name: "control",
    type: "control",
    width:"30px",
    editButton: false,
  },
  { name: "ClientID", type: "text", width:"80px", align:"center"}, //hidden
  { name: "Status", type: "select", items: [{Id: ""},{Id: "submitted"},{Id: "new"},{Id: "used"},{Id:"failed"}], valueField: "Id", textField: "Id", width:"50px", align:"center"}, //hidden
  { name: "UserID", type: "text", width:"80px", align:"center", validate: "required"},
  { name: "Description", type: "text", width:"100px", align:"center", validate: "required"},
  { name: "ID", type: "text", width: "60px", align:"center"}, //hidden
  { name: "RequestType", type: "text", width:"50px", align:"center"},  //hidden
  { name: "Env", type: "text", width:"30px", align:"center"},      //hidden
  { name: "SubmissionDate", type: "text", width:"50px", align:"center"}, //hidden
  { name: "Gender", type: "text", width:"30px", align:"center", validate: "required", insertTemplate: setDefaultInsert("F")},
  { name: "BirthDate", type: "text", width:"50px", align:"center", validate: "required", insertTemplate: setDefaultInsert("01/22/1970")},
  { name: "NationalIdType", type: "text", width:"50px", align:"center", validate: "required", insertTemplate: setDefaultInsert("PR")},
  { name: "CountryCode", type: "text", width:"50px", align:"center", validate: "required", insertTemplate: setDefaultInsert("CAN")},
  { name: "AddressLine1", type: "text", width:"100px", align:"center", validate: "required", insertTemplate: setDefaultInsert("1 University Ave")},
  { name: "AddressCity", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("Toronto")},
  { name: "AddressState", type: "text", width:"50px", align:"center", validate: "required", insertTemplate: setDefaultInsert("ON")},
  { name: "AddressPostalCode", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("M5J 2P1")},
  { name: "Format", type: "text", width:"50px", align:"center", validate: "required", insertTemplate: setDefaultInsert("English")},
  { name: "PhoneType", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("HOME")},
  { name: "PhoneNumber", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("413-164-369")},
  { name: "EmpRecordType", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("1")},
  { name: "DepartmentCode", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("0000802828")},
  { name: "FulltimePartTime", type: "text", width:"60px", align:"center", validate: "required", insertTemplate: setDefaultInsert("P")},
  { name: "HireDate", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("12/14/2014")},
  { name: "JobCode", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("Other")},
  { name: "EmpClass", type: "text", width:"50px", align:"center", validate: "required", insertTemplate: setDefaultInsert("65")},
  { name: "UnionCode", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("O02")},
  { name: "RateCode", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("NAANNL")},
  { name: "BenefitSystem", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("BN")},
  { name: "TypeCompRate", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("75000")},
  { name: "TypeDepartmentId", type: "text", width:"100px", align:"center", validate: "required", insertTemplate: setDefaultInsert("0000802828")},
  { name: "BenefitProgramName", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("OMR")},
  { name: "EnrolmentDate", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("12/14/2014")},
  { name: "NotificationType", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("General")},
  { name: "PensionPlanType", type: "text", width:"70px", align:"center", validate: "required", insertTemplate: setDefaultInsert("80")}
];

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

function setDefaultInsert (value) {
  return function () {
        	var input = this.__proto__.insertTemplate.call(this);
          input.val(value)
          return input;
  }
}

//dev variables
const table = 'EnrollmentData';
const statusColumn = 'Status';
const clientID = 'ClientID';
const reqType = '"R"';


var submitData = [];
var currDb = [];

function guid() {
    return Math.round(Math.random() * (1000000000000 - 100000000000) + 100000000000);
}

$(document).ready(function() {
  $('#currEnv').val("Environment: "+$("#envData", window.parent.document).val());

  $('body').on('click', '.addrow', function() {
    $.ajax({
        type: "GET",
        url: "/db/load",
        dataType: "json"
    }).done(function(result) {
        currDb = result;
    });

        //button visibility
    $("input[type='button']").prop("type","hidden");
    $("#save").prop("type","button");
    $("#home").prop("type","button");

    $("#jsGrid").jsGrid({
      width: "98%",
      shrinkToFit: true,
      inserting: true,
      autowidth: false,
      editing: false,
      sorting: false,
      paging: true,
      autoload: true,

      pageSize: 15,
      pageButtonCount: 5,

      deleteConfirm: "Confirm Delete Client?",


      controller: {
        insertItem: function (item) {
          item.RequestType = "R";
          item.Status = "submitted";
          item.Env = $("#envData", window.parent.document).val();
          item.ClientID = "";
          item.SubmissionDate = getDateNow();
          item.ID = guid();
          for (var row in currDb) {
            while (currDb[row].ID == item.ID) {
              item.ID = guid();
            }
          }
          submitData.push(item);
          console.log(submitData);
        },
        deleteItem: function (item) {
          var index = submitData.indexOf(item);
          submitData.splice(index,1);
          console.log(submitData);
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
  });

  $('body').on('click', '.save', function() {

    $('#currEnv').hide();
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
          width: "98%",
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
                  dataType: "json"
              }).done(function(result) {
                  console.log(result);
                  console.log(submitData);
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
        console.log(error);
      });

  });


  $('body').on('click', '.search', function() {
    $("input[type='button']").prop("type","hidden");
    $("#msg").prop("type","hidden");
    $('#currEnv').hide();

    $("#jsGrid").jsGrid({
        width: "98%",
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
              console.log(submitData);
          }
        },

        fields: columns
    });

    $("#jsGrid").jsGrid("fieldOption", "control", "deleteButton", false);
    $("#jsGrid").jsGrid("fieldOption", "RequestType", "visible", false);
    $("#jsGrid").jsGrid("fieldOption", "Status", "visible", true);
    $("#jsGrid").jsGrid("fieldOption", "Env", "visible", true);
    $("#jsGrid").jsGrid("fieldOption", "ClientID", "visible", true);
    $("#jsGrid").jsGrid("fieldOption", "ID", "visible", true);
    $("#jsGrid").jsGrid("fieldOption", "SubmissionDate", "visible", true);

  });

  $('body').on('click', '.submitStatus', function() {

    $.ajax({
        type: "POST",
        url: "/db/update",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(submitData)
    }).done(function(result) {
      alert('New Status Successfully Submitted');
    });
  });

  $('body').on('click', '.cancel', function() {
    location.reload();
  });

  $('body').on('click', '.home', function() {
    location.reload();
  });

});
