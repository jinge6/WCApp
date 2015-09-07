var args = arguments[0] || {};

var version = Ti.App.Properties.getString('version');
var imageDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, version);
imageDir.createDirectory();
downloadLatestImages(version);
imageDir = null;

function downloadLatestImages(version)
{
	var xhr = Ti.Network.createHTTPClient(
	{
		onload: function() 
		{
		 	var tableData = [];

			json = JSON.parse(this.responseText);
			
			if (json.length != 0)
			{
				Ti.API.info('Saving to ' + Ti.Filesystem.applicationDataDirectory + '/' + version);
				for (var i=0; i<json["images"].length; i++)
				{
					var moveable = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, version + '/'+json["images"][i]["id"] + '.png');
					if(!moveable.exists()) 
					{	
						var tmpImage = Ti.UI.createImageView({
							image: json["images"][i]["url"]
						});
						moveable.write(tmpImage.toImage());
						Ti.API.info('Caching '+ json["images"][i]["url"]);
						$.progress.text = "Caching image " + i + " of " + json["images"].length;
					}
					else
					{
						Ti.API.info('File Exists: '+ Ti.Filesystem.applicationDataDirectory + '/' + version + '/'+json["images"][i]["id"] + '.png');
					}
					// dispose of file handles
					moveable = null;
				}
				$.status.close();
				var assignmentsWindow = Alloy.createController('assignments').getView();
		    	assignmentsWindow.open();
			}	
		}
	});

	xhr.open('GET', webserver+'/drills/images.json');
	xhr.setRequestHeader("X-CSRFToken", Ti.App.Properties.getString("csrf"));
	xhr.send();	
}