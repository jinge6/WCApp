var args = arguments[0] || {};

getActivities();
$.activityPicker.visible = false;
$.gradesPicker.visible = false;

function doCoachCheck()
{
	if ($.coachSwitch.value)
	{
		$.activityPicker.visible = true;
		$.gradesPicker.visible = true;
		if ($.activityPicker.children.length == 0)
		{
			getActivities();
		}
		getGrades();
	}
	else
	{
		$.activityPicker.visible = false;
		$.gradesPicker.visible = false;
	}
}

function getActivities()
{
	
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			json = JSON.parse(this.responseText);
			
			if (json.length != 0)
			{
				var data = [];
				for (var i=0; i<json.length; i++)
				{
					data[i]=Ti.UI.createPickerRow({title:json[i]["name"], id: json[i]["id"]});
				}
				$.activityPicker.add(data);
			}	
		}
	});

	xhr.open('GET', webserver+'/activities.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getGrades()
{
	if($.gradesPicker.columns[0]) 
	{
    	var _col = $.gradesPicker.columns[0];
        var len = _col.rowCount;
        for(var x = len-1; x >= 0; x-- )
        {
            var _row = _col.rows[x];
            _col.removeRow(_row);
        }
	}
	
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	json = JSON.parse(this.responseText);
			
			if (json.length != 0)
			{
				var data = [];
				for (var i=0; i<json.length; i++)
				{
					data[i]=Ti.UI.createPickerRow({title:json[i]["name"], id: json[i]["id"]});
				}
				$.gradesPicker.add(data);
			}	
		}
	});

	var activity_id = $.activityPicker.getSelectedRow(0).id;
	xhr.open('GET', webserver+'/grades/gradesforactivity.json?activity_id='+ activity_id);
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
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
		
		if ($.coachSwitch.value)
		{
			signUpPost = {
				firstname: $.firstName.value,
				surname: $.lastName.value,
				time_zone: 'Adelaide',
				email: $.email.value,
			    password: $.password.value,
			    password_confirmation: $.confirmPassword.value,
			    activity_id: $.activityPicker.getSelectedRow(0).id,
			    grade_id: $.gradesPicker.getSelectedRow(0).id,
			    remember_me: '1'
			  };
		}
		else
		{
			signUpPost = {
				firstname: $.firstName.value,
				surname: $.lastName.value,
				time_zone: 'Adelaide',
				email: $.email.value,
			    password: $.password.value,
			    password_confirmation: $.confirmPassword.value,
			    remember_me: '1'
			  };
		};
	
	var xhr = Ti.Network.createHTTPClient({
		onload: function() 
		{
		 	// handle the response
		 	console.log(this.responseText);
		 	json = JSON.parse(this.responseText);
		 	if (json["success"] == 1)
		 	{
		 		// if these don't exist then set them
				Ti.App.Properties.setString('email', $.email.value);
				Ti.App.Properties.setString('auth_token', json["auth_token"]);
				
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
