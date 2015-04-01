var args = arguments[0] || {};

var strength_id = args[0];
var role = args[1];
var assignment_id = args[2];
var activity_id = args[3];

getDrillsToBrowse(strength_id);

$.drillBrowseTable.addEventListener('singletap', function(e){
	e.cancelBubble = true;
	// if we get a singletap from a star and the hidden view is visible
	if (e.source.is_rating == 1 && hiddenVisible)
	{
		var rating = parseInt(e.source.rating) + 1;
		sendRating(e.rowData.drill_id, rating);
		e.row.v2.setOpacity(1);
		hiddenVisible = false;
		alert('Thanks for rating this drill!');
	}
	else
	{
		hiddenVisible = false;
		e.row.v2.setOpacity(1);
		Ti.App.fireEvent('showDrill',{drill_id: e.rowData.drill_id});
	}
});

var current_row;
var hiddenVisible = false;

$.drillBrowseTable.addEventListener('swipe', function(e){
	if (!!current_row) {
		current_row.v2.animate({
			opacity: 1,
			duration: 500
		});
	};

	current_row = e.row;
	hiddenVisible = true;

	current_row.v2.animate({
		opacity: 0,
		duration: 500
	});
});	

function sendRating(drill_id, rating)
{
	var xhr = Ti.Network.createHTTPClient();
		
	xhr.open('GET', webserver+'/drill_reviews/rate.json?rating=' + rating + '&drill_id=' + drill_id);
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getDrillsToBrowse(strength_id)
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
				for (var i=0; i<json["drills"].length; i++)
				{
					var imageName = "";
					var row = Ti.UI.createTableViewRow({height: 80, hasChild: true, drill_id: json["drills"][i]["id"]});
					if ((json["drills"][i]["thumb"]).indexOf("animated") == -1)
					{
						imageName = json["drills"][i]["thumb"];
						
				  	}
				  	else
				  	{
				  		imageName = "animated.png";
				  	}
				  	var defaultView = Ti.UI.createView({
						backgroundColor: '#fff',
						height: Ti.UI.SIZE,
						touchEnabled: false
					});
				  	var diagram = image({image: imageName, height: Ti.UI.SIZE, width: Ti.UI.SIZE, left: 5, touchEnabled: false});
				  	defaultView.add(diagram);
				  	var drillName = Ti.UI.createLabel({touchEnabled: false, text: json["drills"][i]["name"], top: 10, left: 105, font: { fontSize:12, fontWeight: 'bold' }});
					defaultView.add(drillName);
					var drillRating = new RatingView(json["drills"][i]["rating"], 5, json["drills"][i]["total_ratings"], 20, 105, true, false);
					defaultView.add(drillRating);
					
					var leftOffset = 110;
					if (json["drills"][i]["strengths"].length > 0)
					{
						var teamPerformanceImage = image({touchEnabled: false, image: getTeamPerformanceImagePath(json["drills"][i]["strengths"][0]["performance_id"]), left: leftOffset, top: 50, touchEnabled: false, height: 20, width: 20});
				  		defaultView.add(teamPerformanceImage);
				  		leftOffset += 25;
						var athletePerformanceImage = image({touchEnabled: false, image: getAthletePerformanceImagePath(json["drills"][i]["strengths"][0]["performance_id"]), left: leftOffset, top: 50, touchEnabled: false, height: 20, width: 20});
				  		defaultView.add(athletePerformanceImage);
						leftOffset += 25;
						if (json["drills"][i]["strengths"].length == 1)
						{
							var strength = Ti.UI.createLabel({touchEnabled: false, text: json["drills"][i]["strengths"][0]["name"], top: 50, left: leftOffset, font: { fontSize:8, fontWeight: 'bold'}});
							defaultView.add(strength);
						}
						else
						{
							var strengthAndMore = Ti.UI.createLabel({touchEnabled: false, text: json["drills"][i]["strengths"][0]["name"] + ' and ' + json["drills"][i]["strengths"].length-1 + ' more', top: 50, left: leftOffset, font: { fontSize:8, fontWeight: 'bold'}});
							defaultView.add(strengthAndMore);
						}
					}
					
					var hiddenView = Ti.UI.createView({
						height:Ti.UI.SIZE,
						width:Ti.UI.SIZE,
						opacity: 1
					});
					
					var newRating = new RatingView(0, 5, null, 20, 105, false, true);
					
					hiddenView.add(newRating);
					var howGoodLabel = Ti.UI.createLabel({
						text: "How good is this drill?",
						color:'black',
						top: 0,
						left: 40,
						font: { fontSize:12, fontWeight: 'bold'}
					});
					hiddenView.add(howGoodLabel);

					row.add(hiddenView);
					row.v2 = defaultView;
					row.add(defaultView);
					
					tableData.push(row);
				}
			}	
			$.drillBrowseTable.setData(tableData);
			$.activityIndicator.hide();
			$.drillBrowseTable.visible = true;
		}
	});
		
	if (role == "Coach")
	{
		xhr.open('GET', webserver+'/drills.json?filter=strength&id=' + strength_id + '&activity_id='+ activity_id);
	}
	else
	{
		xhr.open('GET', webserver+'/development/' + assignment_id + '/development/suggested.json?filter=strength&sid=' + strength_id + '&activity_id='+ activity_id);
	}
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}