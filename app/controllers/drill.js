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
			
			$.drillTable.separatorColor = 'transparent';
			
			if (json.length != 0)
			{
				var row = Ti.UI.createTableViewRow({height: 20});
					
				var drillName = Ti.UI.createLabel({text: json["name"], left: 10, font: { fontSize:12, fontWeight: 'bold'}});
				row.add(drillName);
				tableData.push(row);
				
				var row2 = Ti.UI.createTableViewRow({height: 40});
				
				var drillDescription = Ti.UI.createLabel({text: json["description"], left: 10, font: { fontSize:10}});
				row2.add(drillDescription);
				tableData.push(row2);
				
				var row3 = Ti.UI.createTableViewRow({height: 25, left: 10});
				
				var drillRating = new RatingView(json["rating"], 5, json["total_ratings"]);
				drillRating.touchEnabled = false;
				row3.add(drillRating);
				tableData.push(row3);
				
				// add drill steps
				for (var i=0; i<json["steps"].length; i++)
				{
					var row = Ti.UI.createTableViewRow({height: 20});
					
					var stepName = Ti.UI.createLabel({text: json["steps"][i]["title"], left: 10, font: { fontSize:12, fontWeight: 'bold'}});
					row.add(stepName);
					tableData.push(row);
					
					var row2 = Ti.UI.createTableViewRow({height: 40});
					
					var stepDescription = Ti.UI.createTextArea({value: json["steps"][i]["description"], enabled: false, left: 5, font: { fontSize:10}});
					row2.add(stepDescription);
					tableData.push(row2);
					
					var row3 = Ti.UI.createTableViewRow({height: 200});
					
					var stepDiagram = Ti.UI.createImageView({image: json["steps"][i]["thumb"], left: 10});
					row3.add(stepDiagram);
					tableData.push(row3);
				}
				
				var reviewHeaderRow = Ti.UI.createTableViewRow({height: 20});
					
				var reviewTitle = Ti.UI.createLabel({text: 'Reviews', left: 10, font: { fontSize:12, fontWeight: 'bold'}});
				reviewHeaderRow.add(reviewTitle);
				tableData.push(reviewHeaderRow);
				
				// add drill steps
				for (var i=0; i<json["reviews"].length; i++)
				{
					var row = Ti.UI.createTableViewRow({height: 20});
					
					var reviewTitle = Ti.UI.createLabel({text: json["reviews"][i]["title"], left: 10, font: { fontSize:12}});
					row.add(reviewTitle);
					tableData.push(row);
					
					var row2 = Ti.UI.createTableViewRow({height: 25});
					var drillRating = new RatingView(json["rating"], 5, null);
					drillRating.touchEnabled = false;
					row2.add(drillRating);
					tableData.push(row2);
					
					var row3 = Ti.UI.createTableViewRow({height: 40});
					
					var reviewDescription = Ti.UI.createTextArea({value: json["reviews"][i]["description"], enabled: false, left: 5, font: { fontSize:10}});
					row3.add(reviewDescription);
					tableData.push(row3);
				}
			}	
			$.drillTable.setData(tableData);
		}
	});
		
	xhr.open('GET','http://localhost:3000/drills/' + drill_id + '.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}
