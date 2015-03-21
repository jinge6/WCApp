var args = arguments[0] || {};

// args contains the assignment_id we are dealing with
var assignment_id = args[0];
var role = args[1];
var activity_id = args[2];

$.assignmentTab.setActiveTab(1);

$.assessmentTab.addEventListener('focus', function(e){
    getAssessment(assignment_id, role);
});

$.nextTrainingTab.addEventListener('focus', function(e){
    getTrainingDrills(assignment_id);
});

$.videosTab.addEventListener('focus', function(e){
    getVideoCategories(assignment_id, activity_id);
});

$.drillsTab.addEventListener('focus', function(e){
    getDrillBrowseCategories(assignment_id, activity_id);
});

function goTraining(e){
	Ti.App.fireEvent('goTraining',e);
};

function goDrills(e){
	Ti.App.fireEvent('goDrills',e);
};

// create table view
var assessmentTable = Titanium.UI.createTableView();

assessmentTable.addEventListener('click', function(e){
	if (e.rowData.role == "Coach")
	{
		Ti.App.fireEvent('goFocus',{assignment_id: e.rowData.assignment_id, strength: e.rowData.strength});
	}
	else
	{	
		Ti.App.fireEvent('goAssessment',{summary: e.rowData.summary, strength: e.rowData.strength, strengthDescription: e.rowData.strengthDescription, level: e.rowData.level, assessment: e.rowData.assessment});
	}
});

$.videoCategoriesTable.addEventListener('click', function(e){
	Ti.App.fireEvent('goVideos',{assignment_id: e.rowData.assignment_id, strength_id: e.rowData.strength_id, activity_id: activity_id});
});

$.drillsTable.addEventListener('click', function(e){
	Ti.App.fireEvent('showDrillBrowse',{strength_id: e.rowData.strength_id, role: role, assignment_id: assignment_id, activity_id: activity_id});
});

$.trainingTable.addEventListener('singletap', function(e){
	e.cancelBubble = true;
	if (e.source.is_rating == 1)
	{
		var rating = parseInt(e.source.rating) + 1;
		sendRating(e.rowData.drill_id, rating);
		e.row.v2.opacity = 1;
		alert('Thanks for rating this drill!');
	}
	else
	{
		e.row.v2.opacity = 1;
		Ti.App.fireEvent('showDrill',{drill_id: e.rowData.drill_id});
	}
});

var current_row;

$.trainingTable.addEventListener('swipe', function(e){
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
		
	xhr.open('GET', webserver+'/drill_reviews/rate.json?rating=' + rating + '&drill_id=' + drill_id);
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}


function getTrainingDrills(assignment_id)
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
				var sectionHeader = Ti.UI.createTableViewSection({headerTitle: json["eventDate"]});
				tableData.push(sectionHeader);
				
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
				  	var diagram = Ti.UI.createImageView({image: imageName, left: 5});
				  	defaultView.add(diagram);
				  	var drillName = Ti.UI.createLabel({text: json["drills"][i]["name"], top: 10, left: 105, font: { fontSize:12, fontWeight: 'bold' }});
					defaultView.add(drillName);
					var drillRating = new RatingView(json["drills"][i]["rating"], 5, json["drills"][i]["total_ratings"], 20, 105, true);
					drillRating.touchEnabled = false;
					defaultView.add(drillRating);
					
					var leftOffset = 110;
					if (json["drills"][i]["strengths"].length > 0)
					{
						var teamPerformanceImage = Ti.UI.createImageView({image: getTeamPerformanceImagePath(json["drills"][i]["strengths"][0]["performance_id"]), left: leftOffset, top: 50, touchEnabled: false, height: 20, width: 20});
				  		defaultView.add(teamPerformanceImage);
				  		leftOffset += 25;
						var athletePerformanceImage = Ti.UI.createImageView({image: getAthletePerformanceImagePath(json["drills"][i]["strengths"][0]["performance_id"]), left: leftOffset, top: 50, touchEnabled: false, height: 20, width: 20});
				  		defaultView.add(athletePerformanceImage);
						leftOffset += 25;
						if (json["drills"][i]["strengths"].length == 1)
						{
							var strength = Ti.UI.createLabel({text: json["drills"][i]["strengths"][0]["name"], top: 50, left: leftOffset, font: { fontSize:8, fontWeight: 'bold'}});
							defaultView.add(strength);
						}
						else
						{
							var strengthAndMore = Ti.UI.createLabel({text: json["drills"][i]["strengths"][0]["name"] + ' and ' + json["drills"][i]["strengths"].length-1 + ' more', top: 50, left: leftOffset, font: { fontSize:8, fontWeight: 'bold'}});
							defaultView.add(strengthAndMore);
						}
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
			$.trainingTable.setData(tableData);
		}
	});
		
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignments/nexttraining.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getAssessment(assignment_id, role)
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
				focusOnTop = json["focusontop"];
				var color;
				for (var i=0; i<json["assessments"].length; i++)
				{
					if (parseInt(json["assessments"][i]["priority"]) <= parseInt(focusOnTop))
					{
						color = '#DFF0D8';
					}
					else
					{
						color = 'white';
					}
					var row = Ti.UI.createTableViewRow({height: 60, role: role, assignment_id: assignment_id, backgroundColor: color, strength: json["assessments"][i]["strength"], strengthDescription: json["assessments"][i]["description"], summary: json["assessments"][i]["summary"], level: json["assessments"][i]["level"], assessment: json["assessments"][i]["assessment"]});
					
					var strength = Ti.UI.createLabel({text: json["assessments"][i]["strength"], top: 20, left: 50, font: { fontSize:12, fontWeight: 'bold' }});
					row.add(strength);
					var description = Ti.UI.createLabel({text: json["assessments"][i]["description"], top: 40, left: 50, font: { fontSize:10}});
					row.add(description);
					var performanceImage = Ti.UI.createImageView({image: role=="Coach"?getTeamPerformanceImagePath(json["assessments"][i]["level"]):getAthletePerformanceImagePath(json["assessments"][i]["level"]), top: 10, left: 10, height:20, width:20, touchEnabled: false});
				  	row.add(performanceImage);
				  	var assessment = Ti.UI.createLabel({text: json["assessments"][i]["assessment"], top: 6, left: 50, font: { fontSize:10, fontWeight: 'bold'}});
					row.add(assessment);
					tableData.push(row);
				}
			}	
			assessmentTable.setData(tableData);
			// add table view to the window
			$.assessmentWin.add(assessmentTable);
		}
	});
		
	if (role == "Coach")
	{
		
		xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignments/focus.json');
	}
	else
	{
		assessmentTable.moveable = false;
		xhr.open('GET', webserver+'/development/' + assignment_id + '/development/assessment.json?id=' + assignment_id);
	}
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getDrillBrowseCategories(assignment_id)
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
			$.drillsTable.setData(tableData);
		}
	});
		
	xhr.open('GET', webserver+'/activities/' + assignment_id + '/strengths.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getVideoCategories(assignment_id)
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
				var row = Ti.UI.createTableViewRow({height: 60, hasChild: true, assignment_id: assignment_id, strength_id: '0' });
				var name = Ti.UI.createLabel({text: 'Highlights', top: 5, left: 10, font: { fontSize:14, fontWeight: 'bold' }});
				row.add(name);
				var description = Ti.UI.createLabel({text: 'A collection of highlight videos', top: 25, left: 10, font: { fontSize:10 }});
				row.add(description);
				tableData.push(row);
					
				for (var i=0; i<json.length; i++)
				{
					var row = Ti.UI.createTableViewRow({height: 60, hasChild: true, assignment_id: assignment_id, strength_id: json[i]["id"]});
					var name = Ti.UI.createLabel({text: json[i]["name"], top: 5, left: 10, font: { fontSize:14, fontWeight: 'bold' }});
					row.add(name);
					var description = Ti.UI.createLabel({text: json[i]["description"], top: 25, left: 10, font: { fontSize:10 }});
					row.add(description);
					tableData.push(row);
				}
			}	
			$.videoCategoriesTable.setData(tableData);
		}
	});
		
	xhr.open('GET', webserver+'/activities/' + assignment_id + '/strengths.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}