/**
 * Created by Vikas on 12/7/2016.
 */

angular.module('pureSpectrumApp')
    .factory('settingService',['$http','config','$window','localStorageService', function($http,config, $window, localStorageService) {
        var base_url = config.pureSpecturm.url;
        var userInfo=localStorageService.get('logedInUser');

        return {
            addSetting : function(settingData) {
                return $http.post( base_url + '/supplierSettings',settingData);
            },
            updateSetting : function(id,settingData) {
                return $http.put( base_url + '/supplierSettings/'+id,settingData);
            },

            deactivateSupplier: function(data){
                return $http.put(base_url + '/supplierSettings',data);
            },

            getSetting: function(cmp){
                return $http.get(base_url + '/supplierSettings/'+cmp);
            }
        }

    }]);

