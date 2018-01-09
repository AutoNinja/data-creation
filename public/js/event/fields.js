var searchTableFields = [
  { name: "OverallStatus"},
  { name: "ClientID"},
  { name: "UserID"},
  { name: "ID", width: "120px"},
  { name: "SubmissionDate"}
];


var enrollmentTableFields = [
  {
    name: "Control",
    type: "control",
    width: "80px",
    modeSwitchButton: false
  },
  { name: "EnrollStatus", title: "EnrollStatus", type: "select",
    items: [
      {Id: ""},
      {Id: "submitted"},
      {Id: "new"},
      {Id: "used"},
      {Id: "failed"},
      {Id: "terminated"},
      {Id: "data issue"}],
    valueField: "Id",
    textField: "Id"},
  { name: "UserID"},
  { name: "Comment"},
  { name: "Description"},
  { name: "Env"},
  { name: "TypeDepartmentId"},
  { name: "DepartmentCode"},
  { name: "PhoneType"},
  { name: "PhoneNumber"},
  { name: "BirthDate"},
  { name: "EnrolmentDate"},
  { name: "HireDate"},
  { name: "Gender"},
  { name: "FulltimePartTime"},
  { name: "AddressLine1"},
  { name: "AddressCity"},
  { name: "AddressState"},
  { name: "AddressPostalCode"},
  { name: "CountryCode"},
  { name: "NationalIdType"},
  { name: "Format"},
  { name: "EmpRecordType"},
  { name: "JobCode"},
  { name: "EmpClass"},
  { name: "UnionCode"},
  { name: "RateCode"},
  { name: "BenefitSystem"},
  { name: "TypeCompRate"},
  { name: "BenefitProgramName"},
  { name: "NotificationType"},
  { name: "PensionPlanType"},
  { name: "MemberClass"},
  { name: "ConsentIndicator"}
];

var sourcedataTableFields =
[
  {
    name: "Control",
    type: "control",
    width: "80px",
    modeSwitchButton: false,
    headerTemplate: function() {
        return $("<button>")
                .attr("type", "button")
                .attr("class","control-btn")
                .text("New data");
    }
  },
  { name: "SDStatus", title: "Status", type: "select",
    items: [
      {Id: ""},
      {Id: "submitted"},
      {Id: "new"},
      {Id: "used"},
      {Id: "failed"},
      {Id: "terminated"},
      {Id: "data issue"}],
    valueField: "Id",
    textField: "Id",
    visible: false},
  { name: "StartDate"},
  { name: "EndDate"},
  { name: "ServiceAmt"},
  { name: "EarningsAmt"},
  { name: "ServiceEarningsType", type: "select",
    items: [
      {Id: ""},
      {Id: "CR1"},
      {Id: "PA1"}],
    valueField: "Id",
    textField: "Id"},
  { name: "ContributionAmt"},
  { name: "ContributionType"},
  { name: "CarryForward"},
  { name: "PostEvent"}
];

var reportingTableFields = [
  {
    name: "Control",
    type: "control",
    width: "80px",
    modeSwitchButton: false
  },
  { name: "ReportingStatus", title: "Status", type: "select",
    items: [
      {Id: ""},
      {Id: "submitted"},
      {Id: "new"},
      {Id: "used"},
      {Id: "failed"},
      {Id: "terminated"},
      {Id: "data issue"}],
    valueField: "Id",
    textField: "Id",
    visible: false},
  { name: "EventSubTypeID"},
  { name: "NumberOfEventCalculations"},
  { name: "EventDate"}
];

var electionTableFields = [
  {
    name: "Control",
    type: "control",
    width: "80px",
    modeSwitchButton: false
  },
    { name: "ElectionStatus", title: "Status", type: "select",
      items: [
        {Id: ""},
        {Id: "submitted"},
        {Id: "new"},
        {Id: "used"},
        {Id: "failed"},
        {Id: "terminated"},
        {Id: "data issue"}],
      valueField: "Id",
      textField: "Id",
      visible: false},
    { name: "EventOption"},
    { name: "EventComponent"},
    { name: "DestinationType"},
    { name: "BankAccountsType"},
    { name: "BankID"},
    { name: "BankBranchID"},
    { name: "AccountNumber"},
    { name: "PaymentMethod"},
    { name: "BankInfo"}
]

var enrollmentPopupFields = {
  UserID: '',
  Description: '',
  Comment: '',
  TypeDepartmentId: '',
  PhoneType: 'HOME',
  PhoneNumber: '413-164-369',
  BirthDate: '01/22/1970',
  EnrolmentDate: '01/01/1963',
  HireDate: '12/14/2014',
  FulltimePartTime: 'P',
  AddressCity: 'Toronto',
  AddressLine1: '1 University Ave',
  AddressPostalCode: 'M5J 2P1',
  AddressState: 'ON',
  Gender: 'F',
  CountryCode: 'CAN',
  NationalIdType: 'PR',
  BenefitProgramName: 'OMR',
  BenefitSystem: 'BN',
  EmpClass: '65',
  EmpRecordType: '1',
  Format: 'English',
  JobCode: 'Other',
  MemberClass: 'NRA65',
  NotificationType: 'General',
  PensionPlanType: '80',
  RateCode: 'NAANNL',
  TypeCompRate: '75000',
  UnionCode: 'O02',
  ConsentIndicator: 'N'
};



var sourcedataPopupFieldsOne = {
  StartDate: '',
  EndDate: '',
  ServiceAmt: '12',
  EarningsAmt: '55000',
  ServiceEarningsType: 'CR1',
  ContributionAmt: '4500',
  ContributionType: 'RPP1',
  CarryForward: 'N',
  PostEvent: 'N'
};

var sourcedataPopupFieldsTwo = {
  StartDate: '',
  EndDate: '',
  ServiceAmt: '0',
  EarningsAmt: '6400',
  ServiceEarningsType: 'PA1',
  ContributionAmt: '0',
  ContributionType: '',
  CarryForward: 'N',
  PostEvent: 'N'
};

var reportingPopupFields = {
  EventSubTypeID: 'Termination',
  EventDate: '12/31/2014',
  NumberOfEventCalculations: '2'
};

var electionPopupFields = {
  EventOption: "Deferred Pension",
  EventComponent: "RPP Deferred Pension",
  DestinationType: "Non Tax Sheltered",
  BankAccountsType: "Bank Account",
  BankID: "001",
  BankBranchID: "00011",
  AccountNumber: "1234567",
  PaymentMethod: "Cheque",
  BankInfo: ""
};
