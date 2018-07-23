
angular.module('pureSpectrumApp')
    // each function returns a promise object
    .factory('user', ['$http','config','$window','localStorageService', function($http,config, $window, localStorageService) {
        var base_url = config.pureSpecturm.url;
        var token = '';
        if(!token){
            var token= localStorageService.get('token');
        }
        var requestHeader = {
            headers: {
                'x-access-token' : token,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        };
        return {
            logIn : function(authData) {
                return $http.post(base_url + '/user/login', '{username:' +
                    authData.username + ' }',
                    {
                        headers: {
                            'username': authData.username,
                            'password': authData.password,
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    });
            },
            checkAccess:function(byrRole, slrRole, optRole){
                return  $http.get(base_url + '/feature/access?buyer='+byrRole+'&supplier='+slrRole+'&operator='+optRole);


            },
            logoutUser:function(id){
                return $http.delete(base_url + '/logout/'+id);
            },
            updatePasswords:function(id, data){
                return $http.put(base_url + '/updateuserpassword/'+id, data);
            },
             updateStatus:function(id, data){
                return $http.put(base_url + '/updateuserstatus/'+id, data);
            },
            getUserData : function(){
                return $http.get(base_url + '/users' );
            },
             saveUserDetails : function(cmpData){
                return $http.post(base_url + '/user', cmpData);
            }, 
            updateUserDetails : function(cmpData){
                return $http.put(base_url + '/user/'+cmpData.id,cmpData);
            },
            checkForgotPasswordEmail:function(emailId){//PD-344
                return  $http.get(base_url + '/checkForgotPasswordMail/'+emailId);


            },
            getUserDateFromToken : function(resettoken) {//PD-344
                return $http.get(base_url + '/userDataFromResetToken/'+resettoken);
            },

            updateResetPassword : function(resettoken, data) {//PD-344
                return $http.put(base_url + '/updateuserresetpassword/'+resettoken, data);
            }
        }

    }]);

angular.module('pureSpectrumApp').factory('authenticationService',['$window','localStorageService','$cookies', function($window, localStorageService, $cookies) {

    var auth = {
        isAuthenticated: false,
        storageType:"sessionStorage",
        isAdmin: false,

        // Set Authentication flag
        setAuthentication: function(val, token, rememberMe){
            this.isAuthenticated =val;
            if(rememberMe) {
                localStorageService.set('localStorageToken', token);
            }else{
                $window.sessionStorage.token = token;
                $cookies.token = token;
            }
        },
        getAuthentication: function(){
            return this.isAuthenticated;
        },
        revokeAuthentication : function() {
            this.isAuthenticated = false;
            localStorageService.clearAll();
            $window.sessionStorage.token = null;
            $cookies.token = null;
            sessionStorage.removeItem("token");
            localStorageService.remove('localStorageToken');
            localStorageService.remove('logedInUser');
        }
    }
    return auth;
}]);

angular.module('pureSpectrumApp').factory('TokenInterceptor',['$q','config','$window','$location','authenticationService','localStorageService','$cookies', function ($q, config, $window, $location, authenticationService, localStorageService, $cookies) {
    return {
        request: function (configHTTP) {
            configHTTP.headers = configHTTP.headers || {};
            var token =  $cookies.token;//$window.sessionStorage.token;

            if(!token){
                var token= localStorageService.get('localStorageToken');
            }
            var str = $location.path();
            var res = str.substring(0, 11);

            if($location.path()!= '/login' && $location.path()!= '/ManualSurveyTrafficFixes') {
                if (token) {
                    configHTTP.headers['x-access-token'] = token;
                    configHTTP.headers['Content-Type'] = 'application/json; charset=UTF-8';
                }
            }
            /*Reconciliation code*/
            if(configHTTP.url.indexOf('survey/reconciliation') > 0) {
              configHTTP.transformRequest = angular.identity;
              configHTTP.headers['Content-Type'] = undefined;
            }
            if(configHTTP.url.indexOf('survey/confirm/reconciliation') > 0) {
              configHTTP.transformRequest = angular.identity;
              configHTTP.headers['Content-Type'] = undefined;
            }
            if(configHTTP.url.indexOf('survey/uploadZipCode') > 0) {
                configHTTP.transformRequest = angular.identity;
                configHTTP.headers['Content-Type'] = undefined;
            }
            if(configHTTP.url.indexOf('/inclexcl/uploadPSIDListFromUI/') > 0) {
                configHTTP.transformRequest = angular.identity;
                configHTTP.headers['Content-Type'] = undefined;
            }
            return configHTTP;
        },
        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200  && !authenticationService.isAuthenticated && (/*$window.sessionStorage.token*/ $cookies.token || localStorageService.get('localStorageToken'))) {
                authenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401  ){
                authenticationService.isAuthenticated = false;
                //authenticationService.delAuthenticationFlags();
                localStorageService.clearAll();
                sessionStorage.removeItem("token");
                return $location.path("/login");
            }
            var arr=$location.path().split("/");
            var grpPath=arr[0]+"/"+arr[1]+"/"+arr[2]+"/"+arr[3];
            if (rejection != null && rejection.status === 403 && $location.path()!= '/login' && ($location.path()!= '/login' && grpPath != "/jobs/group/groupsettings")){
                $location.path("/access_denied");
            }
            return $q.reject(rejection);
        }
    };
}]);