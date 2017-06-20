/******************************************************************************
Fields
******************************************************************************/

var exports = module.exports;

exports.getDefaults = function (type) {

  if (type == "modal") {
    return filterDefaultFields([
      "DepartmentCode",
      "RequestType",
      "Status",
      "Env",
      "ClientID",
      "ID",
      "SubmissionDate"
    ]);
  } else {
    return filterDefaultFields();
  }

}


/******************************************************************************
Private Functions
******************************************************************************/


//filters fields object based on discard array
function filterDefaultFields (discard) {
  var newDefaults = defaults;
  if (discard == undefined || discard == null) return newDefaults;

  for (var i = 0; i < discard.length; i++) {
    delete newDefaults[discard[i]];
  }
  return newDefaults;
};


var defaults = {
  UserID: '',
  Description: '',
  TypeDepartmentId: '',
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
  UnionCode: 'O02'
};
