//This module returns the states listing.  Located in the ../data/states.json file (May change to a service in cloud)
angular
.module('stateListService', [ 'ngResource' ])
.factory(
		'stateListService',
		function($resource) {
			//return $resource('http://vmdev2.cloud.psionline.com\\:8280/services/LC_Accounts');
			return $resource('assets/data/states.json');
		});
	
	
	
	
	
