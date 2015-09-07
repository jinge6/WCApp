var args = arguments[0] || {};

var inviteJSON = args[0];

$.invitesTable.addEventListener('click', function(e){
	Ti.App.fireEvent('goInviteDetail',e);

});

loadInvites();

function loadInvites()
{
	var tableData = [];
	
	for (var i=0; i<inviteJSON.length; i++)
	{
		var row = Ti.UI.createTableViewRow({className: 'row', height: 80, inviteDetail: inviteJSON[i], hasChild: true});
		var orgName = Ti.UI.createLabel({color: "#000", text: inviteJSON[i]["org_name"], top: 20, left: 80, font: { fontSize:12, fontWeight: 'bold' }});
		row.add(orgName);
		var roleName = Ti.UI.createLabel({color: "#000", text: inviteJSON[i]["role"] + " invite", top: 40, left: 80, font: { fontSize:10}});
		row.add(roleName);
		var assignmentName = Ti.UI.createLabel({color: "#000", text: inviteJSON[i]["assignment_name"], top: 60, left: 80, font: { fontSize:10 }});
		row.add(assignmentName);
		var logo = image({image: inviteJSON[i]["logo_url"], left: 15, width: 55, touchEnabled: false});
		row.add(logo);
	  	tableData.push(row);
		
		$.invitesTable.setData(tableData);
		$.invitesTable.show();
	}
}
