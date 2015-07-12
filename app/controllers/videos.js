var args = arguments[0] || {};

var activity_id = args[0];
var strength_id = args[1];

getVideos(activity_id, strength_id);

function showVideo(e){
	Ti.Platform.openURL(e.rowData.link);
};

function getVideos(activity_id, strength_id)
{
	var tableData = [];
	
	$.activityIndicator.show();

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
					var row = Ti.UI.createTableViewRow({link: json[i]["link"], height: 60});
					
					var thumb = Ti.UI.createImageView({image: json[i]["thumb"], left: 10});
					row.add(thumb);
					var name = Ti.UI.createLabel({text: json[i]["title"], left: 70, font: { fontSize:10, fontWeight: 'bold' }});
					row.add(name);
					tableData.push(row);
				}
			}	
			$.videosTable.setData(tableData);
			$.activityIndicator.hide();
			$.videosTable.visible = true;
		}
	});
		
	xhr.open('GET', webserver+'/videos.json?sid='+strength_id+'&activity_id='+activity_id);
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}