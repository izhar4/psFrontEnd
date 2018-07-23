/**
 * Created by Parveen on 3/8/2016.
 */


angular.module('pureSpectrumApp')
    .factory('commonApi',['$http','config', function($http, config) {
        var base_url = config.pureSpecturm.url;

        return {
            language : function() {
                return $http.get(base_url + '/languages');
            },
            countries : function() {
                return $http.get(base_url + '/countries');
            },
            samples : function() {
                return $http.get(base_url + '/samples');
            },
            relationships : function() {
                return $http.get(base_url + '/relationships');
            },
            educations : function() {
                return $http.get(base_url + '/educations');
            },
            employments: function(){
                    return $http.get(base_url + '/employments');
            },
            childrens: function(){
                return $http.get(base_url + '/children')
            },
            getBuyerCounterParty : function () {
                return $http.get(base_url + '/getBuyers');
            },
            getLanguageByCountry : function (cntId) {
                return $http.get(base_url + '/countryLanguages/'+cntId);
            },
            getRaceData : function () {
                return $http.get(base_url + '/race');
            },
            getGenderData : function () {
                return $http.get(base_url + '/gender');
            },
            getDeviceData : function () {
                return $http.get(base_url + '/device');
            },
            getAllMasterData : function () {
              return $http.get(base_url + '/getmasterdata');
            }
        }

    }]);
