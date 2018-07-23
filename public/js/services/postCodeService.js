angular.module('pureSpectrumApp')
    .factory('postCode',['$http','config', function($http, config) {
        var base_url = config.pureSpecturm.url;

        return {

        	getZipcodes : function(survey_id, buyer_ziplist_ref){
        		return $http.get(base_url + '/retrieve/postcode?survey_id='+survey_id+'&byr_pst_ref='+buyer_ziplist_ref);
        	}

        }

    }]);