var initcookies = require('./library/usecookies.js');
var nav = require('./library/nav.js');
var util = require('./library/table-util.js');

$( document ).ready(function() {
  initcookies();

  nav($);
  var today = new Date();

  $("#date").text(today.toLocaleDateString("en-US",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

  $.post("db/query",{data: "SELECT Env, COUNT(*) FROM EnrollmentData GROUP BY Env;"}, function (res) {
    res = JSON.parse(res);
    for (var i = 0; i < res.length; i++) {
      if (res[i].Env=="TST") {
        $("#TSTcount").val(res[i].Expr1001);
      } else if (res[i].Env=="OAT") {
        $("#OATcount").val(res[i].Expr1001);
      } else if (res[i].Env=="SIT2"){
        $("#SIT2count").val(res[i].Expr1001);
      }
    }
  });

  $.post("db/query",{data: "SELECT Env, COUNT(*) FROM EnrollmentData WHERE SubmissionDate='"+util.date()+"'GROUP BY Env;"}, function (res) {
    res = JSON.parse(res);
    for (var i = 0; i < res.length; i++) {
      if (res[i].Env=="TST") {
        $("#TSTcounttoday").val(res[i].Expr1001);
      } else if (res[i].Env=="OAT") {
        $("#OATcounttoday").val(res[i].Expr1001);
      } else if (res[i].Env=="SIT2"){
        $("#SIT2counttoday").val(res[i].Expr1001);
      }
    }
  });

  $.post("db/query",{data: "SELECT TOP 3 UserID, COUNT(*) FROM EnrollmentData GROUP BY UserID ORDER BY COUNT(*) DESC;"}, function (res) {
    if (res=="undefined")
      $("#champ1").val("Data Retrival Error");
    else {
      res = JSON.parse(res);
      $("#champ1").val("1. '"+res[0].UserID+"' made "+res[0].Expr1001+" entries");
      $("#champ2").val("2. '"+res[1].UserID+"' made "+res[1].Expr1001+" entries");
      $("#champ3").val("3. '"+res[2].UserID+"' made "+res[2].Expr1001+" entries");
    }
  });
});
