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
										url : '/sessionReportConfig?accountID&userID',
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
				function SessionCtrl($scope,$rootScope,$filter, $modal,titleService, stateListService,
						testCenterService,sessionsService,sessionSplitService,$stateParams,configService,allTestCenterListService) {
						var userAccountID=$stateParams.accountID;
						var userID=$stateParams.userID;
					
					
					$scope.hours = [
									  {id:'01', value:'01'},
									  {id:'02', value:'02'},
									  {id:'03', value:'03'},
									  {id:'04', value:'04'},
									  {id:'05', value:'05'},
									  {id:'06', value:'06'},
									  {id:'07', value:'07'},
									  {id:'08', value:'08'},
									  {id:'09', value:'09'},
									  {id:'10', value:'10'},
									  {id:'11', value:'11'},
									  {id:'12', value:'12'}
									];
					
						$scope.reset={};
					//Initializing URLS for Services
					var testCenterURL="";
					var statesURL="";
					var sessionSplitURL="";
					var getSessionByTestCenterURL="";
					var getSessionByStateURL="";
					var getAllTestCentersURL="";
					//Gets the States in the dropdown
					$scope.getConfig = function() {
					configService.get(function(data) {
						$scope.config = data.service_configuration;
					
					
					//console.log('URL  '+data.service_configuration.service.TestCenterURL);
					testCenterURL=$scope.config.services[0].url;
					statesURL=$scope.config.services[1].url;
					sessionSplitURL=$scope.config.services[2].url;
					getSessionByTestCenterURL=$scope.config.services[3].url;
					getSessionByStateURL=$scope.config.services[4].url;
					getAllTestCentersURL=$scope.config.services[5].url;
					$scope.getStatesList(statesURL);
					$scope.getAllTestCenters(getAllTestCentersURL);
					
					
					});
					
					}
					

				//	console.log('NAME  '+$scope.config.services[0].name);
					
						
						$scope.inputDiv="hide-element";
						$scope.isTable="hide-element";
						$scope.resultsSpan="hide-element";
						
					titleService.setTitle('Split Session Configuration');
					var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
					var futureDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).add(14).days();
					//console.log(currentDate);
					var day = currentDate.getDate();
					var month = currentDate.getMonth() + 1;
					var year = currentDate.getFullYear();
					
					var futureDay= futureDate.getDate();
					var futureMonth= futureDate.getMonth() + 1;
					var futureYear= futureDate.getFullYear();
					
					$scope.fromDate= month+"/"+day+"/"+year;
					$scope.toDate=futureMonth+"/"+futureDay+"/"+futureYear;
					console.log($scope.toDate);
					//$scope.fromDate="12/16/1985";
					//Start Date option setup
					var days="1";
					var today = new Date();
					//$scope.fromDate=today;
					$scope.fromDateOptions = {
						minDate : today,
						defaultDate : "+1w",
						changeMonth : true,
						changeYear : false,
						numberOfMonths : 1,
					
						//showAnim: "fold"
					};
					//$scope.date.toDate=today;
					
					// Restricts End Date Selection
					
					$scope.restrictEndDate = function() {
					var maxDateRestriction=DateFromString(this.fromDate);
						$scope.toDateOptions = {
							defaultDate : "+15D",
							changeMonth : true,
							changeYear : false,
							numberOfMonths : 1,
							minDate : this.fromDate,
							maxDate : maxDateRestriction
						  //  showAnim: "fold"
						};

					};
				    $scope.restrictEndDate();//I run the restrict endDate on load since we pre-populate.
					
					//Gets the States in the dropdown
					var url;
					$scope.getStatesList = function(url) {
					//console.log(url);
						var handleStates = function(data, status) {
							$scope.states = data.States.State;
							
						};
						
						
					stateListService.getStates(url).success(handleStates);
					}
					
					$scope.getAllTestCenters = function(url){
					console.log(url);
					var handleAllTestCenters = function(data, status) {
							$scope.aTestCenters = data.TestCenters.TestCenterInfo;
						};
					allTestCenterListService.getAllTCenters(url).success(handleAllTestCenters);
					}
					//This below Line gets the URLS needed to invoke services. This is for all services.
					$scope.getConfig();
					
				
					//This is called on change when user selects state. We take the abbr to get test centers related.
					$scope.testCenters = function() {
						var handleSuccess = function(data, status) {
							$scope.testCenterList = data.TestCenters.TestCenterInfo;
							////console.log($scope.testCenterList);
							$scope.orderTestCenters ="testCenterList.Test_Center_ID.$";
						};
						testCenterService.getTestCenters(
								this.sessionForm.states.State_ID.$,testCenterURL).success(
								handleSuccess);
					};
					
					//This is to Edit the row or session.  Links to Edit Button
					var index;
					$scope.editRow = function(index){
					
					console.log(index);
					$scope.inputForm=index;
					$scope.comments="";
					$scope.seats=parseInt($scope.inputForm.Reserved_Seat_Count.$);
					//This sets the ID of the row we just edited.  From here we will highlight that row.  The expression
					//is on template.  using ng-class to evaluate which class to be used.
					$scope.setSelected(this.inputForm.Session_ID.$);
					//$scope.inputForm.session.seats=0;
					//This hides the Div after user clicks edit
					$scope.isHidden="hide-element";
					$scope.inputDiv="";
					//This clears the session input form. When user go back and forth.
					$scope.session="";
					
					}
					//Resets Form Data
					$scope.clear = function() {
					$scope.sessionForm=angular.copy($scope.reset);
					this.fromDate='';
					this.toDate='';
					this.testCenterList='';
					};
					
					//Clears the session input criteria
					$scope.clearInputForm = function (){
					//$scope.closeAlert(index);
					$scope.session="";
					$scope.comments="";
					$scope.seats="";
					$scope.inputForm.startTime.hour="";
					$scope.inputForm.startTime.minute="";
					$scope.inputForm.startTime.midnight="";
					$scope.inputForm.endTime.hour="";
					$scope.inputForm.endTime.minute="";
					$scope.inputForm.endTime.midnight="";
					$scope.inputForm.comments="";
					
					
					}
					//This cancel button will send you to previous page. Using CSS
					$rootScope.cancelBack = function() {
					//Search session is displayed
					$scope.isHidden="";
					//Input criteria is hidden
					$scope.inputDiv="hide-element";
					
					//Refreshes Sessions Page when Going Back to Results.
					$scope.getSessions();
					
									
					
					}//End of EditRow Function
					
					//Gets All the Sessions to display on Screen
						$scope.getSessions = function() {
						var fromDate=this.fromDate;
						var toDate=this.toDate;
						if(angular.isUndefined(this.sessionForm.states)||this.sessionForm.states== null){
						console.log('no damn state');
						var state=this.sessionForm.allTestCenters.State_ID.$;
						
						}else{
						var state=this.sessionForm.states.State_ID.$;
						}
						var flag="";
						//If Nothing is seleced from dropdown.  We set the flag.
						if (angular.isUndefined($scope.sessionForm.allTestCenters) ) {
						 flag="searchAllState";
						
						}else{
						//If the user goes back & forth between selecting a test Center & not; we need to set to check Null 
						//before setting the variable centerID
							if (this.sessionForm.allTestCenters== null)
						{
						
						flag="searchAllState";
						
						}else
						{
						
						var centerID=this.sessionForm.allTestCenters.Test_Center_ID.$;
						}
						
						}
						/*
						if($scope.sessionForm.allTestCenters.Test_Center_ID.$){
						var centerID=this.sessionForm.allTestCenters.Test_Center_ID.$;
						}else{
						flag="searchAllState";
						}*/
						
						var handleSuccess = function(data, status) {
						if(status==200){
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
							//console.log(data);
							
							$scope.resultsSpan="hide-element";
							}else{
							//If no results.. Hides the Table... Displays the Text. Empties results table.
							$scope.isTable="hide-element";
							$scope.sessionsList ="";
							$scope.resultsMessage="No Results Found";
							$scope.resultsSpan="";
							}
						};
						
					
						//IF The user selects all...Then All Sessions Will be displayed to the screen...
						if (flag =="searchAllState") {
						
								sessionsService.getSessionByState(fromDate,toDate,state,getSessionByStateURL).success(handleSuccess);
						}
								else{
				sessionsService.getSessionByTestCenter(fromDate,toDate,state,centerID,getSessionByTestCenterURL).success(
								handleSuccess);
								}
								
								$scope.orderProp ="sessionsList.Test_Center_ID.$";
					};
					
					//Split Session.  Sends to request to Service once it passes validation...
					$scope.splitSession = function(){
					var startTime= this.inputForm.startTime.hour;
					var endTime=this.inputForm.endTime.hour;
					var compareStartTime = startTime.concat(":").concat(this.inputForm.startTime.minute).concat(":00 ").concat(this.inputForm.startTime.midnight);
					var compareEndTime = endTime.concat(":").concat(this.inputForm.endTime.minute).concat(":00 ").concat(this.inputForm.endTime.midnight);
					var serviceEndTime=toDate(compareEndTime);
					var serviceStartTime=toDate(compareStartTime);
					////console.log("STart Time");
					////console.log(serviceStartTime);
					////console.log(serviceEndTime);
					
					
					////console.log(this.inputForm.Reserved_Seat_Count.$);
					var handleSuccess = function(data, status) {
					$scope.splitSessionResponse=data.Add_Split_Session_Response.responsedata.Message.$;
					var splitResponse= $scope.splitSessionResponse;
					//Opens up Modal
					$scope.open(splitResponse);
									};
					
					var handleError = function(data,status){
					
					$scope.noResultStr="No Results Found";
					////console.log("No Results");
					}
					
					
					
					//Sets the Date that I need to send to service.  Function below.
					var serviceRequestEndDate=convertDate(serviceEndTime,this.inputForm.Session_Date.$);
					var serviceRequestStartDate=convertDate(serviceStartTime,this.inputForm.Session_Date.$);
					
					
					
					
					////console.log("Session DATE:  "+serviceRequestEndDate);
					//if(this.inputForm.Reserved_Seat_Count.$ <= this.session.seats || this.session.seats==0){
				//	$scope.alerts = [{ type: 'error', msg: '# of seats value should be greater than 0 and less than test center capacity.' }];
				//	}
					////console.log(this.inputForm.Session_ID.$);
					////console.log($scope.session.endTime);
					////console.log($scope.session.startTime);
					////console.log(this.session.seats);
					//Line responsible for splitting the sessions.
					sessionSplitService.splitSession(this.inputForm.Session_ID.$,serviceRequestEndDate,serviceRequestStartDate,this.seats,this.comments,userID,userAccountID,sessionSplitURL).success(handleSuccess);
					
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
						)
						 modalInstance.result.then(function (value) {
							//console.log('First part :'+value);
					}, function (value) {
					
					//console.log('The Value is  :'+value);
					if (value=='yes'){
							$scope.cancelBack();}
									
									});
						
						
						};
						$scope.idSelectedVote=null;
						 var sessionIDs = [{}];
					$scope.setSelected = function(idSelectedVote) {
					console.log(idSelectedVote);
					//$scope.idSelectedVote='selected';
					$scope.idSelectedVote = idSelectedVote;
					
				
					       	}	//setSelected
	

						
				// 	$scope.$watch('inputForm.session.seats', function() {
				   // put numbersOnly() logic here, e.g.:
				//   if ($scope.inputForm.session.seats < 0) {
					  // strip out the non-numbers
					 // $scope.alerts = [{ type: 'error', msg: '# of seats value should be greater than 0' }];
				//	  $scope.inputForm.session.seats="";
				//   }
				//})
			
				});//End Of Session Report Controller
				
			
					 	//Modal Control
				var ModalInstanceCtrl = function ($scope,$modalInstance, response) {
				$scope.response=response;
			  $scope.ok = function () {
				//	$modalInstance.close($scope.selected.item);
				$modalInstance.dismiss('cancel');
				  };

				  $scope.cancel = function () {
				  var value='yes';
					
					$modalInstance.dismiss(value);
					
					
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
					var serviceRequestEndDate=serviceEndDate.concat(" "+formDate.getHours()+":").concat(formDate.getMinutes()+":").concat(formDate.getSeconds()+".").concat(formDate.getMilliseconds());
					return serviceRequestEndDate;
				  
				  
				  }
				
					//Start of 15 days restriction on to DATE
					 function DateFromString(str){ 
						str = str.split(/\D+/);
						str = new Date(str[2],str[0]-1,(parseInt(str[1])+14));
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
						var startHour=timeComponents[0];
						
						if (dateString.indexOf("PM")  > -1) {
							if(timeComponents[0]=="12"){//if it is 12 and PM no need to edit
							startHour=12;
							
							}else{
						   startHour = parseInt(startHour,10) + 12;
						   console.log("Components"+startHour);
						   }
						
						}
						
								var date = new Date();
							date.setHours(startHour);
							date.setMinutes(timeComponents[1]);
							date.setSeconds(timeComponents[2]);
							
					

					
						
				
						return date;
					}
					
					
					
					
