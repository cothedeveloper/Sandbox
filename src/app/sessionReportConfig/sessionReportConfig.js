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
						
						$scope.inputDiv="hide-element";
						$scope.isTable="hide-element";
						
					titleService.setTitle('Split Session Configuration');
					//Start Date option setup
					var today = new Date();
					$scope.fromDateOptions = {
						minDate : today,
						defaultDate : "+1w",
						changeMonth : true,
						changeYear : false,
						numberOfMonths : 1
					};
					
					
					// Restricts End Date Selection
					$scope.restrictEndDate = function() {
					var maxDateRestriction=DateFromString(this.date.fromDate);
						$scope.toDateOptions = {
							defaultDate : "+15D",
							changeMonth : true,
							changeYear : false,
							numberOfMonths : 1,
							minDate : this.date.fromDate,
							maxDate : maxDateRestriction
						};

					};
					//Gets the States in the dropdown
					stateListService.get(function(data) {
						$scope.states = data.StateList.States;
					});
					
					//This is called on change when user selects state. We take the abbr to get test centers related.
					$scope.testCenters = function() {
						var handleSuccess = function(data, status) {
							$scope.testCenterList = data.TestCenters.TestCenterInfo;
							console.log($scope.testCenterList);
						};
						testCenterService.getTestCenters(
								this.sessionForm.states.abbr).success(
								handleSuccess);
					};
					
					//This is to Edit the row or session.  Links to Edit Button
					var index;
					$scope.editRow = function(index){
					console.log(index);
					$scope.inputForm=index;
					//console.log($scope.inputForm.data);
					//This hides the Div after user clicks edit
					$scope.isHidden="hide-element";
					$scope.inputDiv="";
					//This clears the session input form. When user go back and forth.
					$scope.session="";
					}
					//Resets Form Data
					$scope.clear = function() {
					$scope.sessionForm=angular.copy($scope.reset);
					this.date.fromDate='';
					this.date.toDate='';
					};
					
					//Clears the session input criteria
					$scope.clearInputForm = function (){
					$scope.session="";
					
					}
					//This cancel button will send you to previous page. Using CSS
					$scope.cancel = function() {
					//Search session is displayed
					$scope.isHidden="";
					//Input criteria is hidden
					$scope.inputDiv="hide-element";
					
					}
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
													 	//Displays table after invoked...
														$scope.isTable="";
													
												

												} else {
													$scope.sessionsList = [data.SessionInfo.TestCenterInfo];
													//Displays table after invoked...
														$scope.isTable="";
													
												

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
				
				
					//Start of 15 days restriction on to DATE
					 function DateFromString(str){ 
						str = str.split(/\D+/);
						str = new Date(str[2],str[0]-1,(parseInt(str[1])+15));
						return MMDDYYYY(str);
					}
					
					function MMDDYYYY(str) {
						var ndateArr = str.toString().split(' ');
						var Months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec';
						return (parseInt(Months.indexOf(ndateArr[1])/4)+1)+'/'+ndateArr[2]+'/'+ndateArr[3];
					}

					function Add15Days() {
						var date = this.date.fromDate;
						var ndate = DateFromString(date);
						return ndate;
					}

					$('#start_date').change(function(){
						$('#end_date').val(Add15Days());
					});
					//END of 15 days restriction
