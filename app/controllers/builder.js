var args = arguments[0] || {};

var expiryLabel = Ti.UI.createLabel({color: "#000", text: "The created Training Session Builder will expire after " + Ti.App.Properties.getString('builder_expiry') + " minutes. To extend visit https://www.winnerscircle.world", left:15, top: 380, font: { fontSize:8}});
$.builder.add(expiryLabel);

var logo = image({image: "winnerscircle2.png", top: 70, touchEnabled: false});
$.builder.add(logo);

function mensChange(e)
{
	e.cancelBubble = true;
	if ($.mensSwitch.value)
	{
		$.womensSwitch.value = false;
	}
	else
	{
		$.womensSwitch.value = true;
	}
}

function womensChange(e)
{
	e.cancelBubble = true;
	if ($.womensSwitch.value)
	{
		$.mensSwitch.value = false;
	}
	else
	{
		$.mensSwitch.value = true;
	}
}

function adultChange(e)
{
	e.cancelBubble = true;
	if ($.adultSwitch.value)
	{
		$.youthSwitch.value = false;
	}
	else
	{
		$.youthSwitch.value = true;
	}
}

function youthChange(e)
{
	e.cancelBubble = true;
	if ($.youthSwitch.value)
	{
		$.adultSwitch.value = false;
	}
	else
	{
		$.adultSwitch.value = true;
	}
}

function doCreate(e)
{
	var activity = "Mens";
	if ($.womensSwitch.value)
	{
		activity = "Womens";
	}
	var grade = "Adult";
	if ($.youthSwitch.value)
	{
		grade = "Youth";
	}
	
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
			json = JSON.parse(this.responseText);
			if (json["success"] == 1)
		 	{
		 		Ti.App.fireEvent('refreshAssignments');
		 		$.builder.close();
		 	}
		 	else
		 	{
		 		alert("Sorry. There was an error creating your Training Session.");
		 	}
		}
	});
	
	xhr.open('POST', webserver+'/assignments/builder.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	
	var builderPost = {'activity': activity, 
		'grade': grade};
	xhr.send(builderPost);
}
