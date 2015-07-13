var args = arguments[0] || {};

$.activitiesTable.addEventListener('click', function(e){
	Ti.App.fireEvent('goActivityDetail',{activity_id: e.row.activity_id});

});

getActivities();

function getActivities()
{
	
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
					var row = Ti.UI.createTableViewRow({className: 'row', height: 80, activity_id: json[i]["id"], hasChild: true});
					var activityName = Ti.UI.createLabel({text: json[i]["name"], top: 30, left: 80, font: { fontSize:12, fontWeight: 'bold' }});
					row.add(activityName);
					var logo = image({image: json[i]["promo_image"], left: 15, width: 55, touchEnabled: false});
					row.add(logo);
				  	tableData.push(row);
					
					$.activitiesTable.setData(tableData);
					$.activitiesTable.show();
				}
			}	
		}
	});

	xhr.open('GET', webserver+'/activities.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}