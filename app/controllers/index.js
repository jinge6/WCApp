var email_property = Ti.App.Properties.getString('email');
var auth_token_property = Ti.App.Properties.getString('auth_token');

var logo = image({image: "winnerscircle2.png", top: 90, touchEnabled: false});
$.index.add(logo);

if (email_property != null && auth_token_property != null)
{
	
	doSignIn();
}
else
{
	$.index.open();
}

function doSignIn(e){
	
	var signInPost = {
				email: (email_property != null && email_property.length>0)?email_property:$.email.value,
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
		 	if (json["success"] == 1)
		 	{
		 		// if these don't exist then set them
				Ti.App.Properties.setString('email', (email_property != null && email_property.length>0)?email_property:$.email.value);
				Ti.App.Properties.setString('auth_token', json["auth_token"]);
				Ti.App.Properties.setString('version', json["version"]);
				Ti.App.Properties.setString('builder_expiry', json["builder_expiry"]);

				var assignmentsWindow = Alloy.createController('assignments').getView();
	    		assignmentsWindow.open();
	    		
	    		if ($.index.visible)
	    		{
	    			$.index.close();
	    		}
		 	}
		 	else
		 	{
		 		$.index.open();
		 		alert(json["message"]);
		 	}
		}
	});
	
	xhr.open('POST',webserver+'/users/sign_in.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send(signInPost);
};

function doSignUp(e)
{
	$.signUpWin = Alloy.createController('signUp').getView();
	$.signUpWin.open();
	$.index.close();
}
