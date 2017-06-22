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
var nav = require('./library/nav.js');

//SQL Syntax Highlight Settings
var uppercase = [
  'ACCESSIBLE', 'ADD', 'ALL', 'ALTER', 'ANALYZE', 'AND', 'AS', 'ASC',
  'ASENSITIVE', 'BEFORE', 'BETWEEN', 'BIGINT', 'BINARY', 'BLOB',
  'BOTH', 'BY', 'CALL', 'CASCADE', 'CASE', 'CHANGE', 'CHAR',
  'CHARACTER', 'CHECK', 'COLLATE', 'COLUMN', 'CONDITION',
  'CONSTRAINT', 'CONTINUE', 'CONVERT', 'CREATE', 'CROSS',
  'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_USER',
  'CURSOR', 'DATABASE', 'DATABASES', 'DAY_HOUR', 'DAY_MICROSECOND',
  'DAY_MINUTE', 'DAY_SECOND', 'DEC', 'DECIMAL', 'DECLARE', 'DEFAULT',
  'DELAYED', 'DELETE', 'DESC', 'DESCRIBE', 'DETERMINISTIC',
  'DISTINCT', 'DISTINCTROW', 'DIV', 'DOUBLE', 'DROP', 'DUAL', 'EACH',
  'ELSE', 'ELSEIF', 'ENCLOSED', 'ESCAPED', 'EXISTS', 'EXIT',
  'EXPLAIN', 'FALSE', 'FETCH', 'FLOAT', 'FLOAT4', 'FLOAT8', 'FOR',
  'FORCE', 'FOREIGN', 'FROM', 'FULLTEXT', 'GRANT', 'GROUP', 'HAVING',
  'HIGH_PRIORITY', 'HOUR_MICROSECOND', 'HOUR_MINUTE', 'HOUR_SECOND',
  'IF', 'IGNORE', 'IN', 'INDEX', 'INFILE', 'INNER', 'INOUT',
  'INSENSITIVE', 'INSERT', 'INT', 'INT1', 'INT2', 'INT3', 'INT4',
  'INT8', 'INTEGER', 'INTERVAL', 'INTO', 'IS', 'ITERATE', 'JOIN',
  'KEY', 'KEYS', 'KILL', 'LEADING', 'LEAVE', 'LEFT', 'LIKE', 'LIMIT',
  'LINEAR', 'LINES', 'LOAD', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOCK',
  'LONG', 'LONGBLOB', 'LONGTEXT', 'LOOP', 'LOW_PRIORITY',
  'MASTER_SSL_VERIFY_SERVER_CERT', 'MATCH', 'MEDIUMBLOB', 'MEDIUMINT',
  'MEDIUMTEXT', 'MIDDLEINT', 'MINUTE_MICROSECOND', 'MINUTE_SECOND',
  'MOD', 'MODIFIES', 'NATURAL', 'NOT', 'NO_WRITE_TO_BINLOG', 'NULL',
  'NUMERIC', 'ON', 'OPTIMIZE', 'OPTION', 'OPTIONALLY', 'OR', 'ORDER',
  'OUT', 'OUTER', 'OUTFILE', 'PRECISION', 'PRIMARY', 'PROCEDURE',
  'PURGE', 'RANGE', 'READ', 'READS', 'READ_WRITE', 'REAL',
  'REFERENCES', 'REGEXP', 'RELEASE', 'RENAME', 'REPEAT', 'REPLACE',
  'REQUIRE', 'RESTRICT', 'RETURN', 'REVOKE', 'RIGHT', 'RLIKE',
  'SCHEMA', 'SCHEMAS', 'SECOND_MICROSECOND', 'SELECT', 'SENSITIVE',
  'SEPARATOR', 'SET', 'SHOW', 'SMALLINT', 'SPATIAL', 'SPECIFIC',
  'SQLEXCEPTION', 'SQLSTATE', 'SQLWARNING', 'SQL_BIG_RESULT',
  'SQL_CALC_FOUND_ROWS', 'SQL_SMALL_RESULT', 'SSL', 'STARTING',
  'STRAIGHT_JOIN', 'TABLE', 'TERMINATED', 'THEN', 'TINYBLOB',
  'TINYINT', 'TINYTEXT', 'TO', 'TRAILING', 'TRIGGER', 'TRUE', 'UNDO',
  'UNION', 'UNIQUE', 'UNLOCK', 'UNSIGNED', 'UPDATE', 'USAGE',
  'USING', 'UTC_DATE', 'UTC_TIME', 'UTC_TIMESTAMP', 'VALUES',
  'VARBINARY', 'VARCHAR', 'VARCHARACTER', 'VARYING', 'WHEN', 'WHERE',
  'WHILE', 'WITH', 'WRITE', 'XOR', 'YEAR_MONTH', 'ZEROFILL'];
var keywords = uppercase.concat(uppercase.map(function(keyword) {
    return keyword.toLowerCase();
}));
$.terminal.defaults.formatters.push(function(string) {
    return string.split(/((?:\s|&nbsp;)+)/).map(function(string) {
        if (keywords.indexOf(string) != -1) {
            return '[[b;red;]' + string + ']';
        } else {
            return string;
        }
    }).join('');
});

$(document).ready(function() {

  nav($);

  //terminal input validation and submission
  $('#term').terminal(function(cmd, term) {
    var token = getFirstToken(cmd);
    if (!cmd || cmd.length===0) {
      term.echo("Error: Empty Command!");
      return;
    } else if (token !== "INSERT" &&
               token !== "UPDATE" &&
               token !== "DELETE" &&
               token !== "SELECT" &&
               token !== "PROCEDURE")
    {
      term.echo("Error: Invalid SQL statement; expected 'DELETE', 'INSERT', 'PROCEDURE', 'SELECT', or 'UPDATE'.");
      return;
    } else if (token === "SELECT") {
      //query with return value
      return $.post("db/query",{data: cmd}, function (res) {
        term.echo(res);
      });
    } else if (token === "DELETE") {
      term.echo("Confirm Execute Delete? (Y/n):");
      term.push(function(cmd, term) {
        if (cmd.toUpperCase() === 'N') {
          term.echo('Execution Aborted');
          term.pop();
        } else {
          //query without return value
          return $.post("db/execute",{data: cmd}, function (res) {
            term.echo(res);
            term.pop();
          });
        }
      }, {
        prompt: '> '
      });
    } else {
      //query without return value
      return $.post("db/execute",{data: cmd}, function (res) {
        term.echo(res);
      });
    }
  },{
    prompt: '> ',
    greetings: "**NOTE: use Ctrl+shift+v to Paste!**\nType your SQL Command Below: ",
    onBlur: function() {
        return false;
    }
  });
});

//terminal helper functions
function getFirstToken(line) {
  return line.split(' ')[0].toUpperCase();
}

},{"./library/nav.js":1}]},{},[2]);
