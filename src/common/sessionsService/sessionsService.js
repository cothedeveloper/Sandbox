angular
		.module('sessionsService', [ 'ngResource' ])
		.factory(
				'sessionsService',
				function($http) {
					return {
						getSessionByTestCenter : function(fromDate,toDate,state,centerID) {
							return $http
									.post(
											'http://vmdev2.cloud.psionline.com:8280/services/GetSessionsByStateProxy',
											{
												data : {
													'startdate' : fromDate,
													'enddate' : toDate,
													'state' : state,
													'testcenterid' : centerID,
													'country' : 127
												},
												isArray : true
											});

						},
							getSessionByState : function(fromDate,toDate,state) {
							return $http
									.post(
											'http://vmdev2.cloud.psionline.com:8280/services/GetSessionsProxy',
											{
												data : {
													'startdate' : fromDate,
													'enddate' : toDate,
													'state' : state,
													'country' : 127
											},
												isArray : true
											});

						}
					};
				}

		);
