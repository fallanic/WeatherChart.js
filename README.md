WeatherChart.js
=============

HTML5 canvas based charting library (compatible with twitter bootstrap).

Easily display horizontal temperature and humidity bar graphs.

NOTE : this lib needs jQuery to run.

**Usage**

    $(document).ready(function() {
    	var data = [
    	["03/10",10],
    	["03/09",10],
    	["03/08",10],
    	["03/07",10],
    	["03/06",10],
    	["03/05",11],
    	["03/04",87]			
    	];
    	weatherChart({
    		canvas_id:"myCanvas",
    		data:data,
    		unit:"%",
    		redraw:true});
    });


Here are the available options :

canvas_id : the id of the canvas to draw
data : matrix containing dates and values
canvas_width (optional) : fixed canvas width
canvas_height (optional) : fixed canvas height
colors (optional) : array containing the colors for the bar charts
font (optional) : the font to use for the values
proportions (optional) : array containing the width percentage of each column in the chart (date, bar chart, second value if available)
unit (optional) : "˚","%" or whatever you want to use 
redraw (optional) : true if you want to redraw the canvas when the window size changes


## License
Copyright (c) 2013 Fabien Allanic

Licensed under the MIT license.