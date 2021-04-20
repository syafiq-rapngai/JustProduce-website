var error_message; 

var widgetId1;
	var onloadCallback = function() {
	// Renders the HTML element with id 'example1' as a reCAPTCHA widget.
	// The id of the reCAPTCHA widget is assigned to 'widgetId1'.
	widgetId1 = grecaptcha.render('recaptcha', {
	  'sitekey' : '6LfdVa8ZAAAAAJ4QAez-IZpkIgOZDeSIntPXjze-',
	  'theme' : 'light'
	});
};

function submit_inquiry(recaptcha_reponse){

	var inquiry = document.getElementById("inquiry").value
	var name = document.getElementById("name").value
	var coyname = document.getElementById("coyname").value
	var email = document.getElementById("useremail").value
	var phone = document.getElementById("phone").value
	var message = document.getElementById("message")
	var messageText = document.getElementById("messageText")
	error_message = "Please fill up the following fields correctly: <br>";

	var user_inputs = {
		inquiry,
		name,
		coyname,
		email,
		phone
	}

	if(!validate_form(inquiry, name, email, phone))
	{
		message.style.display = "block";
    	message.style.borderRadius = "5px";
    	message.style.padding = "10px";
    	message.style.backgroundColor = "#B22222";
        messageText.innerHTML = error_message;
        messageText.style.color = "white";
        return;
	}

	if(recaptcha_reponse==""){
		message.style.display = "block";
    	message.style.borderRadius = "5px";
    	message.style.padding = "10px";
    	message.style.backgroundColor = "#B22222";
        messageText.innerHTML = "Please check the reCAPTCHA box!"
        messageText.style.color = "white";
		return;	
	} else{
		$.ajax({
          type: "POST",
          url: "/verify_recaptcha",
          data: JSON.stringify({token: recaptcha_reponse}),
          contentType: "application/json; charset=utf-8",
          success: function(data){
            send_data(data.google_response.success, user_inputs)
          }
        })
	}

}

function send_data(success_status, user_inputs){
	if(success_status){
		grecaptcha.reset(widgetId1)

		$.ajax({
	        url: '/submit-inquiry',
	        type: 'post',
	        data: user_inputs,
	        success: function( data ){
	        	message.style.display = "block";
	        	message.style.borderRadius = "5px";
	        	message.style.padding = "10px";
	        	if(data['code'] == 200){
		            message.style.backgroundColor = "lightgreen";
		            messageText.innerHTML = "Your inquiry has been submitted! Please allow us some time to get back to you!";

		            $("#contact-form-input")[0].reset()

	        	}else{
		            message.style.backgroundColor = "#B22222";
			        messageText.innerHTML = "Server error, please try again!"
			        messageText.style.color = "white";
	        	}
	            
	        }
	    });
	}else{

	}
}

function validate_form(inquiry, name, email, phone){
	let flag = 0;
	if(inquiry === ""){
		console.log("Empty inquiry")
		error_message += "Please insert your inquiry <br>";
		flag = 1;
	}

	if(name === ""){
		console.log("Empty name")
		error_message += "Please insert your name <br>";
		flag = 1;
	}

	if(phone === ""){
		console.log("Empty phone")
		error_message += "Please insert your phone number <br>";
		flag = 1;
	}

	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(String(email).toLowerCase()) ){
    	console.log("Not valid email")
    	error_message += "Please insert a valid email address <br>";
		flag = 1;
    }

	if(flag == 1){
		return false;
	}

	return true;
}

function validate_email(email) {
    
    return true;
}
