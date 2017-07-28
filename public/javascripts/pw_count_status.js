// Handle pipeline selection: show hidden elements
function pipelineSelected(pipelineID){
	document.getElementById('hidden-pipeline_title').style.display = "block";
	document.getElementById('hidden_tab').style.display = "block";
	document.getElementById('created_closed_layout').style.display = "none";
	document.getElementById('created_closed_graph_container').style.display = 
	"none";
}


// Helper function that puts commas into large numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
var lost_value = [];
var abandoned_count = [];
var abandoned_oid = [];
var abandoned_value = [];

// Finds number of opportunities created, closed, won, lost, abandoned and 
// reopened within selected time frame
function opActivity(pipelineid, fromInput, toInput){
	// process user selected time range
	var dateRange = getTimeRange(fromInput, toInput);
	// display container
	document.getElementById('created_closed_layout').style.display="block";
	// reset all these arrays so data from different pipelines will not be 
	// mixed together for calculations
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
	// for each stage
	async.eachSeries(data, function(stage, done){
		// get the opportunities that were created/won/lost/abandoned
		// in the given time range
		$.get('/prosperworks/' + status + '_actions/' + stage.id + '/' + 
		dateRange.fromDate + '/' + dateRange.toDate, function(data1){
			// store tne number of retrieved opportunities into count_array
			count_array.push(data1.length);
			var push = [];
			for (i = 0; i < data1.length; i++){
				push.push(data1[i].opportunity_id);
			}
			oid_array.push(push);
			done();
		});
	}, function(err){
		// make sure the container is empty, and then append the total
		// number of opportunities that were created/won/lost/abandoned
		// in the time range to be displayed
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
		$('#' + status + '-value').append("$" + 
		numberWithCommas(total_value.reduce(add, 0)));
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
	// data to be displayed in table/graph
	// count data for created/won/lost/abandoned depending on status
	var count_data;
	// value data for created/won/lost/abandoned depending on status
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
	// count graph
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

	// value graph
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
			// if value column, and not the table headings row
			if(i != 0 && j == 2){
				// append the monetary value with $ and commas 
				// so that it is easier to read
				table += "<td>$" + numberWithCommas(table_cells[i][j]) + 
				"</td>";
			}
			else{
				table += "<td>" + table_cells[i][j] + "</td>";
			}
		}
		table += "</tr>";
	}
	table += "</table>";
	$('#created_closed_table').empty();
	$('#created_closed_table').append("<h4>Table for opportunities " + 
		status + ": </h4>");
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
