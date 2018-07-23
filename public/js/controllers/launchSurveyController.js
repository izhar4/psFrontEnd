/**
*choose supplier controller
*/
angular.module('pureSpectrumApp')
    .controller('launchSurveyCtrl',['$scope','$http','$state', '$stateParams', '$cookies','$window','config','commonApi','createSurvey','companyService','notify','user','localStorageService','ngProgressLite', '$filter','$rootScope','buyerSettingService', '$timeout', '$q', 'encodeDecodeFactory', 'Upload', function($scope, $http, $state, $stateParams, $cookies, $window, config, commonApi, createSurvey, companyService, notify, user, localStorageService, ngProgressLite, $filter, $rootScope, buyerSettingService, $timeout, $q, encodeDecodeFactory, Upload){

        var userData = localStorageService.get('logedInUser');
        $scope.loader = {show: false}; //PD-955
        /*--- Show Loader on every http request----*/
        $rootScope.$on('loading:progress', function (){
            $scope.loader.show = true;//PD-955
        });

        $rootScope.$on('loading:finish', function (){
            $scope.loader.show = false;//PD-955
        });
        /*--- Show Loader on every http request----*/
        getSurveyData();
        $scope.srvId = $stateParams.surveyid;
        $scope.finalSurvey = {};
        $scope.oldLaunchVal = '';
        
        // Manage Edit
        $scope.manageEdit = false;
        if($stateParams.edit == 'editStep3'){
            $scope.manageEdit = true;
        }
        $scope.headerValues = {
            completes: 0,
            cpi: 0,
            total: 0,
            field_time:0
        };
        $scope.surveyData = [];
        $scope.finalSurvey.survey_grouping = [];
        $scope.categoryExclusion = "";
        $scope.maxprogressSt = {
            maxprogress_st: false,
            maxinProgressNo: 0
        }

        $scope.launchquantity = 0;
        $scope.launchpercentile = 0;

        $scope.currency_symbol = '$';
        $scope.currencyFx = {fx: 321,symbol: '$'};

        $scope.pdfurl = "/files/BuyerRedirectGuideV2.pdf";
        $scope.field_time = 0;

        $scope.categoryExc = [];
        $scope.catEx = {};
        $scope.surveyExclusion = false;
        //PD-1236
        $scope.disableAutoMapping = {
            IsURLTransform: false,
            visibleTransfrmUrl: false,
            visibleBuyerClient : false,
            visibleMaxInProgress : false
        }; 

        var psidDataArr = new Array();//Include/Exclude PSID Array
        var suppliers = new Array();   // To check length before launch
        //PD-1096
        if(config.app == "pureSpectrumApp-Prod" && _.contains(config.enableUrlTranfrmUsr, userData.cmp)) {
            $scope.disableAutoMapping.visibleTransfrmUrl = true;
        }

        if(config.app == "pureSpectrumApp-Prod" && _.contains(config.buyerClient, userData.cmp)) {
            $scope.disableAutoMapping.visibleBuyerClient = true;
        }

        if(config.app == "pureSpectrumApp-Dev" || config.app == "pureSpectrumApp-Staging") {
            $scope.disableAutoMapping.visibleTransfrmUrl = true;
            $scope.disableAutoMapping.visibleBuyerClient = true;
        }

        //PD-1360
        if((config.app == "pureSpectrumApp-Prod" || config.app == "pureSpectrumApp-Staging") && _.contains(config.maxinProgress, userData.cmp)) {
            $scope.disableAutoMapping.visibleMaxInProgress = true;
        }

        if(config.app == "pureSpectrumApp-Dev") {
            $scope.disableAutoMapping.visibleMaxInProgress = true;
        }
        
        //PD-260
        $scope.buyerSettings = {};
        getBuyerInfo(userData.cmp);

        //Regular expression for match transaction in Live&Test URL
        var regexAmprsnd = new RegExp("\\&transaction_id", "g");
        var regexQustionMrk = new RegExp("\\?transaction_id", "g");

        $scope.enableInclExcl = false;

        if (_.contains(config.incl_excl, userData.cmp) || userData.operatorAcssLvls == 'admin' || config.incl_excl.length == 0) {
            $scope.enableInclExcl = true;
        }

        $scope.$watch('finalSurvey.liveUrl', function (newValue, oldValue, scope) {
            $scope.warningFlg = false;
            //Do anything with $scope.finalSurvey.liveUrl
            if(typeof newValue === 'undefined' || newValue === '' || newValue === 'null') {
                $scope.finalSurvey.liveUrlTT = 'Please enter your Survey URL to check its final form.';
            } else {
                var operationalBuyerUrl = getOperationalBuyerUrl(newValue, $scope.buyerSettings, 0);
                $scope.finalSurvey.liveUrlTT = 'Your URL settings transform the Entry URL into: \n\n '+operationalBuyerUrl;
            }
            if($scope.finalSurvey.liveUrl != undefined && $scope.finalSurvey.liveUrl != null && $scope.finalSurvey.liveUrl != ''){

                if($scope.finalSurvey.liveUrl.search(regexAmprsnd) != -1) {
                    $scope.warningFlg = true;
                    $scope.splitUrl = $scope.finalSurvey.liveUrl.split("transaction_id=");
                    if($scope.splitUrl[1]) {
                        $scope.trans_id = "&transaction_id=" +$scope.splitUrl[1];
                    }
                    else {
                        $scope.trans_id = "&transaction_id=";
                    }
                }
                else {
                    if($scope.finalSurvey.liveUrl.search(regexQustionMrk) != -1) {
                        $scope.warningFlg = true;
                        $scope.splitUrl = $scope.finalSurvey.liveUrl.split("transaction_id=");
                        if($scope.splitUrl[1]) {
                            $scope.trans_id = "&transaction_id=" +$scope.splitUrl[1];
                        }
                        else {
                            $scope.trans_id = "&transaction_id=";
                        }
                    }
                }
                $scope.finalSurvey.liveWarningMsg = "We think there's an issue with your URL. Please remove the portion that reads " + '"'+ $scope.trans_id + '"' + "\n\n.\n\nIf you are certain that your link is okay as is, please continue.";
                
                $scope.liveUrlCheck = $scope.finalSurvey.liveUrl.endsWith('=') || $scope.finalSurvey.liveUrl.indexOf(''+$scope.checkWithUserUrl+'') !== -1;
            }
        });

        $scope.$watch('finalSurvey.testUrl', function (newValue, oldValue, scope) {
            $scope.warningTestFlg = false;
            //Do anything with $scope.finalSurvey.testUrl
            if(typeof newValue === 'undefined' || newValue === '' || newValue === 'null') {
                $scope.finalSurvey.testUrlTT = 'Your TEST URL is empty, we will use your LIVE URL as the TEST URL. Please add a TEST URL if it is different than the LIVE URL.';
            } else {
                var operationalBuyerUrl = getOperationalBuyerUrl(newValue, $scope.buyerSettings , 1);
                $scope.finalSurvey.testUrlTT = 'Your URL settings transform the Entry URL into: \n\n '+operationalBuyerUrl;
            }
            if($scope.finalSurvey.testUrl != undefined && $scope.finalSurvey.testUrl != null && $scope.finalSurvey.testUrl != ''){

                if($scope.finalSurvey.testUrl.search(regexAmprsnd) != -1) {
                    $scope.warningTestFlg = true;
                    $scope.splitUrl = $scope.finalSurvey.testUrl.split("transaction_id=");
                    if($scope.splitUrl[1]) {
                        $scope.trans_id = "&transaction_id=" +$scope.splitUrl[1];
                    }
                    else {
                        $scope.trans_id = "&transaction_id=";
                    }
                }
                else {
                    if($scope.finalSurvey.testUrl.search(regexQustionMrk) != -1) {
                        $scope.warningTestFlg = true;
                        $scope.splitUrl = $scope.finalSurvey.testUrl.split("transaction_id=");
                        if($scope.splitUrl[1]) {
                            $scope.trans_id = "&transaction_id=" +$scope.splitUrl[1];
                        }
                        else {
                            $scope.trans_id = "&transaction_id=";
                        }
                    }
                }

                $scope.finalSurvey.testWarningMsg = "We think there's an issue with your URL. Please remove the portion that reads " + '"'+ $scope.trans_id + '"' + "\n\n.\n\nIf you are certain that your link is okay as is, please continue.";
                $scope.testUrlCheck = $scope.finalSurvey.testUrl.endsWith('=') || $scope.finalSurvey.testUrl.indexOf(''+$scope.checkWithUserUrl+'') !== -1;
            }
        });


        var getOperationalBuyerUrl = function(url, buyerSettings, isTest) {

            if(typeof $scope.buyerSettings.ps_transaction !== 'undefined' && $scope.buyerSettings.ps_transaction !== ''){
                url = getQueryStringUrl(url);
                url += $scope.buyerSettings.ps_transaction+' = [%ps_transaction_id%]';
            } else {
                url = getQueryStringUrl(url);
                url += 'transaction_id = [%ps_transaction_id%]';
            }

            if(typeof $scope.buyerSettings.ps_psid !== 'undefined' && $scope.buyerSettings.ps_psid !== ''){
                url = getQueryStringUrl(url);
                url += $scope.buyerSettings.ps_psid+' = [%psid%]';
            }

            if(typeof $scope.buyerSettings.ps_status !== 'undefined' && $scope.buyerSettings.ps_status !== ''){
                url = getQueryStringUrl(url);
                url += $scope.buyerSettings.ps_status+' = [%st%]';
            }

            if(typeof $scope.buyerSettings.ps_hash !== 'undefined' && $scope.buyerSettings.ps_hash !== ''){
                url = getQueryStringUrl(url);
                url += $scope.buyerSettings.ps_hash+' = [%ps_hash%]';
            }

            // code is commented for now will use it letter

            if(typeof $scope.buyerSettings.ps_transaction_id2 !== 'undefined' && $scope.buyerSettings.ps_transaction_id2 !== ''){
                url = getQueryStringUrl(url);
                url += $scope.buyerSettings.ps_transaction_id2+' = [%ps_transaction_id%]';
            }

            if(typeof $scope.buyerSettings.ps_transaction_id3 !== 'undefined' && $scope.buyerSettings.ps_transaction_id3 !== ''){
                url = getQueryStringUrl(url);
                url += $scope.buyerSettings.ps_transaction_id3+' = [%ps_transaction_id%]';
            }
            if(typeof $scope.buyerSettings.ps_transaction_id4 !== 'undefined' && $scope.buyerSettings.ps_transaction_id4 !== ''){
                url = getQueryStringUrl(url);
                url += $scope.buyerSettings.ps_transaction_id4+' = [%ps_transaction_id%]';
            }

            // added supplier_id to buyer url

            if(typeof $scope.buyerSettings.ps_supplier_id !== 'undefined' && $scope.buyerSettings.ps_supplier_id !== ''){
                url = getQueryStringUrl(url);
                url += $scope.buyerSettings.ps_supplier_id+' = [%ps_supplier_id%]';
            }

            /*if(isTest) {
                url = getQueryStringUrl(url);
                url += 'ps_test = 1';
            }*/
            return url;

        }

        var getQueryStringUrl = function(url){
            if(url != '' && url != undefined && url != null){
                if (url.search(/^http[s]?\:\//) == -1) {
                    url = 'http://' + url;
                }
                var re = /[?]/;
                var result = url.match(re);
                if(result && result[0] == '?'){
                    var lastChar = url.charAt(url.length - 1);
                    if(lastChar=='?'){
                        url =  url;
                    }
                    if(lastChar!='&'){
                        url =  url + '&';
                    }
                    else{
                        url =  url ;
                    }
                   return url;
                }
                else{
                    url = url+'?';
                    return url;
                }
            }
        }


        function getBuyerInfo(id){
            //$scope.loader.show = true; //PD-955
            buyerSettingService.getSetting(id).success(function (data) {
                if(data.apiStatus){
                    if(data.buyer.variable_mapping){
                        for(var i = 0; i < data.buyer.variable_mapping.length; i++) {
                            for(var j in data.buyer.variable_mapping[i]) {
                                if(j == "ps_transaction") {
                                    $scope.buyerSettings.ps_transaction = data.buyer.variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_psid") {
                                    $scope.buyerSettings.ps_psid = data.buyer.variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_status") {
                                    $scope.buyerSettings.ps_status = data.buyer.variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_hash") {
                                    $scope.buyerSettings.ps_hash = data.buyer.variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_transaction_id2") {
                                    $scope.buyerSettings.ps_transaction_id2 = data.buyer.variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_transaction_id3") {
                                    $scope.buyerSettings.ps_transaction_id3 = data.buyer.variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_transaction_id4") {
                                    $scope.buyerSettings.ps_transaction_id4 = data.buyer.variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_supplier_id") {
                                    $scope.buyerSettings.ps_supplier_id = data.buyer.variable_mapping[i][j].outgoing;
                                }
                            
                            }
                        }
                    }

                    $scope.checkWithUserUrl = $scope.buyerSettings.ps_transaction+'=';
                    
                    if($scope.finalSurvey.liveUrl !== undefined && $scope.finalSurvey.liveUrl !== null && $scope.finalSurvey.liveUrl !== "") {
                        var operationalBuyerUrl = getOperationalBuyerUrl($scope.finalSurvey.liveUrl, $scope.buyerSettings, 0);
                        $scope.finalSurvey.liveUrlTT = 'Your URL settings transform the Entry URL into: \n\n '+operationalBuyerUrl;
                    } else {
                        $scope.finalSurvey.liveUrlTT = 'Please enter your Survey URL to check its final form.';
                    }

                    if($scope.finalSurvey.testUrl !== undefined && $scope.finalSurvey.testUrl !== null && $scope.finalSurvey.testUrl !== "") {
                        var operationalBuyerUrl = getOperationalBuyerUrl($scope.finalSurvey.testUrl, $scope.buyerSettings, 1);
                        $scope.finalSurvey.testUrlTT = 'Your URL settings transform the Entry URL into: \n\n '+operationalBuyerUrl;
                    } else {
                        $scope.finalSurvey.testUrlTT = 'Your TEST URL is empty, we will use your LIVE URL as the TEST URL. Please add a TEST URL if it is different than the LIVE URL.';
                    }
                    //$scope.loader.show = false;//PD-955

                }
            }).error(function (err) {
                //$scope.loader.show = false;//PD-955
                notify({message:err.msg,classes:'alert-danger',duration:2000} );
            })
        }

        //PD-260 End

        //PD-1253
        $scope.checkBilling = function() {
            $scope.finalSurvey.survey_po = "";
        }
        // end PD-1253

        //get survey data
        function getSurveyData() {
            //$scope.loader.show = true;//PD-955
            var id = $rootScope.clone && $rootScope.newId != undefined && $rootScope.newId != null && $rootScope.newId != "" ? $rootScope.newId : $stateParams.surveyid;
            createSurvey.getSurveyById(id).success(function (data){
                //Remove Old CPI for Live Clone
                if($rootScope.clone && $scope.checkLive_pus_Clone) {
                    data.survey[0].cpi = $scope.liveCloneCPI;
                }
                $scope.survey_locale = encodeDecodeFactory.encode(data.survey[0].locale); // set for footer updatesurvey fn 
                $scope.headerValues.completes = data.survey[0].number;
                $scope.headerValues.cpi = data.survey[0].cpi;
                $scope.headerValues.field_time = data.survey[0].field_time;
                $scope.clickBalance = data.survey[0].clickBalance;
                $scope.estmClicks = data.survey[0].estmClicks;

                if(data.survey[0].currencyFx && data.survey[0].currencyFx.symbol) {
                    $scope.currency_symbol = data.survey[0].currencyFx.symbol;
                    $scope.currencyFx = data.survey[0].currencyFx;
                }
                
                $scope.surveyData = data.survey;
                calculateTotalCost();
                getSampleTitle();
                //$scope.field_time = data.survey[0].field_time;
                $scope.fldOverTime = data.survey[0].fldOverTime;
                $scope.launchquantity = data.survey[0].launchQuantity;
                $scope.launchpercentile = data.survey[0].launchPercentile;
                $scope.softlaunchno = data.survey[0].softLaunch;
                $scope.finalSurvey.softLaunchOldVal = data.survey[0].softLaunch;
                $scope.finalSurvey.oldLaunchQuantity = data.survey[0].launchQuantity;
                $scope.maxprogressSt.maxprogress_st = data.survey[0].maxInPrgs; //PD-952
                $scope.finalSurvey.oldMaxProgressVal = data.survey[0].maxInPrgs;
                $scope.maxprogressSt.maxinProgressNo = data.survey[0].maxInPrgsNo; //PD-952
                $scope.finalSurvey.oldMaxProgressQuantity = data.survey[0].maxInPrgsNo;
                $scope.finalSurvey.liveUrl = data.survey[0].liveUrl;
                $scope.finalSurvey.testUrl = data.survey[0].testUrl;
                $scope.finalSurvey.oldLiveUrl = data.survey[0].liveUrl;
                $scope.finalSurvey.oldTestUrl = data.survey[0].testUrl;
                $scope.finalSurvey.buyerMsg = data.survey[0].buyerMsg; //pd-782
                $scope.finalSurvey.oldBuyerMsg = data.survey[0].buyerMsg;
                $scope.finalSurvey.teamMember = data.survey[0].teamMember;
                $scope.finalSurvey.incl_excl = data.survey[0].incl_excl;
                $scope.finalSurvey.hasPSIDRefList = data.survey[0].hasPSIDRefList || false;
                if($rootScope.clone && $scope.checkLive_pus_Clone) {
                    $scope.finalSurvey.hasPSIDRefList = false;
                }
                // to check length before launch
                suppliers = data.survey[0].supplier;
                //PD-1236
                if(_.has(data.survey[0], "IsURLTransform") ) {
                    $scope.disableAutoMapping.IsURLTransform = data.survey[0].IsURLTransform;
                }
                $scope.finalSurvey.survey_grouping = data.survey[0].survey_grouping;
                $scope.finalSurvey.oldSurveyGrouping = data.survey[0].survey_grouping;

                //PD-1253
                if($rootScope.clone && $scope.checkLive_pus_Clone) {
                    $scope.openModel = angular.element('#billingModal');
                    $scope.openModel.modal({
                        backdrop: 'static',
                        keyboard: false 
                    });
                    $scope.finalSurvey.survey_po = (data.survey[0].survey_po != undefined && data.survey[0].survey_po != null && data.survey[0].survey_po != "") ? data.survey[0].survey_po : "PS" + id;     
                    $scope.finalSurvey.oldSurvey_po = (data.survey[0].survey_po != undefined && data.survey[0].survey_po != null && data.survey[0].survey_po != "") ? data.survey[0].survey_po : "PS" + id;     

                }
                else {
                    $scope.finalSurvey.survey_po = (data.survey[0].survey_po != undefined && data.survey[0].survey_po != null && data.survey[0].survey_po != "") ? data.survey[0].survey_po : "";
                    $scope.finalSurvey.oldSurvey_po = (data.survey[0].survey_po != undefined && data.survey[0].survey_po != null && data.survey[0].survey_po != "") ? data.survey[0].survey_po : "";
                }

                //PD-1468
                /*$scope.finalSurvey.survey_external_id = (data.survey[0].survey_external_id != undefined && data.survey[0].survey_external_id != null && data.survey[0].survey_external_id != "") ? data.survey[0].survey_external_id : "";*/
                generateEntryLink(data.survey[0].liveUrl , data.survey[0].field_time);
                $scope.finalSurvey.surveyStatus = data.survey[0].status;
		        $scope.finalSurvey.surveyClient = data.survey[0].surveyClient;//pd-822
                $scope.finalSurvey.oldSurveyClient = data.survey[0].surveyClient;

                $scope.survey_locale = encodeDecodeFactory.encode(data.survey[0].locale);

                if(data.survey[0].catExcl.length>0){
                    for(var i in data.survey[0].catExcl){
                         if(data.survey[0].catExcl[i].id == 1){
                             $scope.completed = true;
                            $scope.catEx.Completed = data.survey[0].catExcl[i].time;
                         }
                        if(data.survey[0].catExcl[i].id == 2){
                            $scope.started = true;
                            $scope.catEx.Started = data.survey[0].catExcl[i].time;
                        }
                        if(data.survey[0].catExcl[i].id == 3){
                            $scope.Quota_Full = true;
                            $scope.catEx.QuotaFull = data.survey[0].catExcl[i].time;
                        }
                    }
                }
                //$scope.loader.show = false;//PD-955

                //getSurveyHeaderPricingValue(data.survey[0].language, data.survey[0].country, data.survey[0].lengthOfSurvey, data.survey[0].incidence);
            }).error( function (err){
                //$scope.loader.show = false;//PD-955
                notify({message:err.msg,classes:'alert-danger',duration:2000} );
            })
        }

        function getSurveyHeaderPricingValue(lang,ctry,LOI,incd){
            createSurvey.getSurveyHeaderValue(lang,ctry,LOI,incd, $stateParams.surveyid).success(function (data) {
                if(data.CPI){
                    var tmpCpi = parseFloat(data.CPI).toFixed(2);
                    $scope.headerValues.cpi = (tmpCpi*100)/100;
                    if($scope.headerValues.completes && $scope.headerValues.cpi){
                        calculateTotalCost();
                    }
                    else{
                        $scope.total=0;
                    }
                }
            }).error(function (err) {
                notify({message:err.msg,classes:'alert-danger',duration:2000} );
            })
        }

        function calculateTotalCost(){
            var tol = ($scope.headerValues.completes*$scope.headerValues.cpi);
            $scope.headerValues.total = parseFloat(tol).toFixed(2);
        }

        function getSampleTitle(){
            ngProgressLite.start();
            commonApi.samples().success(function(data){
                ngProgressLite.done();
                if(data.sample!=null) {
                    $scope.samples = data.sample.values;
                    getCategoryEx(data.sample.values);
                }
            }).error(function(err){
                notify({message:err.msg,classes:'alert-danger',duration:2000} );
            })
        }

        function getCategoryEx(data) {
            for(var i=0; i<data.length; i++) {
                if(data[i].id == $scope.surveyData[0].samplesType) {
                    $scope.categoryExclusion = data[i].name;
                }
            }
        }

        $scope.launchquantityChange = function(){
            $scope.launchpercentile = Math.round(($scope.launchquantity * 100) / $scope.headerValues.completes);
            //$scope.launchpercentiles = $filter('number')($scope.launchpercentile, 2);
        }

        $scope.launchpercentileChange = function(){
            $scope.launchquantity = Math.round(($scope.launchpercentile * $scope.headerValues.completes) / 100);
            //$scope.launchquantity = $filter('number')($scope.launchquantity, 2);
        }
     

        $scope.catExStartedTime = function (value) {
           $scope.catExStarted = value;
            if(value){
                $scope.catEx[0].time = value;
            }
        }

        $scope.getCatExcComplete = function (value,id) {
            if(value == true){
                $scope.categoryExc.push({"id":id,"time":"7 days"});
            }

            if(value == false){
                for(var i in $scope.categoryExc){
                    if($scope.categoryExc[i].id == id){
                        $scope.categoryExc.splice(i,1);
                    }
                }
            }
        }

        $scope.getCatExcStarted = function (value,id) {
            if(value == true){
                $scope.categoryExc.push({"id":id,"time":"30 days"});
            }

            if(value == false){
                for(var i in $scope.categoryExc){
                    if($scope.categoryExc[i].id == id){
                        $scope.categoryExc.splice(i,1);
                    }
                }
            }
        }

        $scope.getCatExcQuota = function (value,id) {
            if(value == true){
                $scope.categoryExc.push({"id":id,"time" : "90 days"});
            }

            if(value == false){
                for(var i in $scope.categoryExc){
                    if($scope.categoryExc[i].id == id){
                        $scope.categoryExc.splice(i,1);
                    }
                }
            }
        }

        $scope.catExCompletedTime = function (value,id){
            if(value){
                $scope.catEx.Completed = value;
                for(var i in $scope.categoryExc){
                    if($scope.categoryExc[i].id == id){
                        $scope.categoryExc[i].time = value;
                    }
                }
            }
        }

        $scope.catExStartedTime = function (value,id){
            if(value){
                $scope.catEx.Started = value;
                for(var i in $scope.categoryExc){
                    if($scope.categoryExc[i].id == id){
                        $scope.categoryExc[i].time = value;
                    }
                }
            }
        }

        $scope.catExQuotaTime = function (value,id){
            if(value){
                $scope.catEx.QuotaFull = value;
                for(var i in $scope.categoryExc){
                    if($scope.categoryExc[i].id == id){
                        $scope.categoryExc[i].time = value;
                    }
                }
            }
        }

        $scope.showLoader = ''; // Variable for Disabling Next Page Button Until Api Calls Finishes
        $scope.saveSurvey = function (status, test) {
            $scope.showLoader = 'DataLoading';
            if($scope.surveyExclusion){
               notify({message:"Not a valid number in survey_grouping",classes:'alert-danger',duration:2000} );
               $scope.showLoader = '';
                return false;
            }
            
      
            $scope.finalSurvey.survey_id = $stateParams.surveyid;
            $scope.finalSurvey.catExcl = $scope.categoryExc;
            $scope.finalSurvey.softLaunch = $scope.softlaunchno || false;
            $scope.finalSurvey.maxInPrgs = $scope.maxprogressSt.maxprogress_st || false; //PD-952
            $scope.finalSurvey.maxInPrgsNo = $scope.maxprogressSt.maxinProgressNo; //PD-952
            $scope.finalSurvey.IsURLTransform = $scope.disableAutoMapping.IsURLTransform; //PD-1236

            if(parseInt($scope.launchpercentile) > 100 || $scope.launchquantity > $scope.surveyData[0].number) {
                notify({message:"Soft launch cannot exceed total completes. Please check Soft Launch and try again.",classes:'alert-danger',duration:2000} );
                $scope.showLoader = '';
                return false;
            }
            $scope.finalSurvey.launchPercentile = $scope.launchpercentile;
            $scope.finalSurvey.launchQuantity = $scope.launchquantity;
            //$scope.finalSurvey.field_time = $scope.field_time || 0;
            $scope.finalSurvey.fldOverTime = $scope.fldOverTime || false;
            $scope.finalSurvey.cpi = $scope.headerValues.cpi;

            //$scope.finalSurvey.psid_ref_file = $scope.psidRefFile;
            //PD-1277
            if(!$scope.finalSurvey.survey_po){
                $scope.finalSurvey.survey_po = "PS" + $stateParams.surveyid;
            }

            //PD-1378
           if(_.has($scope.finalSurvey, "isTest")) {
              delete $scope.finalSurvey.isTest;
           }
             
            if(status === 'final'){
                //var time = new Date();
                // check suppliers before launch
                if(suppliers == undefined || suppliers == null || suppliers == ''){
                    console.log('no suppliers');
                    notify({message:'Please add suppliers before launch', classes:'alert-danger',duration:2000} );
                    return false;
                }
                if(status === 'save' && $scope.finalSurvey.surveyStatus != undefined && $scope.finalSurvey.surveyStatus != null && $scope.finalSurvey.surveyStatus != "" && $scope.finalSurvey.surveyStatus != 22) {
                    $scope.finalSurvey.st = 11;
                }
                else{
                    $scope.finalSurvey.st = 22;
                }
                //$scope.finalSurvey.End_Date = time.setDate(time.getDate()+ parseInt($scope.field_time));
                createSurvey.updateSurveyLaunch($scope.finalSurvey).success(function (data) {
                    $rootScope.clone = false;
                    $scope.showLoader = '';
                    notify({message:data.msg,classes:'alert-success',duration:2000} );
                    if(status === 'final' && $scope.finalSurvey.surveyStatus != undefined && $scope.finalSurvey.surveyStatus != null && $scope.finalSurvey.surveyStatus != "" && $scope.finalSurvey.surveyStatus != 22){
                        $state.go('home');
                    }
                    /*PD-709*/
                    if(status === 'final' && ($scope.finalSurvey.surveyStatus == 22 || $scope.finalSurvey.surveyStatus == 33 || $scope.finalSurvey.surveyStatus == 34)) {
                        $state.go('home');
                    }
                    

                }).error(function (err) {
                    $scope.showLoader = '';
                    notify({message:err.msg,classes:'alert-danger',duration:2000} );
                })
            }
            
            //PD-1325 implemented "saveOnClose"
            if(status == 'goToManageSurvey' || status === 'saveAndNew' || status === 'saveAndClone' || status === 'save' || status === 'saveOnClose' || status === 'switchBreadcrumbMenu'){
                //var time = new Date();
               // $scope.finalSurvey.End_Date = time.setDate(time.getDate()+ parseInt($scope.field_time)); // this is added to fix the field time issue
                if(status === 'saveOnClose' || status === 'switchBreadcrumbMenu') {
                  $scope.finalSurvey.st = 11;
                  if(!$scope.finalSurvey.liveUrl) {
                    if(status === 'saveOnClose') {
                        $state.go('home');
                    }
                    return;
                  }
                }

                createSurvey.updateSurveyFromManageStep3($stateParams.surveyid, $scope.finalSurvey).success(function(data) {
                    //console.log(data);
                    $scope.showLoader = '';
                    ngProgressLite.done();
                    if(status === 'saveAndNew' || status === 'saveAndClone' || status === 'save' || status === 'saveOnClose' || status === 'switchBreadcrumbMenu'){
                        if(status === 'save') {
                            notify({message:'Survey Saved',classes:'alert-success',duration:2000} );
                            $rootScope.clone = false;
                            $rootScope.newId = "";
                            //$state.go('dynstate', {id: 'CreateSurveys'}); 
                        }else if(status === 'saveAndNew') {
                            notify({message:'Survey Saved',classes:'alert-success',duration:2000} );
                            $rootScope.clone = false;
                            $rootScope.newId = "";
                            $state.go('dynstate', {id: 'CreateSurveys'}); 
                        } else if(status === 'saveAndClone') {
                            notify({message:'Survey Saved',classes:'alert-success',duration:2000} );
                            $rootScope.newId = $stateParams.surveyid;
                            $rootScope.clone = true;
                            $state.go('dynstate', {id: 'CreateSurveys', 'locale':$scope.survey_locale});
                        }
                        else {
                            if(status === 'saveOnClose') {
                                $state.go('home');
                            }
                        } 
                    }
                    else{
                       notify({message:data.msg,classes:'alert-success',duration:2000} );
                       $state.go('editSurvey', {key: $stateParams.surveyid});
                   }
                }).error(function (err) {
                    $scope.showLoader = '';
                    notify({message:err.msg,classes:'alert-danger',duration:2000} );
                })
            }
        }


        

        function generateEntryLink(liveUrl , field_time){
            var link = '';
            var testLink ='';
            if(liveUrl && field_time){
                link = config.pureSpecturm.url+'/startsurvey-'+$scope.surveyData[0].locale.countryCode.toLowerCase()+'?survey_id='+ $stateParams.surveyid + '&supplier_id=?';
                testLink = config.pureSpecturm.url+'/startsurvey?survey_id='+ $stateParams.surveyid + '&ps_redirect_test=1&bsec='+config.BSEC+'&supplier_id=';
                if(config.app == "pureSpectrumApp-Staging"){
                   testLink = testLink + 26;
                }else{
                    testLink = testLink + 23;
                }

                $scope.entryLink = link;
                $scope.testEntryLink = testLink;

            }
            else{
                $scope.entryLink = link;
                $scope.testEntryLink = testLink;
            }

        }

        $scope.getLiveUrl = function (url) {
           generateEntryLink(url , $scope.field_time);
        }

        $scope.getFieldTime = function (ftime) {
           generateEntryLink($scope.finalSurvey.liveUrl, ftime);
        }

        $scope.saveSurveyOnTestLink = function(status, test) {
            var deferred = $q.defer();
            if($scope.surveyExclusion){
                deferred.reject("Not a valid number in survey_grouping");
            }
            $scope.finalSurvey.survey_id = $stateParams.surveyid;
            $scope.finalSurvey.catExcl = $scope.categoryExc;
            $scope.finalSurvey.softLaunch = $scope.softlaunchno || false;
            $scope.finalSurvey.softLaunchOldVal = $scope.softLaunchOldVal;
            $scope.finalSurvey.oldLiveUrl = $scope.oldLiveUrl;
            $scope.finalSurvey.oldTestUrl = $scope.oldTestUrl;
            $scope.finalSurvey.oldSurveyGrouping = $scope.oldSurveyGrouping;
            $scope.finalSurvey.maxInPrgs = $scope.maxprogressSt.maxprogress_st || false; //PD-952
            $scope.finalSurvey.maxInPrgsNo = $scope.maxprogressSt.maxinProgressNo; //PD-952

            if(parseInt($scope.launchpercentile) > 100 || $scope.launchquantity > $scope.surveyData[0].number) {
                deferred.reject("Soft launch cannot exceed total completes. Please check Soft Launch and try again.");
            }
            $scope.finalSurvey.launchPercentile = $scope.launchpercentile;
            $scope.finalSurvey.launchQuantity = $scope.launchquantity;
            //$scope.finalSurvey.field_time = $scope.field_time || 0;
            $scope.finalSurvey.fldOverTime = $scope.fldOverTime || false;
            $scope.finalSurvey.cpi = $scope.headerValues.cpi;
            //PD-1378
            $scope.finalSurvey.isTest = test;
            
            createSurvey.updateSurveyFromManageStep3($stateParams.surveyid, $scope.finalSurvey).success(function(data) {
                $rootScope.clone = false;
                $rootScope.newId = "";
                deferred.resolve('Survey Saved');
            }).error(function (err) {
                deferred.reject(err.msg);
            })
            // promise is returned
            return deferred.promise;
        }

        $scope.openTab = function (url) {
            ngProgressLite.start();
            $scope.showLoader = 'DataLoading';
            if(url !=''){
                $scope.saveSurveyOnTestLink('save' , 'test').then(function(data) {
                    console.log("saveSurveyOnTestLink success "+JSON.stringify(data));
                    $scope.showLoader = '';
                    ngProgressLite.done();
                    $window.open(url, '_blank');
                    notify({message:'Survey Saved',classes:'alert-success',duration:2000} );
                    //$state.go('dynstate', {id: 'CreateSurveys'}); 
                }).catch(function (err) {
                    console.log("saveSurveyOnTestLink err "+JSON.stringify(err));
                    $scope.showLoader = '';
                    ngProgressLite.done();
                    notify({message:err,classes:'alert-danger',duration:2000} );
                })
            } else {
                $scope.showLoader = '';
                ngProgressLite.done();
                notify({message:'URL not exist',classes:'alert-danger',duration:2000} );
            }
        }

        $scope.closeManage = function(key){
            $state.go('editSurvey', {key: key});
        }
        $scope.clearFields = function() {
            $rootScope.$emit("CallMethod", {});
        }
        $scope.getId = function() {
            $rootScope.newId = $stateParams.surveyid;
            $rootScope.clone = true;
        }

        $scope.validateNumber = function(elm){ 
            if((elm.which >= 65 && elm.which <= 90) || (elm.shiftKey && elm.which >= 48 && elm.which <= 57)){
                //console.log("this is not a valid numbers");
               $scope.surveyExclusion = true;
            }else{
                $scope.surveyExclusion = false;
            }

            for(var i in $scope.finalSurvey.survey_grouping){
              if(isNaN($scope.finalSurvey.survey_grouping[i])){
                $scope.surveyExclusion = true;
                break;
              }
            }
        }

        //PSID file upload
        $scope.uploadPsidFile = function(file, event) {
            //console.log('file ',file);

            if (file != null && file != undefined && file.name && (file.name.indexOf('.csv') > 0 || file.name.indexOf('.xlsx') > 0 || file.name.indexOf('.xls')) > 0) {
                $scope.psidRefFile = file;
                createSurvey.uploadPSIDRefFile($stateParams.surveyid, $scope.psidRefFile).success(function(data) {
                    $scope.finalSurvey.hasPSIDRefList = true;
                    event.preventDefault();
                    notify({
                        message:'File uploaded successfully',
                        classes:'alert-success',
                        duration:2000
                    });                        
                }).error(function(err) {
                    notify({
                        message: err.msg,
                        classes: 'alert-danger',
                        duration: 5000
                    });
                })
            } else if(event.type == 'change') {
                notify({
                    message: "Your Upload Failed. Please Check Your File And Try Again",
                    classes: 'alert-danger',
                    duration: 5000
                });
            }
        }; 


        //view latest upload zipcodes
        $scope.viewLatestPsids = function() {
            //Cleaning the p tag before appending psid data
            var myEl = angular.element( document.querySelector( '#view-psids' ) );
            myEl.empty();
            //read psid from the path in the file
            createSurvey.viewLatestUploadedPSID(parseInt($stateParams.surveyid), parseInt($scope.finalSurvey.incl_excl)).then(
            function(response) {
                var psidDataArr = response.data.psids;
                var divel = document.getElementById('view-psids');
                divel.appendChild(document.createTextNode(psidDataArr)); 
            },
            function(error) {
                notify({
                    message: error.data.msg || "error getting psid",
                    classes: 'alert-success',
                    duration: 2000
                });
            });
        };


        //clear file Uploaded PSIDs
        $scope.clearUploadPsids = function() {
            psidDataArr = [];
            createSurvey.clearUploadedPSIDs(parseInt($stateParams.surveyid)).then(
            function(response) {
                $scope.finalSurvey.hasPSIDRefList = false;
                notify({
                    message: "PSIDs cleared successfully",
                    classes: 'alert-success',
                    duration: 2000
                });
            },
            function(error) {
                //console.log("error ",error)
                notify({
                    message: error.data.msg || "error while removing psid",
                    classes: 'alert-success',
                    duration: 2000
                });
            });
        };

        $scope.chgeInclExcl = function(flagValue){
            if(flagValue == 1){
                $scope.finalSurvey.survey_grouping = '';
            }
        }


    }]);        
