/**
 * Created by Parveen on 3/15/2016.
 */
angular.module('pureSpectrumApp')
    .controller('companiesCntrl', ['$scope', '$http', '$state', 'localStorageService', 'user', 'notify', 'companyService', 'createSurvey', 'ngProgressLite', 'currencyService',
        function($scope, $http, $state, localStorageService, user, notify, companyService, createSurvey, ngProgressLite, currencyService) {
        $scope.cmpDetails = {};
        $scope.currencies = [];

        getCompaniesDetails();
        getCurrencies();

        $scope.companyinfo = {};
        $scope.shUpdate = false;
        $scope.shDelete = false;
        $scope.shSave = true;
        $scope.showCompanyInfo = {isExpose: "0"}; /*PD-607*/
        $scope.selectedCurrency = {};
        $scope.currencyPlaceholder = 'Select';
        $scope.disableCurrency = false;

        function getCompaniesDetails() {
            ngProgressLite.start();
            companyService.getAllCompaniesData().success(function (data) {
                ngProgressLite.done();
                $scope.companyinfo = data.companies;
            }).error(function (err) {
                notify({message:err.msg, classes: 'alert-danger', duration:3000});
            });
        }

        function getCurrencies() {
            ngProgressLite.start();
            currencyService.getCurrencyDataForCompanies().success(function (data) {
                ngProgressLite.done();

                if (data.currencies) {
                    $scope.currencies = _.map(data.currencies, function (currency) {
                        currency.name = currency.currencyFullName + ' (' + currency.currencyShortCode + ')';
                        return currency;
                    });
                }
            }).error(function (err) {
                notify({message:err.msg, classes: 'alert-danger', duration:3000});
            });
        }

        $scope.selectCurrency = function (currency) {
            $scope.selectedCurrency = currency;
            $scope.showCompanyInfo.fx = currency.fx;
        };
        
        $scope.fetchCompanyData = function (data) {
            $scope.showCompanyInfo = angular.copy(data);
            $scope.selectedCurrency = {};
            $scope.disableCurrency = false;

            if ($scope.showCompanyInfo.isExpose === undefined) {
                $scope.showCompanyInfo.isExpose = "0"; /*PD-607*/
            }

            $scope.shDelete = true;
            $scope.shUpdate = true;
            $scope.shSave = false;

            if (data.fx) {
                $scope.selectedCurrency = _.find($scope.currencies, function (currency) {
                   return (parseInt(currency.fx) === parseInt(data.fx));
                });
                $scope.disableCurrency = true;
            }
        };

        $scope.changeDefault = function () {  /*PD-607*/
          $scope.showCompanyInfo.isExpose = "1";
        };

        $scope.makeDefaultChk = function () {  /*PD-607*/
            $scope.showCompanyInfo.isExpose = "0";
        };

        $scope.updateCompanyDetails = function (cmpData) {
            ngProgressLite.start();

            if (cmpData.isNotify == "1") {
                cmpData.isNotify = true;
            }
            else {
                cmpData.isNotify = false;
            }

            if (cmpData.isABuyer == "1") {
                cmpData.isABuyer = true;
            }
            else {
                cmpData.isABuyer = false;
            }

            if (cmpData.isASupplier == "1") {
                cmpData.isASupplier = true;
            }
            else {
                cmpData.isASupplier = false;
            }

            if (cmpData.isAnOperator == "1") {
                cmpData.isAnOperator = true;
            }
            else {
                cmpData.isAnOperator = false;
            }

            if (cmpData.status == "Active") {
                cmpData.status = 1;
            }

            if (cmpData.isExpose == "1") {  /*PD-607*/
              cmpData.isExpose = true;
            }
            else {
              cmpData.isExpose = false;
            }

           companyService.updateCompanyDetails(cmpData).success(function (data) {
               ngProgressLite.done();
               notify({message:data.msg, classes:'alert-success', duration:3000});
               if ($scope.showCompanyInfo.fx) {
                   $scope.disableCurrency = true;
               }
               getCompaniesDetails();
           }).error(function (err) {
               notify({message:err.msg, classes:'alert-danger', duration:3000});
           });
        };

        $scope.newCompany = function () {
            $scope.shDelete = false;
            $scope.shUpdate = false;
            $scope.shSave = true;
            $scope.showCompanyInfo = {};
            $scope.showCompanyInfo.isExpose = 0;
            $scope.selectedCurrency = {};
            $scope.disableCurrency = false;
        };

        $scope.saveCompanyDetails = function (cmpData) {
            ngProgressLite.start();

            if (cmpData.isNotify == "1") {
                cmpData.isNotify = true;
            }
            else {
                cmpData.isNotify = false;
            }

            if (cmpData.isExpose == "1") {  /*PD-607*/
              cmpData.isExpose = true;
            }
            else {
              cmpData.isExpose = false;
            }

            if (cmpData.isABuyer == "1") {
                cmpData.isABuyer = true;
            }
            else {
                cmpData.isABuyer = false;
            }

            if (cmpData.isASupplier == "1") {
                cmpData.isASupplier = true;
                cmpData.supplier_type = "public";//PD-1393
            }
            else {
                cmpData.isASupplier = false;
            }

            if (cmpData.isAnOperator == "1") {
                cmpData.isAnOperator = true;
            }
            else {
                cmpData.isAnOperator = false;
            }

            cmpData.status = 1;

            companyService.saveCompanyDetails(cmpData).success(function (data) {
                ngProgressLite.done();
                notify({message:data.msg, classes:'alert-success', duration:3000});
                getCompaniesDetails();
                //$scope.cancelCompanyInfo();
            }).error(function (err) {
                notify({message:err.msg, classes:'alert-danger', duration:3000});
            });
        };

        $scope.deleteCompany = function (cmpId) {
            ngProgressLite.start();
            companyService.deleteCompany(cmpId).success(function (data) {
                ngProgressLite.done();
                $scope.showCompanyInfo = '';
                $scope.selectedCurrency = {};
                $scope.disableCurrency = false;
                notify({message:data.msg, classes:'alert-success', duration:3000});
                getCompaniesDetails();
            }).error(function (err) {
                notify({message:err.msg, classes:'alert-danger', duration:3000});
            });
        };

        $scope.cancelCompanyInfo = function () {
            $scope.showCompanyInfo = '';
            $scope.selectedCurrency = {};
            $scope.disableCurrency = false;
        };
    }]);