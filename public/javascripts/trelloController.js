angular.module('trello', [])
.controller('trelloController', ($scope, $http) => {
	$scope.boardSelected = boardSelected;
	$scope.getHistory = getHistory;
	$scope.openTab = openTab;
	$scope.generateFigure = generateFigure;
	// Get boards
	$http.get('/trello/boards')
	.success((data) => {
		if (! sessionStorage.justOnce) {
        	sessionStorage.setItem("justOnce", "true");
        	location.reload();
    	}
		$scope.boardData = data;
		// console.log(data);
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