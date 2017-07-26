// Handle pipeline selection: show hidden elements
function pipelineSelected(pipelineID){
	document.getElementById('hidden-pipeline_title').style.display="block";
	document.getElementById('hidden_tab').style.display="block";
	document.getElementById('created_closed_layout').style.display="none";
}

// names of all pipeline stages in the selected pipeline
var stage_names = [];
// all of the below arrays have the same order as stage_names
// opp id and monetary value of opps created in time range, for each stage
// [[], [], [], ...]
var oppid_and_value = [];
// xxx_count: number of opportunites created/won/lost/abandoned in each 
// pipeline in the given time range
// xxx_oid: oid created/won/lost/abandoned in each pipeline in the
// given time range
// [[], [], [], ...]
// xxx_value: total monetary value of opportunities 
// created/won/lost/abandoned in each pipeline in the given time range
var created_count = [];
var created_oid = [];
var created_value = [];
var won_count = [];
var won_oid = [];
var won_value = [];
var lost_count = [];
var lost_oid = [];
var lost_value = []
var abandoned_count = [];
var abandoned_oid = [];
var abandoned_value = [];

// Finds number of opportunities created, closed, won, lost, abandoned and 
// reopened within selected time frame
function opActivity(pipelineid, fromInput, toInput){
	// process user selected time range
	var dateRange = getTimeRange(fromInput, toInput);
	document.getElementById('created_closed_layout').style.display="block";
	stage_names = [];
	oppid_and_value = [];
	created_count = [];
	created_oid = [];
	created_value = [];
	won_count = [];
	won_oid = [];
	won_value = [];
	lost_count = [];
	lost_oid = [];
	lost_value = [];
	abandoned_count = [];
	abandoned_oid = [];
	abandoned_value = [];
	// fill in oppid_and_value
	$.get('/prosperworks/opportunities/pipeline/' + pipelineid, 
	function(opp_data){
		for (i = 0; i < opp_data.length; i++){
			var push = {
				opportunity_id: opp_data[i].id, 
				monetary_value: opp_data[i].monetary_value
			};
			oppid_and_value.push(push);
		}
	}).done(function(){
		// get pipeline stages for this pipeline
		$.get('/prosperworks/pipelinestages/pipeline/' + pipelineid, 
		function(data){
			for (i = 0; i < data.length; i++){
				stage_names.push(data[i].name);
			}
			// created: fill in created_count and created_oid
			countHelper(data, 'created', dateRange, created_count, created_oid, 
				created_value);
			// won: fill in won_count and won_oid
			countHelper(data, 'won', dateRange, won_count, won_oid, 
				won_value);
			// lost: fill in lost_count and lost_oid
			countHelper(data, 'lost', dateRange, lost_count, lost_oid, 
				lost_value);
			// abandoned: fill in abandoned_count and abandoned_oid
			countHelper(data, 'abandoned', dateRange, abandoned_count, 
				abandoned_oid, abandoned_value);
		});
	});
}

// helps fill in count data, called by opActivity()
function countHelper(data, status, dateRange, count_array, oid_array, 
value_array){
	async.eachSeries(data, function(stage, done){
		$.get('/prosperworks/' + status + '_actions/' + stage.id + '/' + 
		dateRange.fromDate + '/' + dateRange.toDate, function(data1){
			count_array.push(data1.length);
			var push = [];
			for (i = 0; i < data1.length; i++){
				push.push(data1[i].opportunity_id);
			}
			oid_array.push(push);
			done();
		});
	}, function(err){
		$('#' + status + '-count').empty();
		$('#' + status + '-count').append(count_array.reduce(add, 0));
		for (i = 0; i < oid_array.length; i++){
			value_array.push(oid_array[i]);
		}
		//value_array = oid_array;
		for (i = 0; i < oid_array.length; i++){
			for (j = 0; j < oid_array[i].length; j++){
				for (k = 0; k < oppid_and_value.length; k++){
					if (oid_array[i][j] == oppid_and_value[k].opportunity_id){
						value_array[i][j] = 
						parseInt(oppid_and_value[k].monetary_value);
					}
				}
			}
		}
		$('#' + status + '-value').empty();
		var total_value = totalStageValue(value_array);
		$('#' + status + '-value').append("$" + total_value.reduce(add, 0));
	});
}


// helper to turn value_array into total_value_array
// [[], [], [], ...] --> [.., .., .., ...]
function totalStageValue(value_array){
	var total_value = [];
	for (i = 0; i < value_array.length; i++){
		total_value.push(value_array[i].reduce(add, 0));
	}
	return total_value;
}

// display opp activity details
function opActivityDetails(status){
	document.getElementById('created_closed_graph_container').style.display = 
	"block";
	var count_data;
	var value_data;
	if (status == 'created'){ 
		count_data = created_count;
		value_data = totalStageValue(created_value); 
	}
	else if (status == 'won'){
		count_data = won_count;
		value_data = totalStageValue(won_value);
	}
	else if (status == 'lost'){
		count_data = lost_count;
		value_data = totalStageValue(lost_value);
	}
	else if (status == 'abandoned'){
		count_data = abandoned_count;
		value_data = totalStageValue(abandoned_value);
	}
	// Handle Charts
	var dataChart = Highcharts.chart('count_graph', {
		chart: {
			type: 'column'
		},
		title: {
			text: 'Summary of the number of opportunities ' + status + 
			' in each stage' 
		},
			xAxis: {
				title: {
					text: 'Stage Name'
			},
				categories: stage_names
		},
		yAxis: {
				title: {
					text: 'Number of Opportunities'
				}
			},
		series: [{
			showInLegend: false,
			name: 'Count',
			data: count_data
		}]
	});	// end of highcharts

	var dataChart = Highcharts.chart('value_graph', {
		chart: {
			type: 'column'
		},
		title: {
			text: 'Summary of the total value of opportunities ' + status + 
			' in each stage' 
		},
			xAxis: {
				title: {
					text: 'Stage Name'
			},
				categories: stage_names
		},
		yAxis: {
				title: {
					text: 'Value ($)'
				}
			},
		series: [{
			showInLegend: false,
			name: 'Value',
			data: value_data
		}]
	});	// end of highcharts

	// Handle table
	var table_cells = [['<b>Stage</b>', '<b>Opportunities</b>', 
	'<b>Total Value</b>']];
	for (i = 0; i < stage_names.length; i++){
		table_cells.push([stage_names[i], count_data[i], value_data[i]]);
	}
	var table = "<table border=1>";
	for (i = 0; i < table_cells.length; i++){
		table += "<tr>";
		for (j = 0; j < table_cells[i].length; j++){
			if(i != 0 && j == 2){
				table += "<td>$" + table_cells[i][j] + "</td>"
			}
			else{
				table += "<td>" + table_cells[i][j] + "</td>";
			}
		}
		table += "</tr>";
	}
	table += "</table>";
	$('#created_closed_table').empty();
	$('#created_closed_table').append(table);
}


// Handle changing between count and value graph
$(document).on("change", "input[type=radio]", function(){
	$('#created_closed_graph').empty();
	var selected = $('[name="y-axis"]:checked').val();
	if (selected == "count"){
		document.getElementById('count_graph').style.display = "block";
		document.getElementById('value_graph').style.display = "none";
	}
	else if(selected == "value"){
		document.getElementById('value_graph').style.display = "block";
		document.getElementById('count_graph').style.display = "none";
	}
});


// Calculates opportunities time distribution
function opTimeDistribution(pipelineid, fromInput, toInput){
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
		$.get('prosperworks/pipelinestages/pipeline/' + 
		pipelineid, function(data){
			stage_names = new Array(data.length);
			stage_actions = new Array(data.length);
			length = data.length;
			$.each(data, function(index, stage){
				stage_names[index] = stage.name;
				stage_id_and_name.push([stage.id, stage.name]);
			});
		}).done(function(){
			for (i = 0; i < opportunities.length; i++){
				opp_id_and_name.push([opportunities[i].id, 
					opportunities[i].name, opportunities[i].pipeline_stage_id]);
			}
			// for each stage
			async.eachSeries(stage_id_and_name, function(stage, done){
				// get the actions for the stage and store them in stage_actions
				$.get('/prosperworks/actions_by_stage/' + stage[0], 
				function(data1){
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
						if(stage_actions[i][j+1] && 
						stage_actions[i][j].opportunity_id == 
						stage_actions[i][j+1].opportunity_id){
							// if both actions are in the time range
							if (stage_actions[i][j].date >= dateRange.fromDate 
							&& stage_actions[i][j+1].date <= dateRange.toDate){
								if(time == -1){
									time = 0;
								}
								time += (ms(stage_actions[i][j+1].date) - 
									ms(stage_actions[i][j].date))/3600000;
							}
							j++;
							// if the next action is for a different card
							if (stage_actions[i][j+1] && 
							stage_actions[i][j].opportunity_id != 
							stage_actions[i][j+1].opportunity_id){
								tTime[k] = time;
								oppid[k] = current_oppid;
								current_oppid = 
								stage_actions[i][j+1].opportunity_id;
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
								current_oppid = 
								stage_actions[i][j+1].opportunity_id;
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
						for (k = 0; k < 
						distribution_data[i][j].opportunities.length; k++){
							for (n = 0; n < opp_id_and_name.length; n++){
								if(distribution_data[i][j].opportunities[k] == 
								opp_id_and_name[n][0]){
									distribution_data[i][j].opportunities[k] = 
									"<br>" + opp_id_and_name[n][1];
								}
							}
						}
					}
					// get rid of all empty columns only at the end of the chart
					var last_useful=distribution_data[i].length -1;
					while (last_useful >= 0 && 
					distribution_data[i][last_useful].y == 0){
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
					calcAverage(distribution_data, averages_table, last_useful, stage_names, ' Opportunities ', ' Stage ');
				}
			});
		});
	});
}
