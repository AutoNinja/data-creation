(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var initcookies = require('./library/usecookies.js');

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
  initcookies();

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
      return $.post("/db/query",{data: cmd}, function (res) {
        term.echo(res);
      });
    } else if (token === "DELETE") {
      term.echo("Confirm Execute Delete? (Y/n):");
      term.push(function(cmd2, term) {
        if (cmd2.toUpperCase() === 'N') {
          term.echo('Execution Aborted');
          term.pop();
        } else {
          console.log(cmd);
          //query without return value
          return $.post("/db/execute",{data: cmd}, function (res) {
            term.echo(res);
            term.pop();
          });
        }
      }, {
        prompt: '> '
      });
    } else {
      //query without return value
      return $.post("/db/execute",{data: cmd}, function (res) {
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

},{"./library/usecookies.js":2}],2:[function(require,module,exports){
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
