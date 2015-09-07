var args = arguments[0] || {};

var logo = image({image: "winnerscircle2.png", top: 10, touchEnabled: false});
$.signUpWindow.add(logo);

if (Ti.Platform.osname == 'iphone')
{
	$.joinBtn.top = 350;
	$.cancelBtn.top = 400;
}

function doJoinNow(e)
{
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	
	if ($.firstName.value == '')
	{
		alert('Please enter your First Name');
	}
	else if ($.lastName.value == '')
	{
		alert('Please enter your Last Name');
	}
	else if ($.email.value == '')
	{
		alert('Please enter your Email');
	}
	else if (!re.test($.email.value))
	{
		alert('Please enter valid Email');
	}
	else if ($.password.value == '')
	{
		alert('Please enter a password');
	}
	else if ($.password.value.length < 8)
	{
		alert('Password needs atleast 8 characters');
	}
	else if ($.confirmPassword.value == '')
	{
		alert('Please confirm password');
	}
	else if (new String($.password.value).valueOf() != new String($.confirmPassword.value).valueOf())
	{
		alert('Passwords do not match');
	}
	else
	{
		var signUpPost = {};
		
		signUpPost = {
				firstname: $.firstName.value,
				surname: $.lastName.value,
				time_zone: 'Adelaide',
				email: $.email.value,
			    password: $.password.value,
			    password_confirmation: $.confirmPassword.value,
			    remember_me: '1'
			  };
	
	var xhr = Ti.Network.createHTTPClient({
		onload: function() 
		{
		 	// handle the response
		 	json = JSON.parse(this.responseText);
		 	if (json["success"] == 1)
		 	{
		 		// if these don't exist then set them
				Ti.App.Properties.setString('email', $.email.value);
				Ti.App.Properties.setString('auth_token', json["auth_token"]);
				Ti.App.Properties.setString('version', json["version"]);
				Ti.App.Properties.setString('builder_expiry', json["builder_expiry"]);

				var assignmentsWindow = Alloy.createController('assignments').getView();
	    		assignmentsWindow.open();

				$.signUpWindow.close();
		 	}
		 	else
		 	{
		 		alert(json["message"]);
		 	}
		},
		onerror : function()
		{
			alert('WinnersCircle has experienced an error. We have contacted Jim - he fixes this stuff');
		}
	});
	
	xhr.open('POST',webserver+'/users.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	var params = signUpPost;
	xhr.send(params);
	}
	
}

function doCancel(e)
{
	$.indexWin = Alloy.createController('index').getView();
	$.indexWin.open();
	$.signUpWindow.close();
}
