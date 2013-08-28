angular
		.module(
				'ngBoilerplate.sessionReportConfig',
				[ 'ui.state', 'placeholders', 'ui.bootstrap', 'titleService',
						'ui' ])

		.config(
				function config($stateProvider) {
					$stateProvider
							.state(
									'sessionReportConfig',
									{
										url : '/sessionReportConfig',
										views : {
											"main" : {
												controller : 'SessionCtrl',
												templateUrl : 'sessionReportConfig/sessionReportConfig.tpl.html'
											}
										}
									});
				})

		.controller(
				'SessionCtrl',
				function SessionCtrl($scope, titleService, stateListService,
						testCenterService,sessionsService) {
						$scope.reset={};
					titleService.setTitle('Split Session Configuration');
					//Start Date option setup
					var today = new Date();
					$scope.fromDateOptions = {
						minDate : today,
						defaultDate : "+1w",
						changeMonth : true,
						changeYear : true,
						numberOfMonths : 1
					};
					// Restricts End Date Selection
					$scope.restrictEndDate = function() {
						$scope.toDateOptions = {
							defaultDate : this.date.fromDate,
							changeMonth : true,
							changeYear : true,
							numberOfMonths : 1,
							minDate : this.date.fromDate,
							maxDate : this.date.fromDate + "+1m"
						};

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
								this.sessionForm.states.abbr).success(
								handleSuccess);
					};
					//Resets Form Data
					$scope.clear = function() {
					$scope.sessionForm=angular.copy($scope.reset);
					this.date.fromDate='';
					this.date.toDate='';
					};
					//Gets All the Sessions to display on Screen
						$scope.getSessions = function() {
						var fromDate=this.date.fromDate;
						var toDate=this.date.toDate;
						var state=this.sessionForm.states.abbr;
						var centerID=this.sessionForm.selectTestCenter;
						console.log(centerID);
						var handleSuccess = function(data, status) {
									if (angular
														.isArray(data.SessionInfo.TestCenterInfo)) {
													
													 $scope.sessionsList =  data.SessionInfo.TestCenterInfo;
													
												

												} else {
													$scope.sessionsList = [data.SessionInfo.TestCenterInfo];
													
												

												}
							console.log(data);
						};
						//IF The user selects all...Then All Sessions Will be displayed to the screen...
						if (this.sessionForm.selectTestCenter != "all") {
						sessionsService.getSessionByTestCenter(fromDate,toDate,state,centerID).success(
								handleSuccess);}
								else{
						sessionsService.getSessionByState(fromDate,toDate,state).success(handleSuccess);
								}
					};
					

				});
