angular
		.module('sessionsService', [ 'ngResource' ])
		.factory(
				'sessionsService',
				function($http) {
					return {
						getSessionByTestCenter : function(fromDate,toDate,state,centerID,url) {
							return $http
									.post(
											url,
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
							getSessionByState : function(fromDate,toDate,state,url) {
							return $http
									.post(
											url,
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
