var args = arguments[0] || {};

var title = args[0];
var summary = args[1];

setValues();

$.summary.addEventListener('load', function(e){
	setDynamicWebviewHeight(e);
});

function setValues()
{
	$.title.text = title;
	$.summary.setHtml(stylizeHTML(summary));
}