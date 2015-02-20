var args = arguments[0] || {};

// args contains the assignment_id we are dealing with
var assignment_id = args;

$.assessmentTab.addEventListener('focus', function(e){
    getAssessment(assignment_id);
});

$.nextTrainingTab.addEventListener('focus', function(e){
    getTrainingDrills(assignment_id);
});

function goAssessment(e){
	getAssessment(assignment_id);
};

function goTraining(e){
	Ti.App.fireEvent('goTraining',e);
};

function goDrills(e){
	Ti.App.fireEvent('goDrills',e);
};

function goVideos(e){
	Ti.App.fireEvent('goVideos',e);
};

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
					var row = Ti.UI.createTableViewRow({height: 80});
					var drillName = Ti.UI.createLabel({text: json["drills"][i]["name"], top: 5, left: 80, font: { fontSize:12, fontWeight: 'bold' }});
					row.add(drillName);
					var drillDescription = Ti.UI.createTextArea({value: json["drills"][i]["description"], top: 20, left: 80, font: { fontSize:10}, width: 210, height : 50});
					row.add(drillDescription);
					tableData.push(row);
				}
			}	
			$.trainingTable.setData(tableData);
		}
	});
		
	xhr.open('GET','http://localhost:3000/assignments/' + assignment_id + '/assignments/nexttraining.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function getAssessment(assignment_id)
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
				for (var i=0; i<json["assessments"].length; i++)
				{
					var sectionHeader = Ti.UI.createTableViewSection({headerTitle: json["assessments"][i]["strength"]});
					tableData.push(sectionHeader);
					var row = Ti.UI.createTableViewRow({height: 40});
					var assessment = Ti.UI.createLabel({text: json["assessments"][i]["assessment"], top: 5, left: 80, font: { fontSize:12, fontWeight: 'bold' }});
					row.add(assessment);
					tableData.push(row);
				}
			}	
			$.assessmentTable.setData(tableData);
		}
	});
		
	xhr.open('GET','http://localhost:3000/assignments/' + assignment_id + '/assignments/focus.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}