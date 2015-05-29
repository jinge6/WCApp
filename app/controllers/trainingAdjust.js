var args = arguments[0] || {};
var assignment_id = args[0];
var prioritiesTable = Titanium.UI.createTableView();

//getTrainingPriorities(assignment_id);

$.trainingAdjustWin.addEventListener('focus', function() {
    getTrainingPriorities(assignment_id);
 });

prioritiesTable.addEventListener('click', function(e){
	Ti.App.fireEvent('goFocus',{assignment_id: e.rowData.assignment_id, strength: e.rowData.strength});

});

function getTrainingPriorities(assignment_id)
{
	var tableData = [];
	$.activityIndicator.show();

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];
			var prioritiesJSON = JSON.parse(this.responseText);
			
			if (prioritiesJSON.length != 0)
			{
				focusOnTop = prioritiesJSON["focusontop"];
				tableData = buildPrioritiesTable(prioritiesJSON, focusOnTop);
			}	
			prioritiesTable.setData(tableData);

			prioritiesTable.top = 100;
			includeLabel = Ti.UI.createLabel({text: 'Include top ' + focusOnTop + ' priorities in Training', left: 20, top: 30});
			includeSlider = Ti.UI.createSlider({
				    top: 50,
				    min: 1,
				    max: tableData.length,
				    width: '100%',
				    value: focusOnTop
			    });
			includeSlider.addEventListener('touchend', function(e) {
				this.value = Math.round(e.source.value);
				focusOnTop = Math.round(e.source.value);
			    includeLabel.text = 'Include top ' + focusOnTop + ' priorities in Training';
			    postFocusOnTop(assignment_id, focusOnTop);
			    tableData = buildAssessedTable(prioritiesJSON, this.value);
			    prioritiesTable.setData(tableData);
			});
			
			includeSlider.addEventListener('change', function(e) {
			    includeLabel.text = 'Include top ' + Math.round(e.source.value) + ' priorities in Training';
			});
			
			$.trainingAdjustWin.add(includeLabel);
			$.trainingAdjustWin.add(includeSlider);

			// add table view to the window
			$.trainingAdjustWin.add(prioritiesTable);
			$.activityIndicator.hide();
		}
	});
		
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignments/focus.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function buildPrioritiesTable(prioritiesJSON, focusOnTop)
{
	var tableData = [];
	var color;
	for (var i=0; i<prioritiesJSON["assessments"].length; i++)
	{
		if (parseInt(prioritiesJSON["assessments"][i]["priority"]) <= parseInt(focusOnTop))
		{
			color = '#DFF0D8';
		}
		else
		{
			color = 'white';
		}
		var row = Ti.UI.createTableViewRow({height: 60, assignment_id: assignment_id, backgroundColor: color, strength: prioritiesJSON["assessments"][i]["strength"], strengthDescription: prioritiesJSON["assessments"][i]["description"], summary: prioritiesJSON["assessments"][i]["summary"], level: prioritiesJSON["assessments"][i]["level"], assessment: prioritiesJSON["assessments"][i]["assessment"]});
		
		var strength = Ti.UI.createLabel({text: prioritiesJSON["assessments"][i]["strength"], top: 20, left: 50, font: { fontSize:12, fontWeight: 'bold' }});
		row.add(strength);
		var description = Ti.UI.createLabel({text: prioritiesJSON["assessments"][i]["description"], top: 40, left: 50, font: { fontSize:10}});
		row.add(description);
		var performanceImage = Ti.UI.createImageView({image: getTeamPerformanceImagePath(prioritiesJSON["assessments"][i]["level"]), top: 10, left: 10, height:20, width:20, touchEnabled: false});
	  	row.add(performanceImage);
	  	
	  	var assessment = Ti.UI.createLabel({text: prioritiesJSON["assessments"][i]["assessment"], top: 6, left: 50, font: { fontSize:10, fontWeight: 'bold'}});
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