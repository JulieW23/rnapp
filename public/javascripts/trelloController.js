angular.module('trello', [])
.controller('trelloController', ($scope, $http) => {
	$scope.boardSelected = boardSelected;
	$scope.getHistory = getHistory;
	$scope.openTab = openTab;
	$scope.generateFigure = generateFigure;

	// Get oauth_token from url
	urlParam = function(name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}
	var token = urlParam("oauth_token");
	// console.log(token);
	
	// Get member
	$http.get('/trello/member/' + token)
	.success((data) => {
		var memberid = data[0].id;
		//console.log(memberid);

		// Get boards
		$http.get('/trello/boards/' + memberid)
		.success((data) => {
			$scope.boardData = data;
			// console.log(data);
		})
		.error((error) => {
			console.log('Error: ' + error);
		});

	})
	.error((error) => {
		console.log('Error: ' + error);
	});
	
	
	// Get open lists
	$http.get('/trello/openlists')
	.success((data) => {
		$scope.openListData = data;
		// console.log(data);
	})
	.error((error) => {
		console.log('Error: ' + error);
	});
	// Get all lists
	$http.get('/trello/lists')
	.success((data) => {
		$scope.allListData = data;
		// console.log(data);
	})
	.error((error) => {
		console.log('Error: ' + error);
	});
	// Get archived cards
	$http.get('/trello/archivedcards')
	.success((data) => {
		$scope.archivedCardData=data;
		// console.log(data);
	})
	// Get open cards
	$http.get('/trello/opencards')
	.success((data) => {
		$scope.openCardData=data;
		// console.log(data);
	})
	.error((error) => {
		console.log('Error: ' + error);
	});
});
