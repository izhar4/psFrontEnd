angular.module('pureSpectrumApp')
    .controller('choosesupplierCtrl', ['$scope', '$http', '$state', '$stateParams', '$cookies', '$window', 'config', 'commonApi', 'createSurvey', 'companyService' ,'supplierService', 'notify', 'user', 'localStorageService', 'ngProgressLite', '$filter', '$timeout', '$rootScope', 'settingService','feasibilityService','encodeDecodeFactory', function ($scope, $http, $state, $stateParams, $cookies, $window, config, commonApi, createSurvey, companyService, supplierService, notify, user, localStorageService, ngProgressLite, $filter, $timeout, $rootScope, settingService, feasibilityService, encodeDecodeFactory) {

        var userData = localStorageService.get('logedInUser');
        var surveyManagementIR;
        $scope.userData = userData;

        $scope.showPriceOverrideBox = false;
        //PD-1145
        $scope.feasibilityCmp = true;
        /*if(_.contains(config.cmp, $scope.userData.cmp)) {
            $scope.feasibilityCmp = true;
        }*/
        //PD-1096
        if(_.contains(config.overridCmp, $scope.userData.cmp)) {
            $scope.showPriceOverrideBox = true;
        }

        var accessRole=localStorageService.get('accessRole');
        $scope.saveSuppliersData = {};
        $scope.supplier = [];
        $scope.headerValues = {
            completes: 0,
            cpi: 0,
            total: 0,
            field_time:0
        };

        var surveyData = new Object(); /**PD-844*/
        var masterDatas = new Array(); /**PD-844*/
        $scope.manageEdit = ($stateParams.edit == 'editStep2');
        $scope.suppliers = [];
        $scope.suppliersCount = 0;
        $scope.totalAllocations = 0;
        $scope.tempSupplier = [];
        $scope.buyerCPI = [];
        $scope.totalRemaining = 0;
        $scope.reCalculateTimeOut = 0;
        $scope.arr = [];
        $scope.currency_symbol = '$';
        $scope.currencyFx = {fx: 321,symbol: '$'};
        $scope.loader = {show: false};//PD-955
        /*--- Show Loader on every http request----*/
        $rootScope.$on('loading:progress', function (){
            $scope.loader.show = true;//PD-955
        });

        $rootScope.$on('loading:finish', function (){
            $scope.loader.show = false;//PD-955
        });
        /*--- Show Loader on every http request----*/
        
        $scope.isOperatorOverideEdit = false;

        //PD-1316
        $scope.srvId = $rootScope.clone && $rootScope.newId != undefined && $rootScope.newId != null && $rootScope.newId != "" ? $rootScope.newId : $stateParams.surveyid;

        // for supplier flexibility
        $scope.isSupplierFlexibility = true;
        $scope.flexibleValue = 100; //PD-1127
        $scope.surveyPauseThreshold = '';
        $scope.operatorOverrideMdl = '';
        $scope.manualOperatorOverride = false;
        $scope.disableSupCpiInput = true;
        // show price override text box only to operator type users
        if(accessRole !== undefined && (accessRole.operator.admin == true || accessRole.operator.full == true || accessRole.operator.limited == true ) ) {
            $scope.showPriceOverrideBox = true;
        }

        getSurveyData();
        // For disabling Next Button Until Supplier Loads
        $scope.showLoader = 'DataLoading';

        var allocationsGreaterThanAcheived = true; // Stops Survey Update if Supplier Allocations are less than their achieved

        // To comapare Survey incidence and loi with suppliers 
        var surveyIncidence = 0;
        var surveyLoi = 0; 

        //get survey data
        function getSurveyData() {
            //$scope.loader.show = true;//PD-955
            var id = $stateParams.surveyid; //PD-1323

            createSurvey.getSurveyById(id).success(function (data) {
                var languageId = data.survey[0].language || 1;
                var countryId = data.survey[0].country || 1;
                $scope.survey_locale = encodeDecodeFactory.encode(data.survey[0].locale); // set for footer  updatesurvey fn.
                $scope.headerValues.completes = data.survey[0].number;
                $scope.headerValues.field_time = data.survey[0].field_time;
                $scope.survey_locale = encodeDecodeFactory.encode(data.survey[0].locale);
                // For Click Based Survey
                $scope.completesNeeded = data.survey[0].clickBalance == 0 ? data.survey[0].number:data.survey[0].estmClicks;
                $scope.clickBalance = data.survey[0].clickBalance;
                $scope.estmClicks = data.survey[0].estmClicks;
                console.log('$scope.completesNeeded ',$scope.completesNeeded);
                //$scope.headerValues.cpi = data.survey[0].cpi;
                //Remove Old CPI for Live Clone
                if($rootScope.clone && $scope.checkLive_pus_Clone) {
                    data.survey[0].cpi = $scope.liveCloneCPI;
                }
                if(data.survey[0].currencyFx && data.survey[0].currencyFx.symbol) {
                    $scope.currency_symbol = data.survey[0].currencyFx.symbol;
                    $scope.currencyFx = data.survey[0].currencyFx;
                }

                surveyIncidence = data.survey[0].incidence;
                surveyLoi = data.survey[0].lengthOfSurvey;
                $scope.arr = data.survey[0];

                if (data.survey[0].supplier.length > 0) {
                    //Remove fielded on Live/Paused/Closed Clone
                    if(data.survey[0].status != 11 && $scope.checkLive_pus_Clone) {
                        _.each(data.survey[0].supplier, function(singleSurvDta) {
                            delete singleSurvDta.fielded;
                        });
                        $scope.hideFieldedFlg = false;
                    }
                    else {
                        $scope.hideFieldedFlg = true;
                    }
                    $scope.tempSupplier = data.survey[0].supplier;
                }
                
                surveyData = data; /** PD-844*/
                console.log('1');
                getSupplier(data.survey[0].company, countryId, languageId); // data.survey[0].company - survey created by buyer id
                console.log('2');
                $scope.showLoader = '';
                //$scope.loader.show = false;//PD-955
                
            }).error(function (err) {
                notify({message: err.msg, classes: 'alert-danger', duration: 2000});
                //$scope.loader.show = false;//PD-955
            });
        }

        function getFlexibilityPricesParams(srvId) {
            // $scope.loader.show = true;//PD-955
            supplierService.getFlexibilityPricesParams(srvId)
                .success(function (data) {
                    if(data.hasOwnProperty('flexibility') && $scope.tempSupplier[0] && !$scope.tempSupplier[0].hasOwnProperty('flexValue')) {
                        $scope.flexibleValue = data.flexibility;
                    }else if(data.hasOwnProperty('flexibility') && $scope.tempSupplier[0] && $scope.tempSupplier[0].hasOwnProperty('flexValue')){
                        $scope.flexibleValue = $scope.tempSupplier[0].flexValue;
                    }
                    //Handle clone survey surveyPauseThreshold on IR change issue 
                    if(data.hasOwnProperty('survey_pause_threshold') && !$rootScope.clone) {
                        $scope.surveyPauseThreshold = data.survey_pause_threshold;
                        $scope.oldSurveyPauseThreshold = data.survey_pause_threshold;
                    }
                    else {
                       $scope.surveyPauseThreshold = 0; 
                       $scope.oldSurveyPauseThreshold = 0;
                    }
                    if(data.hasOwnProperty('survey_price_override') && data.survey_price_override !== null) {
                        $scope.operatorOverrideMdl = data.survey_price_override;
                        $scope.setPriceOverride();
                        angular.forEach($scope.suppliers, function(supp) {
                            supp['oldCpi'] = $scope.operatorOverrideMdl;
                        });
                    }
                    if(data.hasOwnProperty('manual_override')) {
                        //$scope.manualOperatorOverride = data.manual_override;
                        //$scope.manualOverrideMdl = data.manual_override;
                        
                        if($scope.showPriceOverrideBox == true) { // show only for operator
                            $scope.disableSupCpiInput = !data.manual_override;
                        }
                        $scope.manualOperatorOverride = data.manual_override;
                        $scope.manualOverrideMdl = data.manual_override;
                        if(data.manual_override == true) {
                            $scope.operatorOverrideMdl = '';
                            var isFlexibilityUpdate = false;
                            getBuyerCPI(isFlexibilityUpdate);
                        }
                       
                    }
                    if(data.hasOwnProperty('survey_acpi')) {
                        $scope.headerValues.cpi = data.survey_acpi;
                    }
                  //  $scope.loader.show = false;//PD-955
                })
                .error(function (err) {
                    //$scope.loader.show = false;//PD-955
                    notify({message: "Error while fetching default flexibility", classes: 'alert-danger', duration: 2000});
                });
        }

        function getSupplier(id , countryId, languageId) {
            console.log('1 1');
            //$scope.loader.show = true;//PD-955
            supplierService.getNonBlockedSuppliers(id, countryId, languageId).success(function (data) {
                if (data.apiStatus == "success") {
                    var predicate = 'supplrSt';
                    $scope.suppliers = data.supplierList;
                    $scope.suppliers = $filter('orderBy')($scope.suppliers, predicate, false);
                    $scope.suppliersCount = data.supplierList.length;

                    //Decreasing suppliers count which are not eligible for the survey
                    for(var j = 0; j < $scope.suppliers.length; j++){
                        if($scope.userData && $scope.userData.cmp == 56){
                            console.log('done');
                            _.each($scope.suppliers, function(eachSup, j){
                                // Prodege MR
                                if($scope.suppliers[j].id == 107){
                                    $scope.suppliers[j].name = "GTM/My Survey";
                                }
                                // Avtive Measure
                                /*if($scope.suppliers[j].id == 79){
                                    $scope.suppliers[j].name = "GTM/My Survey";
                                }*/
                            }); 
                        }
                        /*if($scope.userData && $scope.userData.cmp == 145){
                            console.log('done');
                            _.each($scope.suppliers, function(eachSup, j){
                                if($scope.suppliers[j].id == 9){
                                    $scope.suppliers[j].name = "GTM";
                                }
                                if($scope.suppliers[j].id == 26){
                                    $scope.suppliers[j].name = "My Survey";
                                }
                            });   
                        }*/
                        if($scope.suppliers[j].min_incidence > surveyIncidence || $scope.suppliers[j].max_loi < surveyLoi){
                            $scope.suppliersCount--;
                            $scope.suppliers[j].isValid = false;
                        }else {
                            $scope.suppliers[j].isValid = true;
                        }
                    }

                    // Sorting for valid suppliers is true and false
                    $scope.suppliers.sort(function(a,b){return b.isValid - a.isValid});

                    console.log('1 2');
                    // Dividing Allocations
                    for(var i = 0; i < $scope.suppliers.length; i++) {
                        if($scope.suppliers[i].isValid == true){
                            console.log('1 3 ',$scope.completesNeeded);
                            var allocation = parseInt($scope.completesNeeded / $scope.suppliersCount);
                            var allocationPercentage = parseFloat((allocation / parseInt($scope.completesNeeded)) * 100).toFixed(2);
                            var allocationData = {
                                allocationValue: allocation,
                                allocationPercentile: parseInt(allocationPercentage),
                                actualPercentile: allocationPercentage,
                                min : '',
                                max : ''
                            };

                            $scope.suppliers[i].allocations = allocationData;
                            $scope.totalAllocations = parseInt($scope.totalAllocations + $scope.suppliers[i].allocations.allocationValue);
                        }else{
                            var allocationData = {
                                allocationValue: 0,
                                allocationPercentile: 0,
                                actualPercentile: 0,
                                min : 0,
                                max : 0
                            };
                            $scope.suppliers[i].allocations = allocationData;
                        }
                    }
                    // For checking the first valid supplier and giving the remaining allocation to him
                    for(var i=0; i < $scope.suppliers.length; i++){
                        if($scope.suppliers[i].isValid == true){
                            $scope.suppliers[i].allocations.allocationValue = $scope.suppliers[i].allocations.allocationValue + ($scope.completesNeeded - $scope.totalAllocations);
                            $scope.totalAllocations = parseInt($scope.totalAllocations + ($scope.completesNeeded % $scope.suppliersCount));
                            break;
                        }
                    }
                    $scope.calculateFlexibility();
                    $scope.manualAllocationEdit = false; // Manual Edit only work on New Survey Creation
                }
                console.log('3 ',JSON.stringify($scope.tempSupplier));
                if ($scope.tempSupplier.length > 0) {
                    var allocationData = '';
                    var newTempArr = [];
                    _.each($scope.tempSupplier, function(tmpSupp){
                        if(tmpSupp.hasOwnProperty('isFlexibility')) {
                            $scope.isSupplierFlexibility = tmpSupp.isFlexibility;
                            $scope.flexibleValue = tmpSupp.flexValue;
                        }
                        newTempArr.push(tmpSupp.id);
                    });

                    for(var i = 0; i < $scope.suppliers.length; i++) {
                        var index = $scope.tempSupplier.map(function (todo) { return todo.id; }).indexOf($scope.suppliers[i].id);

                        if($.inArray($scope.suppliers[i].id, newTempArr) != -1) {
                            allocationData = {
                                allocationValue: parseInt($scope.tempSupplier[index].quantity),
                                actualPercentile: parseFloat($scope.tempSupplier[index].percentile).toFixed(2),
                                allocationPercentile: parseInt($scope.tempSupplier[index].percentile),
                                min: ($scope.tempSupplier[index].minimum)  ? parseInt($scope.tempSupplier[index].minimum) : 0,
                                max: ($scope.tempSupplier[index].maximum) ? parseInt($scope.tempSupplier[index].maximum) : 0,
                                fielded: parseInt($scope.tempSupplier[index].fielded)
                            };

                            $scope.totalAllocations = parseInt($scope.tempSupplier[index].total);
                        }
                        else {
                            allocationData = {
                                allocationValue: 0,
                                actualPercentile: 0,
                                allocationPercentile: 0
                            };
                        }
                        $scope.suppliers[i].allocations = allocationData;
                    }
                    $scope.manualAllocationEdit = true; // Manual Edit should not work on Supplier Edit Details
                }
                $scope.totalRemaining = parseInt(parseInt($scope.completesNeeded) - parseInt($scope.totalAllocations));
                var isFlexibilityUpdate = true;
                /* track the survey allocatin changes */
              
                /* ---------------------------------- */
                commonApi.getAllMasterData().success(function(masterData){
                    if(masterData.apiStatus == 'Success'){
                        masterDatas =  masterData.values;
                    }
                    getBuyerCPI(isFlexibilityUpdate);
                }).error(function (err) {
                    console.log('err '+JSON.stringify(err));
                    notify({message: err.msg, classes: 'alert-danger', duration: 2000});
                });
               /* $scope.loader.show = false;*///PD-955
               
                
            }).error(function (err) {
                //$scope.loader.show = false;//PD-955
                notify({message: err.msg, classes: 'alert-danger', duration: 2000});
            });

        }

        function getBuyerCPI(isFlexibilityUpdate) {
            //$scope.loader.show = true;//PD-955
            createSurvey.getBuyerCPI($stateParams.surveyid).success(function (data) {
                if (data.apiStatus == 'Success') {
                    $scope.buyerCPI = data.buyerCPI;

                    var suppliers = $scope.suppliers;
                    $scope.suppliers = suppliers.map(function (item) {
                        var cpi = $scope.buyerCPI.filter(function (buyer) {
                            return (buyer.supplier == item.id);
                        });

                        if (cpi.length > 0) {
                            item.cpi = (cpi[0].override_cost &&  $scope.manualOperatorOverride) ? cpi[0].override_cost : cpi[0].cost;
                            item.margin = (cpi[0].hasOwnProperty('margin') && cpi[0].margin !== '') ? cpi[0].margin : 20;
                            if(cpi[0].BCPI) {
                               item.BCPI =  cpi[0].BCPI // buyer cpi in usd 
                            }
                            if(cpi[0].CR) {
                               item.CR =  cpi[0].CR // currency reserve if currency !== USD
                            }
                        }
                        else {
                            item.cpi = 0;
                            item.margin = 20;
                        }
                        return item;
                    });
                    $scope.reCalculateCPI();
                    //calculateTotalCost();
                }

                checkFeasibilityStatus(suppliers);/**PD-844 */
                //$scope.loader.show = true;//PD-955
                angular.forEach($scope.suppliers, (supp) => {
                    if (!_.isUndefined(supp['cpi'])) {
                        supp['oldCpi'] = supp['cpi'];
                    }
                    if (!_.isUndefined(supp['allocations']) && !_.isUndefined(supp['allocations']['allocationValue'])) {
                        supp.allocations.oldAllocationValue = supp.allocations.allocationValue;
                    }
                });

                if(isFlexibilityUpdate) { // update if change in price override box not when refreshing page
                    getFlexibilityPricesParams($scope.srvId);
                }
                //Fixed CPI till two decimal places
                _.each(suppliers, function(modfyCPI) {
                    modfyCPI.cpi = parseFloat(modfyCPI.cpi).toFixed(2);
                })
 
            });
        }
        /**PD-844  */
        function checkFeasibilityStatus(suppliers){
            var feasPayload = [];
            var max_feas;
            var localization ={
                feasCountry : surveyData.survey[0].locale["countryCode"],
                feasLng     : surveyData.survey[0].locale["languageCode"]
            };

            

            //$scope.loader.show = true;
            var quotaPayloadObj =  quotaForFeasibilityPayload();
            
              // adding survey localization into every supplier object inside suppliers array.
            _.each(suppliers, function(supplierDoc){
                supplierDoc.localization = localization;
            })    
            feasibilityService.getFeasibilityForSuppliers(suppliers).success(function(fblySetting){
                if(fblySetting.data){
                    var feasPayload = [];
                    if(suppliers && suppliers.length > 0){
                        _.filter(fblySetting.data.suppliers, function(feasibilityRecord){
                            //  `Feas_max` Calculation Logic.
                            var desktopUsr = false;
                            var mobileUsr  = false;
                            _.each(surveyData.survey[0].target.device,function(device){
                                if( device.id === 111){ //Desktop
                                    desktopUsr = true;
                                }
                                if( device.id === 112){ //Mobile
                                    mobileUsr  = true;
                                }
                            });
                            if( desktopUsr && mobileUsr){

                                if( feasibilityRecord.desktopMonthlyActUsr && feasibilityRecord.mobileMonthlyActUsr){
                                    max_feas = feasibilityRecord.desktopMonthlyActUsr + feasibilityRecord.mobileMonthlyActUsr;
                                }

                            }else if( desktopUsr && !mobileUsr){

                                if(feasibilityRecord.desktopMonthlyActUsr){
                                    max_feas = feasibilityRecord.desktopMonthlyActUsr;
                                }

                            }else if( !desktopUsr && mobileUsr){

                                if(feasibilityRecord.mobileMonthlyActUsr){
                                    max_feas = feasibilityRecord.mobileMonthlyActUsr;
                                }

                            }

                            var temp = _.where(suppliers,{id :feasibilityRecord.s_id});
                            if(_.isEqual( localization,feasibilityRecord.surveyLocalization )){
                                if(temp && temp.length > 0){
                                    feasPayload.push({
                                        survey_id          : surveyData.survey[0].id,
                                        quotas             : quotaPayloadObj.quotas,
                                        unUsedQual         : quotaPayloadObj.unUsedQualArr,
                                        supplier_id        : temp[0].id,
                                        cpi                : temp[0].cpi,
                                        field_time         : surveyData.survey[0].field_time,
                                        incidence_rate     : surveyData.survey[0].incidence,
                                        loi                : surveyData.survey[0].lengthOfSurvey,
                                        surveyLocalization : localization,
                                        suppliers          : [{
                                                                s_id     : feasibilityRecord.s_id,
                                                                factor   : feasibilityRecord.patnrDelvryMulplr,
                                                                max_feas : max_feas
                                                              }]
                                    });
                                }
                            }else{
                                if(temp && temp.length > 0){
                                    feasPayload.push({
                                        survey_id          : surveyData.survey[0].id,
                                        quotas             : quotaPayloadObj.quotas,
                                        unUsedQual         : quotaPayloadObj.unUsedQualArr,
                                        supplier_id        : temp[0].id,
                                        cpi                : temp[0].cpi,
                                        field_time         : surveyData.survey[0].field_time,
                                        incidence_rate     : surveyData.survey[0].incidence,
                                        loi                : surveyData.survey[0].lengthOfSurvey,
                                        surveyLocalization : 'NA',
                                        suppliers          : [{
                                                                s_id     : feasibilityRecord.s_id,
                                                                factor   : feasibilityRecord.patnrDelvryMulplr,
                                                                max_feas : max_feas
                                                              }]
                                    });
                                }
                            }
                        });
                    }
                    
                    getSurveyManagementData(feasPayload);
                }
            }).error(function(err){
                //$scope.loader.show = false;
                notify({message: err.msg, classes: 'alert-danger', duration: 2000});
            });
        }


        /**  get Survey Management Data for Feasibility Payload  **/
        function getSurveyManagementData(feasPayload) {
            var locale ={
                countryCode  : surveyData.survey[0].locale["countryCode"],
                languageCode : surveyData.survey[0].locale["languageCode"]
            }
            var surveyManagementData;
            createSurvey.getSurveyManagement($stateParams.surveyid, 'buyer', locale).success(function(data){
                if(data.hasOwnProperty('result') && data.result.length > 0){
                  surveyManagementData   =  data.result[0];
                    if(surveyManagementData && surveyManagementData.hasOwnProperty('gpp') && Object.keys(surveyManagementData.gpp).length > 0 && surveyManagementData.gpp.hasOwnProperty('IR') && !_.isUndefined(surveyManagementData.gpp.IR) && !_.isNull(surveyManagementData.gpp.IR)) {
                        _.each(feasPayload, function(payloadRecord) {
                            payloadRecord.incidence_rate = surveyManagementData.gpp.IR;
                            surveyManagementIR = surveyManagementData.gpp.IR;
                        })
                    }
                }
                calculateFeasibility(feasPayload);
            }).error(function(err){
               calculateFeasibility(feasPayload);
            notify({message:err.msg,classes:'alert-danger',duration:2000} );
            });
        }





        /**  Returns Quotas array for Feasibility Payload  **/
        function quotaForFeasibilityPayload(){
            //$scope.loader.show          = true;
            var autoNestedQuotaExist    = false;
            var feasPayloadRecord       = {};
            var quotas                  = [];
            var quotaArr                = [];
            var qualArr                 = [];
            var quotCategoryInfo        = [];
            var mixQuotaCategoryExist   = false;
            var layeredQuotaInformation = [];
            var layeredQuotaData        = [];

            if(surveyData.quotaV2Data.quotas){

                _.each(surveyData.quotaV2Data.quotas,function(quotaRecord){
                    if(quotaRecord.qualification_code != 229 && quotaRecord.quotaCategory && quotaRecord.quotaCategory !== 'default'){
                        quotCategoryInfo.push(quotaRecord.quotaCategory);
                        if(quotaRecord.quotaCategory === "layered"){
                             layeredQuotaInformation.push(quotaRecord.criteria[0].qualification_code);
                             layeredQuotaData.push({quota_id:quotaRecord.quota_id,q_id:quotaRecord.criteria[0].qualification_code});
                        }
                    }
                });

                layeredQuotaInformation = _.uniq(layeredQuotaInformation);
                var layeredQuotaData    = _.chain(layeredQuotaData)
                                           .flatten()
                                           .uniq(function(v){ return v.quota_id + v.q_id })
                                           .value();

                quotCategoryInfo = _.uniq(quotCategoryInfo);

                if(quotCategoryInfo.length === 2){
                    mixQuotaCategoryExist = true;
                }

                _.each(surveyData.quotaV2Data.quotas,function(quotaRecord){

                    //Fetching  data from Quotas
                    if(quotaRecord.isActive){
                        if(quotaRecord.quotaCategory !== 'autoNested'){
                            _.filter(quotaRecord.criteria,function(quotaCriteria){
                                //check if zipCodes exist in quotaCriteria and push them in array.
                               if(quotaCriteria.conditions && quotaCriteria.conditions.length >0 && quotaCriteria.qualification_code === 229){
                                    if(surveyData && surveyData.hasOwnProperty('survey') && surveyData.survey.length >0 &&  surveyData.survey[0].hasOwnProperty('locale') && surveyData.survey[0].locale.hasOwnProperty('countryCode') && surveyData.survey[0].locale["countryCode"] === 'US'){
                                        var zipTempArr  = _.pluck(quotaCriteria.conditions, 'id');  
                                            zipTempArr  = _.flatten(zipTempArr);
                                        if(zipTempArr && zipTempArr.length > 0){
                                          if(mixQuotaCategoryExist){
                                            quotaArr.push([{quota_id :quotaRecord.quota_id, q_id:quotaCriteria.qualification_code,c_id : zipTempArr}]);
                                          }else{
                                            quotaArr.push({quota_id :quotaRecord.quota_id, q_id:quotaCriteria.qualification_code,c_id : zipTempArr});
                                          }
                                          qualArr.push({ qualification_code :quotaCriteria.qualification_code, id : zipTempArr}) 
                                        }  
                                    }else{
                                        if(mixQuotaCategoryExist){
                                            quotaArr.push([{quota_id :quotaRecord.quota_id, q_id:quotaCriteria.qualification_code,c_id : []}]);
                                          }else{
                                            quotaArr.push({quota_id :quotaRecord.quota_id, q_id:quotaCriteria.qualification_code,c_id : [] });
                                          }
                                         qualArr.push({ qualification_code :quotaCriteria.qualification_code, id : []}) 



                                    }
                                }else if(quotaCriteria.conditions && quotaCriteria.conditions.length >0){
                                    _.filter(quotaCriteria.conditions,function(quotaConditions){
                                        if(mixQuotaCategoryExist){
                                            quotaArr.push([{quota_id :quotaRecord.quota_id, q_id:quotaCriteria.qualification_code,c_id : quotaConditions.id}]);
                                        }else{
                                            quotaArr.push({quota_id :quotaRecord.quota_id, q_id:quotaCriteria.qualification_code,c_id : quotaConditions.id});
                                        }
                                        qualArr.push({ qualification_code :quotaCriteria.qualification_code, id : quotaConditions.id})
                                    });
                                }
                                if(quotaCriteria.range_sets && quotaCriteria.range_sets.length >0){
                                    _.filter(quotaCriteria.range_sets,function(quotaRange){
                                        if(mixQuotaCategoryExist){
                                            quotaArr.push([{
                                                quota_id : quotaRecord.quota_id,
                                                q_id     : quotaCriteria.qualification_code,
                                                c_id      :[quotaRange.from,quotaRange.to],
                                                range    : true
                                            }]);
                                        }
                                        else{
                                            quotaArr.push({
                                                quota_id : quotaRecord.quota_id,
                                                q_id     : quotaCriteria.qualification_code,
                                                c_id      :[quotaRange.from,quotaRange.to],
                                                range    : true
                                            });
                                        }
                                        qualArr.push({ qualification_code :quotaCriteria.qualification_code, id : [quotaRange.from,quotaRange.to], range : true})
                                    });
                                }
                            });

                        }else{
                            autoNestedQuotaExist = true;
                            var tempQuota = [];
                            _.filter(quotaRecord.criteria,function(quotaCriteria){
                                 //check if zipCodes exist in quotaCriteria and push them in array.
                                if(quotaCriteria.hasOwnProperty('qualification_code') && quotaCriteria.qualification_code === 229){

                                    if(surveyData && surveyData.hasOwnProperty('survey') && surveyData.survey.length >0 &&  surveyData.survey[0].hasOwnProperty('locale') && surveyData.survey[0].locale.hasOwnProperty('countryCode') && surveyData.survey[0].locale["countryCode"] === 'US'){  
                                        if(quotaCriteria.conditions && quotaCriteria.conditions.length >0){
                                           var zipTempArr  =   _.pluck(quotaCriteria.conditions,'id');
                                               zipTempArr  =  _.flatten(zipTempArr);
                                            if(zipTempArr && zipTempArr.length > 0){
                                               tempQuota.push({quota_id :quotaRecord.quota_id, q_id:quotaCriteria.qualification_code,c_id : zipTempArr});
                                               qualArr.push({ qualification_code :quotaCriteria.qualification_code, id : zipTempArr})
                                            }    

                                        }
                                    }else{
                                        tempQuota.push({quota_id :quotaRecord.quota_id, q_id:quotaCriteria.qualification_code,c_id : []});
                                        qualArr.push({ qualification_code :quotaCriteria.qualification_code, id : []})

                                    }
                                }else if(quotaCriteria.conditions && quotaCriteria.conditions.length >0){
                                    _.filter(quotaCriteria.conditions,function(quotaConditions){
                                        tempQuota.push({quota_id :quotaRecord.quota_id, q_id:quotaCriteria.qualification_code,c_id : quotaConditions.id});
                                        qualArr.push({ qualification_code :quotaCriteria.qualification_code, id : quotaConditions.id});
                                    });
                                }


                                if(quotaCriteria.range_sets && quotaCriteria.range_sets.length >0){
                                    _.filter(quotaCriteria.range_sets,function(quotaRange){
                                        tempQuota.push({
                                            quota_id : quotaRecord.quota_id,
                                            q_id     : quotaCriteria.qualification_code,
                                            c_id      :[quotaRange.from,quotaRange.to],
                                            range    : true
                                        });
                                        qualArr.push({ qualification_code :quotaCriteria.qualification_code, id : [quotaRange.from,quotaRange.to], range : true})
                                    });
                                }

                            });
                            if(tempQuota.length > 0){
                                quotaArr.push(tempQuota);
                            }
                        }
                    }
                });
            }

            if(surveyData.quotaV2Data.qualifications){
                _.each(surveyData.quotaV2Data.qualifications,function(qualRecord) {
                 
                
                    if(qualRecord.hasOwnProperty('qualification_code')){
                          //code to push zip codes in qual array if they are only in qualifications
                        if(qualRecord.conditions && qualRecord.conditions.length > 0 && qualRecord.qualification_code === 229){
                           if(surveyData && surveyData.hasOwnProperty('survey') && surveyData.survey.length >0 &&  surveyData.survey[0].hasOwnProperty('locale') && surveyData.survey[0].locale.hasOwnProperty('countryCode') && surveyData.survey[0].locale["countryCode"] === 'US'){
                                let qualIndex = _.findIndex(qualArr, {qualification_code: qualRecord.qualification_code});
                                if(qualIndex < 0){
                                    var zipTempArr = _.pluck(qualRecord.conditions,'id');
                                    if(zipTempArr && zipTempArr.length > 0){
                                        qualArr.push({qualification_code: qualRecord.qualification_code , id: zipTempArr})
                                    }
                                }
                             
                           }else{
                                qualRecord.conditions = [{}];
                                qualRecord.conditions[0].qualification_code = qualRecord.qualification_code ;
                                var qualIndex = _.findIndex(qualArr , {qualification_code : qualRecord.qualification_code });
                                if(qualIndex < 0) {
                                    qualArr.push(qualRecord.conditions);

                                }
                            } 
                        }else if(qualRecord.conditions && qualRecord.conditions.length > 0){
                       
                            _.filter(qualRecord.conditions, function (qualConditions) {
                                var data = fetchMasterData(qualRecord.q_name);
                                if(data && data.length !== qualRecord.conditions.length){
                                    qualConditions.qualification_code = qualRecord.qualification_code;
                                    var qualIndex = _.findIndex(qualArr , {qualification_code : qualRecord.qualification_code , id : qualConditions.id });
                                    if(qualIndex < 0) {
                                        qualArr.push(qualConditions);

                                    }
                                }
                            });
                        }

                        if(qualRecord.range_sets && qualRecord.range_sets.length > 0){
                            var addInQual = true;
                            // checking default values of `from` and `to` in Age.
                            if(qualRecord.qualification_code === 212){
                            
                                if(qualRecord.range_sets[0].from === 13 && qualRecord.range_sets[0].to === 99){
                                    addInQual = false;
                                }
                            }
                            // checking default values of `from` and `to` in Income.
                            if(qualRecord.qualification_code === 213){
                                if(qualRecord.range_sets[0].from === 0 && qualRecord.range_sets[0].to === 999999){
                                    addInQual = false;
                                }
                            }
                            if(addInQual){
                                _.filter(qualRecord.range_sets,function(qualRange){
                                    var qualIndex = _.findIndex(qualArr, {qualification_code : qualRecord.qualification_code});

                                    if(qualIndex < 0) {
                                        qualArr.push({
                                            qualification_code: qualRecord.qualification_code,
                                            id: [qualRange.from, qualRange.to],
                                            range: true
                                        });
                                    }
                                });
                            }
                        }
                    }
                });
            }

            var qualArr = _.chain(qualArr)
                           .flatten()
                           .uniq(function(v){ return v.qualification_code + v.id })
                           .value();

            var unUsedQualArr = fetchUnUsedQual(qualArr,quotaArr); /*Fetching the Un-Used Qualifications*/
            feasPayloadRecord.unUsedQualArr = unUsedQualArr;
                    
            var qualRecord= [];
            var qualRepeatChkr =[];
            var qualExist = false;
            
            if(qualArr && qualArr.length > 0){
                // get all the zip Records from qual Array and push zip codes in an array
               var zipQualRecords = _.where(qualArr,{"qualification_code":229})
               if(zipQualRecords && zipQualRecords.length > 0){
                 var zipArr = _.pluck(zipQualRecords, 'id');
               }
                    zipArr =_.flatten(zipArr);
                    zipArr = [...new Set(zipArr)];
                
    
                if(zipQualRecords && zipQualRecords.length > 0 &&  _.has(zipQualRecords[0], "qualification_code")){

                    qualRecord.push({q_id: zipQualRecords[0].qualification_code, c_id: zipArr })
                }
                
                _.each(qualArr, function(data){
                  if(data.qualification_code && data.qualification_code !== 229){   
                   
                    if(qualRecord.indexOf(qualForFeasibilityPayload(qualArr, data.qualification_code)) < 0){
                        qualRecord.push(qualForFeasibilityPayload(qualArr, data.qualification_code));
                    }
                  }
                });
            }

            if(autoNestedQuotaExist === true){

                var quotaIdsTemp = [];
                var q_idTemp     = [];
                _.each(quotaArr,function(quotData){
                    if(quotData instanceof Array){
                        _.filter(quotData,function(quotRecord){
                            quotaIdsTemp.push(quotRecord.quota_id);
                            q_idTemp.push({quota_id:quotRecord.quota_id,q_id:quotRecord.q_id,c_id:quotRecord.c_id});
                        });
                    }
                });

                quotaIdsTemp = _.uniq(quotaIdsTemp);

                q_idTemp     = _.chain(q_idTemp)
                                .flatten()
                                .uniq(function(v){ return v.quota_id + v.q_id + v.c_id })
                                .value();


                var nestedFinalPayload = [];

                _.each(quotaArr,function(quotData){

                    _.filter(quotaIdsTemp,function(quotaIdRecord){
                        var target = [];
                        _.filter(quotData,function(quotRecord){
                            var tempp;
                            if(quotaIdRecord === quotRecord.quota_id){
                                    var tempp = quotaIdRecord;
                                    target.push({q_id:quotRecord.q_id,c_id:quotRecord.c_id});
                            }

                            if(target && target.length > 0)
                            {
                                nestedFinalPayload.push({quota_id:tempp,target:target});
                            }
                        });
                    });
                });

                nestedFinalPayload = _.chain(nestedFinalPayload)
                                      .flatten()
                                      .uniq(function(v){ return v.quota_id + v.target })
                                      .value();


                var qualificationIDsTemp = [];

                _.each(qualArr,function(qualRecord){
                    if(qualRecord.qualification_code){
                        qualificationIDsTemp.push({q_id:qualRecord.qualification_code,c_id:qualRecord.id});
                    }
                });

                qualificationIDsTemp = _.chain(qualificationIDsTemp)
                                        .flatten()
                                        .uniq(function(v){ return v.q_id + v.c_id })
                                        .value();
               
                

                  /* check for Valid Qualification_Code !!!*/
                var nestInfoCombo = [];
                var qualTempArr   = _.pluck(qualificationIDsTemp,"q_id");
                    qualTempArr   = _.uniq(qualTempArr);
                var quotTempArr   = _.pluck(q_idTemp, "q_id");
                    quotTempArr   = _.uniq(quotTempArr);
                var qualdiff      = _.difference(qualTempArr, quotTempArr);
                    qualdiff      = _.union(qualdiff,layeredQuotaInformation);

                if(layeredQuotaInformation  && layeredQuotaInformation.length > 0){

                    var quotaQualDiff   = _.difference(quotTempArr, qualdiff);
                        quotaQualDiff   = _.uniq(quotaQualDiff);
                    var nestedQuotaInfo = _.difference(quotaQualDiff, layeredQuotaInformation);
                        nestedQuotaInfo = _.uniq(nestedQuotaInfo);

                    var nestedQuotaInfoWrapper = _.filter(qualificationIDsTemp,function(obj) { return nestedQuotaInfo.indexOf(obj.q_id) >= 0; });

                    _.each(nestedQuotaInfoWrapper,function(nestedRecord){
                        nestInfoCombo.push(qualForFeasibilityPayload(nestedQuotaInfoWrapper,nestedRecord.q_id));
                    });

                    nestInfoCombo = _.chain(nestInfoCombo)
                                     .flatten()
                                     .uniq(function(v){ return v.q_id + v.c_id })
                                     .value();

                    _.each(nestedFinalPayload,function(finalRecord){
                        _.filter(layeredQuotaData,function(quotaData){

                            if( finalRecord.quota_id === quotaData.quota_id ){
                                _.filter(nestInfoCombo,function(nestedRecord){
                                    finalRecord.target.push(nestedRecord);
                                });
                            }
                        });
                    });
                }
                var validQualification = _.filter(qualificationIDsTemp,function(obj) { return qualdiff.indexOf(obj.q_id) >= 0; });
                      
                var qualIdCombo = [];

                _.each(validQualification,function(qualRecord){
                    qualIdCombo.push(qualForFeasibilityPayload(validQualification,qualRecord.q_id));
                });

                qualIdCombo = _.chain(qualIdCombo)
                               .flatten()
                               .uniq(function(v){ return v.q_id + v.c_id })
                               .value();

                _.each(qualIdCombo,function(qualIdRcrd){
                    qualIdRcrd.c_id = _.sortBy(qualIdRcrd.c_id, function(num) {
                        return num;
                    });
                });

                _.each(qualIdCombo,function(qualIdRcrd){
                    var tempArr = [];
                    if(qualIdRcrd.q_id === 212 || qualIdRcrd.q_id === 213){
                        if(qualIdRcrd.c_id instanceof Array){
                            var len = qualIdRcrd.c_id.length;
                            tempArr.push(qualIdRcrd.c_id[0],qualIdRcrd.c_id[len - 1]);
                        }
                        qualIdRcrd.c_id = tempArr;
                     }

                });

                if(validQualification && validQualification.length > 0){
                    _.each(nestedFinalPayload,function(finalRecord){
                            _.filter(qualIdCombo,function(validQualRecord){
                                   finalRecord.target.push(validQualRecord);
                            });
                    });
                }

                _.each(nestedFinalPayload,function(finalRecord){
                    _.filter(finalRecord.target,function(targetData){
                            targetData = rmRedundantTargetElements(finalRecord.target,finalRecord.target[0].q_id);
                    });
                });

                _.each(nestedFinalPayload,function(finalRecord){
                    _.filter(finalRecord.target,function(targetData){
                        if(targetData.q_id === 212 || targetData.q_id === 213) targetData.range = true;
                    });
                });

                feasPayloadRecord.quotas = nestedFinalPayload;
                

                return feasPayloadRecord;
            }


            var payloadArray = [];

            _.each(qualRecord,function(qualData){
                if(qualData.q_id === 212 || qualData.q_id === 213 ){
                    qualData.range = true;
                }
            });

            var quotaArrLen = quotaArr.length;
            _.each(quotaArr, function (quotaRecord,index){
                if(index < quotaArrLen){
                    var qualData =[];
                    _.map(qualRecord, function (item) {
                        qualData.push(item);
                    });
                    //Handle Grouping and layerd Feasiability
                    if(quotaRecord instanceof Array) {
                        if(quotaRecord[0].quota_id && quotaRecord[0].q_id && quotaRecord[0].c_id) {
                            if(quotaRecord[0].c_id instanceof Array){
                                payloadArray.push([quotaRecord[0].quota_id,{q_id : parseInt(quotaRecord[0].q_id), c_id : quotaRecord[0].c_id,range:quotaRecord[0].range},qualData]);
                            }else{
                                payloadArray.push([quotaRecord[0].quota_id,{q_id : parseInt(quotaRecord[0].q_id), c_id : parseInt(quotaRecord[0].c_id)}, qualData]);
                            }
                        }
                    }
                    else {
                        if(quotaRecord.quota_id && quotaRecord.q_id && quotaRecord.c_id) {
                            if(quotaRecord.c_id instanceof Array){
                                payloadArray.push([quotaRecord.quota_id,{q_id : parseInt(quotaRecord.q_id), c_id : quotaRecord.c_id,range:quotaRecord.range},qualData]);
                            }else{
                                payloadArray.push([quotaRecord.quota_id,{q_id : parseInt(quotaRecord.q_id), c_id : parseInt(quotaRecord.c_id)}, qualData]);
                            }
                        }
                    }
                }
            });

           var payloadArray =  bindQualificationIntoQuotas(payloadArray);

            _.each(quotaArr,function(quota){
                _.filter(payloadArray,function(qualData){
                    //Handle Grouping and layerd Feasiability
                    if(quota instanceof Array) {
                        if(qualData.indexOf(quota[0].quota_id) >=0){
                            qualData.splice(qualData.indexOf(quota[0].quota_id), 1);
                            quotas.push({quota_id: quota[0].quota_id, target: qualData});
                        }  
                    }
                    else {
                        if(qualData.indexOf(quota.quota_id) >=0){
                            qualData.splice(qualData.indexOf(quota.quota_id), 1);
                            quotas.push({quota_id: quota.quota_id, target: qualData});
                        }
                    }
                });

            });


            _.each(quotas,function(quotasRecord){
                _.filter(quotasRecord.target,function(targetData){
                    if(targetData.range){
                        if(targetData.q_id === 212 || targetData.q_id === 213){
                            targetData.c_id = _.sortBy(targetData.c_id, function(num) {
                                return num;
                            });
                            var len = targetData.c_id.length;
                            targetData.c_id = [targetData.c_id[0],targetData.c_id[len - 1]];
                        }
                    }
                });

            });

			feasPayloadRecord.quotas = quotas;
           // $scope.loader.show = false;
            return feasPayloadRecord;
        }



        /* Remove Reduntant Target's entry*/
        function rmRedundantTargetElements(targets,q_id){
            var indexTemp       = -1;
            var qualIndxCounter =  0;

            _.each(targets,function(targetRecord,index){

                /* handling for Age & Income Quotas*/
                if(q_id === 212 ||  q_id === 213){

                    if(targetRecord.q_id === q_id){

                        if(targetRecord.c_id instanceof Array){
                            qualIndxCounter++;
                            if(qualIndxCounter > 1){
                                indexTemp = index;
                            }
                        }
                    }
                }else{
                    if(targetRecord.q_id === q_id){

                        if(targetRecord.c_id instanceof Array){
                            indexTemp = index;
                        }
                    }
                }
            });
            if(indexTemp !== -1){
                targets.splice(indexTemp,1);
            }
            return targets;
        }


        /** Combine quotas and qualification for payload **/

        function bindQualificationIntoQuotas(payloadData) {
            _.each(payloadData, function (payloadRecord) {
                _.filter(payloadRecord, function (payloadInfo) {
                    if(payloadRecord.indexOf(payloadInfo) >= 0 &&  payloadInfo instanceof Array) {
                        var tempRecord = payloadInfo;
                        payloadRecord.splice(payloadRecord.indexOf(payloadInfo), 1);
                        _.map(tempRecord, function(item){

                            
                            var data = _.where(payloadRecord ,  {q_id : item.q_id});

                            if(data.length === 0){
                                payloadRecord.push(item);
                            }
                        })
                    }
                });
            });

            return payloadData;

        }

        /* Fetching Qualification for Feasibility Payload */
        function qualForFeasibilityPayload(qualifications, qualId) {
            var qualArr = [];
            var finalResp = {};
            _.each(qualifications, function (qualificationRecord) {
                if(qualificationRecord.qualification_code === qualId ){
                    if(qualificationRecord.id instanceof Array){

                        _.map(qualificationRecord.id, function(id){
                            qualArr.push(id);
                        })

                    }else{
                          if(qualId === 229){
                           qualArr.push((qualificationRecord.id));
                          }else{
                            qualArr.push(parseInt(qualificationRecord.id));
                          }

                        
                    }
                }
                if(qualificationRecord.q_id === qualId ){

                    if(qualificationRecord.c_id instanceof Array){

                        _.map(qualificationRecord.c_id, function(id){
                            qualArr.push(id);
                        })

                    }else{
                        if(qualId === 229){
                          qualArr.push((qualificationRecord.id));  
                        }
                        else{
                          qualArr.push(parseInt(qualificationRecord.c_id));
                        }
                    }
                }
            });
            if(qualArr.length === 0){
                finalResp['q_id'] = qualId;
                finalResp['c_id'] = qualArr[0];
            }else{
                finalResp['q_id'] = qualId;
                finalResp['c_id'] = qualArr;
            }
            return finalResp;
        }


        /** Fetch MasterData on the basis of Qualification Name. **/
        function  fetchMasterData(qualName){
            var countryCode  = surveyData.survey[0].locale.countryCode;
            var languageCode = surveyData.survey[0].locale.languageCode;
            var countryData = _.where(masterDatas,{masterKey:qualName});
            if(countryData && countryData.length > 0){
                if(countryData[0].hasOwnProperty('data') && countryData[0].data[countryCode] && countryData[0].data[countryCode][languageCode]){
                    return (countryData[0].data[countryCode][languageCode]);
                }else{
                    return countryData[0];
                }
            }else{
                return countryData;
            }
        }


        /** PD-1066  Begins Here**/
        function calculateFeasibility(supplier) {
            //$scope.loader.show = true;

            feasibilityService.getFeasibility(supplier).success(function(feasibiltyData) {
                if(feasibiltyData.apiStatus ===  200){
                    if(feasibiltyData && feasibiltyData.hasOwnProperty('feasibility') && feasibiltyData.feasibility.length > 0 && feasibiltyData.feasibility[0].hasOwnProperty('unUsedQual')){
                         var unUsedQualArr      = [];
                             unUsedQualArr      = feasibiltyData.feasibility[0].unUsedQual;
                         var exactUnusedQualArr = [];
                        _.each(unUsedQualArr, function(qualId){
                            var masterRecord;
                            var qualName;
                          masterRecord= _.findWhere( masterDatas ,{id : qualId});
                            if(!_.isUndefined(masterRecord) && masterRecord.hasOwnProperty('masterKey')){
                                qualName    = masterRecord.masterKey;
                                if(qualName === 'csa') {
                                  qualName = 'Cbsa';
                                }
                                if(qualName && !_.isUndefined(qualName)){
                                  qualName = qualName.toLowerCase();
                                  exactUnusedQualArr.push(qualName.charAt(0).toUpperCase() + qualName.substr(1));
                                }
                            }
                        })
                        exactUnusedQualArr = exactUnusedQualArr.join(', ');
                        _.each(feasibiltyData.feasibility, function(feasRecord){
                            feasRecord.unUsedQual = exactUnusedQualArr;
                        })
                    }
                    _.each(feasibiltyData.feasibility,function(feasRecord){
                        var supplierId     = feasRecord.s_id;
                        var feas           = 0;
                        var feasHolder     = []; /* It contains the `qualCode` & `feasMin` for each qualification_code present inside Quota'scriteria */
                        var feasCodesSet   = [];
                        var estimatedFeasibility;
                        var quotaId;
                        var quotasMax;
                        var intermediaFeas = [];
                        var unUsedQual     = feasRecord.unUsedQual;
                        var incidence_rate;
                        //PD-1386 add CSA 
                        if(_.contains(unUsedQual, "CSA")) {
                            var findIndex = _.indexOf(unUsedQual, "CSA");
                            unUsedQual[findIndex] = "CBSA";
                        }
                        
                        if(supplierId && feasRecord.max_feas && feasRecord.quotas.length === 0){
                            if($scope.supplier){
                                _.each($scope.suppliers,function(supplier){
                                    if(supplier.id === supplierId ){
                                        if(surveyData.survey[0].incidence){
                                          incidence_rate = surveyData.survey[0].incidence;
                                            if(!_.isUndefined(surveyManagementIR)){
                                               incidence_rate = surveyManagementIR;
                                            }
                                            feasRecord.max_feas  *=  incidence_rate / 100;
                                            if(Math.ceil(feasRecord.max_feas) === 0){
	                                            supplier.feasibility = 'N/A';
                                            }else{
	                                            supplier.feasibility  =  Math.ceil(feasRecord.max_feas);
                                            }
                                        }
                                        if(unUsedQual && unUsedQual.length > 0) supplier.unUsedQual = unUsedQual;
                                        else supplier.unUsedQual = 0; // hide the 'tooltip'
                                    }
                                });
                            }
                        }
                        if(supplierId && feasRecord.quotas.length > 0 && !feasRecord.max_feas){
                            _.each(feasRecord.quotas,function(quotaRecord){
                                quotaId              = quotaRecord.quota_id;
                                estimatedFeasibility = quotaRecord.feas;

                                /*if Incidence exist then multiply it by EstimatedFeasibility from Backend*/
                                if(surveyData.survey[0].incidence){
                                    incidence_rate = surveyData.survey[0].incidence;
                                   if(!_.isUndefined(surveyManagementIR)){
                                      incidence_rate = surveyManagementIR;
                                    }
                                    estimatedFeasibility *=  incidence_rate / 100;
                                    /*estimatedFeasibility  =  Math.ceil(estimatedFeasibility);*/
                                }

                                if(surveyData.quotaV2Data.quotas){

                                    /* It contains the `qualification_codes` for each Quota from `quotaManagementV2` Database */
                                    var qualCodes    = [];

                                    _.filter(surveyData.quotaV2Data.quotas,function(quotaData){

                                        if(quotaData.quota_id === quotaId){
                                            quotasMax = quotaData.quantities.maximum;
                                            _.filter(quotaData.criteria,function(quotaCriteria){
                                                qualCodes.push(quotaCriteria.qualification_code);
                                            });
                                        }
                                    });
                                }
                                
                                /*  Logic for finalFeas Calculation. */
                                if(!isNaN(quotasMax)){
                                    if(estimatedFeasibility && quotasMax ){
                                        if(estimatedFeasibility < quotasMax){
                                            feas = estimatedFeasibility;
                                        }else{
                                            feas = quotasMax;
                                        }
                                    }

                                    _.filter(qualCodes,function(qData){
                                        feasHolder.push({qualCode:qData,feasMin:feas});
                                        feasCodesSet.push(qData);
                                    });

                                }
                            });
                            var feasCodesSet = _.uniq(feasCodesSet);

                            _.filter(feasCodesSet,function(feasCodeData){

                                var feasTemp = _.where(feasHolder,{ qualCode : feasCodeData });

                                var  totalFeasTemp = 0; /* contains the total Sum for feas for Each Uniques Qualification-Code*/
                                var  totalFeasTempId;
                                _.filter(feasTemp,function(feasRecord){
                                    totalFeasTemp   += feasRecord.feasMin;
                                    totalFeasTempId = feasRecord.qualCode;
                                });

                                intermediaFeas.push({qualCode : totalFeasTempId,feasMinimum : totalFeasTemp});
                            });
                             
                            //Exception Handling for Age which ensures age feas must have to be less than 100
                            /*_.filter(intermediaFeas,function(interMediateRecord){

                                if(interMediateRecord.qualCode === 212 && interMediateRecord.feasMinimum  > 100){
                                    interMediateRecord.feasMinimum = 100;
                                }

                            });*/
                            var intermediaFeasStatus = _.isEmpty(intermediaFeas);
                            var finalFeasibilityArr = [];
                            var finalFeasMin;
                            if(!intermediaFeasStatus){
                                _.filter(intermediaFeas,function(feasRecord){
                                    finalFeasibilityArr.push(feasRecord.feasMinimum);
                                });
                                finalFeasMin = _.min(finalFeasibilityArr);
                            }

                            if(isNaN(finalFeasMin)){ finalFeasMin = 0;}  //if totalFeas is NaN
                            if($scope.supplier && !isNaN(finalFeasMin)){
                                _.each($scope.suppliers,function(supplier){
                                    if(supplier.id === supplierId ){
                                        if(finalFeasMin === 0){
	                                        supplier.feasibility = 'N/A';
                                        }else{
	                                        supplier.feasibility = Math.ceil(finalFeasMin);
                                        }
                                        if(unUsedQual && unUsedQual.length > 0) supplier.unUsedQual = unUsedQual;
                                        else supplier.unUsedQual = 0; // hide the 'tooltip'
                                    }
                                });
                            }
                        }
                    });
                     //PD-1207
                     $scope.totalFeasibility = 0;
                    _.each($scope.suppliers,function(supplier){
                         var hasFeasbility = _.has(supplier, "feasibility");
                         if(hasFeasbility){
                            if(_.isNumber(supplier.feasibility)) {
                             $scope.totalFeasibility += supplier.feasibility;
                            }
                         }
                         else {
                             supplier.feasibility = "-";
                         }
                    });
                    //$scope.loader.show = false;
                }else{
                   // $scope.loader.show = false;
                    notify({message: "Error in getFeasibility Service", classes: 'alert-danger', duration: 3000});
                }
            }).error(function (err) {
	            if($scope.supplier){
		            _.each($scope.suppliers,function(supplier){
				            supplier.feasibility = '-';
		            });
	            }
                //$scope.loader.show = false;
                /*notify({message: err.msg, classes: 'alert-danger', duration: 2000});*/

            });

        }
        /** PD-1066  Ends   Here**/

        /* Fetch Un-used Qualification by comparing the Used Qualification with MasterData*/
        function fetchUnUsedQual(usedQual,usedQuota){
          let qualIds =[];
          let quotaIds= [];
          let unionIds= [];
          qualIds  =  _.pluck(usedQual ,'qualification_code');
          qualIds  =  _.without(qualIds, 219);
          _.each(usedQuota, function(record){
              if(record &&  record instanceof Array && record.length > 0 ){
                quotaIds.push(_.pluck(record, 'q_id'));
              }else if(record &&  record.q_id){
                quotaIds.push(record.q_id);
              }
          })
          quotaIds = _.flatten(quotaIds)
          quotaIds =  _.without(quotaIds, 219);
          unionIds =  _.union(qualIds,quotaIds);
          return unionIds;
        }
           
        
        /**PD-844-B Ends */

        function calculateTotalCost() {
            var tol = ($scope.headerValues.completes * $scope.headerValues.cpi);
            $scope.headerValues.total = parseFloat(tol).toFixed(2);
        }

        $scope.reCalculateCPI = function reCalculateCPI(callback) {
            if ($scope.reCalculateTimeOut)
                $timeout.cancel($scope.reCalculateTimeOut);
            $scope.reCalculateTimeOut = $timeout(function() {
                var formData = {'suppliers': $scope.suppliers, completes: $scope.headerValues.completes};
                createSurvey.getAllocationCPI(formData).success(function (data) {
                    if (data.apiStatus == "Success") {
                        if($stateParams.edit == '') {
                            // In case of augument Survey
                            $scope.headerValues.cpi = isNaN(parseFloat(data.cpi).toFixed(2))? 0:parseFloat(data.cpi).toFixed(2);
                             //Store new CPI for Live Clone
                            $rootScope.liveCloneCPI = isNaN(parseFloat(data.cpi).toFixed(2))? 0:parseFloat(data.cpi).toFixed(2);
                        }
                       
                        calculateTotalCost();

                        if(callback != undefined) {
                            callback();
                        }
                    }
                });
            }, 500); // delay 250 ms
        };

        $scope.setPriceOverride = function() {
            console.log("$scope.operatorOverrideMdl ",$scope.operatorOverrideMdl)
            if($scope.operatorOverrideMdl !== undefined && $scope.operatorOverrideMdl !== '' && !(isNaN(parseFloat($scope.operatorOverrideMdl)))) {
                $scope.surveyPauseThreshold = '';
                if(!$scope.manualOperatorOverride){
                    angular.forEach($scope.suppliers, function(value, index){
                        $scope.suppliers[index]["cpi"] = parseFloat($scope.operatorOverrideMdl ).toFixed(2);
                    });
                    $scope.reCalculateCPI();
                }
               
            } else {
                /*$scope.operatorOverrideMdl = '';*/
                var isFlexibilityUpdate = false;
                getBuyerCPI(isFlexibilityUpdate);
            }
        };

        

        $scope.allocationValueUpdate = function (index) {
            var value = $scope.suppliers[index].allocations.allocationValue;

            if (isNaN(parseInt(value))) {
                $scope.suppliers[index].allocations.allocationValue = 0;
            }
            else if(value == null || value == undefined || value == "") {
                $scope.suppliers[index].allocations.allocationValue = 0;
            }
            else {
                $scope.suppliers[index].allocations.allocationValue = parseInt(value);
            }

            $scope.suppliers[index].allocations.allocationPercentile = ($scope.suppliers[index].allocations.allocationValue * 100) / $scope.completesNeeded;
            $scope.suppliers[index].allocations.actualPercentile = parseFloat($scope.suppliers[index].allocations.allocationPercentile).toFixed(2);
            $scope.suppliers[index].allocations.allocationPercentile = parseInt($scope.suppliers[index].allocations.actualPercentile);
            $scope.totalAllocations = 0;

            for (var i = 0; i < $scope.suppliers.length; i++) {
                /*Commented this code to prevent make values 0*/
                /*-------On first change make other values 0-------*/
                /*if ($scope.manualAllocationEdit == false && i != index) {
                    $scope.suppliers[i].allocations.allocationValue = 0;
                    $scope.suppliers[i].allocations.allocationPercentile = 0;
                }*/
                $scope.totalAllocations += parseInt($scope.suppliers[i].allocations.allocationValue);
            }

            $scope.totalAllocations = parseInt($scope.totalAllocations);
            $scope.totalRemaining = parseInt(parseInt($scope.completesNeeded) - $scope.totalAllocations);
            $scope.manualAllocationEdit = true;

            $scope.calculateFlexibility();
        };

        $scope.allocationPercentileUpdate = function (index) {
            var value = $scope.suppliers[index].allocations.allocationPercentile;

            if (isNaN(parseFloat(value))) {
                $scope.suppliers[index].allocations.allocationPercentile = 0;
                $scope.suppliers[index].allocations.actualPercentile = 0;
            } else {
                $scope.suppliers[index].allocations.actualPercentile = parseFloat(value).toFixed(2);
                $scope.suppliers[index].allocations.allocationPercentile = parseInt(value);
            }

            $scope.suppliers[index].allocations.allocationValue = parseInt(($scope.suppliers[index].allocations.actualPercentile * $scope.completesNeeded) / 100);
            $scope.suppliers[index].allocations.allocationValue = parseInt($scope.suppliers[index].allocations.allocationValue);
            $scope.totalAllocations = 0;

            for (var i = 0; i < $scope.suppliers.length; i++) {
                $scope.totalAllocations = $scope.totalAllocations + parseInt($scope.suppliers[i].allocations.allocationValue);
            }

            $scope.totalAllocations = parseInt($scope.totalAllocations);
            $scope.totalRemaining = parseInt(parseInt($scope.completesNeeded) - $scope.totalAllocations);

            $scope.calculateFlexibility();
        };
        
        $scope.saveChoosedSuppliers = function (status) {
            // Pause Threshold should be greater than calculated
            // Comment it for now as it is stopping supplier resetting after pause.
            /*if(($scope.surveyPauseThreshold !== undefined && $scope.surveyPauseThreshold !== '' && $scope.surveyPauseThreshold !== 0) && $scope.surveyPauseThreshold < $scope.headerValues.cpi) {
               notify({message: "Pause Threshold value should be greater than calucalted cpi", classes: 'alert-danger', duration: 3000});
                return false; 
            }*/
            // Do not save if flexibility is greater than 100
            if($scope.flexibleValue > 100){
                notify({message: "Flexibility can't be greater than 100", classes: 'alert-danger', duration: 3000});
                return false;
            }
            //Commented due to PD-979
            // Do not save if allocations less than their achieved
            /*if(status == 'goToManageSurvey'){
                for(var i in $scope.tempSupplier){
                    for(var j in $scope.suppliers){
                        if($scope.tempSupplier[i].id == $scope.suppliers[j].id && $scope.tempSupplier[i].fielded > $scope.suppliers[j].allocations.allocationValue){
                            notify({message: "Please enter allocations greater than the achieved", classes: 'alert-danger', duration: 3000});
                            return false;
                        }
                    } 
                }
            }*/
            $scope.showLoader = 'DataLoading';
            $filter.reCalculateTimeOut = 0;
            $scope.reCalculateCPI(function () {
                $scope.saveSuppliersData.survey_id = $stateParams.surveyid;
                $scope.saveSuppliersData.goal = $scope.arr.number;
                if ($scope.totalAllocations == $scope.completesNeeded) {
                    $scope.supplier = [];
                    if($scope.operatorOverrideMdl === undefined || $scope.operatorOverrideMdl === '' || $scope.operatorOverrideMdl === null){
                        $scope.operatorOverrideMdl = '';
                    }
                    
                    if ($scope.suppliers) {

                        /* If feasibility = '-' then remove it with Zero */
                        _.each($scope.suppliers,function(suppRecord){
                            if(suppRecord.feasibility === '-'){
                                suppRecord.feasibility = 0;
                            }
                        });

                        for (var i in $scope.suppliers) {
                            var item = {
                                "id": $scope.suppliers[i].id,
                                "quantity": parseInt($scope.suppliers[i].allocations.allocationValue),
                                "percentile": Math.round(parseFloat($scope.suppliers[i].allocations.actualPercentile).toFixed(2) * 100)/100 ,
                                "cpi": parseFloat($scope.suppliers[i].cpi).toFixed(2),
                                "feasibility": $scope.headerValues.completes,
                                "total": $scope.totalAllocations,
                                "min" : parseInt($scope.suppliers[i].allocations.min),
                                "max" : parseInt($scope.suppliers[i].allocations.max),
                                "flexValue" : parseInt($scope.flexibleValue),
                                "isFlexibility" : $scope.isSupplierFlexibility,
                                "suppFeas": $scope.suppliers[i].feasibility,
                                "margin": $scope.suppliers[i].margin,
                                "oldSurveyQuantity": $scope.suppliers[i].allocations.oldAllocationValue,
                                "oldCpi": parseFloat($scope.suppliers[i]['oldCpi']).toFixed(2),
                                "supplierName": $scope.suppliers[i]['name']
                            };
                            if($scope.suppliers[i].CR) {
                                item['CR'] = $scope.suppliers[i].CR
                            }
                            if($scope.suppliers[i].BCPI) {
                                item['BCPI'] = $scope.suppliers[i].BCPI
                            }
                            $scope.supplier.push(item);
                        }
                        $scope.saveSuppliersData.suppliers = $scope.supplier;
                    }

                    $scope.saveSuppliersData.cpi = $scope.headerValues.cpi;

                    if($scope.surveyPauseThreshold !== undefined && $scope.surveyPauseThreshold !==  null) {
                        $scope.saveSuppliersData.pause_threshold = ($scope.surveyPauseThreshold !== '') ? parseFloat($scope.surveyPauseThreshold).toFixed(2) : '';
                    }
                    if($scope.operatorOverrideMdl !== undefined && $scope.operatorOverrideMdl !==  null) {
                        $scope.saveSuppliersData.price_override = ($scope.operatorOverrideMdl !== '') ? parseFloat($scope.operatorOverrideMdl).toFixed(2) : '';
                    }

                    $scope.saveSuppliersData.manual_override = false;
                    $scope.saveSuppliersData.oldSurveyPauseThreshold = $scope.oldSurveyPauseThreshold;
                    if($scope.manualOperatorOverride !== undefined && $scope.manualOperatorOverride ==  true) {
                        $scope.saveSuppliersData.manual_override = true;
                    }
                    if (status == 'goToManageSurvey' || status == 'saveAndNew' || status == 'saveAndClone' || status == 'save') {
                        createSurvey.updateSurveyFromManageStep2($stateParams.surveyid, $scope.saveSuppliersData).success(function (data) {
                            if(status == 'saveAndNew' || status == 'saveAndClone' || status == 'save') {
                                if(status == 'saveAndNew') {
                                    $scope.showLoader = '';
                                    $rootScope.clone = false;
                                    notify({message: 'Survey Saved', classes: 'alert-success', duration: 3000});
                                    $state.go('dynstate', {id: 'CreateSurveys'});
                                }else if(status == 'save'){
                                    $scope.showLoader = '';
                                    notify({message: 'Survey Saved', classes: 'alert-success', duration: 3000});
                                }else {
                                    $scope.showLoader = '';
                                    notify({message: 'Survey Saved', classes: 'alert-success', duration: 3000});
                                    $rootScope.newId = $stateParams.surveyid;
                                    $rootScope.clone = true;
                                    
                                    $state.go('dynstate', {id: 'CreateSurveys', 'locale':$scope.survey_locale});  
                                }
                            }
                            else {
                                notify({message: data.msg, classes: 'alert-success', duration: 3000});
                                $state.go('editSurvey', {key: $stateParams.surveyid});
                            }

                        }).error(function (err) {
                            //$scope.loader.show = false;
                            $scope.showLoader = '';
                            $scope.supplier = [];
                            notify({message: err.msg, classes: 'alert-danger', duration: 3000});
                        });

                    } else {

                        createSurvey.updateSurveyById($scope.saveSuppliersData).success(function (data) {
                            if (status == 'moveToNext') {
                                $state.go('launchsurvey', {surveyid: $stateParams.surveyid});
                            }
                            notify({message: data.msg, classes: 'alert-success', duration: 3000});
                        }).error(function (err) {
                            //$scope.loader.show = false;
                            $scope.showLoader = '';
                            $scope.supplier = [];
                            notify({message: err.msg, classes: 'alert-danger', duration: 3000});
                        });
                    }
                } else {
                    $scope.showLoader = '';
                    notify({message: 'Allocations must be equal to Completes', classes: 'alert-danger', duration: 3000});
                }
            });
        };

        $scope.closeManage = function (key) {
            $state.go('editSurvey', {key: key});
        };

        $scope.clearFields = function() {
            $rootScope.$emit("CallMethod", {});
        };

        $scope.calculateFlexibility = function () {
            var allocationValue;
            // Case 1 when flexibility off then set min/max to allocation
            if(!$scope.isSupplierFlexibility || $scope.isSupplierFlexibility == '' || $scope.isSupplierFlexibility == undefined || $scope.isSupplierFlexibility == null) {
                _.each($scope.suppliers, function(supp){
                    supp.allocations.min = supp.allocations.allocationValue;
                    supp.allocations.max = supp.allocations.allocationValue;
                });
            // Case 2 when flexibility is 100%  
            }else if($scope.flexibleValue >= 100){
                _.each($scope.suppliers, function(supp){
                    if(supp.allocations.allocationValue > 0 && supp.allocations.allocationValue != $scope.completesNeeded){
                        supp.allocations.min = 0;
                        supp.allocations.max = $scope.completesNeeded;
                    }else if(supp.allocations.allocationValue == $scope.completesNeeded){
                        supp.allocations.min = $scope.completesNeeded;
                        supp.allocations.max = $scope.completesNeeded;
                    }else{
                        supp.allocations.min = 0;
                        supp.allocations.max = 0;
                    }  

                });
            // Normal case of flexibility                  
            }else{
                var totalMin = 0;
                //first calculate min
                _.each($scope.suppliers, function(supp){
                    allocation = supp.allocations.allocationValue;
                    allocation = (!isNaN(allocation) && allocation != undefined) ? allocation : 0;
                    
                    // If total completes are allocated to single supplier the min ansd max are equal
                    if(supp.allocations.allocationValue == $scope.completesNeeded){
                        supp.allocations.min = supp.allocations.allocationValue;
                    }else{
                        var min = allocation - (allocation * ($scope.flexibleValue / 100) );
                        min = Math.ceil((min > 0) ? min : 0);

                        totalMin = totalMin + min;
                        supp.allocations.min = min;
                    }
                });
                // Calculate max
                _.each($scope.suppliers, function(supp){
                    allocation = supp.allocations.allocationValue;
                    allocation = (!isNaN(allocation) && allocation != undefined) ? allocation : 0;

                    // If total completes are allocated to single supplier the min ansd max are equal
                    if(supp.allocations.allocationValue == $scope.completesNeeded){
                        supp.allocations.max = supp.allocations.allocationValue;
                    }else{
                        var max1 = allocation + (allocation * ($scope.flexibleValue / 100));
                        var max2 = parseInt($scope.completesNeeded) - (totalMin - supp.allocations.min);

                        var max = Math.ceil(Math.min(max1, max2));
                        supp.allocations.max = max;
                    }
                });
            }

            $scope.reCalculateCPI();
        };

        $scope.getId = function() {
            $rootScope.newId = $stateParams.surveyid;
            $rootScope.clone = true;
        }

        $scope.checkAllocationWithAchieved = function(value, id){
            if($scope.tempSupplier.length > 0){
                _.each($scope.tempSupplier, function(tmpSupp){
                    if(tmpSupp.id == id){
                        if(value < tmpSupp.fielded){
                            notify({message: 'Please select a value that is greater than '+tmpSupp.fielded, classes: 'alert-danger', duration: 2000});
                            allocationsGreaterThanAcheived = false;
                        }else{
                            allocationsGreaterThanAcheived = true;
                        }
                    }
                });
            }
        }

        /*Supplier Edit*/
        
        $scope.changeManualOverrideCB = function() {
            if($scope.manualOverrideMdl) {
                $scope.operatorOverrideMdl = '';
                $scope.disableSupCpiInput = false;
                $scope.manualOperatorOverride = true;
                $scope.isOperatorOverideEdit = true;
            }
            else {
                $scope.disableSupCpiInput = true;
                //$scope.operatorOverrideMdl = '';
                $scope.manualOperatorOverride = false;
                $scope.isOperatorOverideEdit = false;
            }
            var isFlexibilityUpdate = false;
            getBuyerCPI(isFlexibilityUpdate);
            //getFlexibilityPricesParams($scope.srvId, isFlexibilityUpdate);
        }
       

        /*function to Reset allocation*/
        $scope.resetAllocation = function() {
            if($scope.totalAllocations > 0) {
                for(var i = 0; i < $scope.suppliers.length; i++) {
                    var allocationData = {
                        allocationValue: 0,
                        oldAllocationValue: $scope.suppliers[i].allocations.allocationValue,
                        allocationPercentile: 0,
                        fielded : $scope.suppliers[i].allocations.fielded
                    };
                    $scope.suppliers[i].allocations = allocationData;
                    $scope.totalAllocations += parseInt($scope.suppliers[i].allocations.allocationValue);
                    if($scope.suppliers[i].setActive && $scope.suppliers[i].setActive == true) {
                        delete $scope.suppliers[i].setActive;
                    }
                }
                if($scope.totalAllocations < $scope.completesNeeded) {
                    $scope.totalRemaining = parseInt($scope.completesNeeded);
                }
                else {
                    $scope.totalRemaining = parseInt($scope.totalAllocations);
                }
                $scope.totalAllocations = 0;
            }
        }

        /*Function Select all on chooseSupplier dashboard PD-1596*/
        function selectAndDivideAllocation() {
            $scope.totalRemaining = 0;
            $scope.totalAllocations = 0;
            $scope.suppliersCount = 0;
            for(var i = 0; i < $scope.suppliers.length; i++) {
                if($scope.suppliers[i].isValid == true) {
                    $scope.suppliersCount ++;
                }
            }
            // Dividing Allocations
            for(var i = 0; i < $scope.suppliers.length; i++) {
                if($scope.suppliers[i].isValid == true){
                    var allocation = parseInt($scope.completesNeeded / $scope.suppliersCount);
                    var allocationPercentage = parseFloat((allocation / parseInt($scope.completesNeeded)) * 100).toFixed(2);
                    var allocationData = {
                        allocationValue: allocation,
                        oldAllocationValue: $scope.suppliers[i].allocations.allocationValue,
                        allocationPercentile: parseInt(allocationPercentage),
                        actualPercentile: allocationPercentage,
                        min : '',
                        max : '',
                        fielded : $scope.suppliers[i].allocations.fielded
                    };

                    $scope.suppliers[i].allocations = allocationData;
                    $scope.totalAllocations = parseInt($scope.totalAllocations + $scope.suppliers[i].allocations.allocationValue);
                }
                if($scope.suppliers[i].setActive && $scope.suppliers[i].setActive == true) {
                    delete $scope.suppliers[i].setActive;
                }
            }
            // For checking the first valid supplier and giving the remaining allocation to him
            for(var i=0; i < $scope.suppliers.length; i++){
                if($scope.suppliers[i].isValid == true){
                    $scope.suppliers[i].allocations.allocationValue = $scope.suppliers[i].allocations.allocationValue + ($scope.completesNeeded - $scope.totalAllocations);
                    $scope.totalAllocations = parseInt($scope.totalAllocations + ($scope.completesNeeded % $scope.suppliersCount));
                    break;
                }
            }
            $scope.calculateFlexibility();
            $scope.totalRemaining = parseInt(parseInt($scope.completesNeeded) - parseInt($scope.totalAllocations));
        }
	
        $scope.SelectAllDividingEvenly = function() {
            if($scope.completesNeeded > 0 && $scope.totalRemaining) {
                selectAndDivideAllocation();
            }
            else if($scope.completesNeeded <= 0) {
                 selectAndDivideAllocation();
            }
            else {
                notify({message: "Total Remaning are zero, Please click on Clear All button before Select All", classes: 'alert-danger', duration: 3000});
            }
        }
        
        //Function to distribute the completes among selected suppliers only 
        $scope.selectedSupplierStatus = function() {
            $scope.suppliersCount = 0;
            $scope.supplierIsSelect = false;
            for(var i = 0; i < $scope.suppliers.length; i++) {
                if($scope.suppliers[i].setActive && $scope.suppliers[i].isValid == true && $scope.suppliers[i].setActive == true) {
                    $scope.suppliersCount ++;
                    $scope.supplierIsSelect = true;
                }
            }
            if($scope.supplierIsSelect) {
                $scope.totalRemaining = 0;
                $scope.totalAllocations = 0;
                //$scope.loader.show = true;//PD-955
                // Dividing Allocations
                for(var i = 0; i < $scope.suppliers.length; i++) {
                    if($scope.suppliers[i].setActive && $scope.suppliers[i].isValid == true && $scope.suppliers[i].setActive == true){
                        var allocation = parseInt($scope.completesNeeded / $scope.suppliersCount);
                        var allocationPercentage = parseFloat((allocation / parseInt($scope.completesNeeded)) * 100).toFixed(2);
                        var allocationData = {
                            allocationValue: allocation,
                            oldAllocationValue: $scope.suppliers[i].allocations.allocationValue,
                            allocationPercentile: parseInt(allocationPercentage),
                            actualPercentile: allocationPercentage,
                            min : '',
                            max : '',
                            fielded : $scope.suppliers[i].allocations.fielded
                        };

                        $scope.suppliers[i].allocations = allocationData;
                        $scope.totalAllocations = parseInt($scope.totalAllocations + $scope.suppliers[i].allocations.allocationValue);
                    }
                    else {
                        var allocationData = {
                            allocationValue: 0,
                            oldAllocationValue: $scope.suppliers[i].allocations.allocationValue,
                            allocationPercentile: 0,
                            actualPercentile: 0,
                            fielded : $scope.suppliers[i].allocations.fielded
                        };
                        $scope.suppliers[i].allocations = allocationData;
                        $scope.totalAllocations += parseInt($scope.suppliers[i].allocations.allocationValue);
                    }

                }
                // For checking the first valid supplier and giving the remaining allocation to him
                for(var i=0; i < $scope.suppliers.length; i++){
                    if($scope.suppliers[i].setActive && $scope.suppliers[i].isValid == true && $scope.suppliers[i].setActive == true){
                        $scope.suppliers[i].allocations.allocationValue = $scope.suppliers[i].allocations.allocationValue + ($scope.completesNeeded - $scope.totalAllocations);
                        $scope.totalAllocations = parseInt($scope.totalAllocations + ($scope.completesNeeded % $scope.suppliersCount));
                        break;
                    }
                }
                for(var i=0; i < $scope.suppliers.length; i++){
                    if($scope.suppliers[i].setActive && $scope.suppliers[i].setActive == true) {
                        delete $scope.suppliers[i].setActive;
                    }
                }   
                
                $scope.calculateFlexibility();
                $scope.reCalculateCPI();
                $scope.totalRemaining = parseInt(parseInt($scope.completesNeeded) - parseInt($scope.totalAllocations));
                //$scope.loader.show = false; //PD-955
            }
            else {
                notify({message: "Please select suppliers to allocate Quantity and percentage", classes: 'alert-danger', duration: 3000});
            }
        }

        //Avoid to select row on click lock/unlock
        $scope.avoidClick = function( e ) { 
           e.stopPropagation();
        }

    }]);
