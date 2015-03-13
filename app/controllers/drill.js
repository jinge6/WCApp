var args = arguments[0] || {};

var drill_id = args;
var animateObjects = new Array();
var moveables = new Array();
var scalingFactor = 320/500;
var currentLayer = 2;

//add behavior for goAssessments
Ti.App.addEventListener('runAnimation', function(e) {
	if (animateObjects.length > 0)
    {
    	if (currentLayer > 2)
    	{
    		currentLayer = 2;
    		resetMoveables();
    	}
    	else
    	{
        	kickoffAnimation(true, currentLayer);
        }
    }
});

function resetMoveables()
{
	kickoffAnimation(false, 1);
}

function animationHandler()
{
	kickoffAnimation(true, currentLayer++);
}

function kickoffAnimation(animateAll, moveToLayer)
{
    if (animateObjects != null && animateObjects.length > 0)
    {
        for (var i = 0; i < animateObjects.length; i++)
        {
            if (animateObjects[i][0] == moveToLayer)
            {
            	var previousXPos;
            	var previousYPos;
            	var currentMoveable = animateObjects[i][1];
            	
            	for (var j = 0; j < animateObjects.length; j++)
            	{
            		if ((animateObjects[j][0] == moveToLayer-1) && (animateObjects[j][1] == currentMoveable))
            		{
            			previousXPos = (parseInt(animateObjects[j][2]) * scalingFactor) - 29;
            			previousYPos = (parseInt(animateObjects[j][3]) * scalingFactor) - 29;
            			break;
            		}
            	}
            	
				var newXPos = (parseInt(animateObjects[i][2]) * scalingFactor) - 29;
			    var newYPos = (parseInt(animateObjects[i][3]) * scalingFactor) - 29;
			    var thePlayer = moveables[animateObjects[i][1]];
				var t1 = Ti.UI.create2DMatrix();
				
				t1 = t1.translate((newXPos - previousXPos), (newYPos - previousYPos));
				var a1 = Ti.UI.createAnimation();
				a1.transform = t1;
				a1.duration = 1500;
				if (animateAll)
				{
					a1.addEventListener('complete',animationHandler);
				}
				thePlayer.animate(a1);
            }
        }
    }
}

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
					
					var row3 = Ti.UI.createTableViewRow();
					
					var stepDiagram = Ti.UI.createImageView({image: json["steps"][i]["background"]+'.png', width: 320, height: 273});
					stepDiagram.addEventListener('click', function(e){
						Ti.App.fireEvent('runAnimation');
					});
					
					row3.add(stepDiagram);
					animateObjects = JSON.parse(decodeURIComponent(json["steps"][i]["layers"]));
					
					for (var i=0; i<animateObjects.length; i++)
			        {
			            if (animateObjects[i][0] == 1)
			            {
			            	xPos = (parseInt(animateObjects[i][2]) * scalingFactor) - 29;
			                yPos = (parseInt(animateObjects[i][3]) * scalingFactor) - 29;
			            	var moveable = Ti.UI.createImageView({image: animateObjects[i][1]+'.png', left: xPos, top: yPos});
							row3.add(moveable);
							moveables[animateObjects[i][1]] = moveable;
			            }
			        }
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
