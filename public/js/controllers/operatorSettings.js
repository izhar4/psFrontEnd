 /**
 * Created by Jaspreet Singh on  12/04/2017.
 */
angular.module('pureSpectrumApp')
    .controller('operatorSettingCtrl', ['$scope', '$http', '$state', '$stateParams', '$cookies', '$window', 'config', 'commonApi', 'createSurvey', 'companyService', 'supplierService','feasibilityService' ,'notify', 'user', 'localStorageService', 'ngProgressLite', '$filter', '$timeout', '$rootScope', 'settingService', 'encodeDecodeFactory', 'currencyService', function ($scope, $http, $state, $stateParams, $cookies, $window, config, commonApi, createSurvey, companyService, supplierService, feasibilityService, notify, user, localStorageService, ngProgressLite, $filter, $timeout, $rootScope, settingService, encodeDecodeFactory, currencyService) {
        var localeInfo;
        var feasibilityPayload      = {};

        var supplierId;
        $scope.feasibilityObj       = {};
        $scope.supplierObj          = {};
        $scope.feasibilityModes     = [{ label: 'None', value: 0 }, { label: 'Genpop Estimate', value: 1 }]; /* PD-844 */
        $scope.detectedEmptyFld     = false; /* Disable the 'Save' button if true. */
        $scope.isGenipopMode        = false; /* Show Genpop Estimatation Fileds. */
        $scope.enableSaveBtn        = false; /* Show Save button if true. */
        $scope.enableFeasibilityEst = true;
        $scope.suppliers            = [];    /* It will contain the Supplier's List. */
        $scope.feasCountry          = [];    /* Contains the Countries's List. */
        $scope.surveyLocalization   = [];    /* Contains the combine list of Country & Language. */
        $scope.feasLngByCountry     = [];    /* Contains Language/s on the basis of  Country*/
        $scope.countryNotSelected   = true;
        $scope.langNotSelected      = true;
        $scope.selectedBuyer        = { name : 'All', id : 0};
        $scope.selectedSupplier     = { label : 'All', value : 0};
        $scope.loader               = {show: false};

        $scope.currencies = [];
        $scope.selectedCurrency = {};
        $scope.currencyPlaceholder = 'Select';

        /**  Handles Tab **/
        $scope.tab = 1;
        $scope.setTab = function (newTab) {
            $scope.tab = newTab;
        };

        $scope.isSet = function (tabNum) {
            return $scope.tab === tabNum;
        };

        $scope.selectBuyer = function(buyer) {
            if (buyer === 'all') {
                $scope.selectedBuyer.name = 'All';
                $scope.selectedBuyer.id = 0;
            }
            else {
                $scope.selectedBuyer.name = buyer.name;
                $scope.selectedBuyer.id = buyer.id;
            }
        };

        $scope.selectSupplier = function(supplier) {
            if (supplier === 'all') {
                $scope.selectedSupplier.label = 'All';
                $scope.selectedSupplier.value = 0;
            }
            else {
                $scope.selectedSupplier.label = supplier.label;
                $scope.selectedSupplier.value = supplier.value;
            }
        };

        $scope.selectCurrency = function (currency) {
            $scope.selectedCurrency = angular.copy(currency);
        };

        /* Fetching all the Suppliers PD-1393 */
        companyService.getAllCompaniesData().success(function (data) {
            if (data.companies.length > 0) {
                var cmp = data.companies;
                _.each(cmp, function (supplier) {
                    if (supplier.isASupplier === true) {
                        $scope.suppliers.push({
                            label: supplier.name,
                            value: supplier.id,
                            supplerType: (supplier.supplier_type == "public" ? false : true)
                        });
                    }
                });
            }
        }).error(function (err) {
            $scope.loader.show = false;
            notify({message: err.msg, classes: 'alert-danger', duration: 2000});
        });

        /*Fetching all Buyer Companies*/
        companyService.getBuyerCompany().success(function (res) {
            $scope.buyers = res.company;
        }).error(function (err) {
            notify({message: err.msg, classes: 'alert-danger', duration: 2000});
        });

        /* Fetch all Countries */
        commonApi.countries().success(function (data) {
            if (_.has(data, 'countries')) {
                if (data.countries.values) {
                    $scope.surveyLocalization = data.countries.values;
                    _.each(data.countries.values, function (countryRecord) {
                        $scope.feasCountry.push({
                            label : countryRecord.name,
                            value : countryRecord.short_Code
                        });
                    });
                }
                else {
                    console.log({ status: "Failure", msg: "Countries Value's not found !" });
                }
            }
            else {
                console.log({ status: "Failure", msg: "Countries not found !" });
            }
        }).error(function (err) {
            $scope.loader.show = false;
            notify({message: err.msg, classes: 'alert-danger', duration: 2000});
        });

        /* Fetch all currencies */
        function fetchAllCurrencies() {
            currencyService.getAllCurrencies().success(function (res) {
                if (res.currencies) {
                    $scope.currencies = _.map(res.currencies, function (currency) {
                        currency.name = currency.currencyFullName + ' (' + currency.currencyShortCode + ')';
                        return currency;
                    });
                }
            }).error(function (err) {
                notify({message: err.msg, classes: 'alert-danger', duration: 2000});
            });
        }

        fetchAllCurrencies();

        /** Ensures that  "desktopMonthlyActUsr","mobileMonthlyActUsr","patnrDelvryMulplr"
         *  fields only enable when genepopMode = 1.
         **/
        $scope.changeFeasibility = function() {
            if ($scope.feasibilityObj.genpopMode === 0) {
                $scope.isGenipopMode = false;
                $scope.detectedEmptyFld=false;
            }
            else {
                $scope.isGenipopMode = true;
                $scope.enableSaveBtn = true;
            }
        };


        /** Validate the Feasibility Fields and disable the Save button if any of the three
         *  fields("desktopMonthlyActUsr","mobileMonthlyActUsr","patnrDelvryMulplr")
         *  is/are empty.
         **/
        $scope.validateField = function() {
            var feasObj = $scope.feasibilityObj;

            if(!feasObj.surveyLocalization){
                $scope.detectedEmptyFld = true;
            }
            else if(!feasObj.surveyLocalization.feasCountry || !feasObj.surveyLocalization.feasLng){
                $scope.detectedEmptyFld = true;
            }
            else if (!("feasCountry" in feasObj.surveyLocalization) || !("feasLng" in feasObj.surveyLocalization) || !feasObj.desktopMonthlyActUsr || !feasObj.mobileMonthlyActUsr || !feasObj.patnrDelvryMulplr){
                    $scope.detectedEmptyFld = true;
            } else {
                $scope.detectedEmptyFld = false;
                $scope.enableSaveBtn = true;
            }
        };

        /**
         *  Saving the Feasibility data to Server.
         */

        $scope.saveFeasibility = function() {
            var feasObj      = $scope.feasibilityObj;
                feasObj.s_id = $scope.supplierObj.id;
        
            if (feasObj.desktopMonthlyActUsr !== null &&  feasObj.mobileMonthlyActUsr !== null && feasObj.patnrDelvryMulplr !== null  && feasObj.surveyLocalization !== undefined && feasObj.surveyLocalization.feasCountry !== undefined &&  feasObj.surveyLocalization.feasLng !== undefined) {
                if(feasObj.genpopMode === 1 ){
                   if(feasObj.hasOwnProperty('desktopMonthlyActUsr') && feasObj.desktopMonthlyActUsr && feasObj.hasOwnProperty('mobileMonthlyActUsr') && feasObj.mobileMonthlyActUsr && feasObj.hasOwnProperty('patnrDelvryMulplr') && feasObj.patnrDelvryMulplr){
                     feasibilityService.saveFeasibility($scope.feasibilityObj).success(function(data) {
                      notify({ message: 'Feasibility Settings Saved !', classes: 'alert-success', duration: 2000 });
                      }).error(function(err) {
                       notify({ message: err.msg, classes: 'alert-danger', duration: 3000 });
                      });
                    }else{
                        
                        notify({ message: 'Below fields cannot be Empty!', classes: 'alert-danger', duration: 2000 });
                        $scope.detectedEmptyFld = true;
                    }

                }else{
                      if(feasObj.hasOwnProperty('desktopMonthlyActUsr') && feasObj.desktopMonthlyActUsr){
                        feasObj.desktopMonthlyActUsr="";
                      }
                      if(feasObj.hasOwnProperty('mobileMonthlyActUsr') && feasObj.mobileMonthlyActUsr){
                           feasObj.mobileMonthlyActUsr="";
                      }
                      if(feasObj.hasOwnProperty('patnrDelvryMulplr') && feasObj.patnrDelvryMulplr){
                           feasObj.patnrDelvryMulplr="";
                      }

                    feasibilityService.saveFeasibility($scope.feasibilityObj).success(function(data) {
                    notify({ message: 'Feasibility Settings Saved !', classes: 'alert-success', duration: 2000 });
                    }).error(function(err) {
                    notify({ message: err.msg, classes: 'alert-danger', duration: 3000 });
                    });
                 }   
            }else {
                notify({ message: 'Below fields cannot be Empty!', classes: 'alert-danger', duration: 2000 });
                $scope.detectedEmptyFld = true;
            }
        };


        /**
         *  Fetching Feasibility Setting's data for Supplier.
         */

        $scope.selctSupplier = function(id){
            $scope.supplierObj.id =id;
            var supp = _.findWhere($scope.suppliers,{value:id});
            $scope.name = supp.label;
            if($scope.supplierObj.hasOwnProperty('id') && $scope.supplierObj.id){
                supplierId = angular.copy($scope.supplierObj.id);
                $scope.enableSaveBtn        = true;
                $scope.enableFeasibilityEst = false;
                $scope.countryNotSelected   = true;
                $scope.langNotSelected      = true;

                /* Loads the Value from Database on the basis of supplier Id */

                feasibilityService.getFeasibilityById($scope.supplierObj.id).success(function(feasibility) {
                    $scope.feasibilityObj = {};
                    if(feasibility.data.length > 0){
                      $scope.feasibilityObj = {};
                        feasibilityPayload = feasibility;
                        $scope.feasData = angular.copy(feasibility.data[0]);
                        $scope.feasibilityObj =  $scope.feasData;
                        
                        if(feasibility.data[0].genpopMode !== 0){
                          $scope.isGenipopMode  = true;
                        }else{
                          $scope.isGenipopMode  = false;
                        }
                          $scope.enableSaveBtn  = true;
                    }else{
                        $scope.isGenipopMode = false;
                        $scope.enableSaveBtn = false;
                    }
                         // PD-1372
                    if($scope.feasibilityObj.surveyLocalization && $scope.feasibilityObj.surveyLocalization.hasOwnProperty('feasLng') &&  $scope.feasibilityObj.surveyLocalization.feasLng && $scope.feasibilityObj.surveyLocalization.hasOwnProperty('feasCountry') && $scope.feasibilityObj.surveyLocalization.feasCountry){
                       $scope.countryNotSelected   = false;
                       $scope.langNotSelected      = false; 
                    }

                }).error(function(err) {
                    notify({ message: err.msg, classes: 'alert-danger', duration: 3000 });
                });
            }
        };
                    
        /**
         *  Enable `Save` Button if `feasCountry` conatains any Country
         */

        $scope.selectCountry = function(country){
           clearFeasData();
           $scope.langNotSelected=true;
            if($scope.feasibilityObj.surveyLocalization && $scope.feasibilityObj.surveyLocalization.hasOwnProperty('feasCountry') && $scope.feasibilityObj.surveyLocalization.feasCountry){
                $scope.enableSaveBtn    = true;
                
                $scope.feasLngByCountry = []; /* Remove the Older Entry*/
                _.each($scope.surveyLocalization,function(localRecord){
                    _.filter(localRecord.lang,function(lngData){
                        if(localRecord.short_Code === $scope.feasibilityObj.surveyLocalization.feasCountry){
                            $scope.feasLngByCountry.push({
                                label : lngData.name,
                                value : lngData.short_code
                            });
                            $scope.countryNotSelected = false;
                            
                        }
                    });
                    
                });

               if($scope.feasibilityObj.hasOwnProperty('surveyLocalization') && $scope.feasibilityObj.surveyLocalization.hasOwnProperty('feasLng') && $scope.feasibilityObj.surveyLocalization.feasLng){
                      $scope.isGenipopMode = false;
                      $scope.enableSaveBtn = false;
                    _.each(feasibilityPayload.data,function(payloadRecord){
                       if(payloadRecord.hasOwnProperty('surveyLocalization') && payloadRecord.surveyLocalization.hasOwnProperty('feasCountry') && payloadRecord.surveyLocalization.hasOwnProperty('feasLng') && payloadRecord.surveyLocalization.feasLng === $scope.feasibilityObj.surveyLocalization.feasLng && payloadRecord.hasOwnProperty('s_id') && payloadRecord.s_id === supplierId && payloadRecord.surveyLocalization.feasCountry === $scope.feasibilityObj.surveyLocalization.feasCountry){
                          $scope.payload = angular.copy(payloadRecord);
                          $scope.feasibilityObj=$scope.payload;
                          if(payloadRecord.hasOwnProperty('genpopMode') && payloadRecord.genpopMode !== 0){
                             $scope.isGenipopMode  = true;
                             $scope.langNotSelected=false;
                             $scope.detectedEmptyFld = false;
                            }else{
                              $scope.isGenipopMode  = false;
                              $scope.detectedEmptyFld = false;
                            }
                              $scope.enableSaveBtn = true;
                        }
                    })   
                               
                }
               
            }
            // PD-1372
            if($scope.feasibilityObj.surveyLocalization && $scope.feasibilityObj.surveyLocalization.hasOwnProperty('feasLng') &&  $scope.feasibilityObj.surveyLocalization.feasLng == $scope.feasLngByCountry[0].value){
                     $scope.langNotSelected=false;
            }
            if($scope.feasibilityObj && $scope.feasibilityObj.hasOwnProperty('genpopMode')){
               if($scope.feasibilityObj.genpopMode === 1){
                    $scope.isGenipopMode=true;
                }
            }
        }

        /**
         *  save pricing data in API
         */

        $scope.savePricingMargin = function(){
            if($scope.margin != undefined){
                var marginObj = new Object();
                marginObj.buyer_id = $scope.selectedBuyer.id;
                marginObj.supplier_id = $scope.selectedSupplier.value;
                marginObj.margin = $scope.margin;
                //Start loader
                $scope.loader.show = true;
                //post margin here
                feasibilityService.savePricingMargin(marginObj).success(function(res) {
                    $scope.loader.show = false;
                    notify({ message: 'Pricing Saved !', classes: 'alert-success', duration: 2000 });
                }).error(function(err) {
                    $scope.loader.show = false;
                    notify({ message: err.msg, classes: 'alert-danger', duration: 3000 });
                });
            }else {
                notify({
                    message: 'Margin is not valid',
                    classes: 'alert-warning',
                    duration: 2000
                });
            }
        }

        /**
         *  get pricing data from API
         */

        $scope.getPricingMargin = function(buyer_id, supplier_id){
            //Start loader
            $scope.loader.show = true;
            //get margin here
            feasibilityService.getPricingMargin(buyer_id, supplier_id).success(function(res) {
                $scope.loader.show = false;
                $scope.margin = res.hasOwnProperty('margin') ? res.margin : null;
            }).error(function(err) {
                $scope.loader.show = false;
                notify({ message: err.msg, classes: 'alert-danger', duration: 3000 });
            });
        }



         // PD-1372
         /**
           *  on langage change fetch feas data for supplier.  
          */
        $scope.selectLanguage=function(){
            clearFeasData();
            $scope.langNotSelected = false;
            $scope.enableSaveBtn   = true;
           
            $scope.isGenipopMode = false;
            if($scope.feasibilityObj && $scope.feasibilityObj.hasOwnProperty('genpopMode')){
               if($scope.feasibilityObj.genpopMode === 1){
                    $scope.isGenipopMode=true;
                }
            }
           if($scope.feasibilityObj.hasOwnProperty('surveyLocalization') &&  $scope.feasibilityObj.surveyLocalization && $scope.feasibilityObj.surveyLocalization.hasOwnProperty('feasLng') && $scope.feasLngByCountry[0].label && $scope.feasibilityObj.surveyLocalization.feasLng && $scope.feasibilityObj.surveyLocalization.hasOwnProperty('feasCountry')){
                _.each(feasibilityPayload.data, function(payloadRecord){
                    
                    if(payloadRecord.hasOwnProperty('surveyLocalization') && payloadRecord.surveyLocalization.hasOwnProperty('feasLng') && payloadRecord.surveyLocalization.hasOwnProperty('feasCountry') && payloadRecord.hasOwnProperty('s_id') && payloadRecord.surveyLocalization.feasLng === $scope.feasibilityObj.surveyLocalization.feasLng && payloadRecord.s_id === supplierId && payloadRecord.surveyLocalization.feasCountry === $scope.feasibilityObj.surveyLocalization.feasCountry){
                      $scope.record = angular.copy(payloadRecord);
                      $scope.feasibilityObj=$scope.record;
                       if(payloadRecord.hasOwnProperty('genpopMode') && payloadRecord.genpopMode !== 0){
                         $scope.isGenipopMode  = true;
                         
                       }else{
                         $scope.isGenipopMode  = false;
                        }
                    }
                })
            }
        }


        //PD-1393 Function to update supplier Type public/private
        $scope.updateSupplierType = function(supplierStatus) {
            $scope.loader.show = true;
            var updateJson = {
               "supplier_type": (supplierStatus.supplerType ? "private": "public"),
               "cmp": parseInt(supplierStatus.value)
            }
            settingService.updateSetting(parseInt(supplierStatus.value),updateJson).success(function(res) {
                $scope.loader.show = false;
            }).error(function(err) {
                $scope.loader.show = false;
                notify({ message: err.msg, classes: 'alert-danger', duration: 3000 });
            })
        }

        function clearFeasData(){
            if($scope.feasibilityObj.hasOwnProperty('desktopMonthlyActUsr')){
               $scope.feasibilityObj.desktopMonthlyActUsr="";
                
              }if($scope.feasibilityObj.hasOwnProperty('mobileMonthlyActUsr')){
               $scope.feasibilityObj.mobileMonthlyActUsr="";
                
            }if($scope.feasibilityObj.hasOwnProperty('patnrDelvryMulplr')){
               $scope.feasibilityObj.patnrDelvryMulplr="";
            }
        }

        $scope.saveCurrency = function () {
            if (!$scope.selectedCurrency.currencyShortCode) {
                return notify({
                    message: 'Please select the currency',
                    classes: 'alert-warning',
                    duration: 2000
                });
            }

            if ($scope.selectedCurrency.fx === undefined || $scope.selectedCurrency.fx === '' || $scope.selectedCurrency.fx === 0 ||  $scope.selectedCurrency.fx === null
            || $scope.selectedCurrency.CRRate === undefined || $scope.selectedCurrency.CRRate === '' || $scope.selectedCurrency.CRRate === 0 || $scope.selectedCurrency.CRRate === null
            || $scope.selectedCurrency.symbol === undefined || $scope.selectedCurrency.symbol === '' || $scope.selectedCurrency.symbol === 0 || $scope.selectedCurrency.symbol === null) {
                return notify({
                    message: 'Currency code, CR Rate or symbol is not valid',
                    classes: 'alert-warning',
                    duration: 2000
                });
            }

            $scope.loader.show = true;

            currencyService.updateCurrencyDetails($scope.selectedCurrency).success(function (res) {
                $scope.loader.show = false;
                notify({message: 'Currency Saved !', classes: 'alert-success', duration: 2000});
                fetchAllCurrencies();
            }).error(function(err) {
                $scope.loader.show = false;
                notify({message: err.msg, classes: 'alert-danger', duration: 3000});
            });
        };
    }
]);

