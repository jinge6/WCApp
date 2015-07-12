var args = arguments[0] || {};

var inviteDetail = args[0];

if (inviteDetail["role"] == "Coach")
{
	$.inviteText.text = inviteDetail["org_name"] + " have invited you to coach " + inviteDetail["assignment_name"];
}
else
{
	$.inviteText.text = inviteDetail["org_name"] + " have invited you to join " + inviteDetail["assignment_name"];
}
var logo = image({image: inviteDetail["logo_url"], top: 15, width: 55, touchEnabled: false});
$.inviteDetail.add(logo);

function doAccept(e)
{
	///homes/accept?assignment_id=inviteDetail["assignment_id"]
	postAction("accept");
}

function doReject(e)
{
	///homes/reject?assignment_id=inviteDetail["assignment_id"]
	postAction("reject");
}

function postAction(actionType)
{
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	Ti.App.fireEvent('refreshAssignments',{actionType: "inviteProcessed"});
		}
	});

	xhr.open('GET', webserver+'/homes/' + actionType + '?assignment_id=' + inviteDetail["assignment_id"]);
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}
