var args = arguments[0] || {};

var activity_id = args[0];
getDrillBrowseCategories(activity_id, $.dactivityIndicator, $.drillsTable);
/*
$.activityTab.setActiveTab(0);

$.videosTab.addEventListener('focus', function(e){
    getVideoCategories(activity_id, $.vactivityIndicator, $.videoCategoriesTable);
});

$.drillsTab.addEventListener('focus', function(e){
    getDrillBrowseCategories(activity_id, $.dactivityIndicator, $.drillsTable);
});

$.videoCategoriesTable.addEventListener('click', function(e){
	Ti.App.fireEvent('goVideos',{strength_id: e.rowData.strength_id, activity_id: activity_id});
});
*/

$.drillsTable.addEventListener('click', function(e){
	Ti.App.fireEvent('showDrillBrowse',{strength_id: e.rowData.strength_id, activity_id: activity_id});
});