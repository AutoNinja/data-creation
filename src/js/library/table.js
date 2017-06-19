var exports = module.exports;
var util = require('./table-util.js');
var fields = require('./fields.js').fields;
var defaults = require('./fields.js').defaults;

/******************************************************************************
Table API
******************************************************************************/




/******************************************************************************
Private functions
******************************************************************************/
//format fields into jsGrid format
function formatFields() {

  for (var i = 0; i < ) {

    var column = {};

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
