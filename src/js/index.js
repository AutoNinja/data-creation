var initcookies = require('./library/usecookies.js');
var util = require('./library/table-util.js');

$( document ).ready(function() {
  initcookies();

  var today = new Date();

  $("#date").text("EST "+today.toLocaleDateString("en-US",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));


});
