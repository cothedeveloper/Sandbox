angular
		.module('sessionSplitService', [ 'ngResource' ])
		.factory(
				'sessionSplitService',
				function($http) {
					return {
						splitSession : function(scheduleID,oEndTime,nStartTime,seatCount,comments,userID,adminAcctID,url) {
							return $http
									.post(
											url,
											{
												data : {
													'DailyScheduleID' : scheduleID,
													'OriginalSession_EndTime' : oEndTime,
													'NewSession_StartTime' : nStartTime,
													'NewSession_SeatCount' : seatCount,
													'Admin_UserID' : userID,
													'Admin_AccountID' : adminAcctID,
													'Comments' : comments
													
												},
												isArray : true
											});

						}
					};
				}

		);
