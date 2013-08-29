angular
		.module(
				'ngBoilerplate.incidentReport',
				[ 'ui.state', 'placeholders', 'ui.bootstrap', 'titleService',
						'ui' ])

		.config(
				function config($stateProvider) {
					$stateProvider
							.state(
									'incidentReport',
									{
										url : '/incidentReport',
										views : {
											"main" : {
												controller : 'IncidentCtrl',
												templateUrl : 'incidentReport/incidentReport.tpl.html'
											}
										}
									});
				})

		.controller(
				'IncidentCtrl',
				function IncidentCtrl($scope, titleService, stateListService,
						testCenterService) {
						$scope.reset={};
					titleService.setTitle('Incident Report Service');
					//Start Date option setup
					var today = new Date();
					$scope.timeDiscoveredOptions = {
						minDate : today,
						defaultDate : "+1w",
						changeMonth : true,
						changeYear : true,
						numberOfMonths : 1
					};
					$scope.timeContactedOptions ={
						minDate : today,
						defaultDate : "+1w",
						changeMonth : true,
						changeYear : true,
						numberOfMonths : 1
					};
					$scope.timeResolved ={
						minDate : today,
						defaultDate : "+1w",
						changeMonth : true,
						changeYear : true,
						numberOfMonths : 1
					};
				
				
					stateListService.get(function(data) {
						$scope.states = data.StateList.States;
						// states
					});
					$scope.testCenters = function() {
						var handleSuccess = function(data, status) {
							$scope.testCenterList = data.TestCenters.TestCenterInfo;
							console.log($scope.testCenterList);
						};
						testCenterService.getTestCenters(
								this.incidentForm.states.abbr).success(
								handleSuccess);
					};
					//Resets Form Data
					$scope.clear = function() {
					$scope.incidentForm=angular.copy($scope.reset);
					this.date.timeDiscovered='';
					this.date.timeResolved='';
					this.date.timeContacted='';
					};
				
					

				});
