// helper function that reloads page
function reload(){
	location.reload();
}


// Display the selected tab
function openTab(evt, tabName, idBoard) {
	var i, tabcontent, tablinks;
	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (n = 0; n < tabcontent.length; n++) {
		tabcontent[n].style.display = "none";
	}
	// Get all elements with class "tablinks" and remove class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (m = 0; m < tablinks.length; m++) {
		tablinks[m].className = tablinks[m].className.replace("active", "");
	}

	if (tabName == 'distribution-table'){
		$('#table').empty();
	}

	// Show the current tab, and add an "active" class to the button that 
	// opened the tab
	document.getElementById(tabName).style.display = "block";
	document.getElementById(tabName).className += " active";
	// evt.currentTarget.className += "active";
}


// Limits date picker so user cannot select future dates
$(function(){
    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();

    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();

    var maxDate = year + '-' + month + '-' + day;    
    $('.date_picker').attr('max', maxDate);
});


// if date picker is not supported on the browser being used, 
// use jquery ui date picker instead
$(function(){
	if($('.date_picker')[0].type != 'date'){
		$('.date_picker').datepicker({dateFormat: "yy-mm-dd", 
			maxDate: new Date()});
	}
});


// Format date to milliseconds and correct timezone
function ms(date){
	return Date.parse(date) - 14400000;
}


// helper function to get input time range
function getTimeRange(fromInput, toInput){
	var dateRange = {};
	// if date(s) not selected
	if (!document.getElementById(fromInput).value || 
	!document.getElementById(toInput).value){
		alert("Date range is not selected.");
		return;
	}
	// if from date is after to date
	else if (document.getElementById(fromInput).value > 
	document.getElementById(toInput).value){
		alert("FROM date needs to be before TO date.");
		return;
	}
	// if no problems with date input
	else{
		dateRange.fromDate = document.getElementById(fromInput).value;
		dateRange.toDate = document.getElementById(toInput).value;
	}
	return dateRange;
}


// Addition helper
function add(a, b){
	return a + b;
}


function calcAverage(distribution_data, averages_table, last_useful, 
stage_names, cards, list){
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
	average = Math.round((data_array.reduce(add, 0) / 
	data_array.length) * 100) / 100;
	if (!(average >= 0)){
		$('#distribution-graph' + [i]).append('<h4 style="text-align: \
		center;">Average: no data in time range</h4>');
	}
	else{
		$('#distribution-graph' + [i]).append('<h4 style="text-align: \
		center;">Average: ' + average + ' days </h4>');
	}

	// CALCULATE STANDARD DEVIATION
	var squared_difference = [];
	for (j = 0; j < data_array.length; j++){
		squared_difference.push((data_array[j] - average) * (data_array[j] - 
		average));
	}
	var standard_deviation = 
	Math.round((Math.sqrt(squared_difference.reduce(add, 0) / 
	squared_difference.length) * 100)) / 100;
	if (!(standard_deviation >= 0)){
		$('#distribution-graph' + [i]).append('<h4 style="text-align: \
		center;">Standard Deviation: no data in time range</h4><br><br>');
	}
	else{
		$('#distribution-graph' + [i]).append('<h4 style="text-align: \
		center;">Standard Deviation: ' + standard_deviation + 
		' days</h4><br><br>');
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
	averages_table.push([stage_names[i], average, standard_deviation, 
	min_days, last_useful]);
	$('#overall-table').empty();
	$('#overall-table').append("<h4>Average and Standard Deviation for the \
	Number of Days" + cards + "Spend in Each" +  list + ":</h4>");
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
	$('#overall-table').append("<br><br><h3>Graphs for Each" + list +":</h3>");
}
