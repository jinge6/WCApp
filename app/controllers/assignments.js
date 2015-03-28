var args = arguments[0] || { };

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
	$.navAssignment.openWindow(assessmentView);
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
				var row = Ti.UI.createTableViewRow({className: 'row', height: 80, assignment_id: json[i]["id"], role: json[i]["role"], activity_id: json[i]["activity_id"], hasChild: true});
				
				if (sectionName != json[i]["role"])
				{
					sectionHeader = Ti.UI.createTableViewSection({headerTitle: json[i]["role"], height: 30});
					sectionName = json[i]["role"];
				}
				
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
			  	
			  	tableData.push(sectionHeader);
			}	
			$.trainingTable.setData(tableData);
		}
	});
		
	xhr.open('GET', webserver+'/assignments.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}