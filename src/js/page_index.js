var initcookies = require('./library/usecookies.js');
var nav = require('./library/nav.js');
var util = require('./library/table-util.js');

$( document ).ready(function() {
  initcookies();

  nav($);
  var today = new Date();

  $("#date").text("EST "+today.toLocaleDateString("en-US",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

  $.post("db/query",{data: "SELECT Env, COUNT(*) FROM EnrollmentData GROUP BY Env;"}, function (res) {
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

  $.post("db/query",{data: "SELECT Env, COUNT(*) FROM EnrollmentData WHERE SubmissionDate='"+util.date()+"'GROUP BY Env;"}, function (res) {
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

  $.post("db/query",{data: "SELECT TOP 3 UserID, COUNT(*) FROM EnrollmentData GROUP BY UserID ORDER BY COUNT(*) DESC;"}, function (res) {
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
