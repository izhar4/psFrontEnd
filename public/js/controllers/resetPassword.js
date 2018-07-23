angular.module('pureSpectrumApp')
    .controller('resetPassword',['$scope','$state', '$timeout','user','notify','ngProgressLite', 'localStorageService', function($scope, $state, $timeout, user, notify, ngProgressLite, localStorageService){
	
	$scope.userobj = {
		newpass: "",
		cpass: ""
	};
	
	var userdata = localStorageService.get('logedInUser');
	
	$scope.updatePassword = function() {
		if($scope.userobj.newpass == '' || $scope.userobj.cpass == ''){
			notify({message:"Please don't left password field blank!!", classes:'alert-danger', duration:2000} );
			return false;

		} else if($scope.userobj.newpass != $scope.userobj.cpass) {
			notify({message:"password not match!!",classes:'alert-danger',duration:2000} );
			return false;
		}
		
		user.updatePasswords(userdata.id, $scope.userobj).then(
			function(response){
				if(response.data.apiStatus == 'success') {
					notify({message:'Password is successfully updated',classes:'alert-success',duration:2000} );
				}
			},
			function(error) {
				notify({message:"error",classes:'alert-danger',duration:2000} );
			}
		);
	};
		
	}]);