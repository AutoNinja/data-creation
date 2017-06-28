var initcookies = require('./library/usecookies.js');
var nav = require('./library/nav.js');
var util = require('./library/table-util.js');

$( document ).ready(function() {
  initcookies();

  nav($);

  var today = new Date();

  $("#date").text("EST "+today.toLocaleDateString("en-US",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));


});
