var exports = module.exports;

/******************************************************************************
Table-util API
******************************************************************************/

//filters fields object based on discard array
exports.filter = function (fields, discard) {
  var newFields = fields;
  for (var i = 0; i < discard.length; i++) {
    delete newFields[discard[i]];
  }
  return newFields;
};

//get today's date (mmddyyyy)
exports.date = function () {
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

//generate random 12 digit id
exports.guid = () {
  return Math.round(Math.random() * (1000000000000 - 100000000000) + 100000000000);
}
