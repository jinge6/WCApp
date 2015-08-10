var args = arguments[0] || {};

// args contains the assignment_id we are dealing with
var assignment_id = args[0];
var role = args[1];
var activity_id = args[2];

if (role == "Coach")
{
	$.assessmentTab.title = "Adjust";
}
else
{
	$.assessmentTab.title = "Assessment";
}

$.assignmentTab.setActiveTab(1);
$.assessmentTab.addEventListener('focus', function(e)
{
    if (role == "Coach")
	{
		getAdjustmentTypes(assignment_id, role);
	}
	else
	{
		getAssessment(assignment_id, role);
	}
});

$.nextTrainingTab.addEventListener('focus', function(e){
    getTrainingDrills(assignment_id);
});

/*
$.videosTab.addEventListener('focus', function(e){
    getVideoCategories(activity_id, $.vactivityIndicator, $.videoCategoriesTable);
});
*/

$.drillsTab.addEventListener('focus', function(e){
    getDrillBrowseCategories(activity_id, $.dactivityIndicator, $.drillsTable);
});

$.gameDayTab.addEventListener('focus', function(e){
    getGameDay(assignment_id);
});

$.playersTab.addEventListener('focus', function(e){
    getPlayers(assignment_id, role);
});

// create table view
var assessmentTable = Titanium.UI.createTableView();

assessmentTable.addEventListener('click', function(e){
	if (e.rowData.role == "Coach" && e.rowData.adjustAction == "prioritise")
	{
		Ti.App.fireEvent('goPrioritise',{assignment_id: e.rowData.assignment_id});
	}
	else if (e.rowData.role == "Coach" && e.rowData.adjustAction == "practicePlan")
	{
		Ti.App.fireEvent('goPracticePlan',{assignment_id: e.rowData.assignment_id});
	}
	else
	{	
		Ti.App.fireEvent('goAssessment',{summary: e.rowData.summary, strength: e.rowData.strength, strengthDescription: e.rowData.strengthDescription, level: e.rowData.level, assessment: e.rowData.assessment});
	}
});

/*
$.videoCategoriesTable.addEventListener('click', function(e){
	Ti.App.fireEvent('goVideos',{strength_id: e.rowData.strength_id, activity_id: activity_id});
});
*/

$.drillsTable.addEventListener('click', function(e){
	Ti.App.fireEvent('showDrillBrowse',{strength_id: e.rowData.strength_id, role: role, assignment_id: assignment_id, activity_id: activity_id});
});

$.gameDayTable.addEventListener('click', function(e){
	Ti.App.fireEvent('showEventDetail',{event_id: e.rowData.event_id, gameplan: e.rowData.gameplan, debrief: e.rowData.debrief, opponent: e.rowData.opponent, assignment_id: e.rowData.assignment_id, opponent_id: e.rowData.opponent_id});
});

$.playersTable.addEventListener('click', function(e){
	if (role == "Coach" && e.rowData.inviteRow)
	{
		Ti.App.fireEvent('goInviteAthlete',{assignment_id: assignment_id});
	}
});


$.trainingTable.addEventListener('singletap', function(e){
	e.cancelBubble = true;
	if (e.row != null)
	{
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
	}
});

var current_row;
var hiddenVisible = false;

$.trainingTable.addEventListener('swipe', function(e){
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


function getTrainingDrills(assignment_id)
{
	var tableData = [];
	$.tactivityIndicator.show();

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			json = JSON.parse(this.responseText);
			
			if (json.length != 0)
			{
				var sectionHeader = Ti.UI.createTableViewSection({headerTitle: json["eventDate"], enabled: false});
				tableData.push(sectionHeader);
				
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
				  		imageName = json["drills"][i]["thumb"] + ".png";
				  	}
				  	var defaultView = Ti.UI.createView({
						backgroundColor: '#fff',
						height: Ti.UI.SIZE,
						touchEnabled: false
					});
				  	var diagram = image({image: imageName, height: Ti.UI.SIZE, width: Ti.UI.SIZE, left: 5, touchEnabled: false});
				  	defaultView.add(diagram);
				  	var drillName = Ti.UI.createLabel({touchEnabled: false, text: json["drills"][i]["name"], top: 2, left: 105, width: Ti.UI.SIZE, font: { fontSize:12, fontWeight: 'bold' }});
					defaultView.add(drillName);
					var drillRating = new RatingView(json["drills"][i]["rating"], 5, json["drills"][i]["total_ratings"], 25, 145, true, false);
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
							var strengthCount = json["drills"][i]["strengths"].length-1;
							var strengthAndMore = Ti.UI.createLabel({touchEnabled: false, text: json["drills"][i]["strengths"][0]["name"] + ' and ' + strengthCount.toString() + ' more', top: 50, left: leftOffset, font: { fontSize:8, fontWeight: 'bold'}});
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
			$.trainingTable.setData(tableData);
			$.tactivityIndicator.hide();
			$.trainingTable.visible = true;
		}
	});
		
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignments/nexttraining.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getAdjustmentTypes(assignment_id, role)
{
 	var tableData = [];

	var row = Ti.UI.createTableViewRow({height: 60, hasChild: true, role: role, assignment_id: assignment_id, adjustAction: "prioritise"});
	var prioritise = Ti.UI.createLabel({text: "Prioritise", top: 10, left: 15, font: { fontSize:12, fontWeight: 'bold' }});
	row.add(prioritise);
	var description = Ti.UI.createLabel({text: "Adjust the strengths included in the next training", top: 30, left: 15, font: { fontSize:10}});
	row.add(description);
	tableData.push(row);
	
	var row2 = Ti.UI.createTableViewRow({height: 60, hasChild: true, role: role, assignment_id: assignment_id, adjustAction: "practicePlan"});
	var practicePlan = Ti.UI.createLabel({text: "Practice Plan", top: 10, left: 15, font: { fontSize:12, fontWeight: 'bold' }});
	row2.add(practicePlan);
	var description2 = Ti.UI.createLabel({text: "Select a Practice Plan for the next training", top: 30, left: 15, font: { fontSize:10}});
	row2.add(description2);
	tableData.push(row2);
	
	assessmentTable.setData(tableData);
	
	// add table view to the window
	$.assessmentWin.add(assessmentTable);
	$.assActivityIndicator.hide();
}

var assessedJSON;

function getAssessment(assignment_id, role)
{
	var tableData = [];
	$.assActivityIndicator.show();

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			assessedJSON = JSON.parse(this.responseText);
			
			if (assessedJSON.length != 0)
			{
				focusOnTop = assessedJSON["focusontop"];
				tableData = buildAssessedTable(assessedJSON, focusOnTop);
			}	
			assessmentTable.setData(tableData);
			
			// add table view to the window
			$.assessmentWin.add(assessmentTable);
			$.assActivityIndicator.hide();
		}
	});
		
	xhr.open('GET', webserver+'/development/' + assignment_id + '/development/assessment.json?id=' + assignment_id);
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function buildAssessedTable(assessedJSON, focusOnTop)
{
	var tableData = [];
	var color;
	for (var i=0; i<assessedJSON["assessments"].length; i++)
	{
		if (parseInt(assessedJSON["assessments"][i]["priority"]) <= parseInt(focusOnTop))
		{
			color = '#DFF0D8';
		}
		else
		{
			color = 'white';
		}
		var row = Ti.UI.createTableViewRow({height: 60, role: role, assignment_id: assignment_id, backgroundColor: color, strength: assessedJSON["assessments"][i]["strength"], strengthDescription: assessedJSON["assessments"][i]["description"], summary: assessedJSON["assessments"][i]["summary"], level: assessedJSON["assessments"][i]["level"], assessment: assessedJSON["assessments"][i]["assessment"]});
		
		var strength = Ti.UI.createLabel({text: assessedJSON["assessments"][i]["strength"], top: 20, left: 50, font: { fontSize:12, fontWeight: 'bold' }});
		row.add(strength);
		var description = Ti.UI.createLabel({text: assessedJSON["assessments"][i]["description"], top: 40, left: 50, font: { fontSize:10}});
		row.add(description);
		var performanceImage = Ti.UI.createImageView({image: role=="Coach"?getTeamPerformanceImagePath(assessedJSON["assessments"][i]["level"]):getAthletePerformanceImagePath(assessedJSON["assessments"][i]["level"]), top: 10, left: 10, height:20, width:20, touchEnabled: false});
	  	row.add(performanceImage);
	  	
	  	if (role != "Coach" && assessedJSON["assessments"][i]["summary"] != null && assessedJSON["assessments"][i]["summary"].length > 0)
	  	{
		  	var feedback = Ti.UI.createLabel({text: 'Feedback', top: 40, left: 10, color: 'red', font: { fontSize:6}});
			row.add(feedback);
		}
	  	var assessment = Ti.UI.createLabel({text: assessedJSON["assessments"][i]["assessment"], top: 6, left: 50, font: { fontSize:10, fontWeight: 'bold'}});
		row.add(assessment);
		tableData.push(row);
	}
	return tableData;
}

function postFocusOnTop(id, changedFocusOnTop)
{
	var xhr = Ti.Network.createHTTPClient();
	
	xhr.open('POST', webserver+'/assignments/update_focus_on_top.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	
	var focusOnTopPost = {'assignments[assignment_id]': id, 
		'assignments[focusOnTop]':changedFocusOnTop};
	xhr.send(focusOnTopPost);
}



function getGameDay(assignment_id)
{
	var tableData = [];
	
	$.gactivityIndicator.show();

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
					var eventRow = Ti.UI.createTableViewRow({height: 60, hasChild: true, assignment_id: json[i]["assignment_id"], event_id: json[i]["id"], gameplan: json[i]["gameplan"], debrief: json[i]["debrief"], opponent: json[i]["opponent"], opponent_id: json[i]["opponent_id"]});
					
					var logo = image({image: json[i]["logo"], height: Ti.UI.SIZE, width: Ti.UI.SIZE, left: 5, touchEnabled: false});
				  	eventRow.add(logo);
					var name = Ti.UI.createLabel({text: json[i]["opponent"], touchEnabled: false, top: 15, left: 100, font: { fontSize:14, fontWeight: 'bold' }});
					eventRow.add(name);
					var eventDate = Ti.UI.createLabel({text: json[i]["match_day"], touchEnabled: false, top: 35, left: 100, font: { fontSize:10 }});
					eventRow.add(eventDate);
					tableData.push(eventRow);
				}
			}	
			$.gameDayTable.setData(tableData);
			$.gactivityIndicator.hide();
			$.gameDayTable.visible = true;
		}
	});
		
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignment_events.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getPlayers(assignment_id, role)
{
	var tableData = [];
	
	$.pactivityIndicator.show();
	if (role == "Coach")
	{
		var row = Ti.UI.createTableViewRow({height: 60, touchEnabled: true, assignment_id: assignment_id, inviteRow: true});
		var inviteLabel = Ti.UI.createLabel({text: "Invite Player", touchEnabled: false, hasChild: true, top: 15, left: 100, font: { fontSize:14, fontWeight: 'bold' }});
		row.add(inviteLabel);
		tableData.push(row);
	}

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
			json = JSON.parse(this.responseText);
			
			if (json.length != 0)
			{					
				for (var i=0; i<json["players"].length; i++)
				{
					var row = Ti.UI.createTableViewRow({height: 60, touchEnabled: false});
					var avatarPath = "missing_avatar.png";
					if (json["players"][i]["avatar"] != "missing_avatar.png")
					{
						avatarPath = json["players"][i]["avatar"];
					}
					var avatar = image({image: avatarPath, width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 10});
					row.add(avatar);
					var name = Ti.UI.createLabel({text: json["players"][i]["name"], touchEnabled: false, top: 15, left: 100, font: { fontSize:14, fontWeight: 'bold' }});
					row.add(name);
				}
				tableData.push(row);
				$.playersTable.setData(tableData);
				$.pactivityIndicator.hide();
				$.playersTable.visible = true;
			}	
			else
			{
				var noPlayers = Ti.UI.createLabel({text: "No players have accepted invites", touchEnabled: false, font: { fontSize:12, fontWeight: 'bold' }});
				$.playersWin.add(noPlayers);
			}
		}
	});
		
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignments/players.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}