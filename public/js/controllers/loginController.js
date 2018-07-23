angular.module('pureSpectrumApp')
    .controller('loginCtrl',['$scope','localStorageService','$http','$state','user','authenticationService','notify','companyService','ngProgressLite',function($scope, localStorageService, $http, $state, user, authenticationService, notify, companyService, ngProgressLite){
        $scope.loginObj ={};
        $scope.login = function() {
            ngProgressLite.start();
            user.logIn($scope.loginObj).success(function (data) {
                ngProgressLite.done();
                //PD-344
                $scope.checkResetReq = data.user.password_reset;
                $scope.lockedAccountStatus = data.user.lockout_attempt;
                if($scope.checkResetReq === 1) {
                    if($scope.lockedAccountStatus > 3) {
                        notify({message:'Your account have been locked, Please contact support@purespectrun.com for assistance',classes:'alert-danger',duration:8000} );
                    }
                    else {
                        notify({message:'Your account have been disabled, Please check your email and reset using secure reset-link or contact support@purespectrun.com for assistance',classes:'alert-danger',duration:8000} );    
                    }
                }
                else {
                    localStorageService.set('localStorageToken', data.token);
                    localStorageService.set('logedInUser', data.user);
                    $scope.app.token = localStorageService.get('localStorageToken');
                    authenticationService.setAuthentication(true, data.token, $scope.loginObj.rememberme);
                    ngProgressLite.done();
                    $state.go('home',{reload : true});
                }
            }).error(function (err) {
                if(err.msg =="Invalid credentials")
                    notify({message:err.msg+'. '+'Please check your email and password',classes:'alert-danger',duration:3000} );
                else
                   notify({message:err.msg,classes:'alert-danger',duration:3000} ); 
            });
        }

    }]);

