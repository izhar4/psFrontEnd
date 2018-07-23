angular.module('pureSpectrumApp')

    .controller('mainCtrl',['$scope','localStorageService' ,'$state' ,'$rootScope',function($scope, localStorageService ,$state ,$rootScope){
        $scope.app = {
            name: 'pureSpectrumApp',
            version: '1.0.0',
            token:'',
            user:{},
            race:[],
            education:[],
            children:[],
            employement:[],
            relation:[],
            country:[],
            samples:[],
            lang:[],
            gender:[],
            device:[],
            surveySuccess : ''
        };
        $scope.$state = $state;

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options){
               if(toState.name == 'startsurvey' || toState.name == 'home'){
                   $scope.fotrHide = true;
                   $scope.hdrHide = true;
               }
               else{
                   $scope.fotrHide = false;
                   $scope.hdrHide = false;

               }
            }
        );

        $scope.app.token=localStorageService.get('localStorageToken');
    }]);