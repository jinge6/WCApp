var args = arguments[0] || {};

 var strength = args[0];
 var description = args[1];
 var level = args[2];
 var summary = args[3];
 var assessment = args[4];

var color = getPerformanceColor(level);
$.assessmentTextArea.value = assessment;
$.assessmentTextArea.borderRadius = 3;
$.assessmentTextArea.textAlign = Titanium.UI.TEXT_ALIGNMENT_CENTER;
$.assessmentTextArea.color = 'white';
$.assessmentTextArea.font = { fontSize:10, fontWeight: 'bold'};
$.assessmentTextArea.backgroundColor = color;
$.strength.text = strength;
$.strength.font = { fontSize:14, fontWeight: 'bold'};
$.description.text = description;
$.description.font = { fontSize:10};
if (summary != null)
{
	$.summary.text = summary;
}
else
{
	$.summary.text = "No feedback provided yet";
}
$.summary.font = { fontSize:10, fontWeight: 'bold'};