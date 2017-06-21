function reload(){
	location.reload();
}

// Handle board selection: show hidden elements & retrieve list data fromt Trello
function boardSelected(boardID) {
	// show elements
	document.getElementById('hidden_table1').style.display="block";
    document.getElementById('hidden_table2').style.display="block";
    document.getElementById('hidden_board_link').style.display="block";
    document.getElementById('hidden_tab').style.display="block";
	// console.log(boardID);
	// get unarchived lists of this board from Trello
	// Trello.get(
	// 	'/boards/' + boardID + '/lists', 
	// 	storeLists, 
	// 	function(){console.log('failed to get lists');}
	// );
	// get unarchived lists of this board from Trello
	// Trello.get(
	// 	'/boards/' + boardID + '/lists?filter=closed', 
	// 	storeLists, 
	// 	function(){console.log('failed to get lists');}
	// );
	// get current time
	// var present = new Date();
	// console.log(present);
	// var six_months_ago = addMonths(present, -6).toISOString();
	// console.log(six_months_ago);
	// get actions of this board from Trello
	// if actions in last 6 months > 1000, need to break this up into 2 requests
	// since -6 before -3, and then since -3 (to present)
	// Trello.get(
	// 	'/boards/' + boardID + '/actions?filter=updateCard:idList,updateCard:closed,createCard&since=' + six_months_ago,
	// 	storeActions,
	// 	function(){console.log('failed to get actions');}
	// );

	// Trello.post(
	// 	'/webhooks?idModel=' + boardID + ''
	// );
	
}


function addMonths(date, months){
	date.setMonth(date.getMonth() + months);
	return date;
}


// Store lists
// var storeLists = function(lists){
// 	// for each list
// 	$.each(lists, function(index, list) {
// 		// store the list in database
// 		$.post('/trello/lists', {
// 			id: list.id,
// 			idBoard: list.idBoard,
// 			name: list.name,
// 			closed: list.closed
// 		});
// 		// Get the unarchived cards of each list from Trello
// 		// get current time
// 		var present = new Date();
// 		var six_months_ago = addMonths(present, -6).toISOString();
// 		Trello.get(
// 			'/lists/' + list.id + '/cards?since=' + six_months_ago,
// 			storeCards,
// 			function(){console.log('failed to get cards');}
// 		);
// 		// Get the archived cards of each list from Trello
// 		Trello.get(
// 			'/lists/' + list.id + '/cards?filter=closed&since=' + six_months_ago,
// 			storeCards,
// 			function(){console.log('failed to get cards');}
// 		);
// 	});
// }


// Store cards
// var storeCards = function(cards){
// 	// console.log(cards);
// 	// for each card
// 	$.each(cards, function(index, card) {
// 		// store the card in database
// 		// if card has no due date
// 		if(card.due==null){
// 			$.post('/trello/cards', {
// 				id: card.id,
// 				name: card.name,
// 				description: card.desc,
// 				dueComplete: card.dueComplete,
// 				idBoard: card.idBoard,
// 				idList: card.idList,
// 				shortURL: card.shortUrl,
// 				closed: card.closed
// 			});
// 		}
// 		// if card has due date
// 		else{
// 			$.post('/trello/cards', {
// 				id: card.id,
// 				name: card.name,
// 				description: card.desc,
// 				due: card.due,
// 				dueComplete: card.dueComplete,
// 				idBoard: card.idBoard,
// 				idList: card.idList,
// 				shortURL: card.shortUrl,
// 				closed: card.closed
// 			});
// 		}
// 	});
// }


// Store actions
// var storeActions = function(actions){
// 	// console.log(actions);
// 	$.each(actions, function(index, action) {
// 		if(action.type == 'createCard'){
// 			$.post('/trello/actions', {
// 				id: action.id,
// 				idCard: action.data.card.id, 
// 				date: action.date,
// 				type: action.type,
// 				createdInList: action.data.list.name,
// 				createdInListId: action.data.list.id
// 			});
// 		}
// 		else if(action.type == 'updateCard'){
// 			if (action.data.old.closed!=null){
// 				$.post('/trello/actions', {
// 					id: action.id,
// 					idCard: action.data.card.id, 
// 					date: action.date,
// 					type: action.type,
// 					closedInList: action.data.list.name,
// 					closedInListId: action.data.list.id,
// 					closed: action.data.card.closed
// 				});
// 			}
// 			else {
// 				$.post('/trello/actions', {
// 					id: action.id,
// 					idCard: action.data.card.id, 
// 					date: action.date,
// 					type: action.type,
// 					listBefore: action.data.listBefore.name,
// 					listBeforeId: action.data.listBefore.id,
// 					listAfter: action.data.listAfter.name,
// 					listAfterId: action.data.listAfter.id
// 				});
// 			}
// 		}
// 	});
// }


// Trello authorization
// Trello.authorize({
//   	type: 'popup',
//   	name: 'Getting Started Application',
//   	scope: {
//     	read: 'true',
//     	write: 'true' 
//     },
//   	expiration: 'never',
//   	success: function() {
//   		console.log('authetication success');},
//   	 error: function(){console.log('authentication failure)');}
// });


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

	// Generate the graph
	if (tabName == "list-graph-tab" || tabName == "card-graph-tab"){
		// process data here
		// if tabName=="list-graph-tab"
			// call displaygraph function to display the list graph
		// else if tabName=="card-graph-tab"
			// display list names for the selected board
			// 
		displayGraph(idBoard);
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	document.getElementById(tabName).className += " active";
	// evt.currentTarget.className += "active";
}


function displayListGraph(title, xAxisTitle, xAxisCategories, yAxisTitle, displayData){
	var myChart = Highcharts.chart('list-graph', {
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        xAxis: {
        	title: {
        		text: xAxisTitle
        	},
           	categories: xAxisCategories
        },
        yAxis: {
            title: {
               	text: yAxisTitle
           	}
       	},
        series: [{
            name: ' ',
            data: displayData
        }]
    });	
}

// Generate graph
function displayGraph(idBoard){
	// queries and data processing
		// PRESENT TIME
		// var present = new Date(Math.floor(Date.now()));
		var present = Math.floor(Date.now());
		// console.log(present);

		// get current time
		var present_date = new Date();
		var six_months_ago = addMonths(present_date, -6).toISOString().slice(0, 10);
		// console.log(six_months_ago);

		var list_names;
		var list_actions;
		// var promises;
		var length

		$.get('/trello/lists/' + idBoard, function(data){
			list_names = new Array(data.length);
			list_actions = new Array(data.length);
			length = data.length;

			$.each(data, function(index, list) {
				list_names[index] = list.name;
				
				$.get('/trello/actions_by_list/' + list.id + '/' + six_months_ago, function(data1){
					list_actions[index] = new Array(data1.length);
					$.each(data1, function(index2, action){
						list_actions[index][index2] = action;
					});
				}).done(function(){
					if([index] == length-1){
						var display_time = new Array(length);
						// for every list
						for (i = 0; i < list_actions.length; i++){
							var tTime = [];
							var idCard = [];
							var k = 0;
							var time = 0;
							if (list_actions[i].length > 0){
								var current_idCard = list_actions[i][0].idcard;
							}
							// for every action
							for (j = 0; j < list_actions[i].length; j++){
								if (list_actions[i][j+1] && list_actions[i][j].idcard == list_actions[i][j+1].idcard){
									time += (ms(list_actions[i][j+1].date) - ms(list_actions[i][j].date));
									j++;
									if (list_actions[i][j+1] && list_actions[i][j].idcard != list_actions[i][j+1].idcard){
										tTime[k] = time/3600000;
										idCard[k] = current_idCard;
										current_idCard = list_actions[i][j+1].idcard;
										time = 0;
										k++;
									}
									else if (!list_actions[i][j+1]){
										tTime[k] = time/3600000;
										idCard[k] = current_idCard;
										time=0;
										k++;
									}
								}
								else {
									time += (present - ms(list_actions[i][j].date));
									tTime[k] = time/3600000;
									idCard[k] = current_idCard;
									if(list_actions[i][j+1]){
										current_idCard = list_actions[i][j+1].idcard;
									}
									time = 0;
									k++;
								}
							}
							console.log(tTime);
							console.log(idCard);
							display_time[i] = tTime.reduce(add, 0) / tTime.length;
						}
						console.log(display_time);
						// create chart
						var myChart = Highcharts.chart('list-graph', {
        					chart: {
            					type: 'column'
        					},
        					title: {
            					text: 'Average time that cards are in each list in the past 6 months'
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
            					name: ' ',
            					data: display_time
        					}]
    					});	
					}
				});
			});
		});
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
		// console.log(sorted);
		var closed_tracker = false;
		var div_id = '#history' + idCard;
		// Make sure div is empty
		$(div_id).empty();
		// Append date and time that the card was created
		$(div_id).append('Created at: ' + formatDate(sorted[0].date) + '<br>')
		// Append list that the card was created in
		$(div_id).append('Created in list: ' + sorted[0].createdinlist + '<br><br>');
		// Append the other activity of the card
		for (i = 1; i < sorted.length; i++) {
			// Append card movements between lists
			if (sorted[i].listbefore != null){
				$(div_id).append(formatDate(sorted[i].date) + '<br> Moved from <i>' + sorted[i].listbefore + '</i> to <i>' + sorted[i].listafter + '</i><br><br>');
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

