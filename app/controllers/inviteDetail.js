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
	postAction("accept");
}

function doReject(e)
{
	postAction("reject");
}

function postAction(actionType)
{
	var acceptRejectPost =  {
				action_type: actionType,
				assignment_id: inviteDetail["assignment_id"]
			  };
			  
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
			json = JSON.parse(this.responseText);
		 	if (json["success"] == 1)
		 	{
		 		Ti.App.fireEvent('refreshAssignments');
		 		$.inviteDetail.close();
		 	}
		 	else
		 	{
		 		alert('An error occured processing your request. Please try again later.');
		 	}
		}
	});

	xhr.open('POST', webserver+'/invites/accept_reject.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send(acceptRejectPost);	
}
