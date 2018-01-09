(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var initcookies = require('./library/usecookies.js');
var util = require('./library/table-util.js');

$( document ).ready(function() {
  initcookies();




});

},{"./library/table-util.js":2,"./library/usecookies.js":3}],2:[function(require,module,exports){
var exports = module.exports;

/******************************************************************************
Table-util API
******************************************************************************/

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
exports.guid = function () {
  return Math.round(Math.random() * (1000000000000 - 100000000000) + 100000000000);
}

},{}],3:[function(require,module,exports){
module.exports = function() {

	if (Cookies.get('env')==undefined || Cookies.get('env')==""  || !isValidEnv())
		Cookies.set('env', 'TST', { expires: 15 });
	};

function isValidEnv() {
	var validEnv = ["TST","OAT","SIT2"];
	var valid = false;
	for (var i = 0; i < validEnv.length; i++) {
		if (Cookies.get('env') === validEnv[i]) {
			valid = true;
			break;
		}
	}
	return valid;
}

},{}]},{},[1]);
