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
				var strengths = json["strengths"] == ""?"No strengths added yet":json["strengths"];
				var strengthDescription = Ti.UI.createTextArea({value: strengths, touchEnabled: false, enabled: false, left: 10, font: { fontSize:10}});
				row.add(strengthDescription);
				strengthsHeader.add(row);
				tableData.push(strengthsHeader);
				
				var weaknessHeader = Ti.UI.createTableViewSection({headerTitle: "Weaknesses", height: 30, touchEnabled: false});		
				var weaknessRow = Ti.UI.createTableViewRow({height: 60, touchEnabled: false});
				var weakness = json["weaknesses"] == ""?"No weaknesses added yet":json["weaknesses"];
				var weaknessDescription = Ti.UI.createTextArea({value: weakness, touchEnabled: false, enabled: false, left: 10, font: { fontSize:10}});
				weaknessRow.add(weaknessDescription);
				weaknessHeader.add(weaknessRow);
				tableData.push(weaknessHeader);
				var drillsHeader = Ti.UI.createTableViewSection({headerTitle: "Scouting", height: 30, touchEnabled: false});
				tableData.push(drillsHeader);
				for (var i=0; i<json["drills"].length; i++)
				{
					var imageName = "";
					var row = Ti.UI.createTableViewRow({height: 80, hasChild: true, drill_id: json["drills"][i]["drill_id"]});
					if ((json["drills"][i]["thumb"]).indexOf("animated") == -1)
					{
						imageName = json["drills"][i]["thumb"];
				  	}
				  	else
				  	{
				  		imageName = "animated.png";
				  	}
				  	var diagram = image({image: imageName, height: Ti.UI.SIZE, width: Ti.UI.SIZE, left: 5, touchEnabled: false});
				  	row.add(diagram);
				  	var drillName = Ti.UI.createLabel({touchEnabled: false, text: json["drills"][i]["name"], top: 10, left: 110, width: Ti.UI.SIZE, font: { fontSize:12, fontWeight: 'bold' }});
					row.add(drillName);
					var drillRating = new RatingView(json["drills"][i]["rating"], 5, json["drills"][i]["total_ratings"], 30, 105, true, false);
					row.add(drillRating);
					
					row.addEventListener('click', function(e){
						Ti.App.fireEvent('showDrill',{drill_id: e.rowData.drill_id});
					});
					
					tableData.push(row);
				}
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
