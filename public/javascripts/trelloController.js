angular.module('trello', [])
.controller('trelloController', ($scope, $http) => {
	$scope.boardSelected = boardSelected;
	$scope.getHistory = getHistory;
	$scope.openTab = openTab;
	$scope.generateFigure = generateFigure;

	// Get oauth_token from url
	urlParam = function(name){
		var results = 
		new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}
	var token = urlParam("oauth_token");
	// console.log(token);
	
	// Get member identified with the oauth_token
	$http.get('/trello/member/' + token)
	.success((data) => {
		var memberid = data[0].id;
		//console.log(memberid);

		// Get only the boards that the member has access to
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
	
	// There is no need to limit the following queries
	// to be only data that the member has access to, because
	// this is done by angularjs in /views/trello.ejs

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
