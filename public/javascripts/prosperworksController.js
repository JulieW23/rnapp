angular.module('prosperworks', [])
.controller('pwController', ($scope, $http) => {
	$scope.pipelineSelected = pipelineSelected;
	$scope.openTab = openTab;
	$scope.opTimeDistribution = opTimeDistribution;
	// get pipelines
	$http.get('/prosperworks/pipelines')
	.success((data) => {
		$scope.pipelinesData = data;
	})
	.error((error) => {
		console.log('Error: ' + error);
	});

	// get pipeline stages
	$http.get('/prosperworks/pipelinestages')
	.success((data) => {
		$scope.pipelinestagesData = data;
	})
	.error((error) => {
		console.log('Error: ' + error);
	});

	// get opportunities
	$http.get('/prosperworks/opportunities')
	.success((data) => {
		$scope.opportunitiesData = data;
	})
	.error((error) => {
		console.log('Error: ' + error);
	});
});
