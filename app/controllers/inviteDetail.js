var args = arguments[0] || {};

var inviteDetail = args[0];

if (inviteDetail["role"] == "Coach")
{
	$.inviteText.text = "You have been invited to coach " + inviteDetail["assignment_name"] + " for the " + inviteDetail["org_name"];
}
else
{
	$.inviteText.text = "You have been invited to join " + inviteDetail["assignment_name"]  + " for the " + inviteDetail["org_name"];;
}
var logo = image({image: inviteDetail["logo_url"], top: 15, width: 55, touchEnabled: false});
$.inviteDetail.add(logo);

function doAccept(e)
{
	
}

function doReject(e)
{
	
}
