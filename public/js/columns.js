var columns = [
  {
    name: "control",
    type: "control",
    width:"100px",
    editButton: false,
  },
  { name: "Status", type: "select", items: [{Id: ""},{Id: "submitted"},{Id: "new"},{Id: "used"},{Id:"failed"},{Id:"terminated"}], valueField: "Id", textField: "Id", width:"150px", align:"center"}, //hidden
  { name: "RequestType", type: "text", width:"150px", align:"center"},  //hidden
  { name: "Description", type: "text", width:"150px", align:"center", validate: "required"},
  { name: "UserID", type: "text", width:"150px", align:"center", validate: "required"},
  { name: "Env", type: "text", width:"80px", align:"center"},      //hidden
  { name: "ClientID", type: "text", width:"120px", align:"center"}, //hidden
  { name: "ID", type: "text", width:"300px", align:"center"}, //hidden
  { name: "Gender", type: "text", width:"100px", align:"center", validate: "required", insertTemplate: setDefaultInsert("F")},
  { name: "BirthDate", type: "text", width:"150px", align:"center", validate: "required", insertTemplate: setDefaultInsert("01/22/1970")},
  { name: "NationalIdType", type: "text", width:"150px", align:"center", validate: "required", insertTemplate: setDefaultInsert("PR")},
  { name: "CountryCode", type: "text", width:"150px", align:"center", validate: "required", insertTemplate: setDefaultInsert("CAN")},
  { name: "AddressLine1", type: "text", width:"250px", align:"center", validate: "required", insertTemplate: setDefaultInsert("1 University Ave")},
  { name: "AddressCity", type: "text", width:"150px", align:"center", validate: "required", insertTemplate: setDefaultInsert("Toronto")},
  { name: "AddressState", type: "text", width:"120px", align:"center", validate: "required", insertTemplate: setDefaultInsert("ON")},
  { name: "AddressPostalCode", type: "text", width:"170px", align:"center", validate: "required", insertTemplate: setDefaultInsert("M5J 2P1")},
  { name: "Format", type: "text", width:"120px", align:"center", validate: "required", insertTemplate: setDefaultInsert("English")},
  { name: "PhoneType", type: "text", width:"120px", align:"center", validate: "required", insertTemplate: setDefaultInsert("HOME")},
  { name: "PhoneNumber", type: "text", width:"150px", align:"center", validate: "required", insertTemplate: setDefaultInsert("413-164-369")},
  { name: "EmpRecordType", type: "text", width:"150px", align:"center", validate: "required", insertTemplate: setDefaultInsert("1")},
  { name: "DepartmentCode", type: "text", width:"150px", align:"center", validate: "required", insertTemplate: setDefaultInsert("0000802828")},
  { name: "FulltimePartTime", type: "text", width:"150px", align:"center", validate: "required", insertTemplate: setDefaultInsert("P")},
  { name: "HireDate", type: "text", width:"130px", align:"center", validate: "required", insertTemplate: setDefaultInsert("12/14/2014")},
  { name: "JobCode", type: "text", width:"100px", align:"center", validate: "required", insertTemplate: setDefaultInsert("Other")},
  { name: "EmpClass", type: "text", width:"100px", align:"center", validate: "required", insertTemplate: setDefaultInsert("65")},
  { name: "UnionCode", type: "text", width:"100px", align:"center", validate: "required", insertTemplate: setDefaultInsert("O02")},
  { name: "RateCode", type: "text", width:"100px", align:"center", validate: "required", insertTemplate: setDefaultInsert("NAANNL")},
  { name: "BenefitSystem", type: "text", width:"130px", align:"center", validate: "required", insertTemplate: setDefaultInsert("BN")},
  { name: "TypeCompRate", type: "text", width:"130px", align:"center", validate: "required", insertTemplate: setDefaultInsert("75000")},
  { name: "TypeDepartmentId", type: "text", width:"200px", align:"center", validate: "required", insertTemplate: setDefaultInsert("0000802828")},
  { name: "BenefitProgramName", type: "text", width:"200px", align:"center", validate: "required", insertTemplate: setDefaultInsert("OMR")},
  { name: "EnrolmentDate", type: "text", width:"150px", align:"center", validate: "required", insertTemplate: setDefaultInsert("12/14/2014")},
  { name: "NotificationType", type: "text", width:"150px", align:"center", validate: "required", insertTemplate: setDefaultInsert("General")},
  { name: "PensionPlanType", type: "text", width:"150px", align:"center", validate: "required", insertTemplate: setDefaultInsert("80")}
];

function setDefaultInsert (value) {
  return function () {
        	var input = this.__proto__.insertTemplate.call(this);
          input.val(value)
          return input;
  }
}



module.exports = columns;
