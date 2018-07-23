angular.module('pureSpectrumApp')
    // each function returns a promise object
    .factory('fileUpload', ['$http','config','$window','localStorageService', function($http,config, $window, localStorageService) {
        var base_url = config.pureSpecturm.url;
        /*var token = '';
        if(!token){
            var token= localStorageService.get('token');
        }
        var requestHeader = {
            headers: {
                'x-access-token' : token,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        };*/
        return {
            postUploadFile : function(data) {
                return $http.post(base_url + '/manualsurveytraffic', data,
                    {
                        headers: {
                            'Content-Type': undefined
                        }
                    });
            }
        }

    }]);