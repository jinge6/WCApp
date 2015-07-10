var args = arguments[0] || {};
var mode = args;

function doCoachCheck()
{
	if ($.coachSwitch.value)
	{
		$.activityPicker.visible = true;
		$.gradesPicker.visible = true;
		getActivities();
	}
	else
	{
		$.activityPicker.visible = false;
		$.gradesPicker.visible = true;
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
				$.activityPicker.selectionIndicator = true;
			}	
		}
	});

	xhr.open('GET', webserver+'/activities.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getGrades()
{
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	json = JSON.parse(this.responseText);
			
			if (json.length != 0)
			{
				$.gradesPicker.setTouchEnabled(true);
				var data = [];
				for (var i=0; i<json.length; i++)
				{
					data[i]=Ti.UI.createPickerRow({title:json[i]["name"], id: json[i]["id"]});
				}
				$.gradesPicker.add(data);
				$.gradesPicker.selectionIndicator = true;
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
	
}
