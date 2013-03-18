// WeatherChart.js
// Copyright Fabien Allanic 2013

function roundRect(ctx,x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke(stroke);
    }
    if (fill) {
        ctx.fill(fill);
    }
};

function weatherChart(options){
	if(!options.data){alert("No data");}else{
		var canvas_width = options.canvas_width;
		var canvas_height = options.canvas_height;
		if(!canvas_width){canvas_width = $("#"+options.canvas_id).parent().width();}
		if(!canvas_height){canvas_height = $(window).height()-30;}
		if(!options.colors){options.colors = ["#59B6DF","#FEB431"];}
		if(!options.font){options.font="16px sans-serif";}
		if(!options.proportions){options.proportions = [20,65,15]}

		//we need a minumum size for the chart
		if(canvas_height < 320) canvas_height = 320;

		// Now you can just call
		var ctx = document.getElementById(options.canvas_id).getContext("2d");

		ctx.canvas.width = canvas_width;//don't know where this bloody offset comes from
		ctx.canvas.height = canvas_height;

		//WIDTH : by default a bar is 20% a date, 65% a barchart (with min temp inside), 15% a max temp
		var dateColumnWidth = Math.floor((options.proportions[0]/100)*canvas_width);
		var barChartColumnWidth = Math.floor((options.proportions[1]/100)*canvas_width);
		var maxTempColumnWidth = Math.floor((options.proportions[2]/100)*canvas_width);

		//HEIGHT : with a week data, a bar height is 1/7 of the canvas
		var barRowHeight = Math.floor(canvas_height/options.data['data'].length);

		//the smallest value will take one quarter of the barChartColumnWidth
		var minMinWidth = barChartColumnWidth/4;	
		// the biggest value will take all of barChartColumnWidth 
		var maxMaxWidth = barChartColumnWidth;

		var minMin = options.data['minMin'];
		var maxMax = options.data['maxMax'];

		//this is the coeefficient needed to calculate each width
		var one_degree_width = (maxMaxWidth - minMinWidth)/(maxMax - minMin);

		for(var i=0;i<options.data['data'].length;i++){
			row_data = options.data['data'][i];
			
			//calculating several values
			var xOffset = 0;
			var paddingTopAndBottom = 10;
			yOffset = paddingTopAndBottom+i*barRowHeight;

			//small bar = minimum width + the additional degrees * coefficient
			var smallBarWidth = minMinWidth + (row_data[1] - minMin)*one_degree_width;
			//long bar = maximum width - the number of degrees needed to reach the maximum value
			var longBarWidth = maxMaxWidth - (maxMax - row_data[2])*one_degree_width;
			//removing the paddings on top and bottom
			var bothBarHeight = barRowHeight-paddingTopAndBottom*2; 

			// 1) drawing date
			ctx.fillStyle = "#000";
			ctx.font = options.font;
			ctx.fillText(row_data[0], xOffset, yOffset+bothBarHeight*2/3);

			// 2) drawing bars		
			xOffset = dateColumnWidth;

			//drawing the larger bar
			ctx.strokeStyle = options.colors[1];
			ctx.fillStyle = options.colors[1];
			roundRect(ctx,xOffset, yOffset, longBarWidth, bothBarHeight, 10, true);

			//drawing the smaller bar on top
			ctx.strokeStyle = options.colors[0];
			ctx.fillStyle = options.colors[0];
			roundRect(ctx,xOffset, yOffset, smallBarWidth, bothBarHeight, 10, true);

			//drawing the temperature
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(row_data[1]+"˚", xOffset+20, yOffset+bothBarHeight*2/3);

			// 3) drawing max temp
			xOffset = dateColumnWidth+barChartColumnWidth;
			ctx.fillStyle = "#000";
			ctx.fillText(row_data[2]+"˚", xOffset+10, yOffset+bothBarHeight*2/3);
		}

		if(options.redraw && options.redraw === true){
			options.redraw = false;
			window.addEventListener('resize', function(){weatherChart(options);}, false);				
		}
	}
}