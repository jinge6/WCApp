var args = arguments[0] || {};

var assignment_id = args[0];

function doInvite()
{
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	
	if ($.email.value == '')
	{
		alert('Please enter athlete Email');
	}
	else if (!re.test($.email.value))
	{
		alert('Please enter valid Email');
	}
	else
	{
		var invitePost = {
				assignment_id: assignment_id,
				email_invite: $.email.value,
		};
	
	var xhr = Ti.Network.createHTTPClient({
		onload: function() 
		{
		 	// handle the response
		 	json = JSON.parse(this.responseText);
		 	if (json["success"] == 1)
		 	{
		 		alert('Invite has been sent');
		 		$.inviteBtn.visible = false;
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
	
	xhr.open('POST',webserver+'/assignments/' + assignment_id + '/assignments/invite.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	var params = invitePost;
	xhr.send(params);
	}
	
}
