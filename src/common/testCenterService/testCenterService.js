angular
		.module('testCenterService', [ 'ngResource' ])
		.factory(
				'testCenterService',
				function($http) {
					return {
						getTestCenters : function(stateAbbr) {
							return $http
									.get(
											'http://vmprod1.cloud.psionline.com:8280/services/GetTestCentersProxy',
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
