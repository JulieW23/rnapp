// Get oauth_token from url
urlParam = function(name){
	var results = 
	new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}


// Handle board selection: 
// show hidden elements & retrieve list data fromt Trello
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
function generateFigure(idBoard, tabName, fromInput, toInput){
	// process user selected time range
	var range = getTimeRange(fromInput, toInput);
	var fromDate = range.fromDate;
	var toDate = range.toDate;
	//oauth_token from url, used to identify the user, and get only cards that 
	// the user has access to
	var oauth_token = urlParam("oauth_token");
	var num_days = (ms(toDate)-ms(fromDate))/86400000;
	// lists id and name
	var list_id_and_name = [];
	// all list names
	var list_names;
	// all actions per list [[], [], [], ...]
	var list_actions;
	// number of lists
	var length;
	// all cards
	var cards;
	// the distribution table as a 2d array
	var table_cells = [['idCard', 'shorturl', 'Card']];
	// array that stores card id + name + shorturl so that they can be 
	//matched (for distribution charts)
	// [card.id, card.name, card.shorturl, card.idlist]
	var card_id_and_name = [];
	// get cards for this board
	$.get('/trello/cards/memberships/' + oauth_token, function(carddata){
		cards = new Array(carddata.length);
		$.each(carddata, function(index, card){
			cards[index] = card;
		});
	}).done(function(){
		// get lists for this board and store it all in variables defined above
		$.get('/trello/lists/' + idBoard, function(data){
			list_names = new Array(data.length);
			list_actions = new Array(data.length);
			length = data.length;
			$.each(data, function(index, list){
				list_names[index] = list.name;
				table_cells[0].push(list.name);
				list_id_and_name.push([list.id, list.name]);
			});
		}).done(function(){ // after storing data for all lists
			// tidy up table
			// for table_cells, for distribution table
			for (i = 0; i < cards.length; i++){
				//console.log(cards[i]);
				var push = [cards[i].id, cards[i].shorturl, cards[i].name];
				card_id_and_name.push([cards[i].id, cards[i].name, cards[i].shorturl, cards[i].idlist]);
				for (j = 0; j < length; j++){
					push.push('0');
				}
				table_cells.push(push);
			}
			// for each list
			async.eachSeries(list_id_and_name, function(list, done){
				// get the actions for the list and store them in list_actions
				$.get('/trello/actions_by_list/' + list[0], function(data1){
					var index1 = list_id_and_name.indexOf(list);
					list_actions[index1] = new Array(data1.length);
					$.each(data1, function(index2, action){
						list_actions[index1][index2] = action;
					});
					done();
				});
			}, function(err) {
				if (err) {
					throw err;
				}
				// console.log(table_cells);
				// ALL DATA IS STORED AND READY TO BE USED
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
					// Initial time is negative (=-1) to ensure that cards 
					// that do not exist within the time range will not be 
					// counted in charts/tables.
					// When the processed data from this section is being 
					// prepared for displaying, any entry where the time is a 
					// negative value will be ignored
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
								if(time == -1){
									time = 0;
								}
								time += (ms(list_actions[i][j+1].date) - ms(list_actions[i][j].date))/3600000;
							}
							j++;
							// if the next action is for a different card
							if (list_actions[i][j+1] && list_actions[i][j].idcard != list_actions[i][j+1].idcard){
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
							tTime[k] = time;
							idCard[k] = current_idCard;
							time = -1;
							k++;
							// if there are still actions for other cards
							if (list_actions[i][j+1]){
								current_idCard = list_actions[i][j+1].idcard;
							}
						}
					} // all data has been processed for this list
					// *** next step: prepare the data to be displayed ***
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
					// for every entry in tTime/for every card
					// console.log(card_id_and_name);
					// console.log(list_actions);
					for (m = 0; m < tTime.length; m++){
						// if the card is in the list, set time to 0
						// createdinlistid or listafterid
						for (x = 0; x < card_id_and_name.length; x++){
							if (idCard[m] == card_id_and_name[x][0] && 
							(card_id_and_name[x][3] == 
							list_actions[i][0].createdinlistid || 
							card_id_and_name[x][3] == 
							list_actions[i][0].listafterid)){
								tTime[m] = -1;
							}
						}
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
						for (n = 1; n < table_cells.length; n++){
							if (idCard[m] == table_cells[n][0]){
								// table_cells[n][i+3] = Math.round(tTime[m] * 100) / 100;
								table_cells[n][i+3] = Math.round((tTime[m]/24)*10) / 10;
							}
						}
					}
					// store data for list chart
					display_time[i] = tTime.reduce(add, 0) / tTime.length;
				} // data is now ready to be displayed
				// *** next step: displaying the required chart ***
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
    				});	// end of highcharts
				} // end of display list chart
				// display table
				else if (tabName == 'distribution-table'){
					$('#table').empty();
					var result = "<table>";
					for (x = 0; x < table_cells.length; x++){
						result += "<tr>";
						for (y = 2; y < table_cells[x].length; y++){
							if(y==2 && x>0){
								result += 
								"<td style='border: 1px solid black'><a href='" 
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

					// Create array for the overall table, 
					// and insert the first row of the table
					var averages_table = [['<b>List</b>', 
					'<b>Average (Days)</b>', 
					'<b>Standard Deviation (Days)</b>', '<b>Minimum Days</b>', 
					'<b>Maximum Days</b>']];

					// console.log(list_names);
					console.log(distribution_data);
					// console.log(card_id_and_name);
					for (i = 0; i < list_names.length; i++){
						// go through distribution_data and replace card ids with card names
						for (j = 0; j < distribution_data[i].length; j++){
    						for (k = 0; k < distribution_data[i][j].cards.length; k++){
    							for (n = 0; n < card_id_and_name.length; n++){
    								//console.log(distribution_data[i][j].cards[k]);
    								if(distribution_data[i][j].cards[k] == card_id_and_name[n][0]){
    									distribution_data[i][j].cards[k] = "<br><a href='" 
    									+ card_id_and_name[n][2] + "'>" 
    									+ card_id_and_name[n][1] + "</a>";
    								}
    								//console.log(distribution_data[i][j].cards[k]);
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
           						text: 'Cards time distribution for list: ' + list_names[i]
        					},
        					subtitle: {
            					text: document.ontouchstart === undefined ?
                    				'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        					},
       						xAxis: {
       							title: {
       								text: 'Number of days spent in this list'
        						},
           						categories: categories.slice(0, j+1)
        					},
        					yAxis: {
           						title: {
           							text: 'Number of cards'
       							}
       						},
       						tooltip: {
       							formatter: function(){
       								return '<b>Days: </b>' + this.x + '<br><b>Number of cards: </b>' + this.point.y 
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
       												maincontentText: '<b>Days: </b>' + this.x + '<br><b>Number of cards: </b>' 
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
            					data: distribution_data[i].slice(0, last_useful+1)
        					}]
    					}); // end of highcharts 
						calcAverage(distribution_data, averages_table, last_useful, list_names, ' Cards ', ' List ');
					} // end of for each list
				} // end of (if) display distribution graph
			}); // end of calculation section
		}); // end of get lists from database
	}); // end of get cards from database
} // end of generateFigure function


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
