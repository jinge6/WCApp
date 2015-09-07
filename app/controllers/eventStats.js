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
			
				for (var i=0; i<json.length; i++)
				{
					var row = Ti.UI.createTableViewRow({height: 40, touchEnabled: false});
					var name = Ti.UI.createLabel({color: "#000", text: json[i]["athlete"], touchEnabled: false, top: 15, left: 20, font: { fontSize:10, fontWeight: 'bold' }});
					row.add(name);
					var kpi = Ti.UI.createLabel({color: "#000", text: json[i]["kpi"], touchEnabled: false, top: 15, left: 150, font: { fontSize:10, fontWeight: 'bold' }});
					row.add(kpi);
					tableData.push(row);
				}
				$.statsTable.setData(tableData);
				$.statsTable.visible = true;
			}
			else
			{	
				var no_stats = Ti.UI.createLabel({color: "#000", text: "No stats available yet", touchEnabled: false, font: { fontSize:12, fontWeight: 'bold' }});
				$.eventStats.add(no_stats);
			}
			$.activityIndicator.hide();
		}
	});
		
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignment_event_statistics/' + event_id + '.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}