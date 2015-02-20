var args = arguments[0] || {};

var assignment_id = args[0];
var strength_id = args[1];

getVideos(assignment_id, strength_id);

function showVideo(e){
	Ti.Platform.openURL(e.rowData.link);
};

function getVideos(assignment_id, strength_id)
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
				for (var i=0; i<json.length; i++)
				{
					var row = Ti.UI.createTableViewRow({link: json[i]["link"], height: 60});
					
					var thumb = Ti.UI.createImageView({image: json[i]["thumb"], left: 10});
					row.add(thumb);
					var name = Ti.UI.createLabel({text: json[i]["title"], left: 70, font: { fontSize:10, fontWeight: 'bold' }});
					row.add(name);
					tableData.push(row);
				}
			}	
			$.videosTable.setData(tableData);
		}
	});
		
	xhr.open('GET','http://localhost:3000/assignments/' + assignment_id + '/assignments/video.json?sid='+strength_id);
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}