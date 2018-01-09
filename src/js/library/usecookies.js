module.exports = function() {

	if (Cookies.get('env_enroll')==undefined || Cookies.get('env_enroll')==""  || !isValidEnv())
		Cookies.set('env_enroll', 'TST', { expires: 15 });
	};

function isValidEnv() {
	var validEnv = ["TST","OAT","SIT2"];
	var valid = false;
	for (var i = 0; i < validEnv.length; i++) {
		if (Cookies.get('env_enroll') === validEnv[i]) {
			valid = true;
			break;
		}
	}
	return valid;
}
