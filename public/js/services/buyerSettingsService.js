/**
 * Created by Dinesh on 20/10/2016.
 */

angular.module('pureSpectrumApp')
    .factory('buyerSettingService',['$http','config','$window','localStorageService', function($http,config, $window, localStorageService) {
        var base_url = config.pureSpecturm.url;
        var userInfo=localStorageService.get('logedInUser');

        return {
            addSetting : function(settingData) {
                return $http.post( base_url + '/buyerSettings',settingData);
            },
            updateSetting : function(id,settingData) {
                return $http.put( base_url + '/buyerSettings/'+id,settingData);
            },
            getSetting: function(cmp){
                return $http.get(base_url + '/buyerSettings/'+cmp);
            }
        }

}]);