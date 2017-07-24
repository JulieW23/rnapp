// Handle pipeline selection: show hidden elements
function pipelineSelected(pipelineID){
	document.getElementById('hidden-pipeline_title').style.display="block";
	document.getElementById('hidden_tab').style.display="block";
}

function opTimeDistribution(pipelineid, fromInput, toInput){
	console.log('clicked');
	// process user selected time range
	var dateRange = getTimeRange(fromInput, toInput);

	var num_days = (ms(dateRange.toDate)-ms(dateRange.fromDate))/86400000;
	// all opportunities
	var opportunities;
	// all pipeline stage names
	var stage_names;
	// all actions per stage [[], [], [], ...]
	var stage_actions;
	// number of stages
	var length;
	// stage id and name
	var stage_id_and_name = [];
	// array that stores opp id + name + shorturl so that they can be 
	// matched (for distribution charts)
	// [opp.id, opp.name, opp.pipeline_stage_id]
	var opp_id_and_name = [];
	// get opportunities in this pipeline
	$.get('/prosperworks/opportunities/pipeline/' + pipelineid, function(data){
		opportunities = new Array(data.length);
		$.each(data, function(index, opp){
			opportunities[index] = opp;
		});
	}).done(function(){
		// get pipeline stages for this pipeline
		$.get('prosperworks/pipelinestages/pipeline/' + pipelineid, function(data){
			stage_names = new Array(data.length);
			stage_actions = new Array(data.length);
			length = data.length;
			$.each(data, function(index, stage){
				stage_names[index] = stage.name;
				stage_id_and_name.push([stage.id, stage.name]);
			});
		}).done(function(){
			for (i = 0; i < opportunities.length; i++){
				opp_id_and_name.push([opportunities[i].id, opportunities[i].name, opportunities[i].pipeline_stage_id]);
			}
			// for each stage
			async.eachSeries(stage_id_and_name, function(stage, done){
				// get the actions for the stage and store them in stage_actions
				$.get('/prosperworks/actions_by_stage/' + stage[0], function(data1){
					var index1 = stage_id_and_name.indexOf(stage);
					stage_actions[index1] = new Array(data1.length);
					$.each(data1, function(index2, action){
						stage_actions[index1][index2] = action;
					});
					done();
				});
			}, function(err){
				if(err) {
					throw err;
				}
				// distribution graph data
				var distribution_data = new Array(length);

				for (i = 0; i < stage_actions.length; i++){
					var tTime = [];
					var oppid = [];
					var k = 0;
					var time = -1;
					if (stage_actions[i].length > 0){
						var current_oppid = stage_actions[i][0].opportunity_id;
					}
					// for every action
					for (j = 0; j < stage_actions[i].length; j++){
						// if this and next action are for the same card
						if(stage_actions[i][j+1] && stage_actions[i][j].opportunity_id == stage_actions[i][j+1].opportunity_id){
							// if both actions are in the time range
							if (stage_actions[i][j].date >= dateRange.fromDate && stage_actions[i][j+1].date <= dateRange.toDate){
								if(time == -1){
									time = 0;
								}
								time += (ms(stage_actions[i][j+1].date) - ms(stage_actions[i][j].date))/3600000;
							}
							j++;
							// if the next action is for a different card
							if (stage_actions[i][j+1] && stage_actions[i][j].opportunity_id != stage_actions[i][j+1].opportunity_id){
								tTime[k] = time;
								oppid[k] = current_oppid;
								current_oppid = stage_actions[i][j+1].opportunity_id;
								time = -1;
								k++;
							}
							// if there are no more actions
							else if (!stage_actions[i][j+1]){
								// console.log('no more actions');
								tTime[k] = time;
								oppid[k] = current_oppid;
								time = -1;
								k++;
							}
						}
						// if there is only one action left for a card
						else {
							tTime[k] = time;
							oppid[k] = current_oppid;
							time = -1;
							k++;
							// if there are still actions for other cards
							if (stage_actions[i][j+1]){
								current_oppid = stage_actions[i][j+1].opportunity_id;
							}
						}
					} // all data has been processed for this stage
					var categories = [];
					var zeros = [];
					var stage_data = [];
					for (z = 0; z <= num_days; z++){
						categories.push(z);
						zeros.push(0);
						stage_data.push({y: 0, opportunities: []});
					}
					distribution_data[i] = stage_data;

					for (m = 0; m < tTime.length; m++){
						if (tTime[m] >= 0){
							var hours_to_days = Math.round(tTime[m]/24);
							distribution_data[i][hours_to_days].y ++;
							distribution_data[i][hours_to_days].opportunities.push(oppid[m]);
						}
					}
				}
				$('#distribution-graph').empty();

				// Create array for the overall table, 
				// and insert the first row of the table
				var averages_table = [['<b>Stage</b>', 
				'<b>Average (Days)</b>', 
				'<b>Standard Deviation (Days)</b>', '<b>Minimum Days</b>', 
				'<b>Maximum Days</b>']];

				for( i = 0; i < stage_names.length; i++){
					// go through distribution_data and replace opp ids with opp names
					for (j = 0; j < distribution_data[i].length; j++){
						for (k = 0; k < distribution_data[i][j].opportunities.length; k++){
							for (n = 0; n < opp_id_and_name.length; n++){
								if(distribution_data[i][j].opportunities[k] == opp_id_and_name[n][0]){
									distribution_data[i][j].opportunities[k] = "<br>"  
									+ opp_id_and_name[n][1];
								}
							}
						}
					}
					// get rid of all empty columns only at the end of the chart
					var last_useful=distribution_data[i].length -1;
					while (last_useful >= 0 && distribution_data[i][last_useful].y == 0){
						last_useful--;
					}
					$('#distribution-graph').append("<div id='distribution-graph" + [i] 
    						+ "'></div>");
					Highcharts.chart('distribution-graph' + [i], {
    					chart: {
        					type: 'column',
        					zoomType: 'x'
    					},
    					title: {
       						text: 'Opportunities time distribution for stage: ' + stage_names[i]
    					},
    					subtitle: {
        					text: document.ontouchstart === undefined ?
                				'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
    					},
   						xAxis: {
   							title: {
   								text: 'Number of days spent in this stage'
    						},
       						categories: categories.slice(0, j+1)
    					},
    					yAxis: {
       						title: {
       							text: 'Number of opportunities'
   							}
   						},
   						tooltip: {
   							formatter: function(){
   								return '<b>Days: </b>' + this.x + '<br><b>Number of cards: </b>' + this.point.y 
   								+ '<br><b>Cards: </b>' + this.point.opportunities;
   							}
   						},
   						plotOptions:{
   							series: {
   								cursor: 'pointer',
   								point: {
   									events: {
   										click: function(e){
   											hs.htmlExpand(null, {
   												pageOrigin: {
   													x: e.pageX || e.clientX,
   													y: e.pageY || e.clientY
   												},
   												maincontentText: '<b>Days: </b>' + this.x + '<br><b>Number of opportunities: </b>' 
   												+ this.y + '<br><b>Opportunities: </b>' + this.opportunities
   											});
   										}
   									}
   								},
   							}
   						},
    					series: [{
    						showInLegend: false,
        					name: ' ',
        					data: distribution_data[i].slice(0, last_useful+1)
    					}]
					}); // end of highcharts 
					// CALCULATE AVERAGE
					var data_array = [];
					for (j = 0; j < distribution_data[i].length; j++){
						if (distribution_data[i][j].y > 0){
							for (x = 0; x < distribution_data[i][j].y; x++){
								data_array.push(j);
							}
						}
					}
					var average;
					average = Math.round((data_array.reduce(add, 0) / data_array.length) * 100) / 100;
					if (!(average >= 0)){
						$('#distribution-graph' + [i]).append('<h4 style="text-align: center;">Average: no data in time range</h4>');
					}
					else{
						$('#distribution-graph' + [i]).append('<h4 style="text-align: center;">Average: ' + average + ' days </h4>');
					}

					// CALCULATE STANDARD DEVIATION
					var squared_difference = [];
					for (j = 0; j < data_array.length; j++){
						squared_difference.push((data_array[j] - average) * (data_array[j] - average));
					}
					var standard_deviation = Math.round((Math.sqrt(squared_difference.reduce(add, 0) / squared_difference.length) * 100)) / 100;
					if (!(standard_deviation >= 0)){
						$('#distribution-graph' + [i]).append('<h4 style="text-align: center;">Standard Deviation: no data in time range</h4><br><br>');
					}
					else{
						$('#distribution-graph' + [i]).append('<h4 style="text-align: center;">Standard Deviation: ' + standard_deviation + ' days</h4><br><br>');
					}
					// find minimum number of days
					var min_days;
					for (z = 0; z < distribution_data[i].length; z++){
						if(distribution_data[i][z].y != 0){
							min_days = z;
							break;
						}
					}
					// max number of days = last_useful (from above, when fixing graph x axis)
					// overall table
					averages_table.push([stage_names[i], average, standard_deviation, min_days, last_useful]);
					$('#overall-table').empty();
					$('#overall-table').append("<h4>Average and Standard Deviation for the Number of Days Cards Spend in Each Stage:</h4>");
					var result = "<table>";
					for (x = 0; x < averages_table.length; x++){
						result += "<tr>";
						for (y = 0; y < averages_table[x].length; y++){
							if(x > 0 && y > 0 && !(averages_table[x][y] >= 0)){
								result += "<td>no data</td>";
							}
							else{
								result += "<td>" + averages_table[x][y] + "</td>";
							}
						}
						result += "</tr>";
					}
					result += "</table>";
					$('#overall-table').append(result);
					$('#overall-table').append("<br><br><h3>Graphs for Each Stage:</h3>");
				}
			});
		});
	});
}
