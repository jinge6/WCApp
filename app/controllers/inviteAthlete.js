var args = arguments[0] || {};

var assignment_id = args[0];

var emailSentDialog = Ti.UI.createAlertDialog({
    message: 'Invite has been sent',
    ok: 'OK',
    title: 'Invite Sent'
  });
  
  emailSentDialog.addEventListener('click', function(e){
    $.inviteAthleteWindow.close();
  });

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
		 		$.inviteBtn.visible = false;
		 		emailSentDialog.show();
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
