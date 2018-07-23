angular.module('pureSpectrumApp')
    .controller('forgotPasswordCtrl',['$scope','localStorageService','$http','$state','user','authenticationService','notify','companyService','ngProgressLite','vcRecaptchaService','config',function($scope, localStorageService, $http, $state, user, authenticationService, notify, companyService, ngProgressLite, vcRecaptchaService,config){
        $scope.forgotPasswordObj ={};
        $scope.forgotPasswordObj.noOfAttempt = 0;
        
        $scope.publicKey = config.CAPTCHA_KEY;

        $scope.disableDiv = false;
        $scope.submitEmail = function() {
            if( $scope.forgotPasswordObj.noOfAttempt >= 5 ){
                $scope.disableDiv = true;
                 notify({message:"You have attempted 5 times. Please try again after sometimes ",classes:'alert-danger',duration:3000} ); 
            }else{
                ngProgressLite.start();
            if(vcRecaptchaService.getResponse() === ""){ //if string is empty
                notify({message:"Please resolve the captcha and submit!",classes:'alert-danger',duration:3000} ); 
            }else{
            user.checkForgotPasswordEmail($scope.forgotPasswordObj.email).success(function (data) {
                 notify({message:data.msg,classes:'alert-success',duration:3000} ); 
            }).error(function (err) {
                $scope.forgotPasswordObj.noOfAttempt +=1;
                   notify({message:err.msg,classes:'alert-danger',duration:3000} ); 
            });
            }
                ngProgressLite.done();
            }
            
        }
    }]);

