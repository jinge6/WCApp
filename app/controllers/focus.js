var args = arguments[0] || {};

var assignment_id = args[0];
var strength = args[1];
var json;
var currentPriorityLabel;
var currentPriority;
var updatedPriority;
var orderedList = [];

getPriorities();

function initialise(json)
{
	focusOnTop = json["focusontop"];
	for (var i=0; i<json["assessments"].length; i++)
	{
		orderedList[i] = json["assessments"][i]["strength"];
	}
}

function getPriorities()
{
	$.activityIndicator.show();
	
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
			json = JSON.parse(this.responseText);
			initialise(json);
			buildUI();
			$.activityIndicator.hide();
		}
	});
	
	xhr.open('GET', webserver+'/assignments/' + assignment_id + '/assignments/focus.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function postReorderPriority(id, start, finish)
{
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
			json = JSON.parse(this.responseText);
		}
	});
	
	xhr.open('POST', webserver+'/assignments/update_row_order.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	
	var reorderPost = {'assignments[assignment_id]': id, 
		'assignments[start_position]': start,
		'assignments[finish_position]': finish+1};
	xhr.send(reorderPost);
}



function buildUI()
{
	var selectedRow = 0;
	
	if (json.length != 0)
	{
		for (var i=0; i<orderedList.length; i++)
		{
			if (orderedList[i] == strength)
			{
				currentPriority = i+1;
				updatedPriority = i+1;

				currentPriorityLabel = Ti.UI.createLabel({color: "#000", text: 'Adjust ' + strength + ' training priority', left: 20, top: 30});
				$.focusWin.add(currentPriorityLabel);
				
				var performanceImage = Ti.UI.createImageView({image: getTeamPerformanceImagePath(json["assessments"][i]["level"]), top: 90, left: 20, height:20, width:20, touchEnabled: false});
			  	$.focusWin.add(performanceImage);
			  	
			  	var currentRating = Ti.UI.createLabel({color: "#000", text: 'Currently rated: ' + json["assessments"][i]["assessment"] + ' level', left: 50, top: 90, font: {fontSize: 10}});
				$.focusWin.add(currentRating);
			}				
		}

		var prioritySlider = Ti.UI.createSlider({
			    top: 180,
			    min: 1,
			    max: orderedList.length,
			    width: '100%',
			    value: currentPriority
		    });
				    
		prioritySlider.addEventListener('touchend', function(e) {
			this.value = Math.round(e.source.value);
		    newPriority.text = 'New Priority ' + this.value;
		    postReorderPriority(assignment_id, updatedPriority, this.value);
		    updatedPriority = this.value;
		});
		
		prioritySlider.addEventListener('change', function(e) {
		    newPriority.text = 'New Priority ' + Math.round(e.source.value);
		});
		var startingPriority = Ti.UI.createLabel({color: "#000", text: 'Current Priority ' + currentPriority, left: 20, top: 120});
		var newPriority = Ti.UI.createLabel({color: "#000", text: 'New Priority ' + updatedPriority, left: 20, top: 150});
		
		$.focusWin.add(startingPriority);
		$.focusWin.add(newPriority);
		$.focusWin.add(prioritySlider);
	}	
}
