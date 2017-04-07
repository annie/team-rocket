$(document).ready(function() {
// window.onload = function() {
 
//     alert( "welcome" );
 
// };
	console.log("in sign up");


	
	$('#account-form-btn1').html('Cancel');
	$('#account-form-btn2').html('Submit');
	

		$('#account-form').submit(function() {
			var user = {
	            userId: document.getElementById("user-tf").value,
	            score: 0
        	}
	        var req = new XMLHttpRequest();
		    req.open("POST", "http://localhost:8080/", true);
		    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		    req.send(JSON.stringify(user));



			alert(JSON.stringify(user));
	    

	});	
	});
