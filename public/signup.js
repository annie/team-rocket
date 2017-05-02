function backToLogin () {
 		console.log("in the login function");
 		location = 'login.html';
 		return false;
 	}



 // $('.message a').click(function(){
	// 	   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
	// 	});
 	
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

		

		$('#acount-form').submit(function() {
			console.log("hit the submit form and function");
			var user = {
				
	            username: document.getElementById("user-tf").value,
	            password: document.getElementById("pass-tf").value,
        	}
	        var req = new XMLHttpRequest();
		    req.open("POST", "//localhost:8080/signup", true);
		    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		    req.send(JSON.stringify(user));


		    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
			alert(JSON.stringify(user));

	    

	});	
	});
