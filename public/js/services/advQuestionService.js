angular.module('pureSpectrumApp')
.factory('questionService',['$http','config', function($http, config) {
    var base_url = config.pureSpecturm.url;
    return {
    	getAdvTargetingQues : function(page){
            return $http.get(base_url + '/survey/getAdvQuestions/' + page);
        },
    	addAdvQuestions: function (data) {
            return $http.post(base_url + '/survey/addAdvQuestions', data);
        },
    	updateAdvQuestions: function (id, data) {
            return $http.put(base_url + '/survey/updateAdvQuestions/' + id, data);
        },
    	deleteAdvQuestions: function (id) {
            return $http.delete(base_url + '/survey/deleteAdvQuestions/' + id);
        }
    }
}]);