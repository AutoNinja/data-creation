/******************************************************************************
Modal Fields API
******************************************************************************/
var exports = module.exports;

//import fields(columns) for different tables
var fields = require("./modal_fields.js");

exports.getDefaults = function (type) {
  if (type === "modal_enrollment_manual") {
    return filterDefaultFields(fields.enrollment, [
      "DepartmentCode",
      "RequestType",
      "Status",
      "Env",
      "ClientID",
      "ID",
      "SubmissionDate"
    ]);
  } else if (type === "modal_enrollment_automation") {
    return filterDefaultFields(fields.enrollment, [
      "DepartmentCode",
      "Status",
      "Env",
      "ClientID",
      "SubmissionDate"
    ]);
  } else if  (type === "modal_sourcedata_manual") {
    return [fields.sourcedata1, fields.sourcedata2];
  } else if  (type === "modal_reporting_manual") {
    return fields.reporting;
  } else if  (type === "modal_election_manual") {
    return fields.election;
  }




}


/******************************************************************************
Private Functions
******************************************************************************/


//filters fields object based on discard array
function filterDefaultFields (fields, discard) {
  if (discard == undefined || discard == null) return fields;

  for (var i = 0; i < discard.length; i++) {
    delete fields[discard[i]];
  }
  return fields;
};
