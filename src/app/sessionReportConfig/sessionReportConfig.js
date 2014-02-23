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
										url : '/sessionReportConfig?accountID&userID&esbhost',
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
						var protocol="http://";
						var hostURL= protocol.concat($stateParams.esbhost);
						console.log(hostURL);
					
					
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
					testCenterURL=hostURL.concat($scope.config.services[0].url);
					statesURL=hostURL.concat($scope.config.services[1].url);
					sessionSplitURL=hostURL.concat($scope.config.services[2].url);
					getSessionByTestCenterURL=hostURL.concat($scope.config.services[3].url);
					getSessionByStateURL=hostURL.concat($scope.config.services[4].url);
					getAllTestCentersURL=hostURL.concat($scope.config.services[5].url);
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
					$scope.$watch('hours + minutes + period', function() {
					var time=$scope.hours.toString();
					var sMinutes=$scope.minutes;
					var timeCompare=time.concat(":"+sMinutes+" "+$scope.period);
					console.log('Time Selected :  '+ timeCompare);
					if(timeCompare=="12:45 PM"){
					$scope.StHours=1;
					$scope.StMinutes=0;
					$scope.StPeriod="PM";
					return;
					}
					if(timeCompare=="11:45 AM"){
					$scope.StHours=12;
					$scope.StMinutes=0;
					$scope.StPeriod="PM";
					return;			
					}
					
					if(timeCompare=="11:45 PM"){
					$scope.StHours=12;
					$scope.StMinutes=0;
					$scope.StPeriod="AM";
					return;			
					}
					if(sMinutes==45){
					$scope.StHours=$scope.hours +1;
					$scope.StMinutes=0;
					$scope.StPeriod=$scope.period;
					console.log('hours :'+$scope.hours);
					console.log('minutes :'+sMinutes);
					console.log('period :'+$scope.period);
					}else{
					$scope.StMinutes= sMinutes+15;
					$scope.StHours= $scope.hours;
					$scope.StPeriod= $scope.period;
					
					}
					
					})
					//This is to Edit the row or session.  Links to Edit Button
					var index;
					$scope.editRow = function(index){
					$scope.hours=01;
					$scope.minutes=00;
					$scope.period = "PM";
					
					$scope.StHours=01;
					$scope.StMinutes=15;
					$scope.StPeriod = "PM";
					
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
						var flag="";
						//If user doesn't select testcent or state
						if(angular.isUndefined(this.sessionForm)){
					
						$scope.boldError='customError';
						return;
						}else{
						$scope.boldError='';
						}
						
						
						if(angular.isUndefined(this.sessionForm.states) && angular.isUndefined(this.sessionForm.allTestCenters)){
							$scope.boldError='customError';
							return;
						}
						if(this.sessionForm.states == null && this.sessionForm.allTestCenters == null){
						$scope.boldError='customError';
						return;
						}
						
						if(this.sessionForm.states == null){
						console.log('this.sessionForm.states is null.  Setting All TestCenter State');					
						var state=this.sessionForm.allTestCenters.State_ID.$;
						}else{
						var state=this.sessionForm.states.State_ID.$;
						}
						
						if(this.sessionForm.allTestCenters == null){
						console.log('test center is null');
						 flag="searchAllState";
						
						}else{
						var centerID=this.sessionForm.allTestCenters.Test_Center_ID.$;
						}
						
						if(angular.isUndefined(this.sessionForm.allTestCenters)){
						 flag="searchAllState";
						
						}
						
						
					
						
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
					//var checkHour=this.hours.toString().substring(0,0);
					//console.log(checkHour+'  check hour');
					//checks hour and prepends if less than or equal to 9
					if(this.hours <= 9){
					var serviceEndTimeHour="0"+this.hours;
					}else{
					var serviceEndTimeHour=this.hours.toString();
					}
					if(this.minutes<=0){
					var serviceEndTimeMinute="0"+this.minutes;
					}else{
					var serviceEndTimeMinute=this.minutes;
					}
					if(this.StMinutes<=0){
					var serviceStartMinute="0"+this.StMinutes;
					}else{
					var serviceStartMinute=this.StMinutes.toString();
					}
					if(this.StHours<=9){
					var serviceStartHour="0"+this.StHours;
					}else{
					var serviceStartHour=this.StHours.toString();
					}
					
					console.log('this.hour :'+this.hours);
					console.log('this.minutes :'+this.minutes);
					//var startTime= this.StHours.toString().substring(0,2);
					//var startMinute=this.StMinutes;
					var startPeriod=this.StPeriod;
					//var endMinute=this.minutes;
					var endPeriod=this.period;
					//var endTime=this.hours.toString();
					//console.log('End Time  '+endTime);
					var compareStartTime = serviceStartHour.concat(":").concat(serviceStartMinute).concat(":00 ").concat(startPeriod);
					var compareEndTime = serviceEndTimeHour.concat(":").concat(serviceEndTimeMinute).concat(":00 ").concat(endPeriod);
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
						console.log('datestring '+dateString.indexOf("PM"));
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
					
					
					
					
