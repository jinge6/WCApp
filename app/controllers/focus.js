var args = arguments[0] || {};

var assignment_id = args[0];
var strength = args[1];
var json;
var picker;
var includeSlider;
var includeLabel;
var currentPriorityLabel;
var orderedList = [];
var focusOnTop;

getPriorities();

function includeChange()
{
	alert('do something here');
}

function initialise(json)
{
	focusOnTop = json["focusontop"];
	for (var i=0; i<json["assessments"].length; i++)
	{
		orderedList[i] = json["assessments"][i]["strength"];
	}
}

function reorder(movedTo)
{
	var i = 0;
	var j = 0;
	var notOrdered = true;
	orderedList = [];
	
	while (notOrdered)
	{
		if (j == movedTo)
		{
			orderedList[j] = strength;
			j++;
		}
		else if (json["assessments"][i]["strength"] == strength)
		{
			i++;
			continue;
		}
		else
		{
			orderedList[j] = json["assessments"][i]["strength"];
			i++;
			j++;
		}
		notOrdered = (orderedList.length < json["assessments"].length);
	}
	
	for (var i=0; i<orderedList.length; i++)
	{
		console.log(orderedList[i]);
	}
}

function getPriorities()
{
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
			json = JSON.parse(this.responseText);
			initialise(json);
			buildUI(focusOnTop, true);
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
		'assignments[start_position]': start+1,
		'assignments[finish_position]': finish};
	xhr.send(reorderPost);
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

function buildUI(focusOnTop, firstDraw)
{
	var selectedRow = 0;
	
	if (json.length != 0)
	{
		var color;
		var data = [];
		var priorityColumn = Ti.UI.createPickerColumn({width: 5});
		var strengthColumn = Ti.UI.createPickerColumn();

		for (var i=0; i<orderedList.length; i++)
		{
			if (orderedList[i] == strength)
			{
				selectedRow = i;
				
				if (firstDraw)
				{
					includeSlider = Ti.UI.createSlider({
					    top: 50,
					    min: 1,
					    max: orderedList.length,
					    width: '100%',
					    value: focusOnTop
				    });
					includeSlider.addEventListener('touchend', function(e) {
						this.value = Math.round(e.value);
						focusOnTop = Math.round(e.value);
					    includeLabel.text = 'Include top ' + focusOnTop + ' priorities in Training';
					    postFocusOnTop(assignment_id, focusOnTop);
					    buildUI(this.value, false);
					});
					
					includeSlider.addEventListener('change', function(e) {
					    includeLabel.text = 'Include top ' + Math.round(e.value) + ' priorities in Training';
					});
					
					$.focusWin.add(includeSlider);
					
					currentPriorityLabel = Ti.UI.createLabel({text: 'Adjust ' + strength + ' training priority', left: 20, top: 120});
					$.focusWin.add(currentPriorityLabel);
					
					var performanceImage = Ti.UI.createImageView({image: getTeamPerformanceImagePath(json["assessments"][i]["level"]), top: 90, left: 20, height:20, width:20, touchEnabled: false});
				  	$.focusWin.add(performanceImage);
				  	
				  	var currentRating = Ti.UI.createLabel({text: 'Currently rated: ' + json["assessments"][i]["assessment"] + ' level', left: 50, top: 90, font: {fontSize: 10}});
					$.focusWin.add(currentRating);
					
					includeLabel = Ti.UI.createLabel({text: 'Include top ' + focusOnTop, left: 20, top: 30});
					$.focusWin.add(includeLabel);
				}
				else
				{
					currentPriorityLabel.text = 'Adjust ' + strength + ' training priority';
					includeLabel.text = 'Include top ' + focusOnTop+ ' priorities in Training';
				}
			}
			
			if (i < parseInt(focusOnTop))
			{
				includedText = '(included)';
			}
			else 
			{
				includedText = '';
			}
			var priorityRow = Ti.UI.createPickerRow({title:(i+1).toString()});
			var strengthRow = Ti.UI.createPickerRow({title:orderedList[i].toString() + ' ' + includedText, font: {fontSize: 10}, ignore: true});
			priorityColumn.addRow(priorityRow);
			strengthColumn.addRow(strengthRow);				
		}

		
		picker = Ti.UI.createPicker(
			{columns: [priorityColumn, strengthColumn],
			  selectionIndicator: true,
			  useSpinner: true, // required in order to use multi-column pickers with Android
			 });
			 
		picker.addEventListener('change',function(e){
			if (e.columnIndex == 1 && e.rowIndex != selectedRow)
			{
			  	this.setSelectedRow(1, selectedRow, true);
		 	}
		 	if (e.columnIndex == 0 && e.rowIndex != selectedRow)
			{
				postReorderPriority(assignment_id, selectedRow, e.rowIndex);
				selectedRow = e.rowIndex;
				reorder(e.rowIndex);
				buildUI(focusOnTop, false);
		 	}	
		});
		
		$.focusWin.add(picker);
		picker.setSelectedRow(0, selectedRow, false);
		picker.setSelectedRow(1, selectedRow, false);
	}	
}
