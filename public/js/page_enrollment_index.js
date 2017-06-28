(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! Pushy - v1.1.0 - 2017-1-30
* Pushy is a responsive off-canvas navigation menu using CSS transforms & transitions.
* https://github.com/christophery/pushy/
* by Christopher Yee */

module.exports = function ($) {
	var pushy = $('.pushy'), //menu css class
		body = $('body'),
		container = $('#container'), //container css class
		push = $('.push'), //css class to add pushy capability
		pushyLeft = 'pushy-left', //css class for left menu position
		pushyOpenLeft = 'pushy-open-left', //css class when menu is open (left position)
		pushyOpenRight = 'pushy-open-right', //css class when menu is open (right position)
		siteOverlay = $('.site-overlay'), //site overlay
		menuBtn = $('.menu-btn, .pushy-link'), //css classes to toggle the menu
		menuBtnFocus = $('.menu-btn'), //css class to focus when menu is closed w/ esc key
		menuLinkFocus = $(pushy.data('focus')), //focus on link when menu is open
		menuSpeed = 200, //jQuery fallback menu speed
		menuWidth = pushy.width() + 'px', //jQuery fallback menu width
		submenuClass = '.pushy-submenu',
		submenuOpenClass = 'pushy-submenu-open',
		submenuClosedClass = 'pushy-submenu-closed',
		submenu = $(submenuClass);

	$(".env").click(function () {
		Cookies.set('env', $(this).text(), { expires: 15 });
		location.reload();
	});

	$("#envDisplay").text("Environment: "+Cookies.get('env'));

	//close menu w/ esc key
	$(document).keyup(function(e) {
		//check if esc key is pressed
		if (e.keyCode == 27) {

			//check if menu is open
			if( body.hasClass(pushyOpenLeft) || body.hasClass(pushyOpenRight) ){
				if(cssTransforms3d){
					closePushy(); //close pushy
				}else{
					closePushyFallback();
					opened = false; //set menu state
				}

				//focus on menu button after menu is closed
				if(menuBtnFocus){
					menuBtnFocus.focus();
				}

			}

		}
	});

	function togglePushy(){
		//add class to body based on menu position
		if( pushy.hasClass(pushyLeft) ){
			body.toggleClass(pushyOpenLeft);
		}else{
			body.toggleClass(pushyOpenRight);
		}

		//focus on link in menu after css transition ends
		if(menuLinkFocus){
			pushy.one('transitionend', function() {
				menuLinkFocus.focus();
			});
		}

	}

	function closePushy(){
		if( pushy.hasClass(pushyLeft) ){
			body.removeClass(pushyOpenLeft);
		}else{
			body.removeClass(pushyOpenRight);
		}
	}

	function openPushyFallback(){
		//animate menu position based on CSS class
		if( pushy.hasClass(pushyLeft) ){
			body.addClass(pushyOpenLeft);
			pushy.animate({left: "0px"}, menuSpeed);
			container.animate({left: menuWidth}, menuSpeed);
			//css class to add pushy capability
			push.animate({left: menuWidth}, menuSpeed);
		}else{
			body.addClass(pushyOpenRight);
			pushy.animate({right: '0px'}, menuSpeed);
			container.animate({right: menuWidth}, menuSpeed);
			push.animate({right: menuWidth}, menuSpeed);
		}

		//focus on link in menu
		if(menuLinkFocus){
			menuLinkFocus.focus();
		}
	}

	function closePushyFallback(){
		//animate menu position based on CSS class
		if( pushy.hasClass(pushyLeft) ){
			body.removeClass(pushyOpenLeft);
			pushy.animate({left: "-" + menuWidth}, menuSpeed);
			container.animate({left: "0px"}, menuSpeed);
			//css class to add pushy capability
			push.animate({left: "0px"}, menuSpeed);
		}else{
			body.removeClass(pushyOpenRight);
			pushy.animate({right: "-" + menuWidth}, menuSpeed);
			container.animate({right: "0px"}, menuSpeed);
			push.animate({right: "0px"}, menuSpeed);
		}
	}

	function toggleSubmenu(){
		//hide submenu by default
		$(submenuClass).addClass(submenuClosedClass);

		$(submenuClass).on('click', function(){
	        var selected = $(this);

	        if( selected.hasClass(submenuClosedClass) ) {
	            //hide opened submenus
	            $(submenuClass).addClass(submenuClosedClass).removeClass(submenuOpenClass);
	            //show submenu
	            selected.removeClass(submenuClosedClass).addClass(submenuOpenClass);
	        }else{
	            //hide submenu
	            selected.addClass(submenuClosedClass).removeClass(submenuOpenClass);
	        }
	    });
	}

	//checks if 3d transforms are supported removing the modernizr dependency
	var cssTransforms3d = (function csstransforms3d(){
		var el = document.createElement('p'),
		supported = false,
		transforms = {
		    'webkitTransform':'-webkit-transform',
		    'OTransform':'-o-transform',
		    'msTransform':'-ms-transform',
		    'MozTransform':'-moz-transform',
		    'transform':'transform'
		};

		if(document.body !== null) {
			// Add it to the body to get the computed style
			document.body.insertBefore(el, null);

			for(var t in transforms){
			    if( el.style[t] !== undefined ){
			        el.style[t] = 'translate3d(1px,1px,1px)';
			        supported = window.getComputedStyle(el).getPropertyValue(transforms[t]);
			    }
			}

			document.body.removeChild(el);

			return (supported !== undefined && supported.length > 0 && supported !== "none");
		}else{
			return false;
		}
	})();

	if(cssTransforms3d){
		//toggle submenu
		toggleSubmenu();

		//toggle menu
		menuBtn.on('click', function(){
			togglePushy();
		});
		//close menu when clicking site overlay
		siteOverlay.on('click', function(){
			togglePushy();
		});
	}else{
		//add css class to body
		body.addClass('no-csstransforms3d');

		//hide menu by default
		if( pushy.hasClass(pushyLeft) ){
			pushy.css({left: "-" + menuWidth});
		}else{
			pushy.css({right: "-" + menuWidth});
		}

		//fixes IE scrollbar issue
		container.css({"overflow-x": "hidden"});

		//keep track of menu state (open/close)
		var opened = false;

		//toggle submenu
		toggleSubmenu();

		//toggle menu
		menuBtn.on('click', function(){
			if (opened) {
				closePushyFallback();
				opened = false;
			} else {
				openPushyFallback();
				opened = true;
			}
		});

		//close menu when clicking site overlay
		siteOverlay.on('click', function(){
			if (opened) {
				closePushyFallback();
				opened = false;
			} else {
				openPushyFallback();
				opened = true;
			}
		});
	}
};

},{}],2:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
var initcookies = require('./library/usecookies.js');
var nav = require('./library/nav.js');
var util = require('./library/table-util.js');

$( document ).ready(function() {
  initcookies();

  nav($);

  $("#newdata").click(function() {window.location.replace(window.location.pathname+'newdata')});
  $("#search").click(function() {window.location.replace(window.location.pathname+'search')});


  var today = new Date();

  $("#date").text("EST "+today.toLocaleDateString("en-US",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

  $.post("/db/query",{data: "SELECT Env, COUNT(*) FROM EnrollmentData GROUP BY Env;"}, function (res) {
    console.log(res);
    res = JSON.parse(res);
    if (typeof res == "string") {
      $("#TSTcount").val("Error");
      $("#OATcount").val("Error");
      $("#SIT2count").val("Error");
    } else if (res.length>0) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].Env=="TST") {
          $("#TSTcount").val("TST: "+res[i].Expr1001);
        } else if (res[i].Env=="OAT") {
          $("#OATcount").val("OAT: "+res[i].Expr1001);
        } else if (res[i].Env=="SIT2"){
          $("#SIT2count").val("SIT2: "+res[i].Expr1001);
        }
      }
    }
  });

  $.post("/db/query",{data: "SELECT Env, COUNT(*) FROM EnrollmentData WHERE SubmissionDate='"+util.date()+"'GROUP BY Env;"}, function (res) {
    res = JSON.parse(res);
    if (typeof res == "string") {
      $("#TSTcounttoday").val("Error");
      $("#OATcounttoday").val("Error");
      $("#SIT2counttoday").val("Error");
    } else if (res.length>0){
      for (var i = 0; i < res.length; i++) {
        if (res[i].Env=="TST") {
          $("#TSTcounttoday").val("TST: "+res[i].Expr1001);
        } else if (res[i].Env=="OAT") {
          $("#OATcounttoday").val("OAT: "+res[i].Expr1001);
        } else if (res[i].Env=="SIT2"){
          $("#SIT2counttoday").val("SIT2: "+res[i].Expr1001);
        }
      }
    }
  });

  $.post("/db/query",{data: "SELECT TOP 3 UserID, COUNT(*) FROM EnrollmentData GROUP BY UserID ORDER BY COUNT(*) DESC;"}, function (res) {
    res = JSON.parse(res);
    if (res=="string")
      $("#champ1").val("Data Retrival Error");
    else if (res.length==0) {
      $("#champ1").val("No data");
    } else {
      $("#champ1").val("1. '"+res[0].UserID+"' made "+res[0].Expr1001+" entries");
      $("#champ2").val("2. '"+res[1].UserID+"' made "+res[1].Expr1001+" entries");
      $("#champ3").val("3. '"+res[2].UserID+"' made "+res[2].Expr1001+" entries");
    }
  });

});

},{"./library/nav.js":1,"./library/table-util.js":2,"./library/usecookies.js":3}]},{},[4]);
