var args = arguments[0] || {};

 var strength = args[0];
 var description = args[1];
 var level = args[2];
 var summary = args[3];
 var assessment = args[4];

$.performanceImage.image = getAthletePerformanceImagePath(level);
$.performanceImage.height = 20;
$.performanceImage.width = 20;
$.assessmentType.text = assessment;
$.strength.text = strength;
$.strength.font = { fontWeight: 'bold'};
$.description.text = description;
$.description.font = { fontSize:10};
if (summary != "")
{
	$.summary.text = summary;
}
else
{
	$.summary.text = "No feedback provided yet";
}
$.summary.font = { fontSize:10, fontWeight: 'bold'};