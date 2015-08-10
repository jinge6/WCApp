// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
//some keystroke-savers :)
function view(args) {
	return Ti.UI.createView(args);
}

function label(args) {
	return Ti.UI.createLabel(args);
}

function image(args) {
	return Ti.UI.createImageView(args);
}

function window(args) {
	return Ti.UI.createWindow(args);
}

function button(args,onclick) {
	var btn = Ti.UI.createButton(args);
	btn.addEventListener('click', onclick);
	return btn;
}

function setDynamicWebviewHeight(e)
{
	var docHeight = e.source.evalJS("document.height;");
	if (e.source.height != docHeight)
	{
		e.source.height = docHeight;
	}
}						

function stylizeHTML(htmlString)
{
	return '<meta name="viewport" content="width=device-width,user-scalable=no"><style type="text/css"> body,td,p,div,span { font-family:Arial; font-size:10; } </style>' + htmlString;
}

var webserver;

Ti.App.Properties.setString("Mode","Prod");
var mode = Ti.App.Properties.getString("Mode");
if (mode == "Dev")
{
	// dev mode logic
	webserver = "http://192.168.1.11:3000";
}
else
{
	// prod mode logic
	webserver = "https://winnerscircle.herokuapp.com";
};

/*
 * Our custom rating view component takes an initial
 * rating, and a maximum value for the rating, which
 * will be used to render the view
 * 
 */
function RatingView(initialRating, max, totalRatings, topOffset, leftOffset, mini, touchEnabled) {
	//create and populate the rating object
	var instance = view({
		layout:'horizontal',
		height:30,
		top: topOffset,
		left: leftOffset,
		touchEnabled: touchEnabled
	});
	
	var rating; 		// instance variable indicating 
					// rating. this data is private 
					// to the object, since it is 
					// declared in this constructor
					// function
								
	var stars = [];	// another instance variable
					// containing an array of 
					// ImageView objects representing
					// the stars of the rating
	
	//Create the necessary view structures to represent the
	//current value of the rating
	for (var i = 0; i < max; i++) {
		var star = image({
			height:mini?12:24,
			width:mini?12:24,
			left:5,
			zindex: 999999,
			is_rating:1,
			rating:i
		});
		
		(function() {
			//we need to capture the value of "i"
			//for use in click handler functions
			//on our image views.  To do this, we
			//use a closure (this self-calling function)
			var index = i;
			star.addEventListener('click', function() {
				setRating(index+1);
				Ti.App.fireEvent('ratingChanged', {currentValue: rating});
			});
		})();
		
		stars.push(star);
		instance.add(star);
	}
	
	if (totalRatings != null)
	{
		var textValue = label({
			text: '(' + totalRatings + ')',
			height:24,
			width:'auto',
			left:5,
			color:'#787878',
			font: {
				fontSize:12
			}
		});
		instance.add(textValue);
	}
	
	//inner function to update view to reflect the current
	//rating
	function setRating(newRating) {
		rating = newRating;
		
		instance.fireEvent('ratingChanged',{
			currentValue:rating
		});
		
		for (var i = 0, l = stars.length; i < l; i++) {
			if (i >= rating) {
				stars[i].image = mini?'half-star-off.png':'star-off.png';
			}
			else if (rating > i && rating < i+1) {
				stars[i].image = mini?'half-star-half.png':'star-half.png';
			}
			else {
				stars[i].image = mini?'half-star-on.png':'star-on.png';
			}
		}
	}
	
	instance.changeRating = setRating;
	
	//initialize view and return instance
	setRating(initialRating);
	return instance;
};

function getPerformanceColor(level)
{
	var color;
	if (level == "1")
	{
		color = "#FF1919";
	}
	else if(level == "2")
	{
		color = "#FFA319";
	}
	else
	{
		color = "#33AD33";
	}
	return color;
}

function getAthletePerformanceImagePath(level)
{
	var path;
	if (level == "1")
	{
		path = "athlete_basic_indicator.png";
	}
	else if(level == "2")
	{
		path = "athlete_intermediate_indicator.png";
	}
	else
	{
		path = "athlete_advanced_indicator.png";
	}
	return path;
}

function getTeamPerformanceImagePath(level)
{
	var path;
	if (level == "1")
	{
		path = "team_basic_indicator.png";
	}
	else if(level == "2")
	{
		path = "team_intermediate_indicator.png";
	}
	else
	{
		path = "team_advanced_indicator.png";
	}
	return path;
}

function getDrillBrowseCategories(activity_id, dactivityIndicator, drillsTable)
{
	var tableData = [];
	
	dactivityIndicator.show();

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
					var row = Ti.UI.createTableViewRow({height: 60, hasChild: true, strength_id: json[i]["id"]});
					var name = Ti.UI.createLabel({text: json[i]["name"], top: 5, left: 10, font: { fontSize:14, fontWeight: 'bold' }});
					row.add(name);
					var description = Ti.UI.createLabel({text: json[i]["description"], top: 25, left: 10, font: { fontSize:10 }});
					row.add(description);
					tableData.push(row);
				}
			}	
			drillsTable.setData(tableData);
			dactivityIndicator.hide();
			drillsTable.visible = true;
		}
	});
		
	xhr.open('GET', webserver+'/activities/' + activity_id + '/strengths.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getVideoCategories(activity_id, vactivityIndicator, videoCategoriesTable)
{
	var tableData = [];
	vactivityIndicator.show();

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			json = JSON.parse(this.responseText);
			
			if (json.length != 0)
			{
				var row = Ti.UI.createTableViewRow({height: 60, hasChild: true, strength_id: '0' });
				var name = Ti.UI.createLabel({text: 'Highlights', top: 5, left: 10, font: { fontSize:14, fontWeight: 'bold' }});
				row.add(name);
				var description = Ti.UI.createLabel({text: 'A collection of highlight videos', top: 25, left: 10, font: { fontSize:10 }});
				row.add(description);
				tableData.push(row);
					
				for (var i=0; i<json.length; i++)
				{
					var row = Ti.UI.createTableViewRow({height: 60, hasChild: true, strength_id: json[i]["id"]});
					var name = Ti.UI.createLabel({text: json[i]["name"], top: 5, left: 10, font: { fontSize:14, fontWeight: 'bold' }});
					row.add(name);
					var description = Ti.UI.createLabel({text: json[i]["description"], top: 25, left: 10, font: { fontSize:10 }});
					row.add(description);
					tableData.push(row);
				}
			}	
			videoCategoriesTable.setData(tableData);
			vactivityIndicator.hide();
			videoCategoriesTable.visible = true;
		}
	});
		
	xhr.open('GET', webserver+'/activities/' + activity_id + '/strengths.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}
