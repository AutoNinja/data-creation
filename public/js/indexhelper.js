$( document ).ready(function() {
  console.log(Cookies.get('env'));
  if (Cookies.get('env')=="" || Cookies.get('env')==undefined) {
    Cookies.set('env', 'TST', { expires: 15 });
  }
  $("#envDisplay").text("Environment: "+Cookies.get('env'));
  $(".env").click(function () {
    Cookies.set('env', $(this).text(), { expires: 15 });
    $("#envValue").prop("value", Cookies.get('env') );
    $("#envDisplay").text("Environment: "+Cookies.get('env'));

  });
  $("#console").click(function () {
      $('#term').show();
      $(".main-content-container").hide();
      $('.table-btn').hide();
  });
});
