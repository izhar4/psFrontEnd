angular.module('pureSpectrumApp')
.controller('reconcileCtrl',['$scope','$http','$state', '$timeout','localStorageService','user','notify', 'createSurvey', function($scope, $http, $state, $timeout, localStorageService, user, notify, createSurvey){

	//var userData = localStorageService.get('logedInUser');
	//console.log('userData '+JSON.stringify(userData));
	$scope.inputBocClick = function() {
      angular.element('#fileModel').trigger('click');
    }
    $scope.loader = {show:false}; 
    $scope.uploadBuyerReconciliationFile = function() {
	    $scope.loader.show = true;
	    $scope.uploadFile = document.getElementById('fileModel').files[0];
	    var regex = new RegExp("(.*?)\.(csv|xlsx|xls)$");
	    if($scope.uploadFile) {
	        var fileName = $scope.uploadFile.name;
	        if ((regex.test(fileName))) {
	            createSurvey.uploadReconciliationFile($scope.uploadFile).success(function(res) {
	                    //$scope.tabs.makeDisable = false;
	                    $scope.loader.show = false;
	                    delete $scope.param.file;
	                    $scope.totalFileTrans = res.msg.totalFileTrans;
	                    $scope.changeToComplt = res.msg.changeToCompltTrans;
	                    $scope.rejectTrans = res.msg.rejectedTrans;
	                    $scope.transStatusComplt = res.msg.statusComplt;
	                    angular.element("input[type='file']").val(null);
	                    angular.element("input[type='text']").val(null);
	                    //console.log("res-------", res, res.msg, res.msg.totalFileTrans, res.msg.changeComplt, res.msg.rejectedTransactions)
	                    if (res.msg != "error") {
	                        $scope.openModel = angular.element('#reconcileModal');
	                    }
	                    if (res.msg == "error") {
	                        $scope.openModel = angular.element('#reconcileWarnModal');
	                    }

	                    $scope.openModel.modal('show');
	                })
	                .error(function(err) {
	                    delete $scope.param.file;
	                    $scope.loader.show = false;
	                    angular.element("input[type='file']").val(null);
	                    angular.element("input[type='text']").val(null);
	                    if (err.msg == "error") {
	                        $scope.openModel = angular.element('#reconcileWarnModal');
	                        $scope.openModel.modal('show');
	                    } else {
	                        $scope.loader.show = false;
	                        notify({
	                            message: "Something went wrong",
	                            classes: 'alert-danger',
	                            duration: 2000
	                        });
	                    }
	                })
	        } else {
	            delete $scope.param.file;
	            $scope.loader.show = false;
	            notify({
	                message: "Please select .csv/.xls/.xlsx file to upload",
	                classes: 'alert-danger',
	                duration: 2000
	            });
	        }
	    } else {
	        $scope.loader.show = false;
	        notify({
	            message: "First select the file to upload",
	            classes: 'alert-danger',
	            duration: 2000
	        });
	    }
	}

	/*
   *@ update STC by upload reconcile file trans IDs
   */
    $scope.confirmReconciliation = function() {
    	$scope.loader.show = true;
        createSurvey.confirmForReconcile().then(
            function(success) {
                $scope.loader.show = false;
                notify({message: "File upload Reconciliation done successfully", classes:'alert-success', duration:2000} );
            },
            function(error) {
                $scope.loader.show = false;
                notify({message : error , classes:'alert-danger', duration:2000} );
            }
      );
    }

    /*
     *@ decline reconciliation
     */
    $scope.declineReconciliation = function(){
       $scope.loader.show = true;
       createSurvey.declineReconciliationProcess().then(
           function(success){
               notify({message: "You decline the reconciliation process", classes:'alert-success', duration:2000} );
               $scope.loader.show = false;
           },
           function(error){
               notify({message : error , classes:'alert-danger', duration:2000} );
               $scope.loader.show = false;
           }
        )
   }

    
    /*Show Date for Reconcile Approve content*/
    getReconcileDate();

    function getReconcileDate() {
        $scope.monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];
        /*********************Current month setting*******************************/ 
        $scope.modDate = new Date();
        $scope.date = $scope.prevDate = new Date($scope.modDate.setMonth($scope.modDate.getMonth() + 1));
        $scope.monthIndex = $scope.date.getMonth();
        $scope.year = $scope.date.getFullYear();
        $scope.leapYear = leapYear($scope.year); 
        if($scope.leapYear) {
          $scope.day = ["31", "29", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31" ]
        }
        $scope.day = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31" ]

        $scope.currentMonth = $scope.monthNames[$scope.monthIndex] + ' ' + $scope.day[$scope.monthIndex] + ' ' + $scope.year;

        /*********************Previous month setting*******************************/ 
        $scope.prvMOnthObj = new Date();
        $scope.prevDate = new Date($scope.prvMOnthObj.setMonth($scope.prvMOnthObj.getMonth()));
        $scope.prvMonthIndex = $scope.prevDate.getMonth();
        $scope.prvYear = $scope.prevDate.getFullYear();
        $scope.prevMonth = $scope.monthNames[$scope.prvMonthIndex] + ' ' + $scope.day[$scope.prvMonthIndex] + ' ' + $scope.prvYear;
    }

    /*
    * Function to check leap year
    */
    function leapYear(year){
      return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }


}]);