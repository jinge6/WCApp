var args = arguments[0] || {};

var drill_id = args;

getDrill(drill_id);

function getDrill(drill_id)
{
	var tableData = [];

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			json = JSON.parse(this.responseText);
			console.log(this.responseText);
			
			if (json.length != 0)
			{
				var row = Ti.UI.createTableViewRow({height: 60});
					
				var name = Ti.UI.createLabel({text: json["name"], left: 10});
				row.add(name);
				tableData.push(row);
			}	
			$.drillTable.setData(tableData);
		}
	});
		
	xhr.open('GET','http://localhost:3000/drills/' + drill_id + '.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}