var args = arguments[0] || { };

$.activityIndicator.show();
getAssignments();

function goAssignment(e){
	var assignmentDetailWindow = Alloy.createController('assignmentDetail', [e.row.assignment_id, e.row.role, e.row.activity_id]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(assignmentDetailWindow);
	}
	else
	{
		assignmentDetailWindow.open();
	}
};

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
	var videosView = Alloy.createController('videos', [e.assignment_id, e.strength_id]).getView();
	if (Ti.Platform.osname == 'iphone')
	{
		$.navAssignment.openWindow(videosView);
	}
	else
	{
		videosView.open();
	}
});

function getAssignments()
{
	var tableData = [];
	
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			json = JSON.parse(this.responseText);
			
			var sectionName;
			var sectionHeader;
			
			for (var i=0; i<json.length; i++)
			{
				if (sectionName != json[i]["role"])
				{
					if (i != 0)
					{
						tableData.push(sectionHeader);
					}
					sectionHeader = Ti.UI.createTableViewSection({headerTitle: json[i]["role"], height: 30});
					sectionName = json[i]["role"];
				}
				
				var row = Ti.UI.createTableViewRow({className: 'row', height: 80, assignment_id: json[i]["id"], role: json[i]["role"], activity_id: json[i]["activity_id"], hasChild: true});
				var imageName = 'missing_logo.png';
				if ((json[i]["logo_url"]).indexOf("missing_logo.png") == -1)
				{
					imageName = json[i]["logo_url"];
				}
				
				var assignmentLogo = image({image: imageName, left: 15, width: 55, touchEnabled: false});
			  	row.add(assignmentLogo);
				var assignmentName = Ti.UI.createLabel({text: json[i]["name"], top: 10, left: 80, font: { fontSize:12, fontWeight: 'bold' }});
				row.add(assignmentName);
				var assignmentDescription = Ti.UI.createLabel({text: json[i]["description"], top: 25, left: 80, font: { fontSize:10}});
				row.add(assignmentDescription);
				var assignmentStartDate = Ti.UI.createLabel({text: 'Start: ' + json[i]["startDate"], top: 50, left: 80, font: { fontSize:8}});
				row.add(assignmentStartDate);
				var assignmentEndDate = Ti.UI.createLabel({text: 'End: ' + json[i]["endDate"], top: 60, left: 80, font: { fontSize:8}});
				row.add(assignmentEndDate);
			  	sectionHeader.add(row);	
			}	
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