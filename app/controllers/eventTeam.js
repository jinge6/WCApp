var args = arguments[0] || {};

var event_id = args[0];
var opponent = args[1];
var assignment_id = args[2];

getEventTeam();

function getEventTeam()
{
	var tableData = [];
	
	$.activityIndicator.show();

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			json = JSON.parse(this.responseText);
			
			if (json.length != 0)
			{					
				var sectionName;
				var sectionHeader;
			
				for (var i=0; i<json.length; i++)
				{
					if (sectionName != json[i]["role"])
					{
						if (i != 0)
						{
							tableData.push(sectionHeader);
						}
						sectionHeader = Ti.UI.createTableViewSection({headerTitle: json[i]["role"], height: 30, touchEnabled: false});
						sectionName = json[i]["role"];
					}
					
					var row = Ti.UI.createTableViewRow({height: 60, touchEnabled: false});
					var avatarPath = "missing_avatar.png";
					if (json[i]["avatar"] != "missing_avatar.png")
					{
						avatarPath = json[i]["avatar"];
					}
					var avatar = image({image: avatarPath, width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0});
					row.add(avatar);
					var name = Ti.UI.createLabel({color: "#000", text: json[i]["name"], touchEnabled: false, top: 15, left: 100, font: { fontSize:14, fontWeight: 'bold' }});
					row.add(name);
					sectionHeader.add(row);
				}
				tableData.push(sectionHeader);
			}	
			$.eventTeamTable.setData(tableData);
			$.activityIndicator.hide();
			$.eventTeamTable.visible = true;
		}
	});
		
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignment_event_teams/' + event_id + '.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}
