var args = arguments[0] || {};

var assignment_id = args[0];
var opponent_id = args[1];

getOppositionDetails();

function getOppositionDetails()
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
				var strengthsHeader = Ti.UI.createTableViewSection({headerTitle: "Strengths", height: 30, touchEnabled: false});		
				var row = Ti.UI.createTableViewRow({height: 60, touchEnabled: false});
				var strengths = json["strengths"] == null?"No strengths added yet":json["strengths"];
				var strengthDescription = Ti.UI.createTextArea({value: strengths, touchEnabled: false, enabled: false, left: 5, font: { fontSize:10}});
				row.add(strengthDescription);
				strengthsHeader.add(row);
				tableData.push(strengthsHeader);
				/*	
				for (var i=0; i<json.length; i++)
				{
					if (sectionName != json[i]["role"])
					{
						sectionHeader = Ti.UI.createTableViewSection({headerTitle: json[i]["role"], height: 30, touchEnabled: false});
						sectionName = json[i]["role"];
					}
					
					var row = Ti.UI.createTableViewRow({height: 60, touchEnabled: false});
					var name = Ti.UI.createLabel({text: json[i]["name"], touchEnabled: false, top: 15, left: 10, font: { fontSize:14, fontWeight: 'bold' }});
					row.add(name);
					sectionHeader.add(row);
			  		tableData.push(sectionHeader);
				}
				*/
			}	
			$.opponentTable.setData(tableData);
			$.activityIndicator.hide();
			$.opponentTable.visible = true;
		}
	});
		
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignment_oppositions/' + opponent_id + '.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}
