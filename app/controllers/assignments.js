var args = arguments[0] || { };

getCoachingAssignments();
getTrainingAssignments();

function prettyDate(dateString) {
  var day, formatted, jsDate, month;

  jsDate = new Date(dateString);
  day = jsDate.getMonth() + 1 < 10 ? "0" + (jsDate.getMonth() + 1) : "" + (jsDate.getMonth() + 1);
  month = jsDate.getDate() < 10 ? "0" + (jsDate.getDate()) : "" + (jsDate.getDate());

  formatted = "" + day + "/" + month + "/" + (jsDate.getFullYear());
  return formatted;
};

function goAssignment(e){
	if (e.source == 1)
	{
		var trainingWindow = Alloy.createController('training', e.rowData.assignment_id).getView();
		$.navAssignment.openWindow(trainingWindow);
	}
	else
	{
		var coachingWindow = Alloy.createController('coaching', e.rowData.assignment_id).getView();
		$.navAssignment.openWindow(coachingWindow);
	}
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

//add behavior for goTraining
Ti.App.addEventListener('goTraining', function(e) {
	var trainingView = Alloy.createController('training', [e.rowData.assignment_id, e.rowData.strength]).getView();
	$.navAssignment.openWindow(trainingView);
});

//add behavior for goVideos
Ti.App.addEventListener('goVideos', function(e) {
	var videosView = Alloy.createController('videos', [e.assignment_id, e.strength_id]).getView();
	$.navAssignment.openWindow(videosView);
});

function getCoachingAssignments()
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
			
			for (var i=0; i<json.length; i++)
			{
				var row = Ti.UI.createTableViewRow({className: 'row', height: 80, assignment_id: json[i]["id"], hasChild: true});
				
				var sectionHeader = Ti.UI.createTableViewSection({headerTitle: 'Coaching', height: 30});
				var assignmentLogo = Ti.UI.createImageView({image: json[i]["logo_url"], left: 15});
			  	row.add(assignmentLogo);
				var assignmentName = Ti.UI.createLabel({text: json[i]["name"], top: 10, left: 80, font: { fontSize:12, fontWeight: 'bold' }});
				row.add(assignmentName);
				var assignmentDescription = Ti.UI.createLabel({text: json[i]["description"], top: 25, left: 80, font: { fontSize:10}});
				row.add(assignmentDescription);
				var assignmentStartDate = Ti.UI.createLabel({text: 'Start: ' + prettyDate(json[i]["startDate"]), top: 60, left: 80, font: { fontSize:8}});
				row.add(assignmentStartDate);
				var assignmentEndDate = Ti.UI.createLabel({text: 'End: ' + prettyDate(json[i]["endDate"]), top: 60, left: 160, font: { fontSize:8}});
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

function getTrainingAssignments()
{
	var tableData = [];

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			json = JSON.parse(this.responseText);
			
			for (var i=0; i<json.length; i++)
			{
				var row = Ti.UI.createTableViewRow({className: 'row', height: 80, assignment_id: json[i]["id"], hasChild: true});
				
				var sectionHeader = Ti.UI.createTableViewSection({headerTitle: 'Athlete', height: 30});
				var assignmentName = Ti.UI.createLabel({text: json[i]["name"], top: 10, left: 80, font: { fontSize:12, fontWeight: 'bold' }});
				row.add(assignmentName);
				var assignmentDescription = Ti.UI.createLabel({text: json[i]["description"], top: 25, left: 80, font: { fontSize:10}});
				row.add(assignmentDescription);
				var assignmentStartDate = Ti.UI.createLabel({text: 'Start: ' + prettyDate(json[i]["startDate"]), top: 60, left: 80, font: { fontSize:8}});
				row.add(assignmentStartDate);
				var assignmentEndDate = Ti.UI.createLabel({text: 'End: ' + prettyDate(json[i]["endDate"]), top: 60, left: 160, font: { fontSize:8}});
				row.add(assignmentEndDate);
			  	var assignmentLogo = Ti.UI.createImageView({image: json[i]["logo_url"], left: 15});
			  	row.add(assignmentLogo);
			  	sectionHeader.add(row);
			  	
			  	tableData.push(sectionHeader);
			}	
			$.trainingTable.appendSection(tableData);
		}
	});
		
	xhr.open('GET','http://localhost:3000/development.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}