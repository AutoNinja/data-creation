$( document ).ready(function() {
  $("#envDisplay").text("Environment: "+$("#envValue").val());
  $(".env").click(function () {
    $("#envValue").prop("value",$(this).text());
    $("#envDisplay").text("Environment: "+$("#envValue").val());
  });
});
