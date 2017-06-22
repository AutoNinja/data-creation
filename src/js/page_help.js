var initcookies = require('./library/usecookies.js');
var nav = require('./library/nav.js');

$( document ).ready(function() {
  initcookies();

  nav($);

});
