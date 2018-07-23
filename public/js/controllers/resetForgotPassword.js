angular.module('pureSpectrumApp')
    .controller('resetForgetPassword',['$scope','$state', '$timeout','user','notify','ngProgressLite', 'localStorageService', '$stateParams', function($scope, $state, $timeout, user, notify, ngProgressLite, localStorageService, $stateParams){
	
	$scope.userobj = {
		newpass: "",
		cpass: ""
	};
	$scope.hideResetPass = true;
	var token = $stateParams.token;
	console.log("token is:::", token);

	checkResetUrlValidity();
	function checkResetUrlValidity() {
		
		user.getUserDateFromToken(token).then(
			function(response) {
				console.log("response is:::", response);
				$scope.resetUserData = response.data.result;
				if($scope.resetUserData.reset_link_valid === 1 && $scope.resetUserData.password_reset === 1) {
					if($scope.resetUserData.lockout_attempt > 3) {
						$state.go('invalidpasswordlink', {locked: "lock"});
					}
					else {
						$scope.hideResetPass = true;
					}
				}
				else {
					$state.go('invalidpasswordlink', {locked: "expirelink"});
				}
			},
			function(error) {
				$scope.hideResetPass = false;
				notify({message:"error to get token from DB",classes:'alert-danger',duration:2000} );
			}
		);
	}
	

    $scope.backLoginPage = function() {
            $state.go('login');
    }

	$scope.updatePassword = function() {
		if($scope.userobj.newpass == '' || $scope.userobj.cpass == ''){
			notify({message:"Please don't left password field blank!!", classes:'alert-danger', duration:2000} );
			return false;

		} else if($scope.userobj.newpass != $scope.userobj.cpass) {
			notify({message:"password not match!!",classes:'alert-danger',duration:2000} );
			return false;
		}
		
		user.updateResetPassword(token, $scope.userobj).then(
			function(response){
				if(response.data.apiStatus == 'success') {
					notify({message:'Password is successfully updated',classes:'alert-success',duration:2000} );
					$state.go('login');
				}
			},
			function(error) {
				notify({message:"error",classes:'alert-danger',duration:2000} );
			}
		);
	};
		
	}]);

	//PD-344