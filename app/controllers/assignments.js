var args = arguments[0] || {};

var coachingWindow = Alloy.createController('coaching').getView();

function goAssignment(e){
	if (e.source == 1)
	{
		var trainingWindow = Alloy.createController('training').getView();
		$.navAssignment.openWindow(trainingWindow);
	}
	else
	{
		$.navAssignment.openWindow(coachingWindow);
	}
};

//add behavior for goAssessments
Ti.App.addEventListener('goAssessments', function(e) {
	var assessmentView = Alloy.createController('assessment').getView();
	$.navAssignment.openWindow(assessmentView);
});

//add behavior for goDrills
Ti.App.addEventListener('goDrills', function(e) {
	var drillsView = Alloy.createController('drills').getView();
	$.navAssignment.openWindow(drillsView);
});

//add behavior for goTraining
Ti.App.addEventListener('goTraining', function(e) {
	var trainingView = Alloy.createController('training').getView();
	$.navAssignment.openWindow(trainingView);
});

//add behavior for goVideos
Ti.App.addEventListener('goVideos', function(e) {
	var videosView = Alloy.createController('videos').getView();
	$.navAssignment.openWindow(videosView);
});