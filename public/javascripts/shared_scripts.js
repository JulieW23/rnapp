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
