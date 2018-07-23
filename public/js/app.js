
var psApp=angular.module('pureSpectrumApp',['ui.router','ngCookies','ngProgressLite','cgNotify','LocalStorageModule','ngAnimate', 'datatables','ngFlag','ngFileUpload','datatables.fixedheader', 'infinite-scroll', 'angularFileUpload','pascalprecht.translate', 'ngCsvImport','vcRecaptcha', 'daterangepicker', 'toggle-switch', 'selectize', 'ngFileSaver', 'contenteditable']);

psApp.config(['$stateProvider', '$urlRouterProvider','$httpProvider','$translateProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');

    //$httpProvider.interceptors.push('LoadingInterceptor');
    $urlRouterProvider.otherwise('/');
    $stateProvider.
        state('login', {
            url:'/login',
            templateUrl: 'login.html',
            access: { requiredAuthentication: false },
            data : { pageTitle: 'pureSpectrum | Login' }
        })
        .state('home',{
            url:'/dashboard',
            templateUrl:'home.html',
            access: { requiredAuthentication: true },
            data : { pageTitle: 'pureSpectrum | Home' }
        })
        .state('forgotPassword',{
            url:'/forgotPassword',
            templateUrl:'forgotPassword.html'
           
        })
        .state('resetforgotPassword',{
            url:'/resetforgotPassword/{token}',
            templateUrl:'resetForgotPassword.html'
           
        })
         .state('invalidpasswordlink',{
            url:'/invalidpasswordlink/{locked}',
            templateUrl:'invalidPasswordLink.html'
           
        })
        .state('editSurvey',{
            url:'/dashboard/{key}',
            templateUrl:'home.html',
            access: { requiredAuthentication: true }
        })
        .state('managecompany',{
            url:'/managecompanies',
            templateUrl:'manageCompanies.html',
            access: { requiredAuthentication: true }
        })
        .state('managesupplier',{
            url:'/manageSuppliers',
            templateUrl:'manageSuppliers.html',
            access: { requiredAuthentication: true }
        })
        .state('surveySuccess',{
            url : '/surveySuccess',
            templateUrl: 'surveysuccess.html'
        })
        .state('choosesuppliers',{
            url:'/choosesuppliers/{surveyid}/{edit}',
            templateUrl:'choosesuppliers.html'
        })
        .state('launchsurvey',{
            url:'/launchsurvey/{surveyid}/{edit}',
            templateUrl:'launchsurvey.html'
        })
        .state('manageBuyerSettings',{
            url:'/manageBuyerSettings',
            templateUrl:'manageBuyerSettings.html'
        })
	   .state('resetPassword',{
            url:'/resetPassword',
            templateUrl:'resetPassword.html'
        })
       .state('downloadReport',{
            url:'/downloadReport',
            templateUrl:'downloadReports.html'
        })
        .state('addAdvQuestion',{
            url:'/addAdvQuestion',
            templateUrl:'addAdvQuestion.html',
            access: { requiredAuthentication: true }
        })
        .state('reconcile',{
            url:'/reconcile',
            templateUrl:'reconcile.html',
            controller: 'reconcileCtrl',
            access: { requiredAuthentication: true }
        })
        .state('reportsDashboard',{
            url:'/reportsDashboard',
            templateUrl:'reportsDashboard.html',
            controller: 'reportsDashboardCtrl',
            access: { requiredAuthentication: true }
        })
        .state('/', {
            url: '/',
            controller: 'indexController',
            access: { requiredAuthentication: true }
        })
        .state('updatesurvey',{
            url : '/updatesurvey/{key}/{edit}?{locale}',
            reloadOnSearch:false,
            templateUrl:'CreateSurveys.html',
            access: { requiredAuthentication: true }
        })
        .state('buyerRedirectGuide',{
            url : '/buyerRedirectGuide',
            templateUrl:'buyerRedirectGuide.html',
            access: { requiredAuthentication: true }
        })
        .state('dynstate',{
            url : '/{id}?{locale}&{survey_id}',
            templateUrl: function (stateParams){
                return   stateParams.id + '.html';
            },
            access: { requiredAuthentication: true }
        })
        .state('404',{
            url : '/404',
            templateUrl: '404.html'
        })
        .state('decipher',{
            url : '/importDecipher',
            templateUrl: 'importDecipher.html',
            access: { requiredAuthentication: true }
        })
        

        // language transalte
        $translateProvider.translations('en', {
            'tr_survey_title': 'Survey Title'
        });

        $translateProvider.preferredLanguage('en');
        
}]);


psApp.run(['$rootScope','$location','$state','$window','authenticationService','localStorageService','$cookies', 'user', 'notify', 'createSurvey', '$timeout', 'commonApi', function($rootScope, $location, $state, $window, authenticationService, localStorageService, $cookies, user, notify, createSurvey, $timeout, commonApi) {
    // Calling masterData on app Run
    /*commonApi.getAllMasterData().success(function(masterData){
        if(masterData.apiStatus == 'Success'){
            $rootScope.masterDatas =  masterData.values;
            console.log('app.js ',$rootScope.masterDatas);
        }else{
            $state.go("dataNotFound");
            //notify({message: 'Error in loading MasterData', classes: 'alert-danger', duration: 2000});
        }
    }).error(function (err) {
        console.log('err '+JSON.stringify(err));
        $state.go("dataNotFound");
        //notify({message: 'Error in loading MasterData', classes: 'alert-danger', duration: 2000});
    });*/

    /*createSurvey.getMasterDataByCountryLang().then(
      function(response){
        if(response && response.data && response.data.apiStatus == "Success"){
            console.log(' IN APPJS ');
          masterDataService.set(response.data.values);
        }
      }, function(err){
        console.log('err ',JSON.stringify(err));
      }
    );*/

    /*toState.resolve.promise = [
        '$q',
        function($q) {
            var defer = $q.defer();
            $http.makeSomeAPICallOrWhatever().then(function (resp) {
                if(resp = thisOrThat) {
                    doSomeThingsHere();
                    defer.resolve();
                } else {
                    doOtherThingsHere();
                    defer.resolve();
                }
            });
            return defer.promise;
        }
    ]*/

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
       
        //Track user with FS
        var userData  = localStorageService.get('logedInUser');
        //console.log('userData ',JSON.stringify(userData));
        if(userData && $window.FS) {
            $window.FS.identify(userData.eml, {
              displayName: userData.usrName,
              email: userData.eml
            });
        }

        //limit notifications to only one at a time
        notify.config({maximumOpen : 1});

        $rootScope.$state = $state;
        var localtoken= localStorageService.get('localStorageToken');
        //if token is not available than redirect to login
        //redirect only if both isAuthenticated is false and no token is set
        if (toState != null && toState.access != null && toState.access.requiredAuthentication
            && !authenticationService.isAuthenticated && !localtoken) {
            event.preventDefault();
            $state.go("login");
        }
        if(toState != null &&  toState.url!=null && (toState.url=='/' || toState.url=='') && (authenticationService.isAuthenticated || $cookies.token  || localtoken)) {
            $rootScope.loggedInUser = authenticationService.loggedInUser;
            event.preventDefault();
            $state.go("home");

        }
        if(toState.url=="/login" && (authenticationService.isAuthenticated  ||  $cookies.token || localtoken)){
            $window.location.href="/#/";
        }

        // To prevent the survey getting launched twice by accessing urls
        if(toState.url == "/launchsurvey/{surveyid}/{edit}"){
            createSurvey.getSurveyStatus(toParams.surveyid).success(function(result) {
                if(toParams.edit == "" && result.surveyStatus != 11){
                    $timeout(function(){
                        $state.go("404");
                    }, 0);
                }else if(toParams.edit != "" && result.surveyStatus == 11){
                    $timeout(function(){
                        $state.go("404");
                    }, 0);
                }
            }).error(function(err){
                console.log(err);
            });
        }
        if(toState.url == "/choosesuppliers/{surveyid}/{edit}"){
            createSurvey.getSurveyStatus(toParams.surveyid).success(function(result) {
                if(toParams.edit == "" && result.surveyStatus != 11){
                    $timeout(function(){
                        $state.go("404");
                    }, 0);
                }else if(toParams.edit != "" && result.surveyStatus == 11){
                    $timeout(function(){
                        $state.go("404");
                    }, 0);
                }
            }).error(function(err){
                console.log(err);
            });
        }
        if(toState.url == "/updatesurvey/{key}/{edit}?{locale}"){
            createSurvey.getSurveyStatus(toParams.key).success(function(result) {
                if(toParams.edit == "" && result.surveyStatus != 11){
                    $timeout(function(){
                        $state.go("404");
                    }, 0);
                }else if(toParams.edit != "" && result.surveyStatus == 11){
                    $timeout(function(){
                        $state.go("404");
                    }, 0);
                }
            }).error(function(err){
                console.log(err);
            });
        }
        if((toState.url == "/addAdvQuestion" || toState.url == "/reportsDashboard") && userData.operatorAcssLvls == "none"){
            $timeout(function(){
                $state.go("404");
            }, 0);
            
        }
    });

}]);



