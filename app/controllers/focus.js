var args = arguments[0] || {};

var assignment_id = args[0];
var strength = args[1];
var json;
var picker;
var includeSlider;
var includeLabel;
var currentPriorityLabel;

getPriorities();

function includeChange()
{
	alert('do something here');
}

function getPriorities()
{
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
			json = JSON.parse(this.responseText);
			buildUI(json, json["focusontop"], true);
		}
	});
	
	xhr.open('GET','http://localhost:3000/assignments/' + assignment_id + '/assignments/focus.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}

function buildUI(json, focusOnTop, firstDraw)
{
	var selectedRow = 0;
	
	if (json.length != 0)
	{
		var color;
		var data = [];
		var priorityColumn = Ti.UI.createPickerColumn({width: 5});
		var strengthColumn = Ti.UI.createPickerColumn();

		for (var i=0; i<json["assessments"].length; i++)
		{
			if (json["assessments"][i]["strength"] == strength)
			{
				selectedRow = i;
				
				
				
				if (firstDraw)
				{
					includeSlider = Ti.UI.createSlider({
					    top: 50,
					    min: 1,
					    max: json["assessments"].length,
					    width: '100%',
					    value: focusOnTop
				    });
					includeSlider.addEventListener('touchend', function(e) {
						this.value = Math.round(e.value);
					    includeLabel.text = 'Include top ' + this.value + ' priorities in Training';
					    buildUI(json, this.value, false);
					});
					
					includeSlider.addEventListener('change', function(e) {
					    includeLabel.text = 'Include top ' + Math.round(e.value) + ' priorities in Training';
					});
					
					$.focusWin.add(includeSlider);
					
					currentPriorityLabel = Ti.UI.createLabel({text: 'Adjust ' + strength + ' training priority', left: 20, top: 120});
					$.focusWin.add(currentPriorityLabel);
					
					includeLabel = Ti.UI.createLabel({text: 'Include top ' + focusOnTop, left: 20, top: 30});
					$.focusWin.add(includeLabel);
				}
				else
				{
					currentPriorityLabel.text = 'Adjust ' + strength + ' training priority';
					includeLabel.text = 'Include top ' + focusOnTop;
				}
			}
			
			if (parseInt(json["assessments"][i]["priority"]) <= parseInt(focusOnTop))
			{
				includedText = '(included)';
			}
			else 
			{
				includedText = '';
			}
			var priorityRow = Ti.UI.createPickerRow({title:json["assessments"][i]["priority"].toString()});
			var strengthRow = Ti.UI.createPickerRow({title:json["assessments"][i]["strength"].toString() + ' ' + includedText, font: {fontSize: 10}, ignore: true});
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
				console.log(selectedRow);
			  	this.setSelectedRow(1, selectedRow, true);
		 	}	
		});
		
		$.focusWin.add(picker);
		picker.setSelectedRow(0, selectedRow, false);
		picker.setSelectedRow(1, selectedRow, false);
	}	
}
