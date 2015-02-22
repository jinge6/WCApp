var args = arguments[0] || { };

getAssignments();

function goAssignment(e){
	var assignmentDetailWindow = Alloy.createController('assignmentDetail', e.rowData.assignment_id).getView();
	$.navAssignment.openWindow(assignmentDetailWindow);
};

//add behavior for goAssessments
Ti.App.addEventListener('goAssessments', function(e) {
	var assessmentView = Alloy.createController('assessment').getView();
	$.navAssignment.openWindow(assessmentView);
});

//add behavior for goDrills
Ti.App.addEventListener('goDrills', function(e) {
	var drillsView = Alloy.createController('drills').getView();
	$.navAssignment.openWindow(drillsView);
});

//add behavior for showing drills
Ti.App.addEventListener('showDrill', function(e) {
	var drillView = Alloy.createController('drill', [e.drill_id]).getView();
	$.navAssignment.openWindow(drillView);
});

//add behavior for showing drills
Ti.App.addEventListener('showDrillBrowse', function(e) {
	var drillView = Alloy.createController('drillBrowse', [e.strength_id]).getView();
	$.navAssignment.openWindow(drillView);
});

//add behavior for goVideos
Ti.App.addEventListener('goVideos', function(e) {
	var videosView = Alloy.createController('videos', [e.assignment_id, e.strength_id]).getView();
	$.navAssignment.openWindow(videosView);
});

function getAssignments()
{
	var tableData = [];
	
	var credentials = {
				email: Ti.App.Properties.getString('email'),
				auth_token: Ti.App.Properties.getString('auth_token')
		};

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
				var row = Ti.UI.createTableViewRow({className: 'row', height: 80, assignment_id: json[i]["id"], hasChild: true});
				
				if (sectionName != json[i]["role"])
				{
					sectionHeader = Ti.UI.createTableViewSection({headerTitle: json[i]["role"], height: 30});
					sectionName = json[i]["role"];
				}
				
				var assignmentLogo = Ti.UI.createImageView({image: json[i]["logo_url"], left: 15});
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
		
	xhr.open('GET','http://localhost:3000/assignments.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}