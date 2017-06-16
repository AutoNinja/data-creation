$(document).ready(function() {


	if (Cookies.get('env')=="" || Cookies.get('env')==undefined) {
		Cookies.set('env', 'TST', { expires: 15 });
	}

	$("#envDisplay").text("Environment: "+Cookies.get('env'));

	$(".env").click(function () {
		Cookies.set('env', $(this).text(), { expires: 15 });
		location.reload();
	});
});
