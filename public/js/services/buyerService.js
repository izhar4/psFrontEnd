

angular.module('pureSpectrumApp')
    .factory('buyerService',['$http','config', function($http, config) {
        var base_url = config.pureSpecturm.url;
        return {

            getBlockedBuyer : function(id){
                return $http.get(base_url + '/blockedBuyerList/'+id);
            },
            
            updateBlockedBuyers: function(data) {
                return $http.post(base_url + '/updateblockedBuyerList', data);
            },

            getAllBlockedBuyers : function(){
                return $http.get(base_url + '/getblockedBuyerList');
            }
        }
    }]);
