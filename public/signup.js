$(document).ready(function() {
// window.onload = function() {
 
//     alert( "welcome" );
 
// };
	console.log("in sign up");


	
	$('#account-form-btn1').html('Cancel');
	$('#account-form-btn2').html('Submit');
	// $('#account-form-btn2').onclick = function () {
 //        location.href = "http://localhost:8080/game";
 //    };
	

		$('#account-form').submit(function() {
			var user = {
				usrName: document.getElementById("name-tf").value,
				email: document.getElementById("email-tf").value,
	            userId: document.getElementById("user-tf").value,
	            password: document.getElementById("pass-tf").value,
	            score: 0
        	}
	        var req = new XMLHttpRequest();
		    req.open("POST", "//localhost:8080/signup", true);
		    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		    req.send(JSON.stringify(user));





			alert(JSON.stringify(user));
	    

	});	
	});
