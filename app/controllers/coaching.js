var args = arguments[0] || {};

function goAssessment(e){
	Ti.App.fireEvent('goAssessments',e);
};

function goTraining(e){
	Ti.App.fireEvent('goTraining',e);
};

function goDrills(e){
	Ti.App.fireEvent('goDrills',e);
};

function goVideos(e){
	Ti.App.fireEvent('goVideos',e);
};