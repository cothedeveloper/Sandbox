	angular
		.module('stateListService', [ 'ngResource' ])
		.factory(
				'stateListService',
				function($http) {
					return {
						getStates : function(url) {
							return $http
									.get(
											url,
											{
												params : {
													message : 'Get Test Centers'
												},
												isArray : true
											});

						}
					};
				}

		);

	
	
	
