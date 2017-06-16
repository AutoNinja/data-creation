
  $(document).ready(function() {

    initializeDataFields();

    createSearchGrid();

    $("#jsGrid").jsGrid("fieldOption", "control", "deleteButton", false);

    setColumnsVisibility(
    [
      "Status",
      "ClientID",
      "ID",
      "SubmissionDate"
    ], true);

    setColumnsVisibility(
    [
      "RequestType",
      "Env"
    ], false);

    $('body').on('click', '#home', function() {window.location.replace("/");});

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
      pageSize: 13,
      pageButtonCount: 5,
      noDataContent: "No Data to be Displayed",
      loadIndicationDelay: 0,

      controller: {
        //get data from db
        loadData: function (filter) {
          var d = $.Deferred();

          $.ajax({
            type: "GET",
            url: "/db/load",
            cache: false,
            dataType: "json"
          })
          .done(function(result) {
            result = $.grep(result, function(item) {
              if (item["Env"] != Cookies.get("env")) {
                return false;
              }
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

        //submit updated data to db
        updateItem: function(item) {
          console.log(item);
          var d = $.Deferred();
          $.ajax({
            type: "POST",
            url: "/db/update",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(item)
          }).done(function(result) {
            d.resolve(item);
            alert('Update Success');
          });
          return d.promise();
        }
      },

      //disabled editing when status = used
      onItemEditing: function(args) {
        if (args.item.Status === "used" || args.item.Status === "terminated") {
          args.cancel = true;
        }
      }

    });

  }





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

      if (item.type!=="control") {
        //initialize edit template
        setEditTemplate(item);
      }


    });
  }



  function setEditTemplate(col) {
    if (col.name === "Status") {
      col.editTemplate = function (value, item) {
        var $select = this.__proto__.editTemplate.call(this);
        $select.val(value);
        $select.find("option[value='']").remove();
        if (item.Status==="submitted") {
          $select.find("option[value='new']").remove();
          $select.find("option[value='used']").remove();
          $select.find("option[value='failed']").remove();
        } else if (item.Status==="failed") {
          $select.find("option[value='new']").remove();
          $select.find("option[value='used']").remove();
        } else if (item.Status==="new") {
          $select.find("option[value='failed']").remove();
          $select.find("option[value='terminated']").remove();
          $select.find("option[value='submitted']").remove();
        }
        return $select;
      }
    } else {

      col.editTemplate = function (value, item) {
        var $input = this.__proto__.editTemplate.call(this);
        $input.prop("value",value);
        if (item.Status==="submitted" || item.Status==="failed") {
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

  var columns = [
    {
      name: "control",
      type: "control",
      width:"30px"
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
