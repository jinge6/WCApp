var args = arguments[0] || {};

var assignment_id = args[0];
var practicePlanTable = Titanium.UI.createTableView();

getTrainingpracticePlans(assignment_id);

practicePlanTable.addEventListener('click', function(e) 
{
    if(e.source.practicePlanID != null) {
        postUsePracticePlan(e.source.practicePlanID);
        alert('Next training session has been updated');
    }
});

function getTrainingpracticePlans(assignment_id)
{
	var tableData = [];
	$.activityIndicator.show();

	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];
			var practicePlanJSON = JSON.parse(this.responseText);
			
			if (practicePlanJSON["practiceplans"].length != 0)
			{
				for (var i=0; i<practicePlanJSON["practiceplans"].length; i++)
				{
					var row = Ti.UI.createTableViewRow({height: 60, assignment_id: assignment_id, practice_plan_id: practicePlanJSON["practiceplans"][i]["id"]});
					var practicePlan = Ti.UI.createLabel({text: practicePlanJSON["practiceplans"][i]["name"], top: 25, left: 15, font: { fontSize:12, fontWeight: 'bold' }});
					row.add(practicePlan);
					
					var button = Titanium.UI.createButton({
					   title: 'Add',
					   top: 15,
					   width: 100,
					   height: 40,
					   left: 220,
					   practicePlanID: practicePlanJSON["practiceplans"][i]["id"]
					});
					row.add(button);
					
					tableData.push(row);
				}
				practicePlanTable.setData(tableData);
				// add table view to the window
				$.practicePlanWin.add(practicePlanTable);
			}
			else
			{
				var noPracticePlansLabel = Ti.UI.createLabel({text: "No practice plans created yet!", top: 160, font: { fontSize:12}});
				$.practicePlanWin.add(noPracticePlansLabel);	
			}	
			
			$.activityIndicator.hide();
		}
	});
		
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignments/assignment_practice_plans.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function postUsePracticePlan(id)
{
	var xhr = Ti.Network.createHTTPClient();
	
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignments/practiceplan.json?practice_plan_id=' + id + '&do_action=copy');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));

	xhr.send();
}