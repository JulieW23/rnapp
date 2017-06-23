function reload(){
	location.reload();
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


// Handle board selection: show hidden elements & retrieve list data fromt Trello
function boardSelected(boardID) {
	// show elements
	document.getElementById('hidden_table1').style.display="block";
    document.getElementById('hidden_table2').style.display="block";
    document.getElementById('hidden_board_link').style.display="block";
    document.getElementById('hidden_tab').style.display="block";	
}


// Helper function to add a given number of months to a given date
function addMonths(date, months){
	date.setMonth(date.getMonth() + months);
	return date;
}


// Process database data and generate the figure for the selected tab
function generateFigure(idBoard, tabName){
	// process time range
	var fromDate;
	var toDate;
	if (tabName == 'distribution-table'){
		// if date(s) not selected
		if (!document.getElementById("tableFromDate").value || !document.getElementById("tableToDate").value){
			alert("Date range is not selected.");
			return;
		}
		// if from date is after to date
		else if (document.getElementById("tableFromDate").value > document.getElementById("tableToDate").value){
			alert("'From' date needs to be before 'To' date,");
			return;
		}
		// if no problems with input
		else {
			fromDate = document.getElementById("tableFromDate").value;
			toDate = document.getElementById("tableToDate").value;
		}
	}
	else if (tabName == 'distribution-graph-tab') {
		if (!document.getElementById("distributionFromDate").value || !document.getElementById("distributionToDate").value){
			alert("Date range is not selected.");
			return;
		}
		else if (document.getElementById("distributionFromDate").value > document.getElementById("distributionToDate").value){
			alert("'From' date needs to be before 'To' date,");
			return;
		}
		else {
			fromDate = document.getElementById("distributionFromDate").value;
			toDate = document.getElementById("distributionToDate").value;
		}
	}
	else if (tabName == 'list-graph-tab') {
		if (!document.getElementById("listFromDate").value || !document.getElementById("listToDate").value){
			alert("Date range is not selected.");
			return;
		}
		else if (document.getElementById("listFromDate").value > document.getElementById("listToDate").value){
			alert("'From' date needs to be before 'To' date,");
			return;
		}
		else {
			fromDate = document.getElementById("listFromDate").value;
			toDate = document.getElementById("listToDate").value;
		}
	}
	var num_days = (ms(toDate)-ms(fromDate))/86400000;
	// lists id and name
	var list_id_and_name = [];
	// all list names
	var list_names;
	// all actions per list [[], [], [], ...]
	var list_actions;
	// number of lists
	var length;
	// the distribution table as a 2d array
	var table_cells = [['idCard', 'shorturl', 'Card']];
	// array that stores card id + name + shorturl so that they can be matched (for distribution charts)
	// [card.id, card.name, card.shorturl, card.idlist]
	var card_id_and_name = [];
	// get lists for this board
	$.get('/trello/lists/' + idBoard, function(data){
		list_names = new Array(data.length);
		list_actions = new Array(data.length);
		length = data.length;
		// get cards for this board
		$.get('/trello/cards/' + idBoard, function(carddata){
			$.each(carddata, function(index, card){
				// for table_cells, for distribution table
				var push = [card.id, card.shorturl, card.name];
				// for distribution graphs
				card_id_and_name.push([card.id, card.name, card.shorturl, card.idlist]);
				for (i=0; i < length; i++){
					push.push('0');
				}
				table_cells.push(push);
			});
		}).done(function(){
			//for each list
			$.each(data, function(index, list) {
				// store list name in it's own list
				list_names[index] = list.name;
				// append list name to table cell
				table_cells[0].push(list.name);
				list_id_and_name.push([list.id, list.name]);
				// get actions for this list
				$.get('/trello/actions_by_list/' + list.id, function(data1){
					list_actions[index] = new Array(data1.length);
					$.each(data1, function(index2, action){
						list_actions[index][index2] = action;
					});
				}).done(function(){
					// *** data processing to find time each card spends in each list ***
					if([index] == length-1){
						// list graph data
						var display_time = new Array(length);
						// distribution graph data
						var distribution_data = new Array(length);
						
						// for every list
						for (i = 0; i < list_actions.length; i++){
							// time each card spent in this list
							var tTime = [];
							// id of card (same order as tTime)
							var idCard = [];
							var k = 0;
							// Initial time is negative (=-1) to ensure that cards that do not 
							// exist within the time range will not be counted in charts/tables.
							// When the processed data from this section is being prepared for 
							// displaying, any entry where the time is a negative value
							// will be ignored
							var time = -1;
							if (list_actions[i].length > 0){
								var current_idCard = list_actions[i][0].idcard;
							}
							// for every action
							for (j = 0; j < list_actions[i].length; j++){
								// if this and next action are for the same card
								if (list_actions[i][j+1] && list_actions[i][j].idcard == list_actions[i][j+1].idcard){
									// if both actions are in the time range
									if (list_actions[i][j].date >= fromDate && list_actions[i][j+1].date <= toDate){
										// console.log('case1');
										if (time == -1){
											time = 0;
										}
										time += (ms(list_actions[i][j+1].date) - ms(list_actions[i][j].date))/3600000;
									}
									// if the first action is in the time range but the second action is not
									// else if (list_actions[i][j].date >= fromDate && list_actions[i][j].date <= toDate && list_actions[i][j+1].date > toDate){
									// 	if (time == -1){
									// 		time = 0;
									// 	}
									// 	time += (ms(toDate) - ms(list_actions[i][j].date))/3600000;
									// 	// console.log('case2');
									// }
									// if the first action is not in the time range but the second action is
									// else if (list_actions[i][j].date < fromDate && list_actions[i][j+1].date >= fromDate && list_actions[i][j+1] <= toDate){
									// 	if (time == -1){
									// 		time = 0;
									// 	}
									// 	time += (ms(list_actions[i][j+1].date) - ms(fromDate))/3600000;
									// 	// console.log('case3');
									// }
									// else if (list_actions[i][j].date < fromDate && list_actions[i][j+1].date > toDate){
									// 	// console.log('case4');
									// 	if (time == -1){
									// 		time = 0;
									// 	}
									// 	time = (ms(toDate) - ms(fromDate))/3600000;
									// }
									// actions within the time range for the same cards
									// should be processed in pairs
									j++;
									// if the next action is for a different card
									if (list_actions[i][j+1] && list_actions[i][j].idcard != list_actions[i][j+1].idcard){
										// console.log('different card');
										tTime[k] = time;
										idCard[k] = current_idCard;
										current_idCard = list_actions[i][j+1].idcard;
										time = -1;
										k++;
									}
									// if there are no more actions
									else if (!list_actions[i][j+1]){
										// console.log('no more actions');
										tTime[k] = time;
										idCard[k] = current_idCard;
										time = -1;
										k++;
									}
								}
								// if there is only one action left for a card
								else {
									// if the last action for the card is in the time range
									// *** assuming this action is the card entering the list
									// if (list_actions[i][j].date <= toDate && list_actions[i][j].date >= fromDate){
									// 	// console.log('last action for this card');
									// 	time += (ms(toDate) - ms(list_actions[i][j].date))/3600000;
									// }
									// if the last action for this card is before the time range
									// it should be the card entering the list, so the time = the time range
									// if (list_actions[i][j].date < fromDate){
									// 	// console.log('last action is before time range');
									// 	time += (ms(toDate) - ms(fromDate))/3600000;
									// }
									tTime[k] = time;
									idCard[k] = current_idCard;
									time = -1;
									k++;
									// if there are still actions for other cards
									if (list_actions[i][j+1]){
										current_idCard = list_actions[i][j+1].idcard;
									}
								}
							}

							// *** preparing the processed data to be displayed ***
							// console.log(tTime);
							// console.log(idCard);
							// generate x axis categories for distribution graphs
							var categories = [];
							var zeros = [];
							var list_data = [];
							for (z = 0; z <= num_days; z++){
								categories.push(z);
								zeros.push(0);
								list_data.push({y: 0, cards: []});
							}

							distribution_data[i] = list_data;

							// store data for table
							// for every entry in tTime/for every idcard
							for (m = 0; m < tTime.length; m++){
								// data for distribution chart
								if (tTime[m] >= 0){
									var hours_to_days = Math.round(tTime[m]/24);
									distribution_data[i][hours_to_days].y ++;
									distribution_data[i][hours_to_days].cards.push(idCard[m]);
								}
								// change -1 to 0 for table + list chart
								else if (tTime[m] < 0){
									tTime[m] = 0;
								}
								// for every row of table
								for(n = 1; n < table_cells.length; n++){
									if (idCard[m] == table_cells[n][0]){
										table_cells[n][i+3] = Math.round(tTime[m] * 100) / 100;
									}
								}
							}
							// store data for list chart
							display_time[i] = tTime.reduce(add, 0) / tTime.length;	
						}
						// *** displaying the required chart ***
						// console.log(display_time);
						// console.log(table_cells);
						// display list chart
						if (tabName == 'list-graph-tab'){
							var listChart = Highcharts.chart('list-graph', {
        						chart: {
            						type: 'column'
        						},
        						title: {
           							text: 'Average time that cards are in each list'
        						},
       							xAxis: {
       								title: {
       									text: 'List Name'
        							},
           							categories: list_names
        						},
        						yAxis: {
           							title: {
           								text: 'Average number of hours'
       								}
       							},
        						series: [{
        							showInLegend: false,
        							name: 'Average # hours',
            						data: display_time
        						}]
    						});	
						}
						// display table
						else if (tabName == 'distribution-table'){
							$('#table').empty();
							var result = "<table>";
							for (x = 0; x < table_cells.length; x++){
								result += "<tr>";
								for (y = 2; y < table_cells[x].length; y++){
									if(y==2 && x>0){
										result += "<td style='border: 1px solid black'><a href='" 
										+ table_cells[x][1] + "'>" 
										+ table_cells[x][y] + "</a></td>";
									}
									else{
										result += "<td style='border: 1px solid black'>" 
										+ table_cells[x][y] + "</td>";
									}
								}
								result += "</tr>";
							}
							result += "</table>";
							$('#table').append(result);
						}
						// display distribution graph
						else if (tabName == 'distribution-graph-tab'){
    						$('#distribution-graph').empty();
    						for (i = 0; i < list_names.length; i++){
    							// go through distribution_data and replace card ids with card names
    							for (j = 0; j < distribution_data[i].length; j++){
    								for (k = 0; k < distribution_data[i][j].cards.length; k++){
    									for (n = 0; n < card_id_and_name.length; n++){
    										if(distribution_data[i][j].cards[k] == card_id_and_name[n][0]){
    											distribution_data[i][j].cards[k] = "<br><a href='" 
    											+ card_id_and_name[n][2] + "'>" 
    											+ card_id_and_name[n][1] + "</a>";
    										}
    									}
    								}
    							}
    							$('#distribution-graph').append("<div id='distribution-graph" + [i] 
    								+ "'></div>");
    							Highcharts.chart('distribution-graph' + [i], {
        							chart: {
            							type: 'column'
        							},
        							title: {
           								text: 'Cards time distribution for list: ' + list_names[i]
        							},
       								xAxis: {
       									title: {
       										text: 'Number of days spent in this list'
        								},
           								categories: categories
        							},
        							yAxis: {
           								title: {
           									text: 'Number of cards'
       									}
       								},
       								tooltip: {
       									formatter: function(){
       										return '<b>Number of cards: </b>' + this.point.y 
       										+ '<br><b>Cards: </b>' + this.point.cards;
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
       														maincontentText: '<b>Number of cards: </b>' 
       														+ this.y + '<br><b>Cards: </b>' + this.cards
       													});
       												}
       											}
       										},
       									}
       								},
        							series: [{
        								showInLegend: false,
            							name: ' ',
            							data: distribution_data[i]
        							}]
    							});
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
    							$('#distribution-graph' + [i]).append('<h4 style="text-align: center;">Average: ' + average + ' days </h4>');
    							
    							// CALCULATE STANDARD DEVIATION
    							var squared_difference = [];
    							for (j = 0; j < data_array.length; j++){
    								squared_difference.push((data_array[j] - average) * (data_array[j] - average));
    							}
    							var standard_deviation = Math.round((Math.sqrt(squared_difference.reduce(add, 0) / squared_difference.length) * 100)) / 100;
    							$('#distribution-graph' + [i]).append('<h4 style="text-align: center;">Standard Deviation: ' + standard_deviation + ' days</h4><br><br>');
    						}
    						// console.log(distribution_data);
    						// console.log(card_id_and_name);
						}
					}
				});
			});
		});	
	});
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

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	document.getElementById(tabName).className += " active";
	// evt.currentTarget.className += "active";
}


// Addition helper
function add(a, b){
	return a + b;
}


// Format date to milliseconds and correct timezone
function ms(date){
	return Date.parse(date) - 14400000;
}


// Format date to be displayed 
function formatDate(date){
	var milliseconds = Date.parse(date) - 14400000; // minus 8 hours
	var newDate = new Date(milliseconds);
	return newDate.toString().slice(0, 24);
}


// Display the card history for a specified card
function getHistory(idCard) {
	// Get all actions for specified card
	$.get("/trello/actions/"+idCard, function(data, status) {
		// sort list by date (earliest date first)
		var sorted = data.sort(function(a, b) {
			if (a.date < b.date){return -1;}
			if (a.date > b.date){return 1;}
			return 0;
		});
		var closed_tracker = false;
		var div_id = '#history' + idCard;
		// Make sure div is empty
		$(div_id).empty();
		// Append date and time that the card was created
		$(div_id).append('Created at: ' + formatDate(sorted[0].date) + '<br>');
		// Append list that the card was created in
		$(div_id).append('Created in list: ' + sorted[0].createdinlist + '<br><br>');
		// Append the other activity of the card
		for (i = 1; i < sorted.length; i++) {
			// Append card movements between lists
			if (sorted[i].listbefore != null){
				$(div_id).append(formatDate(sorted[i].date) + '<br> Moved from <i>' 
				+ sorted[i].listbefore + '</i> to <i>' + sorted[i].listafter + '</i><br><br>');
			}
			// Append card closed/reopened
			else if (sorted[i].closed != closed_tracker){
				closed_tracker = sorted[i].closed;
				if(sorted[i].closed==true){
					$(div_id).append(formatDate(sorted[i].date) + '<br> Card closed. <br><br>');
				}
				else{
					$(div_id).append(formatDate(sorted[i].date) + '<br> Card reopened. <br><br>');
				}
			}
		}
	});
}
