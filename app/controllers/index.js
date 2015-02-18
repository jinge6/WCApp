$.index.open();

var email_property = Ti.App.Properties.getString('email');
var auth_token_property = Ti.App.Properties.getString('auth_token');

console.log(auth_token_property);
console.log(email_property);

if (email_property != null && auth_token_property != null)
{
	doSignIn();
}

function doSignIn(e){
	var assignmentsWindow = Alloy.createController('assignments').getView();
	
	var signInPost = signInPost = {
				email: $.email.value,
			    password: $.password.value,
			    auth_token: auth_token_property,
			    remember_me: '1',
			    commit : 'Sign In'
		};
	
	
		
	var xhr = Ti.Network.createHTTPClient({
		onload: function() 
		{
		 	// handle the response
		 	json = JSON.parse(this.responseText);
		 	console.log(this.responseText);
		 	if (json["success"] == 1)
		 	{
		 		// if these don't exist then set them
				Ti.App.Properties.setString('email', $.email.value);
				Ti.App.Properties.setString('auth_token', json["auth_token"]);
				$.index.close();
	    		assignmentsWindow.open();
		 	}
		 	else
		 	{
		 		if (auth_token_property != null)
		 		{
		 			alert('Email or password was incorrect');
		 		}
		 	}
		}
	});
	
	xhr.open('POST','http://localhost:3000/users/sign_in');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send(signInPost);
};