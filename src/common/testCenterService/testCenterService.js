angular
		.module('testCenterService', [ 'ngResource' ])
		.factory(
				'testCenterService',
				function($http) {
					return {
						getTestCenters : function(stateAbbr,url) {
							return $http
									.get(
											url,
											{
												params : {
													state : stateAbbr
												},
												isArray : true
											});

						}
					};
				}

		);
