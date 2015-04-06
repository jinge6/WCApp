var args = arguments[0] || {};

var title = args[0];
var summary = args[1];

setValues();

function setValues()
{
	$.title.text = title;
	$.summary.value = summary;
}