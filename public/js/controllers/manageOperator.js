angular.module('pureSpectrumApp')
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                    scope.filepath = element[0].files[0].name;
                    element.val(null);
                });
            });
        }
    };
}])
        
.controller('manageOperatorCtrl',['$scope', '$http', '$state', '$timeout', 'localStorageService','user','notify', 'companyService', 'createSurvey', 'ngProgressLite', '$rootScope', 'config', '$stateParams', 'fileUpload', '$upload', function($scope, $http, $state, $timeout, localStorageService, user, notify, companyService, createSurvey, ngProgressLite, $rootScope, config, $stateParams, fileUpload, $upload){
	     $scope.userInfo=localStorageService.get('logedInUser');
        $scope.base_url = config.pureSpecturm.url;
        $scope.showSPU = true;
        $scope.showStatusAndPrice = true;
        var regex = new RegExp("(.*?)\.(xlsx|xls)$");

         $scope.clickUpload = function(){
            angular.element('#fileMobile').trigger('click');
        };

        $scope.statusPriceUpdateFile = function(){
	        $scope.file = $scope.myFile;
	        if($scope.file) {
	        	var fileName = $scope.file.name;
	        	if(regex.test(fileName)) {
			        $scope.upload = $upload.upload({
		                url: $scope.base_url + '/manualStatusPriceTraffic',
		                method: 'POST',
		                headers: {'Content-Type': undefined},
		                file: $scope.file,
		                data: {"LoggedInUser": $scope.userInfo.id}
		            }).success(function(data){
		            	notify({message:data.msg,classes:'alert-success',duration:3000} );
		            	$scope.myFile ='';
		            	$scope.filepath ='';
		            }).error(function (err) {
	                    $scope.myFile ='';
	                    $scope.filepath ='';
		                notify({message:err.msg,classes:'alert-danger',duration:3000} );
		            });
	            }
	            else {
	            	notify({message:"Please select .xls/.xlsx file to upload",classes:'alert-danger',duration:2000} );
	            }
            }
            else {
            	notify({message:"First Select the file from browse option",classes:'alert-danger',duration:3000} );
            }
	    }

   
    	$scope.statusUpdateFile = function(){
	        $scope.file = $scope.myFile;
	        if($scope.file) {
	        	var fileName = $scope.file.name;
	        	if(regex.test(fileName)) {
			        $scope.upload = $upload.upload({
		                url: $scope.base_url + '/manualsurveytraffic',
		                method: 'POST',
		                headers: {'Content-Type': undefined},
		                file: $scope.file,
		                data: {"LoggedInUser": $scope.userInfo.id}
		            }).success(function(data){
		            	notify({message:data.msg,classes:'alert-success',duration:3000} );
		            	$scope.myFile ='';
		            	$scope.filepath ='';
		            }).error(function (err) {
		                notify({message:err.msg,classes:'alert-danger',duration:3000} );
		            });
	            }
	            else {
	            	notify({message:"Please select .xls/.xlsx file to upload",classes:'alert-danger',duration:2000} );
	            }
            }
            else {
            	notify({message:"First Select the file from browse option",classes:'alert-danger',duration:3000} );
            }
	    }

	    $scope.priceUpdateFile = function() {
	    	$scope.file = $scope.myFile;
	        if($scope.file) {
	        	var fileName = $scope.file.name;
	        	if(regex.test(fileName)) {
			        $scope.upload = $upload.upload({
		                url: $scope.base_url + '/manualpriceupdatetraffic',
		                method: 'POST',
		                headers: {'Content-Type': undefined},
		                file: $scope.file,
		                data: {"LoggedInUser": $scope.userInfo.id}
		            }).success(function(data){
		            	notify({message:data.msg,classes:'alert-success',duration:3000} );
		            	$scope.myFile ='';
		            	$scope.filepath ='';
		            }).error(function (err) {
		                notify({message:err.msg,classes:'alert-danger',duration:3000} );
		            });
	            }
	            else {
	            	notify({message:"Please select .xls/.xlsx file to upload",classes:'alert-danger',duration:2000} );
	            }
            }
            else {
            	notify({message:"First Select the file from browse option",classes:'alert-danger',duration:3000} );
            }
	    }

	    $scope.deletionFile = function() {
	    	$scope.file = $scope.myFile;
	        if($scope.file) {
	        	var fileName = $scope.file.name;
	        	if(regex.test(fileName)) {
			        $scope.upload = $upload.upload({
		                url: $scope.base_url + '/manualdeletiontraffic',
		                method: 'POST',
		                headers: {'Content-Type': undefined},
		                file: $scope.file,
		                data: {"LoggedInUser": $scope.userInfo.id}
		            }).success(function(data){
		            	notify({message:data.msg,classes:'alert-success',duration:3000} );
		            	$scope.myFile ='';
		            	$scope.filepath ='';
		            }).error(function (err) {
		                notify({message:err.msg,classes:'alert-danger',duration:3000} );
		            });
	            }
	            else {
	            	notify({message:"Please select .xls/.xlsx file to upload",classes:'alert-danger',duration:2000} );
	            }
            }
            else {
            	notify({message:"First Select the file from browse option",classes:'alert-danger',duration:3000} );
            }
	    }

	    $scope.statusPriceUpdate = function() {
	    	$scope.filepath ='';
	    	$scope.myFile ='';
	    	$scope.showSPU = true;
	    	$scope.showStatusAndPrice = true;
	    	$scope.showStatus = false;
	    	$scope.showPrice = false;
	    	$scope.showDelete = false;
	    }

	     $scope.statusUpdate = function() {
	    	$scope.filepath ='';
	    	$scope.myFile ='';
	    	$scope.showStatus = false;
	    	$scope.showStatusAndPrice = true;
	    	$scope.showPrice = false;
	    	$scope.showDelete = false;
	    	$scope.showSPU = false;
	    }

	    $scope.priceUpdate = function() {
	    	$scope.filepath ='';
	    	$scope.myFile ='';
	    	$scope.showStatus = false;
	    	$scope.showStatusAndPrice = false;
	    	$scope.showPrice = true;
	    	$scope.showDelete = false;
	    	$scope.showSPU = false;
	    }

	    $scope.statusDeletion = function() {
	    	$scope.filepath ='';
	    	$scope.myFile ='';
	    	$scope.showStatus = false;
	    	$scope.showStatusAndPrice = false;
	    	$scope.showPrice = false;
	    	$scope.showDelete = true;
	    	$scope.showSPU = false;
	    }
}]);
