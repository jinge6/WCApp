var args = arguments[0] || {};

var event_id = args[0];
var gameplan = args[1];
var debrief = args[2];
var opponent = args[3];
var assignment_id = args[4];

$.eventDetail.title = "vs. " + opponent;
$.scoutingLabel.text = opponent + " scouting"

$.eventDetailTable.addEventListener('click', function(e){
	if (e.source.id == "plan")
	{
		Ti.App.fireEvent('showEventBreakdown',{title: "Our Game Plan", summary: gameplan});
	}
	else if (e.source.id == "debrief")
	{
		Ti.App.fireEvent('showEventBreakdown',{title: "Game Debrief", summary: debrief});
	}
	if (e.source.id == "team")
	{
		Ti.App.fireEvent('showEventTeam',{event_id: event_id, assignment_id: assignment_id});
	}
	if (e.source.id == "stats")
	{
		Ti.App.fireEvent('showEventStats',{event_id: event_id, assignment_id: assignment_id});
	}
	if (e.source.id == "scouting")
	{
		Ti.App.fireEvent('showEventScouting',{event_id: event_id, opponent: opponent, assignment_id: assignment_id});
	}
});
