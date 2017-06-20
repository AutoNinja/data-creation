$( document ).ready(function() {

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

  $('body').on('click', '#newdata', handleClickNewData);
  $('body').on('click', '#search', handleClickSearch);
});

function handleClickSearch() {
  window.location.replace("/search");
}


function handleClickNewData() {
  window.location.replace("/newdata");
}
