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
				function SessionCtrl($scope, $modal,titleService, stateListService,
						testCenterService,sessionsService,sessionSplitService) {
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
						$scope.states = data.States.State;
					//	console.log($scope.states);
					});
					
					//This is called on change when user selects state. We take the abbr to get test centers related.
					$scope.testCenters = function() {
						var handleSuccess = function(data, status) {
							$scope.testCenterList = data.TestCenters.TestCenterInfo;
							console.log($scope.testCenterList);
						};
						testCenterService.getTestCenters(
								this.sessionForm.states.code.$).success(
								handleSuccess);
					};
					
					//This is to Edit the row or session.  Links to Edit Button
					var index;
					$scope.editRow = function(index){
					
					
					console.log(index);
					$scope.inputForm=index;
					//This hides the Div after user clicks edit
					$scope.isHidden="hide-element";
					$scope.inputDiv="";
					//This clears the session input form. When user go back and forth.
					$scope.session="";
					this.session.seats=10;
					}
					//Resets Form Data
					$scope.clear = function() {
					$scope.sessionForm=angular.copy($scope.reset);
					this.date.fromDate='';
					this.date.toDate='';
					};
					
					//Clears the session input criteria
					$scope.clearInputForm = function (){
					//$scope.closeAlert(index);
					$scope.session="";
					$scope.inputForm.session.seats="";
					$scope.inputForm.startTime.hour="";
					$scope.inputForm.startTime.minute="";
					$scope.inputForm.startTime.midnight="";
					$scope.inputForm.endTime.hour="";
					$scope.inputForm.endTime.minute="";
					$scope.inputForm.endTime.midnight="";
					
					
					}
					//This cancel button will send you to previous page. Using CSS
					$scope.cancelBack = function() {
					//Search session is displayed
					$scope.isHidden="";
					//Input criteria is hidden
					$scope.inputDiv="hide-element";
					
					}
					//Gets All the Sessions to display on Screen
						$scope.getSessions = function() {
						
						var fromDate=this.date.fromDate;
						var toDate=this.date.toDate;
						var state=this.sessionForm.states.code.$;
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
					
					//Split Session.  Sends to request to Service once it passes validation...
					$scope.splitSession = function(){
					var startTime= this.inputForm.startTime.hour;
					var endTime=this.inputForm.endTime.hour;
					var compareStartTime = startTime.concat(":").concat(this.inputForm.startTime.minute).concat(":00 ").concat(this.inputForm.startTime.midnight);
					var compareEndTime = endTime.concat(":").concat(this.inputForm.endTime.minute).concat(":00 ").concat(this.inputForm.endTime.midnight);
					var serviceEndTime=toDate(compareEndTime);
					var serviceStartTime=toDate(compareStartTime);
					console.log("STart Time");
					console.log(serviceStartTime);
					console.log(serviceEndTime);
					
					
					console.log(this.inputForm.Reserved_Seat_Count.$);
					var handleSuccess = function(data, status) {
					$scope.splitSessionResponse=data.Add_Split_Session_Response.responsedata.Message.$;
					var splitResponse= $scope.splitSessionResponse;
				
					$scope.open(splitResponse);
				
					console.log("Below is the response from Teams Input Proxy");
					
					console.log(data);
					
					console.log(status);
					
					
					};
					
					
					
					//Sets the Date that I need to send to service.  Function below.
					var serviceRequestEndDate=convertDate(serviceEndTime,this.inputForm.Session_Date.$);
					var serviceRequestStartDate=convertDate(serviceStartTime,this.inputForm.Session_Date.$);
					
					
					
					
					//console.log("Session DATE:  "+serviceRequestEndDate);
					//if(this.inputForm.Reserved_Seat_Count.$ <= this.session.seats || this.session.seats==0){
				//	$scope.alerts = [{ type: 'error', msg: '# of seats value should be greater than 0 and less than test center capacity.' }];
				//	}
					//console.log(this.inputForm.Session_ID.$);
					//console.log($scope.session.endTime);
					//console.log($scope.session.startTime);
					//console.log(this.session.seats);
					sessionSplitService.splitSession(this.inputForm.Session_ID.$,serviceRequestEndDate,serviceRequestStartDate,this.inputForm.session.seats).success(handleSuccess);
					
					 //$scope.alerts = [{ type: 'error', msg: 'Original session end time should be more than its start time.' }];
					 //$scope.alerts = [{ type: 'error', msg: 'New session start time should be more or equal to original session end time.' }];
					 }//End Of SplitSession Function
					
					$scope.closeAlert = function(index) {
						$scope.alerts.splice(index, 1);
					};
							
					$scope.open = function (value) {
					var modalInstance = $modal.open({
					templateUrl: 'myModalContent.html',
					controller: ModalInstanceCtrl,
					resolve: {
					response: function () {
					return value;
					}
							}
					}
						)};
						
					$scope.ok = function () {
					$modalInstance.dismiss('cancel');
					};

					$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
					};

				});//End Of Session Report Controller
				
				//Modal Control
				var ModalInstanceCtrl = function ($scope, $modalInstance, response) {
				$scope.response=response;
				//"Show the return Message from Service here.  Determine what is the success flow";
				 // $scope.items = items;
				// $scope.selected = {
				//	item: $scope.items[0]
				 // };

				  $scope.ok = function () {
				//	$modalInstance.close($scope.selected.item);
				  };

				  $scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				  };
				};
				
				
				
				  //Date Manipulation
				  function convertDate(formDate,orignalDate){
					var spliceDate=orignalDate;
					var sDate=spliceDate.split("T");
					var hour=formDate.getHours();
					var min=formDate.getMinutes();
					var seconds=formDate.getSeconds();
					var milli=formDate.getMilliseconds();
					var serviceEndDate=sDate[0];
					var serviceRequestEndDate=serviceEndDate.concat(" "+hour+":").concat(min+":").concat(seconds+".").concat(milli);
					return serviceRequestEndDate;
				  
				  
				  }
				
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
					
					//This will change the Time to A Date; then I will need to Parse.
					function toDate(dateString) {
						var timeComponents = dateString.replace(/\s.*$/, '').split(':');

						if (dateString.indexOf("PM") > -1) {
						   timeComponents[0] -= 12;
						}

						var date = new Date();
						date.setHours(timeComponents[0]);
						date.setMinutes(timeComponents[1]);
						date.setSeconds(timeComponents[2]);

						return date;
					}
					
					
					
					
