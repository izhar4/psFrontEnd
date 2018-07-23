angular.module('pureSpectrumApp')
.controller('reportCntrl' ,['$scope', '$state', 'ngProgressLite', 'notify', 'localStorageService', 'config', 'reportService', function($scope, $state, ngProgressLite, notify, localStorageService, config, reportService){
    var userInfo= localStorageService.get('logedInUser');
    $scope.loader = {show: false};
    $scope.isOperatorUser = (userInfo.operatorAcssLvls !== undefined && userInfo.operatorAcssLvls !== 'none') ? true : false
    $scope.report = {};
    $scope.report.date = {startDate: null, endDate: null};
    $scope.downloadReport = function(){
        var daterange = $scope.report.date;
        $scope.loader.show = true;
        if(daterange.startDate == "" || daterange.startDate == null || daterange.endDate == null ||daterange.endDate == "") {
            notify({
                message: 'Please Enter Start & End Date ',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.loader.show = false;
            return false;
        }
        var stDt = moment($scope.report.date.startDate).format("YYYY-MM-DD");
        var endDt = moment($scope.report.date.endDate).format("YYYY-MM-DD");
	
	// st is used to send the toggle status 
        var st = 'All';
        if($scope.switchStatus){
            st = 'Complete';
        }
       
        reportService.downloadReport(userInfo.id, userInfo.cmp, stDt, endDt, st).success(function (response) {
            //console.log("response ",JSON.stringify(response));
            var fileName = response.fileName;
            window.location.assign(reportService.downloadFile(fileName));
            $scope.loader.show = false;
        }).error(function (err) {
            notify({message: err.msg, classes: 'alert-danger', duration: 2000});
            $scope.loader.show = false;
        });
    }

    $scope.downloadLoginReport = function(){
        $scope.loader.show = true;
        var date = moment().format("YYYY-MM-DD");
        var anchor = angular.element('<a/>');
        reportService.downloadLoginReport().success(function (response) {
            //downloadCSV(data, 'user-login-report');
            //console.log("response ",JSON.stringify(response));
            var fileName = response.fileName;
            window.location.assign(reportService.downloadFile(fileName));
            $scope.loader.show = false;
        }).error(function (err) {
            notify({message: err.msg, classes: 'alert-danger', duration: 2000});
            $scope.loader.show = false;
        });
    }
    $scope.bckDashboard = function() {
        $state.go('home');
    };

    function downloadCSV(data, fileName){
        var date = moment().format("YYYY-MM-DD");
        var anchor = angular.element('<a/>');
        anchor.attr({
            href: 'data:attachment/csv,' + encodeURI(data),
            target: '_blank',
            download: fileName + '-' + date + '.csv'
        })[0].click();
    }        
}]);

