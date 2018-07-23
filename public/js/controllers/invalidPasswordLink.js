angular.module('pureSpectrumApp')
    .controller('invalidPassLnkCtrl',['$scope','$state','$stateParams',function($scope, $state, $stateParams){
        
        $scope.cnnfgVal = $stateParams.locked;
        if($scope.cnnfgVal === "lock") {
        	$scope.showFlglock = true;
        	$scope.showFlgInvld = false;

        }
        if($scope.cnnfgVal === "expirelink") {
        	$scope.showFlglock = false;
        	$scope.showFlgInvld = true;
        }
        console.log("$scope.hideFlg", $scope.cnnfgVal)

        $scope.bckLoginPage = function() {
            $state.go('login');
        }
    }]);

    //PD-344

