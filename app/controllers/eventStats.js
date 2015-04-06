var args = arguments[0] || {};

var event_id = args[0];
var assignment_id = args[1];

getEventStats();

function getEventStats()
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
					if (sectionName != json[i]["kpi"])
					{
						if (i != 0)
						{
							tableData.push(sectionHeader);
						}
						sectionHeader = Ti.UI.createTableViewSection({headerTitle: json[i]["kpi"], height: 30, touchEnabled: false});
						sectionName = json[i]["kpi"];
					}
					var row = Ti.UI.createTableViewRow({height: 40, touchEnabled: false});
					var name = Ti.UI.createLabel({text: json[i]["athlete"], touchEnabled: false, top: 20, left: 20, font: { fontSize:10, fontWeight: 'bold' }});
					row.add(name);
					var kpi_value = Ti.UI.createLabel({text: json[i]["kpi_value"], touchEnabled: false, top: 20, left: 150, font: { fontSize:10, fontWeight: 'bold' }});
					row.add(kpi_value);
					sectionHeader.add(row);
				}
				tableData.push(sectionHeader);
			}	
			$.statsTable.setData(tableData);
			$.activityIndicator.hide();
			$.statsTable.visible = true;
		}
	});
		
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignment_event_statistics/' + event_id + '.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}