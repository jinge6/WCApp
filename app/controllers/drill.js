var args = arguments[0] || {};

var drill_id = args;
var animateObjects = new Array();
var layerEvents = new Array();
var moveables = new Array();
var xScalingFactor = 320/550;
var yScalingFactor = 273/470;
var currentLayer = 1;
var eventsProcessed = 1;

//add behavior for goAssessments
Ti.App.addEventListener('runAnimation', function(e) {
	layerEvents = [];
	if (animateObjects.length > 0)
    {
    	if (currentLayer > 1)
    	{
    		eventsProcessed = 1;
    		kickoffAnimation(false, 1, currentLayer-1);
    		currentLayer = 1;
    	}
    	else
    	{
			currentLayer = 1;
    		eventsProcessed = 1;
        	kickoffAnimation(true, 2, 1);
        }
    }
});

Ti.App.addEventListener('updatePosition', function(evtData){
      animationHandler(evtData.layer);   
});

function animationHandler(layer)
{
	var expectEventsForThisLayer = layerEvents[layer];
	if (expectEventsForThisLayer == eventsProcessed)
	{
		eventsProcessed = 1;
		currentLayer = layer + 1;
		kickoffAnimation(true, currentLayer, layer);
	}
	else
	{
		eventsProcessed++;
	}
	
}

function kickoffAnimation(animateAll, moveToLayer, fromLayer)
{
    if (animateObjects != null && animateObjects.length > 0)
    {
        for (var i = 0; i < animateObjects.length; i++)
        {
            if (animateObjects[i][0] == moveToLayer)
            {
            	var currentMoveable = animateObjects[i][1];

				var newXPos = parseInt(animateObjects[i][2])  * xScalingFactor;
			    var newYPos = parseInt(animateObjects[i][3]) * yScalingFactor;
			    
			    var thePlayer = moveables[animateObjects[i][1]];
				var t1 = Ti.UI.create2DMatrix();
				
				if (Ti.Platform.osname == "android")
				{
					// android uses pixels
					t1 = t1.translate((newXPos-thePlayer.left)*(Titanium.Platform.displayCaps.dpi / 160), (newYPos-thePlayer.top)*(Titanium.Platform.displayCaps.dpi / 160));
				}
				else
				{
					//ios uses dp
					t1 = t1.translate(newXPos-thePlayer.left, newYPos-thePlayer.top);
				}
				
				var a1 = Ti.UI.createAnimation();
				a1.transform = t1;
				a1.duration = 1500;
				if (animateAll)
				{
					a1.addEventListener('complete',function(e) {
						Ti.App.fireEvent( 'updatePosition', { event:e, layer:moveToLayer });
					});
				}
				if (layerEvents[moveToLayer] == null)
				{
					layerEvents[moveToLayer] = 1;
				}
				else
				{
					layerEvents[moveToLayer] = (layerEvents[moveToLayer])+1;
				}
				thePlayer.animate(a1);
            }
        }
    }
}

function eventsToExpect(layer)
{
	if (animateObjects.length > 0)
	{
		var moveableCount = 0;
		for (var i = 0; i < animateObjects.length; i++)
        {
			if (parseInt(animateObjects[i][0]) == layer)
			{
				moveableCount++;
			}
		}
	}
	return moveableCount;
}

getDrill(drill_id);

function getDrill(drill_id)
{
	var tableData = [];
	$.activityIndicator.show();

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			json = JSON.parse(this.responseText);
			
			$.drillTable.separatorColor = 'transparent';
			
			if (json.length != 0)
			{
				var row = Ti.UI.createTableViewRow({touchEnabled: false, height: 20});
					
				var drillName = Ti.UI.createLabel({text: json["name"], left: 10, touchEnabled: false, font: { fontSize:12, fontWeight: 'bold'}});
				row.add(drillName);
				tableData.push(row);
				
				//TODO add strengths here
				
				var row2 = Ti.UI.createTableViewRow({touchEnabled: false});
						
				var drillDescription = Ti.UI.createLabel({text: json["description"], left: 10, touchEnabled: false,font: { fontSize:10}});
				row2.add(drillDescription);
				tableData.push(row2);
				
				var row3 = Ti.UI.createTableViewRow({touchEnabled: false, height: 25, left: 10});
				
				var drillRating = new RatingView(json["rating"], 5, json["total_ratings"], 0, 0, false, false);
				drillRating.touchEnabled = false;
				row3.add(drillRating);
				tableData.push(row3);
				
				// add drill steps
				for (var i=0; i<json["steps"].length; i++)
				{
					var row = Ti.UI.createTableViewRow({touchEnabled: false, height: 20});
					
					var stepName = Ti.UI.createLabel({text: json["steps"][i]["title"], left: 10, touchEnabled: false, font: { fontSize:12, fontWeight: 'bold'}});
					row.add(stepName);
					tableData.push(row);
					
					var row2 = Ti.UI.createTableViewRow({touchEnabled: false});
					
					var stepDescription = Ti.UI.createTextArea({value: json["steps"][i]["description"], touchEnabled: false, enabled: false, left: 5, font: { fontSize:10}});
					row2.add(stepDescription);
					tableData.push(row2);
					
					var row3 = Ti.UI.createTableViewRow({touchEnabled: false});
					if (json["steps"][i]["layers"] != null && json["steps"][i]["layers"].length > 0)
					{
						var animatedDiagram = image({image: json["steps"][i]["background"]+'.png', width: 320, height: 273, left: 0});
						animatedDiagram.addEventListener('click', function(e){
							Ti.App.fireEvent('runAnimation');
						});
						
						row3.add(animatedDiagram);
						animateObjects = JSON.parse(decodeURIComponent(json["steps"][i]["layers"]));
						if (animateObjects != null && animateObjects.length > 0)
						{
							for (var i=0; i<animateObjects.length; i++)
					        {
					            if (animateObjects[i][0] == 1)
					            {
					            	xPos = (parseInt(animateObjects[i][2]) * xScalingFactor);
					                yPos = (parseInt(animateObjects[i][3]) * yScalingFactor);
					            	var moveable = image({image: animateObjects[i][1]+'.png', left: xPos, top: yPos, height:30, width: 30});
									row3.add(moveable);
									moveables[animateObjects[i][1]] = moveable;
					            }
					        }
				       	}
					}
					else if (json["steps"][i]["thumb"] != null && json["steps"][i]["thumb"].length > 0)
					{
						var stepDiagram = Ti.UI.createImageView({image: json["steps"][i]["thumb"], link: json["steps"][i]["link"]});
						
						if (json["steps"][i]["link"].length > 0)
						{
							var playButton = image({image: "play.png",link: json["steps"][i]["link"], left: 120, top: 80});
							playButton.addEventListener('click', function(e){
								Ti.Platform.openURL(e.source.link);
							});
							stepDiagram.addEventListener('click', function(e){
								Ti.Platform.openURL(e.source.link);
							});
							row3.add(stepDiagram);
							row3.add(playButton);
						}
						else
						{
							row3.add(stepDiagram);
						}
					}

					tableData.push(row3);
				}
				
				var reviewHeaderRow = Ti.UI.createTableViewRow({touchEnabled: false, height: 20});
					
				var reviewTitle = Ti.UI.createLabel({text: 'Reviews', left: 10, touchEnabled: false, font: { fontSize:12, fontWeight: 'bold'}});
				reviewHeaderRow.add(reviewTitle);
				tableData.push(reviewHeaderRow);
				
				// add drill steps
				for (var i=0; i<json["reviews"].length; i++)
				{
					var row = Ti.UI.createTableViewRow({touchEnabled: false, height: 20});
					
					var reviewTitle = Ti.UI.createLabel({text: json["reviews"][i]["title"], left: 10, touchEnabled: false, font: { fontSize:12}});
					row.add(reviewTitle);
					tableData.push(row);
					
					var row2 = Ti.UI.createTableViewRow({touchEnabled: false, height: 25});
					var drillRating = new RatingView(json["reviews"][i]["rating"], 5, null, false, false);
					drillRating.touchEnabled = false;
					row2.add(drillRating);
					tableData.push(row2);
					
					var row3 = Ti.UI.createTableViewRow({touchEnabled: false, height: 40});
					
					var reviewDescription = Ti.UI.createTextArea({value: json["reviews"][i]["description"], enabled: false, left: 5, font: { fontSize:10}});
					row3.add(reviewDescription);
					tableData.push(row3);
				}
			}	
			$.drillTable.setData(tableData);
			$.activityIndicator.hide();
			$.drillTable.visible = true;
		}
	});
		
	xhr.open('GET', webserver+'/drills/' + drill_id + '.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}
