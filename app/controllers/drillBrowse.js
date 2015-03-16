var args = arguments[0] || {};

var strength_id = args[0];
var role = args[1];
var assignment_id = args[2];
var activity_id = args[3];

getDrillsToBrowse(strength_id);

$.drillBrowseTable.addEventListener('singletap', function(e){
	e.cancelBubble = true;
	if (e.source.is_rating == 1)
	{
		var rating = parseInt(e.source.rating) + 1;
		sendRating(e.rowData.drill_id, rating);
		getDrillsToBrowse(strength_id);
		alert('Thanks for rating this drill!');
	}
	else
	{
		e.row.v2.opacity = 1;
		Ti.App.fireEvent('showDrill',{drill_id: e.rowData.drill_id});
	}
});

var current_row;

$.drillBrowseTable.addEventListener('swipe', function(e){
	if (!!current_row) {
		current_row.v2.animate({
			opacity: 1,
			duration: 500
		});
	};

	current_row = Ti.Platform.osname == 'android' ? this : e.row; // it looks like android does not have the e.row property for this event.

	current_row.v2.animate({
		opacity: 0,
		duration: 500
	});
});	

function sendRating(drill_id, rating)
{
	var xhr = Ti.Network.createHTTPClient();
		
	xhr.open('GET','http://localhost:3000/drill_reviews/rate.json?rating=' + rating + '&drill_id=' + drill_id);
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getDrillsToBrowse(strength_id)
{
	var tableData = [];

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			console.log(this.responseText);
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
				  	var defaultView = Ti.UI.createView({
						backgroundColor: '#fff',
						height: Ti.UI.SIZE
					});
				  	var diagram = Ti.UI.createImageView({image: imageName, left: 5, touchEnabled: false});
				  	defaultView.add(diagram);
				  	var drillName = Ti.UI.createLabel({text: json["drills"][i]["name"], top: 10, left: 105, font: { fontSize:12, fontWeight: 'bold' }});
					defaultView.add(drillName);
					var drillRating = new RatingView(json["drills"][i]["rating"], 5, json["drills"][i]["total_ratings"], 20, 105, true);
					drillRating.touchEnabled = false;
					defaultView.add(drillRating);
							
					var description = json["drills"][i]["description"];
					var drillDescription = Ti.UI.createLabel({text: description.substring(0,37), top: 40, left: 110, font: { fontSize:10}});
					defaultView.add(drillDescription);
					
					var leftOffset = 110;
					for (var j=0; j<json["drills"][i]["strengths"].length; j++)
					{
						var strength = Ti.UI.createLabel({text: json["drills"][i]["strengths"][j]["name"], top: 55, left: leftOffset, font: { fontSize:10}});
						defaultView.add(strength);
						leftOffset += 100;
					}
					
					var hiddenView = Ti.UI.createView({
						height:Ti.UI.SIZE,
						width:Ti.UI.SIZE,
						backgroundColor:'white',
						opacity: 1
					});
					
					var newRating = new RatingView(0, 5, null, 20, 105, false);
					
					hiddenView.add(newRating);
					var howGoodLabel = Ti.UI.createLabel({
						text: "How good is this drill?",
						color:'black',
						top: 0,
						left: 40,
						visible: true,
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
		}
	});
		
	if (role == "coach")
	{	
		xhr.open('GET','http://localhost:3000/drills.json?filter=strength&id=' + strength_id + '&activity_id='+ activity_id);
	}
	else
	{
		xhr.open('GET','http://localhost:3000/development/' + assignment_id + '/development/suggested.json?filter=strength&sid=' + strength_id + '&activity_id='+ activity_id);
	}
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}