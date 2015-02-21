var args = arguments[0] || {};

// args contains the assignment_id we are dealing with
var assignment_id = args;

$.assessmentTab.addEventListener('focus', function(e){
    getAssessment(assignment_id);
});

$.nextTrainingTab.addEventListener('focus', function(e){
    getTrainingDrills(assignment_id);
});

$.videosTab.addEventListener('focus', function(e){
    getVideoCategories(assignment_id);
});

function goAssessment(e){
	Ti.App.fireEvent('goAssessment',e);
};

function goTraining(e){
	Ti.App.fireEvent('goTraining',e);
};

function goDrills(e){
	Ti.App.fireEvent('goDrills',e);
};

$.videoCategoriesTable.addEventListener('click', function(e){
	Ti.App.fireEvent('goVideos',{assignment_id: e.rowData.assignment_id, strength_id: e.rowData.strength_id});
});

$.trainingTable.addEventListener('click', function(e){
	Ti.App.fireEvent('showDrill',{drill_id: e.rowData.drill_id});
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
				  	var diagram = Ti.UI.createImageView({image: imageName, left: 5});
				  	row.add(diagram);
					var drillName = Ti.UI.createLabel({text: json["drills"][i]["name"], top: 5, left: 105, font: { fontSize:12, fontWeight: 'bold' }});
					row.add(drillName);
					var concatStrengths = null;
					for (var j=0; j<json["drills"][i]["strengths"].length; j++)
					{
						if (concatStrengths != null)
						{
							concatStrengths = concatStrengths + ' | ' + json["drills"][i]["strengths"][j]["name"];
						}
						else
						{
							concatStrengths = json["drills"][i]["strengths"][j]["name"];
						}
						
					}
					var strengths = Ti.UI.createLabel({text: concatStrengths, top: 20, left: 105, font: { fontSize:10 }});
					row.add(strengths);
					
					var drillDescription = Ti.UI.createTextArea({value: json["drills"][i]["description"], top: 32, left: 105, font: { fontSize:10}, width: 210, height : 50});
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
					var row = Ti.UI.createTableViewRow({height: 60});
					var color;
					if (json["assessments"][i]["level"] == "1")
					{
						color = "#FF1919";
					}
					else if(json["assessments"][i]["level"] == "2")
					{
						color = "#FFA319";
					}
					else
					{
						color = "#33AD33";
					}
					var strength = Ti.UI.createLabel({text: json["assessments"][i]["strength"], top: 10, left: 20, font: { fontSize:12, fontWeight: 'bold' }});
					row.add(strength);
					var description = Ti.UI.createLabel({text: json["assessments"][i]["description"], top: 35, left: 20, font: { fontSize:10}});
					row.add(description);
					var assessment = Ti.UI.createLabel({text: json["assessments"][i]["assessment"], top: 25, left: 200, color: 'white', font: { fontSize:10}, backgroundColor: color});
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