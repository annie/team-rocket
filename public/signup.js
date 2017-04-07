$(document).ready(function() {
// window.onload = function() {
 
//     alert( "welcome" );
 
// };
	console.log("in sign up");


	
	$('#account-form-btn1').html('Cancel');
	$('#account-form-btn2').html('Submit');
	$('#account-form-btn2').onclick = function () {
        location.href = "http://localhost:8080/game";
    };
	

		$('#account-form').submit(function() {
			var user = {
	            userId: document.getElementById("user-tf").value,
	            score: 0
        	}
	        var req = new XMLHttpRequest();
		    req.open("POST", "//localhost:8080/signup", true);
		    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		    // alert(JSON.stringify(user));
		    req.send(JSON.stringify(user));





			// alert(JSON.stringify(user));
	    

	});	
	});
