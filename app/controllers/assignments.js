var args = arguments[0] || { };
var invitesJSON;
var is_member = false;
var tableData = [];

$.activityIndicator.show();
getAssignments();

if (Ti.Platform.osname == 'iphone')
{
	var pullRefreshControl = Ti.UI.createRefreshControl();
	pullRefreshControl.addEventListener('refreshstart',function(e){
	    setTimeout(function(){
	        getAssignments();
	        pullRefreshControl.endRefreshing();
	    }, 2000);
	});
	$.trainingTable.refreshControl = pullRefreshControl;
}

function androidRefresh(e)
{
	getAssignments();
	$.ptr.hide();
}


function goAssignment(e){
	if (is_member == false && e.row.role != "invite")
	{
		alert('Please renew your membership to access this feature');
	}
	else if (e.row.role == "browse")
	{
		var activityView = Alloy.createController('activities').getView();
		if (Ti.Platform.osname == 'iphone')
		{
			$.navAssignment.openWindow(activityView);
		}
		else
		{
			activityView.open();
		}
	}
	else if (e.row.role == "builder")
	{
		var builderView = Alloy.createController('builder').getView();
		if (Ti.Platform.osname == 'iphone')
		{
			$.navAssignment.openWindow(builderView);
		}
		else
		{
			builderView.open();
		}
	}
	else if (e.row.role == "invite")
	{
		if (invitesJSON.length == 1)
		{
			showInviteDetail(invitesJSON[0]);
		}
		else
		{
			var invitesView = Alloy.createController('invites', [invitesJSON]).getView();
			if (Ti.Platform.osname == 'iphone')
			{
				$.navAssignment.openWindow(invitesView);
			}
			else
			{
				invitesView.open();
			}
		}
	}
	else
	{
		var assignmentDetailWindow = Alloy.createController('assignmentDetail', [e.row.assignment_id, e.row.role, e.row.activity_id]).getView();
		if (Ti.Platform.osname == 'iphone')
		{
			$.navAssignment.openWindow(assignmentDetailWindow);
		}
		else
		{
			assignmentDetailWindow.open();
		}
	}
};

function showInviteDetail(inviteDetail)
{
	var inviteDetailView = Alloy.createController('inviteDetail', [inviteDetail]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(inviteDetailView);
	}
	else
	{
		inviteDetailView.open();
	}
}

//add behavior for goInviteDetail
Ti.App.addEventListener('goInviteDetail', function(e) {
	showInviteDetail(e.row.inviteDetail);
});

//add behavior to refresh home screen
Ti.App.addEventListener('refreshAssignments', function(e) {
	getAssignments();
});

//add behavior for goActivityDetail
Ti.App.addEventListener('goActivityDetail', function(e) {
	var activityDetailWindow = Alloy.createController('activityDetail', [e.activity_id]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(activityDetailWindow);
	}
	else
	{
		activityDetailWindow.open();
	}
});

//add behavior for goInviteAthlete
Ti.App.addEventListener('goInviteAthlete', function(e) {
	var inviteAthleteWindow = Alloy.createController('inviteAthlete', [e.assignment_id]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(inviteAthleteWindow);
	}
	else
	{
		inviteAthleteWindow.open();
	}
});

//add behavior for goAssessments
Ti.App.addEventListener('goAssessment', function(e) {
	var assessmentView = Alloy.createController('assessment', [e.strength, e.strengthDescription, e.level, e.summary, e.assessment]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(assessmentView);
	}
	else
	{
		assessmentView.open();
	}
});

//add behavior for goEventDetail
Ti.App.addEventListener('showEventDetail', function(e) {
	var eventDetailView = Alloy.createController('eventDetail', [e.event_id, e.gameplan, e.debrief, e.opponent, e.assignment_id, e.opponent_id]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(eventDetailView);
	}
	else
	{
		eventDetailView.open();
	}
});

//add behavior for showEventBreakdown
Ti.App.addEventListener('showEventBreakdown', function(e) {
	var eventDetailBreakdownView = Alloy.createController('eventBreakdown', [e.title, e.summary]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(eventDetailBreakdownView);
	}
	else
	{
		eventDetailBreakdownView.open();
	}
});

//add behavior for showEventTeam
Ti.App.addEventListener('showEventTeam', function(e) {
	var eventTeamView = Alloy.createController('eventTeam', [e.event_id, e.opponent, e.assignment_id]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(eventTeamView);
	}
	else
	{
		eventTeamView.open();
	}
});

//add behavior for showEventStats
Ti.App.addEventListener('showEventStats', function(e) {
	var eventStatsView = Alloy.createController('eventStats', [e.event_id, e.assignment_id]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(eventStatsView);
	}
	else
	{
		eventStatsView.open();
	}
});

//add behavior for showEventStats
Ti.App.addEventListener('showOppositionScouting', function(e) {
	var opponentView = Alloy.createController('opponent', [e.assignment_id, e.opponent_id]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(opponentView);
	}
	else
	{
		opponentView.open();
	}
});

//add behavior for goFocus
Ti.App.addEventListener('goFocus', function(e) {
		var focusView = Alloy.createController('focus', [e.assignment_id, e.strength]).getView();
		
		if (Ti.Platform.osname == 'iphone')
		{
			$.navAssignment.openWindow(focusView);
		}
		else
		{
			focusView.open();
		}
});

//add behavior for goPrioritise
Ti.App.addEventListener('goPrioritise', function(e) {
		var prioritiseView = Alloy.createController('trainingAdjust', [e.assignment_id]).getView();
		
		if (Ti.Platform.osname == 'iphone')
		{
			$.navAssignment.openWindow(prioritiseView);
		}
		else
		{
			prioritiseView.open();
		}
});

//add behavior for goTrainingAdjust
Ti.App.addEventListener('goTrainingAdjust', function(e) {
		var trainingAdjustView = Alloy.createController('trainingAdjust', [e.assignment_id]).getView();
		
		if (Ti.Platform.osname == 'iphone')
		{
			$.navAssignment.openWindow(trainingAdjustView);
		}
		else
		{
			trainingAdjustView.open();
		}
});

//add behavior for goPracticePlan
Ti.App.addEventListener('goPracticePlan', function(e) {
		var practicePlanView = Alloy.createController('practicePlan', [e.assignment_id]).getView();
		
		if (Ti.Platform.osname == 'iphone')
		{
			$.navAssignment.openWindow(practicePlanView);
		}
		else
		{
			practicePlanView.open();
		}
});

//add behavior for goDrills
Ti.App.addEventListener('goDrills', function(e) {
	var drillsView = Alloy.createController('drills').getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(drillsView);
	}
	else
	{
		drillsView.open();
	}
});

//add behavior for showing drills
Ti.App.addEventListener('showDrill', function(e) {
	var drillView = Alloy.createController('drill', [e.drill_id]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(drillView);
	}
	else
	{
		drillView.open();
	}
});

//add behavior for showing drills
Ti.App.addEventListener('showDrillBrowse', function(e) {
	var drillView = Alloy.createController('drillBrowse', [e.strength_id, e.role, e.assignment_id, e.activity_id]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(drillView);
	}
	else
	{
		drillView.open();
	}
});

//add behavior for goVideos
Ti.App.addEventListener('goVideos', function(e) {
	var videosView = Alloy.createController('videos', [e.activity_id, e.strength_id]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(videosView);
	}
	else
	{
		videosView.open();
	}
});

function getInvites()
{
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
			console.log(this.responseText);
			return this.responseText;
		}
	});
		
	xhr.open('GET', webserver+'/invites.json?email='+Ti.App.Properties.getString('email'));
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getAssignments()
{
	tableData = [];
	var sectionName;
	var sectionHeader;
	
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			json = JSON.parse(this.responseText);
			
			is_member = json["is_member"];
			
			if (json["invites"].length > 0)
			{
				invitesJSON = json["invites"];
				// Only add the invites row if there are invites
				sectionHeader = Ti.UI.createTableViewSection({headerTitle: "Invites", height: 30});
			
				var row = Ti.UI.createTableViewRow({className: 'row', height: 80, role: "invite", hasChild: true});
				var imageName = 'missing_logo.png';
				var wcLogo = image({image: imageName, left: 15, width: 55, touchEnabled: false});
			  	row.add(wcLogo);
			  	var inviteText;
			  	if (json["invites"].length == 1)
			  	{
			  		inviteText = "You have " + json["invites"].length + " invite";
			  	}
			  	else
			  	{
			  		inviteText = "You have " + json["invites"].length + " invites";
			  	}
				var invitesName = Ti.UI.createLabel({color: "#000", text: inviteText, top: 30, left: 80, font: { fontSize:12, fontWeight: 'bold' }});
				row.add(invitesName);
			  	sectionHeader.add(row);	
			  	tableData.push(sectionHeader);
			  	sectionHeader = null;
			}

			for (var i=0; i<json["assignments"].length; i++)
			{
				if (sectionName != json["assignments"][i]["role"])
				{
					if (i != 0)
					{
						tableData.push(sectionHeader);
					}
					sectionHeader = Ti.UI.createTableViewSection({headerTitle: json["assignments"][i]["role"], height: 30});
					sectionName = json["assignments"][i]["role"];
				}
				
				var row = Ti.UI.createTableViewRow({className: 'row', height: 80, assignment_id: json["assignments"][i]["id"], role: json["assignments"][i]["role"], activity_id: json["assignments"][i]["activity_id"], hasChild: true});
				var imageName = 'missing_logo.png';
				if ((json["assignments"][i]["logo_url"]).indexOf("missing_logo.png") == -1)
				{
					imageName = json["assignments"][i]["logo_url"];
				}
				
				var assignmentLogo = image({image: imageName, left: 15, width: 55, touchEnabled: false});
			  	row.add(assignmentLogo);
				var assignmentName = Ti.UI.createLabel({color: "#000", text: json["assignments"][i]["name"], top: 20, left: 80, font: { fontSize:12, fontWeight: 'bold' }});
				row.add(assignmentName);
				var assignmentStartDate = Ti.UI.createLabel({color: "#000", text: 'Start: ' + json["assignments"][i]["startDate"], top: 40, left: 80, font: { fontSize:8}});
				row.add(assignmentStartDate);
				var assignmentEndDate = Ti.UI.createLabel({color: "#000", text: 'End: ' + json["assignments"][i]["endDate"], top: 50, left: 80, font: { fontSize:8}});
				row.add(assignmentEndDate);
			  	sectionHeader.add(row);	
			}

			if (sectionHeader != null)
			{
				// Add assignments if they existed
				tableData.push(sectionHeader);
			}
			// Always add the activity browse row
			sectionHeader = Ti.UI.createTableViewSection({headerTitle: "Browse Sports", height: 30});

			var row = Ti.UI.createTableViewRow({className: 'row', height: 80, role: "browse", hasChild: true});
			var imageName = 'missing_logo.png';
			var wcLogo = image({image: imageName, left: 15, width: 55, touchEnabled: false});
		  	row.add(wcLogo);
			var goToName = Ti.UI.createLabel({color: "#000", text: "Drill Library", top: 30, left: 80, font: { fontSize:12, fontWeight: 'bold' }});
			row.add(goToName);
		  	sectionHeader.add(row);	
		  	tableData.push(sectionHeader);
		  	
		  	// Always add the Training Session Builder row
			sectionHeader = Ti.UI.createTableViewSection({headerTitle: "Training Session Builder", height: 30});

			var row = Ti.UI.createTableViewRow({className: 'row', height: 80, role: "builder", hasChild: true});
			var imageName = 'missing_logo.png';
			var wcLogo = image({image: imageName, left: 15, width: 55, touchEnabled: false});
		  	row.add(wcLogo);
			var goToName = Ti.UI.createLabel({color: "#000", text: "Create Training Session", top: 30, left: 80, font: { fontSize:12, fontWeight: 'bold' }});
			row.add(goToName);
		  	sectionHeader.add(row);	
		  	tableData.push(sectionHeader);
			
			$.trainingTable.setData(tableData);
			$.activityIndicator.hide();
			$.trainingTable.show();
		}
	});
		
	xhr.open('GET', webserver+'/assignments.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getMoveableImages()
{
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	json = JSON.parse(this.responseText);
			
			if (json["stamp"] != Ti.App.Properties.getString('stamp'))
			{
				// check that we have room on the file system
				var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory);
				
				var freeBytes = dir.spaceAvailable();
				
				if (freeBytes > parseInt(json["total_bytes"]))
				{
					// create the new directory
					var imageDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,            
					    json["stamp"]);
					if (! imageDir.exists()) {
					    imageDir.createDirectory();
					}
					
					// read each name and path, create the file, resize it
					for (var i=0; i<json["moveables"].length; i++)
					{
						console.log(json["moveables"][i]["name"]);
						console.log(json["moveables"][i]["path"]);
					}
					// if that has all gone well then lets update the stamp property so we start reading from a different folder
				}
				else
				{
					alert('WinnersCircle does not have enough space to store required images. json["total_bytes"] btyes required.');
				}
			}
		}
	});
		
	xhr.open('GET', webserver+'/welcome/moveable_images.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}