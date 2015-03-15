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
	Ti.App.fireEvent('goAssessment',{summary: e.rowData.summary, strength: e.rowData.strength, strengthDescription: e.rowData.strengthDescription, level: e.rowData.level, assessment: e.rowData.assessment});
});

$.videoCategoriesTable.addEventListener('click', function(e){
	Ti.App.fireEvent('goVideos',{assignment_id: e.rowData.assignment_id, strength_id: e.rowData.strength_id, activity_id: activity_id});
});

$.trainingTable.addEventListener('click', function(e){
	Ti.App.fireEvent('showDrill',{drill_id: e.rowData.drill_id});
});

$.drillsTable.addEventListener('click', function(e){
	Ti.App.fireEvent('showDrillBrowse',{strength_id: e.rowData.strength_id, role: role, assignment_id: assignment_id, activity_id: activity_id});
});

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
				  	var diagram = Ti.UI.createImageView({image: imageName, left: 5, touchEnabled: false});
				  	row.add(diagram);
					var drillName = Ti.UI.createLabel({text: json["drills"][i]["name"], top: 10, left: 105, font: { fontSize:12, fontWeight: 'bold' }});
					row.add(drillName);
					var leftOffset = 110;
					for (var j=0; j<json["drills"][i]["strengths"].length; j++)
					{
						var color = getPerformanceColor(json["drills"][i]["strengths"][j]["performance_id"]);
						var strength = Ti.UI.createTextArea({value: json["drills"][i]["strengths"][j]["name"], top: 40, borderRadius: 3, textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER, left: leftOffset, color: 'white', font: { fontSize:10, fontWeight: 'bold'}, backgroundColor: color});
						row.add(strength);
						leftOffset += 100;
					}
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
					var row = Ti.UI.createTableViewRow({height: 60, moveable: (role == "Coach"), hasChild: (role != "Coach"), backgroundColor: color, strength: json["assessments"][i]["strength"], strengthDescription: json["assessments"][i]["description"], summary: json["assessments"][i]["summary"], level: json["assessments"][i]["level"], assessment: json["assessments"][i]["assessment"]});
					
					var strength = Ti.UI.createLabel({text: json["assessments"][i]["strength"], top: 20, left: 50, font: { fontSize:12, fontWeight: 'bold' }});
					row.add(strength);
					var description = Ti.UI.createLabel({text: json["assessments"][i]["description"], top: 40, left: 50, font: { fontSize:10}});
					row.add(description);
					var performanceImage = Ti.UI.createImageView({image: getPerformanceImagePath(json["assessments"][i]["level"]), top: 6, left: 5, touchEnabled: false});
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
		
	if (role == "coach")
	{
		
		xhr.open('GET','http://localhost:3000/assignments/' + assignment_id + '/assignments/focus.json');
	}
	else
	{
		assessmentTable.moveable = false;
		xhr.open('GET','http://localhost:3000/development/' + assignment_id + '/development/assessment.json?id=' + assignment_id);
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
		
	xhr.open('GET','http://localhost:3000/activities/' + assignment_id + '/strengths.json');
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
		
	xhr.open('GET','http://localhost:3000/activities/' + assignment_id + '/strengths.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}