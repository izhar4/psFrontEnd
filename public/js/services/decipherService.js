/*	
	Created By Mandeep
	Using to Add Details IN Decipher Survey
*/

psApp.factory('decipherService',['$http','config', function($http, config) {
	var decipher_url = config.pureSpecturm.decipherUrl;
	return {
		getTitle: function (uri, directory) {
			var payload = {"uri" : uri, "directory" : directory}
            console.log('payload ',JSON.stringify(payload));
            return $http.post(decipher_url + '/decipher/live/surveys', payload);
        },
        getQuotas: function(uri, path){
        	var payload = {"uri" : uri, "path":path}
        	return $http.post(decipher_url + '/decipher/quotas', payload);
        },
        createSurvey: function(data){
        	return $http.post(decipher_url + '/decipher/create/survey', data);
        }
	}

}]);