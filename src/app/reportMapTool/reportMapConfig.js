angular
		.module(
				'ngBoilerplate.ReportMapTool',
				[ 'ui.state', 'placeholders', 'ui.bootstrap', 'titleService',
						'ui' ])

		.config(
				function config($stateProvider) {
					$stateProvider
							.state(
									'ReportMapCtrl',
									{
										url : '/reportMapper?accountID&userID&esbhost',
										views : {
											"main" : {
												controller : 'ReportMapCtrl',
												templateUrl : 'reportMapTool/reportMapConfig.tpl.html'
											}
										}
									});
				})

		.controller(
				'ReportMapCtrl',
				function ReportMapCtrl($scope,$rootScope,$filter, $modal,titleService,accountList,$stateParams,configService,$http,accountReportList,availableReportsList,visibilityService,reportAssociate,addReport) {
						var userAccountID=$stateParams.accountID;
						var userID=$stateParams.userID;
						var protocol="http://";
						var hostURL= protocol.concat($stateParams.esbhost);
						$scope.hideMe='hide-element';
						console.log("Report Map Tool Controller");
						
						//Service URLS
						var accountURL;
						var availableReportsURL;
						var insertReportURL;
						var updateVisibilityURL;
						var removeReportURL;
						
					//Configuration Service.
					configService.get(function(data) {
						$scope.config = data.service_configuration;
					
					
					//////console.log('URL  '+data.service_configuration.service.TestCenterURL);
					accountURL=hostURL.concat($scope.config.services[6].url);
					availableReportsURL=hostURL.concat($scope.config.services[7].url);
					insertReportURL=hostURL.concat($scope.config.services[8].url);
					updateVisibilityURL=hostURL.concat($scope.config.services[9].url);
					removeReportURL=hostURL.concat($scope.config.services[10].url);
					reportsForAccountURL=hostURL.concat($scope.config.services[11].url);
					
					
					
					$scope.getAccounts(accountURL);
					
					
					
					});
					
					var url;
					$scope.getAccounts = function(url){
					
					var handleAccounts = function(data,status){
					$scope.accounts = data.Accounts.Account;
					}
						//This gets all the accounts needed.
						accountList.getAccountList(url).success(handleAccounts);
						
						}
						//Function to Get Reports for account.
						$scope.getConfiguredReports = function() {
						
						//Sets Account ID to call for available reports
						var accountID = this.MapForm.accountDropdown;
						
						
						
						var handleSuccess = function(data, status) {
							if (angular.isArray(data.Reports.Report)) {
								$scope.reports = data.Reports.Report;

							} else {
								$scope.reports = [ data.Reports.Report ];

							}
							
							$scope.hideMe="";
							// Gets the available reports
							getAvailableReports(accountID);
						};
						accountReportList.getAccountReports(
								this.MapForm.accountDropdown,reportsForAccountURL).success(
								handleSuccess);
								
								
						

					}; //end of getConfiguredReports
					
					
					//Available Reports
					function getAvailableReports(accountID) {
					var handleSuccess = function(data, status) {
							if (angular
													.isArray(data.Reports.Report)) {
												$scope.avialableReports = data.Reports.Report;
												
											

											} else {
												$scope.avialableReports = [ data.Reports.Report ];
												
											

											}
											$scope.hideMe='show-report-Table';
						};
						availableReportsList.getAvailableReportList(
								accountID,availableReportsURL).success(
								handleSuccess);
								
					
		
					
					
					

					};//end of AvailableReports
					
					$scope.updateVisibility = function(reportItem) {

						var visibility = this.reportItem.VisibleToPartner.$;
						var reportName= this.reportItem.ReportName.$;
						var accountID = this.MapForm.accountDropdown;
						var templateID=this.reportItem.TemplateID.$;
						var reportID=this.reportItem.ReportID.$;
						
						var handleSuccess = function(data, status) {
							$scope.status = status;
							console.log(status);
							$scope.data = data;
						};
						visibilityService.updateVisibility(accountID,templateID,reportID,visibility,updateVisibilityURL).success(
								handleSuccess);
								
								

						
					};//end of updateVisibility
					
					//Removes Report Association
					$scope.removeReportConfig = function(reportItem) {
						var visibility = this.reportItem.VisibleToPartner.$;
						var reportName= this.reportItem.ReportName.$;
						var accountID = this.MapForm.accountDropdown;
						var templateID=this.reportItem.TemplateID.$;
						var reportID=this.reportItem.ReportID.$;
						
						var handleSuccess = function(data, status) {
							getAvailableReports(accountID);
							$scope.getConfiguredReports();
						};
						
						reportAssociate.removeReportAssociation(reportID,templateID,accountID,removeReportURL).success(
						   handleSuccess);

					};//end of Remove Report Config
					
					//Start of insertReportConfig
					$scope.insertReportConfig = function(reportItem, VisibleToPartner) {
					
						var reportName= this.reportItem.ReportName.$;
						var accountID = this.MapForm.accountDropdown;
						var templateID=this.reportItem.TemplateID.$;
						var templateURL=this.reportItem.TemplateURL.$;
						var reportID=this.reportItem.ReportID.$;
						var handleSuccess = function(data, status) {
							getAvailableReports(accountID);
							$scope.getConfiguredReports();
						};
						addReport.addReportAssociation(reportID,templateID,templateURL,accountID,VisibleToPartner,insertReportURL).success(
						handleSuccess);
						
					};//end of insertReportConfig
					
						//Search functionality for Available reports.. I have asked to only Search ReportName.
					  $scope.searchFilter = function (obj) {
					        var re = new RegExp($scope.searchText, 'i');
					        return !$scope.searchText || re.test(obj.ReportName.$);
					    };
					    

	
			
				});//End Of Session Report Controller
				
			
		