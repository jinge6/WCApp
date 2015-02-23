// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
//some keystroke-savers :)
function view(args) {
	return Ti.UI.createView(args);
}

function label(args) {
	return Ti.UI.createLabel(args);
}

function image(args) {
	return Ti.UI.createImageView(args);
}

function window(args) {
	return Ti.UI.createWindow(args);
}

function button(args,onclick) {
	var btn = Ti.UI.createButton(args);
	btn.addEventListener('click', onclick);
	return btn;
}

/*
 * Our custom rating view component takes an initial
 * rating, and a maximum value for the rating, which
 * will be used to render the view
 * 
 */
function RatingView(initialRating, max, totalRatings, topOffset, leftOffset) {
	//create and populate the rating object
	var instance = view({
		layout:'horizontal',
		height:30,
		top: topOffset,
		left: leftOffset
	});
	
	var rating; 		// instance variable indicating 
					// rating. this data is private 
					// to the object, since it is 
					// declared in this constructor
					// function
								
	var stars = [];	// another instance variable
					// containing an array of 
					// ImageView objects representing
					// the stars of the rating
	
	//Create the necessary view structures to represent the
	//current value of the rating
	for (var i = 0; i < max; i++) {
		var star = image({
			height:24,
			width:24,
			left:5
		});
		
		(function() {
			//we need to capture the value of "i"
			//for use in click handler functions
			//on our image views.  To do this, we
			//use a closure (this self-calling function)
			var index = i;
			star.addEventListener('click', function() {
				setRating(index+1);
			});
		})();
		
		stars.push(star);
		instance.add(star);
	}
	
	if (totalRatings != null)
	{
		var textValue = label({
			text: '(' + totalRatings + ')',
			height:24,
			width:'auto',
			left:5,
			color:'#787878',
			font: {
				fontSize:12
			}
		});
		instance.add(textValue);
	}
	
	//inner function to update view to reflect the current
	//rating
	function setRating(newRating) {
		rating = newRating;
		
		instance.fireEvent('ratingChanged',{
			currentValue:rating
		});
		
		for (var i = 0, l = stars.length; i < l; i++) {
			if (i >= rating) {
				stars[i].image = 'star-off.png';
			}
			else if (rating > i && rating < i+1) {
				stars[i].image = 'star-half.png';
			}
			else {
				stars[i].image = 'star-on.png';
			}
		}
	}
	
	instance.changeRating = setRating;
	
	//initialize view and return instance
	setRating(initialRating);
	return instance;
};

function getPerformanceColor(level)
{
	var color;
	if (level == "1")
	{
		color = "#FF1919";
	}
	else if(level == "2")
	{
		color = "#FFA319";
	}
	else
	{
		color = "#33AD33";
	}
	return color;
}
