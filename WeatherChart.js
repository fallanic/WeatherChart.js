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

function getMinAndMax(data){
	var minMin=null;
	var maxMax=null;
	for(var i=0;i<data.length;i++){		
		var min = data[i][1];
		//if only one value
		var max = data[i][1];
		if(data[i].length==3){
			//if two values
			max = data[i][2];
		}
		
		if(minMin==null||min<minMin){
			minMin = min;
		}
		if(maxMax==null||maxMax<max){
			maxMax = max;
		}
	}

	return [minMin,maxMax];
}

function weatherChart(options){
	if(!options.data){alert("No data");}else{

		//for each row we have one date and one or two values
		var dimensions = options.data[0].length - 1;

		if(dimensions < 1 || dimensions > 2){
			alert('Wrong data');
		}else{

			var canvas_width = options.canvas_width;
			var canvas_height = options.canvas_height;
			if(!canvas_width){canvas_width = $("#"+options.canvas_id).parent().width();}
			if(!canvas_height){canvas_height = $(window).height()-30;}
			if(!options.colors){options.colors = ["#59B6DF","#FEB431"];}
			if(!options.font){options.font="16px sans-serif";}
			if(!options.proportions){
				if(dimensions==1){
					options.proportions = [20,80];
				}else{
					options.proportions = [20,65,15];
				}				
			}
			if(!options.unit){options.unit = ""}

			//we need a minumum size for the chart
			if(canvas_height < 320) canvas_height = 320;

			// getting the canvas context
			var ctx = document.getElementById(options.canvas_id).getContext("2d");

			ctx.canvas.width = canvas_width;//don't know where this bloody offset comes from
			ctx.canvas.height = canvas_height;

			//WIDTH : by default a bar is 20% a date, 65% a barchart (with min value inside), 15% a max value (20/80 if no max value)
			var dateColumnWidth = Math.floor((options.proportions[0]/100)*canvas_width);
			var barChartColumnWidth = Math.floor((options.proportions[1]/100)*canvas_width);

			//HEIGHT : with a week data, a bar height is 1/7 of the canvas
			var barRowHeight = Math.floor(canvas_height/options.data.length);

			//the smallest value will take one quarter of the barChartColumnWidth
			var minMinWidth = barChartColumnWidth/4;	
			// the biggest value will take all of barChartColumnWidth 
			var maxMaxWidth = barChartColumnWidth;

			var minAndMax = getMinAndMax(options.data);
			var minMin = minAndMax[0];
			var maxMax = minAndMax[1];

			//if we display percent, we need to make the bar proportionnal the absolute max value
			if(options.unit == "%"){
				maxMax = 100;
			}

			//this is the coeefficient needed to calculate each width
			var one_degree_width = (maxMaxWidth - minMinWidth)/(maxMax - minMin);

			for(var i=0;i<options.data.length;i++){
				row_data = options.data[i];
				
				//calculating several values
				var xOffset = 0;
				var paddingTopAndBottom = 10;
				yOffset = paddingTopAndBottom+i*barRowHeight;

				if(dimensions == 2){
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
					ctx.fillText(row_data[1]+options.unit, xOffset+20, yOffset+bothBarHeight*2/3);

					// 3) drawing max value
					xOffset = dateColumnWidth+barChartColumnWidth;
					ctx.fillStyle = "#000";
					ctx.fillText(row_data[2]+options.unit, xOffset+10, yOffset+bothBarHeight*2/3);
				}else{
					longBarWidth = maxMaxWidth - (maxMax - row_data[1])*one_degree_width;

					//removing the paddings on top and bottom
					var bothBarHeight = barRowHeight-paddingTopAndBottom*2; 

					// 1) drawing date
					ctx.fillStyle = "#000";
					ctx.font = options.font;
					ctx.fillText(row_data[0], xOffset, yOffset+bothBarHeight*2/3);

					// 2) drawing bars		
					xOffset = dateColumnWidth;

					//drawing the larger bar
					ctx.strokeStyle = options.colors[0];
					ctx.fillStyle = options.colors[0];
					roundRect(ctx,xOffset, yOffset, longBarWidth, bothBarHeight, 10, true);

					//drawing the temperature
					ctx.fillStyle = "#FFFFFF";
					ctx.fillText(row_data[1]+options.unit, xOffset+20, yOffset+bothBarHeight*2/3);
				}
			}

			if(options.redraw && options.redraw === true){
				options.redraw = false;
				window.addEventListener('resize', function(){weatherChart(options);}, false);				
			}
		}
	}
}