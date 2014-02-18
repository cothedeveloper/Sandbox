	angular
		.module('allTestCenterListService', [ 'ngResource' ])
		.factory(
				'allTestCenterListService',
				function($http) {
					return {
						getAllTCenters : function(url) {
							return $http
									.get(
											url,
											{
												params : {
													message : 'Get ALL Test Centers'
												},
												isArray : true
											});

						}
					};
				}

		);

	
	
	
