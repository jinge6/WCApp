var args = arguments[0] || {};

var strength_id = args[0];
var role = args[1];
var assignment_id = args[2];

getDrillsToBrowse(strength_id);

$.drillBrowseTable.addEventListener('click', function(e){
    Ti.App.fireEvent('showDrill',{drill_id: e.rowData.drill_id});
});

function getDrillsToBrowse(strength_id)
{
	var tableData = [];

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			json = JSON.parse(this.responseText);
			
			if (json.length != 0)
			{
				for (var i=0; i<json["drills"].length; i++)
				{
					var imageName = "";
					var row = Ti.UI.createTableViewRow({height: 80, hasChild: true, drill_id: json["drills"][i]["id"]});
					if ((json["drills"][i]["thumb"]).indexOf("notfound") == -1)
					{
						imageName = json["drills"][i]["thumb"];
						
				  	}
				  	else
				  	{
				  		imageName = 'missing_thumbnail.png';
				  	}
				  	var diagram = Ti.UI.createImageView({image: imageName, left: 5, touchEnabled: false});
				  	row.add(diagram);
					var drillName = Ti.UI.createLabel({text: json["drills"][i]["name"], top: 10, left: 105, font: { fontSize:12, fontWeight: 'bold' }});
					row.add(drillName);
					
					var drillRating = new RatingView(json["drills"][i]["rating"], 5, json["drills"][i]["total_ratings"], 50, 105);
					drillRating.touchEnabled = false;
					row.add(drillRating);
					
					var leftOffset = 110;
					for (var j=0; j<json["drills"][i]["strengths"].length; j++)
					{
						var strength = Ti.UI.createLabel({text: json["drills"][i]["strengths"][j]["name"], top: 30, left: leftOffset, font: { fontSize:10}});
						row.add(strength);
						leftOffset += 100;
					}
					tableData.push(row);
				}
			}	
			$.drillBrowseTable.setData(tableData);
		}
	});
		
	if (role == "coach")
	{	
		xhr.open('GET','http://localhost:3000/drills.json?filter=strength&id=' + strength_id);
	}
	else
	{
		xhr.open('GET','http://localhost:3000/development/' + assignment_id + '/development/suggested.json?filter=strength&sid=' + strength_id);
	}
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}