angular.module('pureSpectrumApp')
.controller('dashCtrl',['$scope','$http','$state', '$timeout','localStorageService','user','notify','companyService', 'settingService', 'createSurvey','ngProgressLite', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$rootScope','config','socket','$stateParams','encodeDecodeFactory', 'authenticationService', '$filter', 'postCode', 'reportService', 'buyerSettingService', function($scope, $http, $state, $timeout, localStorageService, user, notify, companyService, settingService, createSurvey, ngProgressLite, DTOptionsBuilder, DTColumnDefBuilder, $rootScope, config,socket,$stateParams, encodeDecodeFactory, authenticationService, $filter, postCode, reportService, buyerSettingService){

    $scope.show=false;
    $rootScope.showCreate = false;
    $rootScope.dsboardLink=[];
    $scope.dsbrdSurvey=[];
    $scope.liveSurveys = [];
    $scope.pausedSurveys = [];
    $scope.closeSurveys = [];
    $scope.draftSurveys = [];
    $scope.showActivities = [];
    $scope.isExist = false;
    $scope.allSurveySearch = "";
    $scope.filterCompanyDetail = false;
    $scope.hideManageSurvey = true;
    $scope.showDraftSurvey = true;
    $scope.showFooterLink = true;
    $scope.hideStatusEdit = false;
    $scope.showActivtityInputBox = false;
    $scope.searchSurvey = {
      query : ""
    };  
    $scope.operatorFlg = false; /*PD-628*/
    $scope.isSupplierFielded = false;
    //$scope.lockUnlockGroupStatus.groupLockUnlockStatus = false; //PD-1100 PD-1154
    $scope.lockUnlockGroupStatus = {
      "groupLockUnlockStatus" : false,
      "fadeoptcitylock": false
    }
    
    //PD-1261
    $scope.quotaViewFlags = {
      "quotaview" : true,
      "supplierview" : false
    }
    $scope.nestedQuotasQualName = [];
    var allCaseSortNestedQuota = [];
    $scope.defaultActiveNestedBtn = "all";
    // Variables used for group updating Current Target Field
    $scope.editCurrentTarget = {
      "value" : new String(0),
      "type": new String()
    }; 

    var base_url = config.pureSpecturm.url;
    $scope.enableAccordianMenu = false;//PD-1227
    $scope.repDownloadButton = false; //flag for enable disable STR download button

    var userData = localStorageService.get('logedInUser');
    /*Check code for cmp undefined case if we login as supplier and open other page using top right corner and then logout */
    if(userData) {
      $scope.userCompany = userData.cmp;
      //PD-1227
      if((config.app == "pureSpectrumApp-Prod" || config.app == "pureSpectrumApp-Staging") && _.contains(config.supplierAccordian, userData.cmp)) {
          $scope.enableAccordianMenu = true;
      }
      if(config.app == "pureSpectrumApp-Dev" || config.app == "pureSpectrumApp-Staging") {
           $scope.enableAccordianMenu = true;
        }
    }
    else {
      $scope.userCompany = "";
    }
    $scope.currency_symbol = '$';
    //page numbers for pagination calls
    $scope.pageNumbers = {
      allTab: 1,
      liveTab: 1,
      pauseTab: 1,
      draftsTab: 1,
      closedTab: 1
    };
    //this is the main var that controll the infinite scroll
    $scope.infinteScroll = {
      disabled: true
    };
    //enable/disable pagination according to tabs
    //is the call return no data than disable variable according to tab
    $scope.disableInfiniteScroll = {
      allTab: true,
      liveTab: true,
      pauseTab: true,
      draftsTab: true,
      closedTab: true
    };
    //show loader for loading data of next page. shows when loading is true
    $scope.tableData = {loading: false};
    //surveys count according to status
    $scope.surveysCount = {
      all: 0,
      live: 0,
      drafts: 0,
      pause: 0,
      closed: 0
    };

    // Get Buyer Setting to check the Decipher is Set
    getBuyerSetting();
    function getBuyerSetting(){
      buyerSettingService.getSetting(userData.cmp).then(function(response){
        if(response && response.data && response.data.apiStatus == 'success' || response.data.buyer && response.data.buyer && response.data.buyer.isDecipher){
          $scope.isDecipher = response.data.buyer.isDecipher?response.data.buyer.isDecipher: false;
        } 
      }, function(err){
        console.log('err ',JSON.stringify(err));
      });
    }

          
    /*Check code for cmp undefined case if we login as supplier and open other page using top right corner and then logout */
    if(userData) {
       getCompanyDetails();
       showDataOnDashboard();
    }
    
    //make live survey tab default open
    $scope.active = { tab : 'live'};

    //when click on a tab and data is loading, make disable until fully load data
    // For Showing loader on manage page
    if($stateParams.key){
      $scope.loader = {show: true};
    }else{
      $scope.loader = {show: false};
    }
    // /*--- Show Loader on every http request----*/
    // $rootScope.$on('loading:progress', function (){
    //     $scope.loader.show = true;//PD-955
    // });

    // $rootScope.$on('loading:finish', function (){
    //     $scope.loader.show = false;//PD-955
    // });
    /*--- Show Loader on every http request----*/
    $scope.tabs = {makeDisable : false};
    //open selected tab
    $scope.setTab = function(newTab){
      $scope.active.tab = newTab;
      //check the disableInfiniteScroll according to tab
      //and make the infinite scroll disable variable true if it is true on this tab
      //we cann't combine immediate 'if' b'cos it will conflict when tabs swiched
      //all tab
      if(newTab == 'all') {
        if($scope.disableInfiniteScroll.allTab) {
          $scope.infinteScroll.disabled = true;
        }else {
          $scope.infinteScroll.disabled = false;
        }
        
        //very first click on tab. If there is no data in array call method to get data
        if($scope.dsbrdSurvey.length == 0) {
          $scope.tabs.makeDisable = true;
          $scope.pageNumbers.allTab = 1;
          getPaginatedSurveysList($scope.pageNumbers.allTab, "all", $scope.searchSurvey.query);
        }
      }
      //live tab
      if(newTab == 'live') {
        if($scope.disableInfiniteScroll.liveTab) {
          $scope.infinteScroll.disabled = true;
        }else {
          $scope.infinteScroll.disabled = false;
        }
        
        if($scope.liveSurveys.length == 0) {
          $scope.tabs.makeDisable = true;
          $scope.pageNumbers.liveTab = 1;
          getPaginatedSurveysList($scope.pageNumbers.liveTab, 22, $scope.searchSurvey.query);
        }
      }
      //pause tab
      if(newTab == 'paused') {
        if($scope.disableInfiniteScroll.pauseTab) {
          $scope.infinteScroll.disabled = true;
        }else {
          $scope.infinteScroll.disabled = false;
        }
        
        if($scope.pausedSurveys.length == 0) {
          $scope.tabs.makeDisable = true;
          $scope.pageNumbers.pauseTab = 1;
          getPaginatedSurveysList($scope.pageNumbers.pauseTab, 33, $scope.searchSurvey.query);
        }
      }
      //drafts tab
      if(newTab == 'drafts') {
        if($scope.disableInfiniteScroll.draftsTab) {
          $scope.infinteScroll.disabled = true;
        }else {
          $scope.infinteScroll.disabled = false;
        }

        if($scope.draftSurveys.length == 0) {
          $scope.tabs.makeDisable = true;
          $scope.pageNumbers.draftsTab = 1;
          getPaginatedSurveysList($scope.pageNumbers.draftsTab, 11, $scope.searchSurvey.query);
        }
      }
      //closed tab
      if(newTab == 'closed') {
        if($scope.disableInfiniteScroll.closedTab) {
          $scope.infinteScroll.disabled = true;
        }else {
          $scope.infinteScroll.disabled = false;
        }
        
        if($scope.closeSurveys.length == 0) {
          $scope.tabs.makeDisable = true;
          $scope.pageNumbers.closedTab = 1;
          getPaginatedSurveysList($scope.pageNumbers.closedTab, 44, $scope.searchSurvey.query);
        }
      }
      
    };
    $scope.isSet = function(tabNum){
      return $scope.active.tab === tabNum;
    };
    

    //get survey count grouped by survey status
    function getSurveysCount() {
      var type = '';
      if($rootScope.supplier != 'none'){
          type = 'supplier';
      }

      if($rootScope.buyer != 'none'){
          type = 'buyer';
      }

      if($rootScope.operator != 'none'){
          type = 'operator';
      }
      createSurvey.getSurveysCount(type, $scope.searchSurvey.query).then(
        function(response) {
          if(response && response.data && response.data.surveyCounts.length > 0) {
            _.each(response.data.surveyCounts, function(surveyCount){
              if(surveyCount._id == 11){
                $scope.surveysCount.drafts = surveyCount.count;
                $scope.surveysCount.all += surveyCount.count;
              }
              if(surveyCount._id == 22){
                $scope.surveysCount.live = surveyCount.count;
                $scope.surveysCount.all += surveyCount.count;
              }
              if(surveyCount._id == 33){
                $scope.surveysCount.pause = surveyCount.count;
                $scope.surveysCount.all += surveyCount.count;
              }
              if(surveyCount._id == 44){
                $scope.surveysCount.closed = surveyCount.count;
                $scope.surveysCount.all += surveyCount.count;
              }
            });
          }

          if(response && response.data && response.data.surveyCounts.length == 0) {
            $scope.surveysCount.all = 0;
            $scope.surveysCount.closed = 0;
            $scope.surveysCount.pause = 0;
            $scope.surveysCount.live = 0;
            $scope.surveysCount.drafts = 0;

          }
        },
        function(error) {
          notify({message:"error getting survey count",classes:'alert-danger',duration:2000} );
        });
    };

    $scope.downloadSurveyReport = function (survey_id) {
        $scope.repDownloadButton = true; //disable button till STR download
        //var user_type = ($rootScope.supplier != 'none') ? 'supplier' : 'buyer';
        var user_type = '';
        if($rootScope.supplier != 'none'){
            user_type = 'supplier';
        }

        if($rootScope.buyer != 'none'){
            user_type = 'buyer';
        }

        if($rootScope.operator != 'none'){
            user_type = 'operator';
        }
        //var url =  base_url+'/surveytrafficreport?user_id=' + $scope.userCompany + '&survey_id='+id + '&type='+type;
        //window.location.assign(url);
        
        var cmp = $scope.userCompany;
        reportService.downloadSTR(cmp, survey_id, user_type).success(function (response) {
            console.log(" downloadSTR response ",JSON.stringify(response));
            var fileName = response.fileName;
            window.location.assign(reportService.downloadFile(fileName));
            $scope.repDownloadButton = false; //enable STR download button
        }).error(function (err) {
            notify({message: err.msg, classes: 'alert-danger', duration: 2000});
            $scope.repDownloadButton = false; //enable STR download button
        });
        
        
    };

    $scope.category = '';

    function checkAccessByRole(cmpInfo){
      if(cmpInfo.isABuyer || cmpInfo.isASupplier || cmpInfo.isAnOperator){
        if(cmpInfo.isAnOperator==true){
          $scope.ManageCmpLink=true;
        }else{
          $scope.ManageCmpLink=false;
        }

        user.checkAccess(userData.buyerAcssLvls, userData.supplierAcssLvls, userData.operatorAcssLvls).success(function(dataEtnl){
          if(dataEtnl.Entitlement){
            _.each(dataEtnl.Entitlement, function(ent){
              if(ent.featureKey == 'CreateSurveys') {
                 if(ent.buyer.admin == true || ent.buyer.full == true) {
                    $rootScope.showCreate = true;
                    $scope.showManageSurvey  = false;
                 }
                 else{
                    $rootScope.showCreate = false;
                 }
              }
              if(ent.featureKey == 'manageCompanies' ){
                if(ent.operator.admin == true || ent.operator.full == true){
                  $rootScope.dsboardLink.push({
                    "featureName":ent.featureName,
                    "featureKey":ent.featureKey,
                    "featureLabel":ent.featureLabel
                  });
                }
                $scope.showManageSurvey  = false;
                $scope.operatorFlg = true; /*PD-628*/
              }
              //manage invoice link
              if(ent.featureKey == 'manageInvoice') {
                if(ent.operator.admin == true || ent.operator.full == true || ent.operator.limited == true) {
                  $rootScope.dsboardLink.push({
                    "featureName" : ent.featureName,
                    "featureKey" : ent.featureKey,
                    "featureLabel" : ent.featureLabel
                  });
                }
              }
              /**  PD-844 Begins*/
              if(_.contains(config.cmp, userData.cmp) && userData.operatorAcssLvls !== 'none'){
                  if (ent.featureKey == 'operatorSettings') {
                      if (ent.operator.admin == true || ent.operator.full == true || ent.operator.limited == true) {
                          $rootScope.dsboardLink.push({
                              "featureName": ent.featureName,
                              "featureKey": ent.featureKey,
                              "featureLabel": ent.featureLabel
                          });
                      }
                  }
              }
              /**  PD-844 Ends*/
              if(ent.featureKey.toLowerCase() == 'manualsurveytrafficfixes' ){
                if (ent.operator.admin == true || ent.operator.full == true){
                  $rootScope.dsboardLink.push({
                    "featureName":ent.featureName,
                    "featureKey":ent.featureKey,
                    "featureLabel":ent.featureLabel
                  });
                  $scope.showManageSurvey  = true;
                  $scope.hideManageSurvey =true;
                  $scope.showAllSurvey =true;
                  $scope.showCreate = false;
                  $scope.operatorFlg = true; /*PD-628*/
                }
              }
                 
              if(ent.featureKey == 'manageSuppliers'){
                 if(ent.buyer.admin == true){
                     $rootScope.dsboardLink.push({
                         "featureName":ent.featureName,
                         "featureKey":ent.featureKey,
                         "featureLabel":ent.featureLabel
                     });
                 }
                 $scope.showManageSurvey  = false;
              }
              if(ent.featureKey == 'manageUsers' ){
                 if (ent.operator.admin == true){
                     $rootScope.dsboardLink.push({
                         "featureName":ent.featureName,
                         "featureKey":ent.featureKey,
                         "featureLabel":ent.featureLabel
                     });
                     $scope.operatorFlg = true; /*PD-628*/
                 }
              }
              if(ent.featureKey == 'ManageSupplierPricingCard' ){
                 if(ent.supplier.admin || ent.supplier.full) {
                     $rootScope.dsboardLink.push({
                         "featureName": ent.featureName,
                         "featureKey": ent.featureKey,
                         "featureLabel":ent.featureLabel
                     });
                 }
              }

              if(ent.featureKey == 'ManageSupplierSettings' ){
                 if(ent.supplier.admin || ent.supplier.full) {
                     $rootScope.dsboardLink.push({
                         "featureName": ent.featureName,
                         "featureKey": ent.featureKey,
                         "featureLabel":ent.featureLabel
                     });
                 }
              }
             
              if(ent.featureKey == 'manageBuyers'){
                 if (ent.supplier.admin || ent.supplier.full){
                     $rootScope.dsboardLink.push({
                         "featureName":ent.featureName,
                         "featureKey":ent.featureKey,
                         "featureLabel":ent.featureLabel
                     });
                 }
              }

              if(ent.featureKey == 'manageBuyerSettings'){
                 if (ent.buyer.admin){
                     $rootScope.dsboardLink.push({
                         "featureName":ent.featureName,
                         "featureKey":ent.featureKey,
                         "featureLabel":ent.featureLabel
                     });
                 }
              }

              if(ent.featureKey == 'manageSurveys' ){
                 if(ent.buyer.limited ) {
                     //getSurveyesDetails();
                     $scope.showManageSurvey  = true;
                     $scope.hideManageSurvey = true;
                 }
              }

              if(ent.featureKey == 'downloadReports' ){
                if(ent.supplier.admin || ent.supplier.full || ent.operator.admin || ent.operator.full || ent.buyer.admin || ent.buyer.full ){
                  $rootScope.dsboardLink.push({
                    "featureName":ent.featureName,
                    "featureKey":ent.featureKey,
                    "featureLabel":ent.featureLabel
                  });
                }
              }

              if(ent.featureKey == 'addAdvQuestion'){
                if(ent.operator.admin || ent.operator.full){
                  $rootScope.dsboardLink.push({
                    "featureName":ent.featureName,
                    "featureKey":ent.featureKey,
                    "featureLabel":ent.featureLabel
                  });
                }
              }

              if(ent.featureKey == 'reconcile'){
                if(ent.operator.admin || ent.operator.full){
                  $rootScope.dsboardLink.push({
                    "featureName":ent.featureName,
                    "featureKey":ent.featureKey,
                    "featureLabel":ent.featureLabel
                  });
                }
              }
              if(ent.featureKey == 'reportsDashboard'){
                if(ent.operator.admin || ent.operator.full){
                  $rootScope.dsboardLink.push({
                    "featureName":ent.featureName,
                    "featureKey":ent.featureKey,
                    "featureLabel":ent.featureLabel
                  });
                }
              }
                 
              if(ent.supplier.admin == true || ent.supplier.full == true || ent.supplier.limited == true || ent.operator.admin == true || ent.operator.full == true || ent.operator.limited == true ) {
                    if(userData.buyerAcssLvls === "admin" || userData.buyerAcssLvls === "full"){
                      $scope.hideStatusEdit = false;
                      $scope.filterCompanyDetail = false;
                    } else {
                      $scope.hideStatusEdit = true;
                      $scope.filterCompanyDetail = true;
                    }
                    $scope.showManageSurvey    = true;
                    $scope.hideManageSurvey    = false;
              }
                 
              // draft survey not showing to supplier type of user
              // and edit link of survey not showing to suppliers
              if(ent.supplier.admin == true || ent.supplier.full == true || ent.supplier.limited == true ) {
                    if(userData.buyerAcssLvls !== "admin" && userData.buyerAcssLvls !== "full" && userData.operatorAcssLvls !== "admin" &&userData.operatorAcssLvls !== "full"){
                      $scope.showDraftSurvey = false;
                      $scope.showFooterLink = false;
                    }
              }
              if(ent.operator.admin == true || ent.operator.full == true || ent.operator.limited == true ) {
                if(userData.buyerAcssLvls == "admin" || userData.buyerAcssLvls == "full" || userData.buyerAcssLvls == "limited"){

                }else{
                   $scope.showDraftSurvey = false;
                  //$scope.showFooterLink = false; 
                }
              }

            });
            localStorageService.set('accessRole',dataEtnl.Entitlement[0]);
            getSurveyesDetails();
            showDataOnDashboard();
          }
        }).error(function (err) {
          notify({message:err.error,classes:'alert-danger',duration:2000} );
        })
      }
    }

    function showDataOnDashboard(){
            var user=localStorageService.get('logedInUser');
            var access=localStorageService.get('accessRole');
            

            $rootScope.userName=user.usrName;
            $rootScope.userEmail=user.eml;
            $rootScope.buyer=user.buyerAcssLvls;
            $rootScope.supplier=user.supplierAcssLvls;
            $rootScope.operator=user.operatorAcssLvls;

            if(!access){
                $rootScope.buyerrole='none';
                $rootScope.supplierrole='none';
            }
            else{

                if(access &&access.buyer.full==true){
                    $rootScope.buyerrole='full';
                }
                else{
                    $rootScope.buyerrole='none';
                }
                if(access.buyer.admin==true){
                    $rootScope.buyerrole='admin';
                }
                else{
                    $rootScope.buyerrole='none';
                }

                if(access.buyer.limited==true){
                    $rootScope.buyerrole='limited';
                }
                else{
                    $rootScope.buyerrole='none';
                }

                if(access.supplier.full==true){
                    $rootScope.supplierrole='full';
                }
                else{
                    $rootScope.supplierrole='none';
                }
                if(access.supplier.admin==true){
                    $rootScope.supplierrole='admin';
                }
                else{
                    $rootScope.supplierrole='none';
                }
                if(access.supplier.limited==true){
                    $rootScope.supplierrole='limited';
                }
                else{
                    $rootScope.supplierrole='none';
                }
            }
    }

    function getCompanyDetails(){
        var cmpId=userData.cmp;
        companyService.getCompany(cmpId).success(function (data) {
            if(data.company){
                checkAccessByRole(data.company[0])
            }
            else{
                notify({message:'User Company does not exist',classes:'alert-warning',duration:2000} );
            }
        }).error(function (err) {
            notify({message:'Error in Company',classes:'alert-danger',duration:2000} );
        })
    }

    function getSurveyesDetails(){
      $scope.loader.show = true;
      if($stateParams.key != undefined && $stateParams.key != null && $stateParams.key != "") {
        //get survey
        $scope.tabs.makeDisable = true;
        //$scope.openSurveyDetails();
        createSurvey.getSurveyBasicDetails($stateParams.key).then(
          function(response) {
            $scope.openSurveyDetails(response.data.survey[0]);
            $scope.tabs.makeDisable = false;
            $scope.loader.show = false;
          },
          function(error) {
            $scope.loader.show = false;
            $scope.tabs.makeDisable = false;
            notify({message:"error getting survey data",classes:'alert-danger',duration:2000} );
          });

      }else {
        //load dashboard
        $scope.tabs.makeDisable = true;
        getPaginatedSurveysList($scope.pageNumbers.allTab, 22, $scope.searchSurvey.query);
        getSurveysCount();
           
        }
    };

    function getPaginatedSurveysList(pageno, surveyType, searchKeyword) {
      var userType = '';
      if($rootScope.supplier != 'none'){
          userType = 'supplier';
      }

      if($rootScope.buyer != 'none'){
          userType = 'buyer';
      }

      if($rootScope.operator != 'none'){
          userType = 'operator';
      }
      $scope.loader.show = true;
      $scope.infinteScroll.disabled = true;
      $scope.tableData.loading = true;
      $scope.tabs.makeDisable = true;
      createSurvey.getPaginatedSurveys(pageno, surveyType, userType, searchKeyword).then(
        function(response) {
          $scope.loader.show = false;
          $scope.tabs.makeDisable = false;
          $scope.tableData.loading = false;
          if(response.data && response.data.survey && response.data.survey.length > 0) {

            //check survey type and append data according to survey type 
            if(surveyType == 'all') {
              //append to all tab
              $scope.dsbrdSurvey.push.apply($scope.dsbrdSurvey, response.data.survey);
              $scope.pageNumbers.allTab++;
              $scope.disableInfiniteScroll.allTab = false;
            }
            if(surveyType == 11) {
              //append to draft tab
              $scope.draftSurveys.push.apply($scope.draftSurveys, response.data.survey);
              $scope.pageNumbers.draftsTab++;
              $scope.disableInfiniteScroll.draftsTab = false;
            }
            if(surveyType == 22) {
              //append to live tab
              $scope.liveSurveys.push.apply($scope.liveSurveys, response.data.survey);
              $scope.pageNumbers.liveTab++;
              $scope.disableInfiniteScroll.liveTab = false;
            }
            if(surveyType == 33) {
              //append to paused tab
              $scope.pausedSurveys.push.apply($scope.pausedSurveys, response.data.survey);
              $scope.pageNumbers.pauseTab++;
              $scope.disableInfiniteScroll.pauseTab = false;
            }
            if(surveyType == 44) {
              //append to closed tab
              $scope.closeSurveys.push.apply($scope.closeSurveys, response.data.survey);
              $scope.pageNumbers.closedTab++;
              $scope.disableInfiniteScroll.closedTab = false;
            }
              
            $timeout(function(){
              $scope.infinteScroll.disabled = false;
              $scope.tabs.makeDisable = false;
            },1000);
            
          }else {
            //disable infinite scroll on tab if there is no survey returned
            //this is similar to infinite scroll disabled variable
            //true means scroll is disabled else on false it's enabled
            $scope.tabs.makeDisable = false;
            if(surveyType == 'all') {
              $scope.disableInfiniteScroll.allTab = true;
            }
            if(surveyType == 11) {
              $scope.disableInfiniteScroll.draftsTab = true;
            }
            if(surveyType == 22) {
              $scope.disableInfiniteScroll.liveTab = true;
            }
            if(surveyType == 33) {
              $scope.disableInfiniteScroll.pauseTab = true;
            }
            if(surveyType == 44) {
              $scope.disableInfiniteScroll.closedTab = true;
            }
          }
          $scope.tableData.loading = false;
        },
        function(error) {
          $scope.loader.show = false;
          $scope.tableData.loading = false;
          $scope.infinteScroll.disabled = true;
          $scope.tabs.makeDisable = false;
        });
    }

    $scope.loadMoreRecords = function() {
      //get the page number according to tab
      var pageNumberToSend = 1;
      var surveyType = ""
      if($scope.active.tab == 'all') {
        pageNumberToSend = $scope.pageNumbers.allTab;
        surveyType = 'all';
      }
      if($scope.active.tab == 'live') {
        pageNumberToSend = $scope.pageNumbers.liveTab;
        surveyType = 22;
      }
      if($scope.active.tab == 'paused') {
        pageNumberToSend = $scope.pageNumbers.pauseTab;
        surveyType = 33;
      }
      if($scope.active.tab == 'drafts') {
        pageNumberToSend = $scope.pageNumbers.draftsTab;
        surveyType = 11;
      }
      if($scope.active.tab == 'closed') {
        pageNumberToSend = $scope.pageNumbers.closedTab;
        surveyType = 44;
      }
      //call the method to get data
      if(!$scope.infinteScroll.disabled) {
        getPaginatedSurveysList(pageNumberToSend, surveyType, $scope.searchSurvey.query); 
      }          
    };


    /*------------For Datatable---------*/
    // if Different operators have different no of columns
    if($rootScope.buyer != 'none' || $rootScope.operator != 'none'){
      $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('bLengthChange', false).withOption('paging', false).withOption('aaSorting', [1, 'desc']).withOption('bFilter', false).withFixedHeader({header: true});
      if( $rootScope.operator != 'none') {
        $scope.dtColumnDefs = [
          DTColumnDefBuilder.newColumnDef(0).notSortable()
       ];
      }
      if($rootScope.buyer != 'none') {
        $scope.dtColumnDefs = [
          DTColumnDefBuilder.newColumnDef(8).notSortable(),
          DTColumnDefBuilder.newColumnDef(0).notSortable()
       ];
      }
    }else{
      $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('bLengthChange', false).withOption('paging', false).withOption('aaSorting', [1, 'desc']).withOption('bFilter', false).withFixedHeader({header: true});
      $scope.dtColumnDefs = [
          DTColumnDefBuilder.newColumnDef(7).notSortable(),
          DTColumnDefBuilder.newColumnDef(0).notSortable()
       ];
    }

    $scope.toUpdate = {
      id: "",
      encId: "",
      status: "",
      itemIndex: ""
    };
    $scope.statusUpdateMsg = "";
    $scope.showSuccessMessage = false;

    /*----------Put Survey Data in Survey Status Change Modal------*/
    $scope.openStatusModal = function(id, encId, status, itemIndex, currentStatus) {
      $scope.statusUpdateMsg = "";
      $scope.showSuccessMessage = false;

      $scope.toUpdate.id =id;
      $scope.toUpdate.encId =encId;
      $scope.toUpdate.status =status;
      $scope.toUpdate.itemIndex = itemIndex;
      $scope.toUpdate.currentStatus = currentStatus;

    };

    /*---------Updates Survey Status in Table after change-------*/
    $scope.updateSurveyStatus = function() {
      createSurvey.updateSurveyStatus($scope.toUpdate.id, $scope.toUpdate).success(function (data){
         if(data.apiStatus == "success"){
            if($scope.surveyDetails){
              $scope.surveyDetails.status = $scope.toUpdate.status;
            }

            let activityDate = new Date();
            let dateString = $filter('date')(activityDate, 'EEEE, MMMM d');
            let timeString = $filter('date')(activityDate, 'HH:mm');
            $scope.showActivities.unshift({
              activityString: userData['usrName'] + ' changed the survey status from ' + $scope.toUpdate.currentStatus + ' to ' + $scope.toUpdate.status,
              timeString: dateString + ' @ ' + timeString
            });
            if ($scope.showActivities.length) {
              $scope.isExist = true;
            }

            $scope.showSuccessMessage = true;
            $scope.statusUpdateMsg = " #"+$scope.toUpdate.id+" is in "+$scope.toUpdate.status+" state.";

            $timeout(function(){
              $("#status-change-modal .close").trigger("click");
            },3000);
          }
        })
        .error(function (err) {
           notify({message:err.msg,classes:'alert-danger',duration:2000} );
       });
    };

    /*--------Open Survey Details------*/
    $scope.showSurveyDetails = false;
    $scope.openSurveyDetails = function(survey, itemIndex){
      $scope.loader.show = true;
      $scope.tabs.makeDisable = true;
      $scope.toUpdate.itemIndex = itemIndex;
      $scope.infinteScroll.disabled = true;
      $rootScope.newId = survey.id;
      //$rootScope.clone = true;
      angular.element('body').addClass('manageSurvey');
      var user=localStorageService.get('logedInUser');
          

      $scope.survey_locale = encodeDecodeFactory.encode(survey.locale);
      // Show categories in link detail tab
      if(survey.status != 11 && survey.status != "Draft") {
        $scope.active.tab = 'quotas';
        $scope.showSurveyDetails = true;
        $scope.surveyDetails = survey;
        $scope.surveyDetails.status == 22 ? $scope.surveyDetails.status = "Live" : $scope.surveyDetails.status == 11 ? $scope.surveyDetails.status = "Drafts" : $scope.surveyDetails.status == 33 ? $scope.surveyDetails.status = "Pause" : $scope.surveyDetails.status == 44 ? $scope.surveyDetails.status = "Closed" : "Live";

        for(var i in $scope.surveyDetails.survey_grouping){
          if($scope.surveyDetails.survey_grouping[i] == survey.id){
            $scope.surveyDetails.survey_grouping.splice(i, 1);;
            break;
          }
        }

        if($scope.surveyDetails.survey_grouping && $scope.surveyDetails.survey_grouping.length == 0){
          $scope.surveyDetails.survey_grouping ='';
        }

        var userType = '';
        if($rootScope.supplier != 'none'){
            userType = 'supplier';
        }
        if($rootScope.buyer != 'none'){
            userType = 'buyer';
        }

        if($rootScope.operator != 'none'){
            userType = 'operator';
        }

        if(user.supplierAcssLvls != 'none'){
          createSurvey.getSurveyDetailforSupplier(survey.id, userType, survey.locale,userData.cmp).success(function(ssurveyDetails){

            $scope.loader.show = false;
            $scope.tabs.makeDisable = false;
            $timeout(function(){
              $scope.srvQtaMgeDetails = ssurveyDetails.quotaData[0];
              //PD-1261
              if(_.has($scope.srvQtaMgeDetails, "nestedQuotas") && $scope.srvQtaMgeDetails.nestedQuotas.length > 0) {
                allCaseSortNestedQuota = $scope.srvQtaMgeDetails.nestedQuotas;
              }
              $scope.srvAudienceDetails = ssurveyDetails.audience;
              $scope.suppSetObj = ssurveyDetails.supplierNames;
              $scope.srvMgeDetails = ssurveyDetails.result[0];
              $scope.surveyDetails.samplesName = ssurveyDetails.survey[0].samplesName;

              if(ssurveyDetails.survey[0].hasOwnProperty('sr_launchTS')){
                  $scope.surveyDetails.sr_launchTS = ssurveyDetails.survey[0].sr_launchTS;
              }
              if(ssurveyDetails.survey[0].hasOwnProperty('sr_closeTS')){
                  $scope.surveyDetails.sr_closeTS = ssurveyDetails.survey[0].sr_closeTS;
              }
              if(ssurveyDetails.survey[0].hasOwnProperty('openDates')){
                  $scope.surveyDetails.openDates = ssurveyDetails.survey[0].openDates;
              }
             

              if($scope.srvMgeDetails.hasOwnProperty('fielded') && $scope.srvMgeDetails.fielded == 0) {
                $scope.isSupplierFielded = true;

                $scope.srvMgeDetails.cpi_launch = ssurveyDetails.result[0].cpi_launch;
                $scope.srvMgeDetails.loi_launch = ssurveyDetails.result[0].loi_launch;
                $scope.srvMgeDetails.cpi_current = ssurveyDetails.result[0].acpi ||  ssurveyDetails.result[0].cpi_current ;
                $scope.srvMgeDetails.incidence_launch = ssurveyDetails.result[0].incidence_launch;
                $scope.srvMgeDetails.total_cost_projected = ssurveyDetails.result[0].total_cost_projected;

                if($scope.isSupplierFielded == true) {
                  $scope.cpiMode = "Current";
                  $scope.acpiMode = "Average";
                  $scope.loiMode = "Recent";//PD-1142
                  $scope.incidenceMode = "Recent"; //PD-1142
                }
              }else{
                $scope.isSupplierFielded = false;
                $scope.totalCostMode = "Current";
                $scope.cpiMode = "Current";
                $scope.acpiMode = "Average";
                $scope.loiMode = "Recent";//PD-1142
                $scope.incidenceMode = "Recent";//PD-1142
              }

              $scope.nestedQuotasQualName = []; 
              extractAutoNestedQuota(allCaseSortNestedQuota);//PD-1261
              //Change location name as the country changes
              console.log('$scope.srvMgeDetails.countryName 1 ',$scope.srvMgeDetails.countryCode);
              setLocationViews($scope.srvMgeDetails.countryCode);
            }, 100);
          });

        }else{
          createSurvey.getSurveyDetails(survey.id, userType, survey.locale).success(function(ssurveyDetails){
              $scope.loader.show = false;
              $scope.tabs.makeDisable = false;
              $timeout(function(){
                $scope.surveyDetails.samplesName = ssurveyDetails.survey[0].samplesName;

                // add the swagbucks project_id only for operator
                if(userType === 'operator' && ssurveyDetails.survey[0].sb_project_id) {
                    $scope.surveyDetails.sb_project_id = ssurveyDetails.survey[0].sb_project_id;
                }



              if(ssurveyDetails.survey[0].hasOwnProperty('sr_launchTS')){
                  $scope.surveyDetails.sr_launchTS = ssurveyDetails.survey[0].sr_launchTS;
              }
              if(ssurveyDetails.survey[0].hasOwnProperty('sr_closeTS')){
                  $scope.surveyDetails.sr_closeTS = ssurveyDetails.survey[0].sr_closeTS;
              }
              if(ssurveyDetails.survey[0].hasOwnProperty('openDates')){
                  $scope.surveyDetails.openDates = ssurveyDetails.survey[0].openDates;
              }
              


                //PD-822
                $scope.surveyDetails.survey_client = ssurveyDetails.survey[0].survey_client;

                $scope.srvMgeDetails = ssurveyDetails.mgmtData;
                
                if(ssurveyDetails.mgmtData && ssurveyDetails.mgmtData.currencyFx && ssurveyDetails.mgmtData.currencyFx.symbol) {
                   $scope.currency_symbol = ssurveyDetails.mgmtData.currencyFx.symbol;
                }

                /*modify data according to PD-389*/
                $scope.srvMgeDetails.cost_launch = ssurveyDetails.mgmtData.total_cost_launch || parseFloat(ssurveyDetails.mgmtData.cpi_launch * ssurveyDetails.mgmtData.goal).toFixed(2);
                $scope.srvMgeDetails.cpi_projected =  parseFloat(ssurveyDetails.mgmtData.total_cost_projected / ssurveyDetails.mgmtData.goal).toFixed(2);
                     
                $scope.srvQtaMgeDetails = ssurveyDetails.quotaData[0];
                
                //PD-1261
                if(_.has($scope.srvQtaMgeDetails, "nestedQuotas") && $scope.srvQtaMgeDetails.nestedQuotas.length > 0) {
                  allCaseSortNestedQuota = $scope.srvQtaMgeDetails.nestedQuotas;
                }

                /*==========Audience Qualification Data
                =====================================*/
                $scope.srvAudienceDetails = ssurveyDetails.audience;
               
                      
                /*PD-655*/
                $scope.srvAudienceDetails.survey_id = survey.id;
                if(survey.target.zipcodes != undefined && survey.target.zipcodes.length > 0) {
                  $scope.zipCodeFlg = true;
                  if(survey.target.zipcodes.length > 1) {
                    $scope.zipCodesLntFlg = true;
                  }
                }

                /*==============Get Suppliers for Buyer
                ======================================*/

               
                $scope.srvSupplierDetails = ssurveyDetails.supplierNames;
                $scope.availReconcileSurvey = ssurveyDetails.mgmtData;
                //PD-1028
                _.each($scope.srvSupplierDetails, function(itrateSupplr){
                    itrateSupplr["survey_id"] = survey.id;
                    
                });
                if(userData && userData.cmp == 56){
                  console.log('done');
                  _.each($scope.srvSupplierDetails, function(eachSup, j){
                      // Prodege MR
                      if(eachSup.id == 107){
                          eachSup.name = "GTM/My Survey";
                      }
                      // Avtive Measure
                      /*if(eachSup.id == 79){
                          eachSup.name = "GTM/My Survey";
                      }*/
                  }); 
                }
                /*if(userData && userData.cmp == 145){
                    console.log('done');
                    _.each($scope.srvSupplierDetails, function(eachSup, j){
                        if(eachSup.id == 9){
                            eachSup.name = "GTM";
                        }
                        if(eachSup.id == 26){
                            eachSup.name = "My Survey";
                        }
                    });   
                }*/

                $scope.nestedQuotasQualName = []; 
                extractAutoNestedQuota(allCaseSortNestedQuota);//PD-1261
                console.log('$scope.srvMgeDetails.countryName 2 ',$scope.srvMgeDetails.countryCode);
                setLocationViews($scope.srvMgeDetails.countryCode);
              }, 100);
          });
        }

      }else{
        $scope.loader.show = false;
        $scope.tabs.makeDisable = false;
  	    $state.go('launchsurvey',{surveyid: survey.id});
      }
    };


    /*--------Close Survey Details------*/
    $scope.closeSurveyDetails = function(surveyType){
        jQuery('body').removeClass('manageSurvey');
        $scope.showSurveyDetails = false;
        $scope.zipCodeFlg = false; /*PD-655*/
        $scope.zipCodesLntFlg = false; /*PD-655*/

        //set active tab according to current active tab
        if(surveyType != undefined && surveyType != null) {
          $scope.active.tab = ( surveyType == 'Live' ) ? 'live' : (surveyType == 'Pause') ? 'paused' : (surveyType == 'Closed') ? 'closed' : 'live';
          $scope.setTab($scope.active.tab);
        }
        //$scope.active.tab = 'live';
        $scope.infinteScroll.disabled = false;
        if($scope.filterCompanyDetail == false){
          $scope.totalCostMode = "Current";
          $scope.cpiMode = "Current";
          $scope.acpiMode = "Average";
          $scope.loiMode = "Recent";//PD-1142
          $scope.incidenceMode = "Recent";//PD-1142
        }
        //PD-1261
        $scope.quotaViewFlags.quotaview = true;
        $scope.quotaViewFlags.supplierview = false;

        $state.go('home')
    };

    //logout function and reset pssword function
    $rootScope.logout = function(){
        user.logoutUser(userData.id).success(function (data) {
            localStorageService.clearAll();
            sessionStorage.removeItem("token");
            authenticationService.revokeAuthentication();
            $state.go('login',{reload : true});
            //window.location.reload();
        }).error(function (err) {
            notify({message:'Error in logout',classes:'alert-danger',duration:2000} );
        })

    };
        
    $rootScope.resetPassword = function() {
        $state.go('resetPassword');
    };

    /*==========Survey Management Details
    =====================*/
    if( $rootScope.operator != 'none'){
      $scope.totalCostMode = "Current";
      $scope.cpiMode = "Current";
      $scope.acpiMode = "Average";
      $scope.loiMode = "Recent";//PD-1142
      $scope.incidenceMode = "Recent";//PD-1142
    }
    if($rootScope.supplier != 'none'){
      $scope.totalCostMode = "Current";
      $scope.cpiMode = "Current";
      $scope.acpiMode = "Average";
      $scope.loiMode = "Recent";//PD-1142
      $scope.incidenceMode = "Recent";//PD-1142
    }
    if($rootScope.buyer != 'none'){
      // $scope.totalCostMode = "Projected";
      // $scope.cpiMode = "At Launch";
      // $scope.acpiMode = "At Launch";
      // $scope.loiMode = "At Launch";
      // $scope.incidenceMode = "At Launch";

      $scope.totalCostMode = "Current";
      $scope.cpiMode = "Current";
      $scope.acpiMode = "Average";
      $scope.loiMode = "Recent";//PD-1142
      $scope.incidenceMode = "Recent";//PD-1142
    }
    if($scope.isSupplierFielded == true) {
        $scope.cpiMode = "At Launch";
        $scope.acpiMode = "Average";
        $scope.loiMode = "Recent";//PD-1142
        $scope.incidenceMode = "Recent";//PD-1142
    }

    $scope.changeTotalCostMode = function(mode){
      $scope.totalCostMode = mode;
    }
    $scope.changeCpiMode = function(mode){
      $scope.cpiMode = mode;
    }
    $scope.changeAcpiMode = function(mode){
      $scope.acpiMode = mode;
    }
    $scope.changeLoiMode = function(mode){
      $scope.loiMode = mode;
    }
    $scope.changeIncidenceMode = function(mode){
      $scope.incidenceMode = mode;
    }
    $scope.setLink = function(surveyDetails){
      var cmpId=userData.cmp;
      $scope.buyerEntryLink = config.pureSpecturm.url+'/startsurvey?survey_id='+ surveyDetails.id+'&supplier_id=?';
      if(config.app == "pureSpectrumApp-Staging"){
        $scope.buyerTestEntryLink = config.pureSpecturm.url+'/startsurvey?survey_id='+ surveyDetails.id + '&ps_redirect_test=1&bsec='+config.BSEC+'&supplier_id=26';
      }else{
        $scope.buyerTestEntryLink = config.pureSpecturm.url+'/startsurvey?survey_id='+ surveyDetails.id + '&ps_redirect_test=1&bsec='+config.BSEC+'&supplier_id=23';
      }
      $scope.suppEntryLink = config.pureSpecturm.url+'/startsurvey?survey_id='+ surveyDetails.id+'&supplier_id='+cmpId;
      $scope.suppTestEntryLink = config.pureSpecturm.url+'/startsurvey?survey_id='+ surveyDetails.id + '&ps_redirect_test=1&bsec='+config.BSEC+'&supplier_id='+cmpId;
    }

    /*------For Editing Live Close And Paused Surveys-----------------*/
    
    if($stateParams.key){
        $scope.showSurveyDetails = true;
        $scope.active.tab = 'quotas';

    }
    $scope.closeManage = function(key){
        $scope.active.tab = 'all';
        $state.go('home');
    };

    
    socket.on('channel', function (message) {
      var tempArr = [];
      var socLiveSurvey = _.findWhere($scope.liveSurveys, {"id":message.survey_param.id});
      var liveIndex = _.findIndex($scope.liveSurveys, socLiveSurvey);
      if(socLiveSurvey && angular.lowercase(socLiveSurvey.status) == 'live'){
        tempArr.push(socLiveSurvey);
        $scope.liveSurveys.splice(liveIndex,1);
        $scope.surveysCount.live = $scope.surveysCount.live - 1;
      }
      
      var socPauseSurvey = _.findWhere($scope.pausedSurveys, {"id":message.survey_param.id});
      var pauseIndex = _.findIndex($scope.pausedSurveys, socPauseSurvey);
      if(socPauseSurvey && socPauseSurvey.id  == message.survey_param.id){
         if(angular.lowercase(socPauseSurvey.status) == 'pause') {
          tempArr.push(socPauseSurvey);
          $scope.pausedSurveys.splice(pauseIndex,1);
          $scope.surveysCount.pause = $scope.surveysCount.pause - 1;
        }
      }

      var socCloseSurvey = _.findWhere($scope.closeSurveys, {"id":message.survey_param.id});
      var closeIndex = _.findIndex($scope.closeSurveys, socCloseSurvey);
      if(socCloseSurvey && socCloseSurvey.id  == message.survey_param.id){
        if(angular.lowercase(socCloseSurvey.status) == 'closed') {
          tempArr.push(socCloseSurvey);
          $scope.closeSurveys.splice(closeIndex,1);
        }
      } 

      var socDraftSurvey = _.findWhere($scope.draftSurveys, {"id":message.survey_param.id});
      var draftIndex = _.findIndex($scope.draftSurveys, socDraftSurvey);
      if(socDraftSurvey && socDraftSurvey.id  == message.survey_param.id){
        if(angular.lowercase(socDraftSurvey.status) == 'draft'){
          tempArr.push(socDraftSurvey);
          $scope.draftSurveys.splice(draftIndex,1);
        }
      } 

      if(angular.lowercase(message.survey_param.status) == 'live') {
        $scope.surveysCount.live = $scope.surveysCount.live + 1;
        if($scope.liveSurveys.length != 0 && tempArr[0] != undefined){
          tempArr[0].status ='Live';
          $scope.liveSurveys.push(tempArr[0]);
        }
      }else if(angular.lowercase(message.survey_param.status) == 'pause') {
        $scope.surveysCount.pause = $scope.surveysCount.pause + 1;
        if( $scope.pausedSurveys.length != 0 && tempArr[0] != undefined){
           tempArr[0].status ='Pause';
          $scope.pausedSurveys.push(tempArr[0]);
        }
      }else if(angular.lowercase(message.survey_param.status) == 'closed') {
        if( $scope.closeSurveys.length != 0 && tempArr[0] != undefined){
           tempArr[0].status ='Closed';
          $scope.closeSurveys.push(tempArr[0]);
        }
      }else if(angular.lowercase(message.survey_param.status) == 'draft') {
        if($scope.draftSurveys != undefined && $scope.draftSurveys.length != 0 && tempArr[0] != undefined){
           tempArr[0].status ='Draft';
          $scope.draftSurveys.push(tempArr[0]);
        }
      }
    });
    

    // update on survey done
    socket.on('channel2', function (message) {
      //console.log('channel2 ',$scope.showAccordianQuota.current);
      var user = localStorageService.get('logedInUser');
     
      if(user.supplierAcssLvls != 'none'){
        var survey_id = message.supp_survey_param.survey_id;
        var fielded   = message.supp_survey_param.fielded;
      }else{
        var survey_id = message.survey_param.survey_id;
        var fielded   = message.survey_param.fielded;
      }
      
      /*if($scope.surveyDetails && message.supp_survey_param && message.supp_survey_param.samplesName){
        $scope.surveyDetails.samplesName = message.supp_survey_param.samplesName;
      }*/
      
      if($scope.srvMgeDetails != undefined && $scope.srvMgeDetails.survey_id == survey_id){
        if(user.supplierAcssLvls != 'none' ){
          if( user.cmp == message.supp_survey_param.supplier_id){
            $scope.srvMgeDetails = message.supp_survey_param;
          }
        }else{
            $scope.srvMgeDetails = message.survey_param;
        }
      }

      if($scope.srvQtaMgeDetails != undefined){ 
        if($scope.srvQtaMgeDetails.survey_id == survey_id){
          $scope.srvQtaMgeDetails = message.quotamgmt_param[0];
        }
      }
      if($scope.srvSupplierDetails != undefined){
        if($scope.srvMgeDetails.survey_id == survey_id){
          _.each($scope.srvSupplierDetails, function(singleSupp){
            var currSupp = _.findWhere(message.supplierNames, {"id":singleSupp.id});
            if(currSupp){
              singleSupp['fielded'] = currSupp.fielded;
              singleSupp['cpi'] = currSupp.cpi;
              singleSupp['buyer_in_progress'] = currSupp.buyer_in_progress;
              singleSupp['remaining'] = currSupp.remaining;
              singleSupp['blockprice'] = currSupp.blockprice;
              singleSupp['price_override'] = currSupp.price_override;
              //PD-1227 1283
              
              if(_.has(currSupp, "performance")) {
                singleSupp['performance']  = currSupp.performance;
              }
              
              if(_.has(currSupp, "valid_click")) {
                singleSupp['valid_click'] = currSupp.valid_click;
              }
              if(_.has(currSupp, "valid_click_cost")) {
                singleSupp['valid_click_cost'] = currSupp.valid_click_cost;
              }
              if(_.has(currSupp, "total_click_cost")) {
                singleSupp['total_click_cost'] = currSupp.total_click_cost;
              }
              if(_.has(currSupp, "valid_click_per")) {
                singleSupp['valid_click_per'] = currSupp.valid_click_per;
              }
            }
          });
          //$scope.srvSupplierDetails = message.supplierNames;
        }
      }

      var socDashSurvey = _.findWhere($scope.dsbrdSurvey, {"id":survey_id});
      //console.log('socDashSurvey '+JSON.stringify(socDashSurvey));
      if(socDashSurvey){
        if(user.supplierAcssLvls != 'none' && user.cmp == message.supp_survey_param.supplier_id){
          socDashSurvey.supplier[0].fielded = fielded;
        }else{
          socDashSurvey.incidence_current = message.survey_param.incidence_current;
          socDashSurvey.acpi = message.survey_param.acpi;
          socDashSurvey.Fielded = fielded;
        }
      }
      
      var socLiveSurvey = _.findWhere($scope.liveSurveys, {"id":survey_id});
      //console.log('socLiveSurvey '+JSON.stringify(socLiveSurvey));
      if(socLiveSurvey){
        if(user.supplierAcssLvls != 'none' && user.cmp == message.supp_survey_param.supplier_id) {
          socLiveSurvey.supplier[0].fielded = fielded;
        }else{
          socLiveSurvey.incidence_current = message.survey_param.incidence_current;
          socLiveSurvey.acpi = message.survey_param.acpi;
          socLiveSurvey.Fielded = fielded;
        }
      }

      var socPauseSurvey = _.findWhere($scope.pausedSurveys, {"id":survey_id});
      //console.log('socPauseSurvey '+JSON.stringify(socPauseSurvey));
      if(socPauseSurvey){
        if(user.supplierAcssLvls != 'none' && user.cmp == message.supp_survey_param.supplier_id) {
          socPauseSurvey.supplier[0].fielded = fielded;
        } else {
          socPauseSurvey.incidence_current = message.survey_param.incidence_current;
          socPauseSurvey.acpi = message.survey_param.acpi;
          socPauseSurvey.Fielded = fielded;
        } 
      }

      var socCloseSurvey = _.findWhere($scope.closeSurveys, {"id":survey_id});
      //console.log('socCloseSurvey '+JSON.stringify(socCloseSurvey));
      if(socCloseSurvey){
        if(user.supplierAcssLvls != 'none' && user.cmp == message.supp_survey_param.supplier_id) {
          socCloseSurvey.supplier[0].fielded = fielded;
        }else{
          socCloseSurvey.incidence_current = message.survey_param.incidence_current;
          socCloseSurvey.acpi = message.survey_param.acpi;
          socCloseSurvey.Fielded = fielded;
        }
      }
      
    });
    socket.on('channel3', function (message) {
      //console.log('channel3 ',$scope.showAccordianQuota.current);
      var socDashSurvey = _.findWhere($scope.dsbrdSurvey, {"id":message.survey_param.survey_id});
      if(socDashSurvey){
        if(angular.lowercase(message.survey_param.st) == 'pause'){
          $scope.pausedSurveys.push(socDashSurvey);
        }
        socDashSurvey.status = message.survey_param.st;
      }
      var socLiveSurvey = _.findWhere($scope.liveSurveys, {"id":message.survey_param.survey_id});
      var liveIndex = _.findIndex($scope.liveSurveys, socLiveSurvey);
      if(socLiveSurvey && angular.lowercase(message.survey_param.st) == 'pause') {
        socLiveSurvey.status = message.survey_param.st;
        $scope.liveSurveys.splice(liveIndex,1);
      }
      //console.log('channel3  after ',$scope.showAccordianQuota.current);
    });
    //socket to update survey status in case survey gets closed on surveydone
    socket.on('channel4', function (message) {
      //console.log('channel4  ',$scope.showAccordianQuota.current);
      var socDashSurvey = _.findWhere($scope.dsbrdSurvey, {"id":message.survey_param.survey_id});
      if(socDashSurvey){
        if(angular.lowercase(message.status) == 'closed') {
          $scope.closeSurveys.push(socDashSurvey);
          //$scope.liveSurveys.splice(i,1);
        }
        socDashSurvey.status = message.status;
      }
      var socLiveSurvey = _.findWhere($scope.liveSurveys, {"id":message.survey_param.survey_id});
      var liveIndex = _.findIndex($scope.liveSurveys, socLiveSurvey);
      if(socLiveSurvey){
        if(angular.lowercase(message.status) == 'closed') {
          socLiveSurvey.status = message.status;
          $scope.liveSurveys.splice(liveIndex,1);
        }
      }
      //console.log('channel4  after ',$scope.showAccordianQuota.current);
    });
    
    socket.on('channel5', function (message) {
      //console.log('channel5  ',$scope.showAccordianQuota.current);
      var socDraftSurvey = _.findWhere($scope.draftSurveys, {"encriptionId":message.survey_param.id});
      var draftIndex = _.findIndex($scope.draftSurveys, socDraftSurvey);
      if(socDraftSurvey){
        if(angular.lowercase(socDraftSurvey.status) == 'draft'){
          $scope.draftSurveys.splice(draftIndex,1);
        }
      }
      //console.log('channel5  after ',$scope.showAccordianQuota.current);
    });
    socket.on('buyerProgressChannel', function (message) {
      //console.log('buyerProgressChannel  ',$scope.showAccordianQuota.current);
      var socDashSurvey = _.findWhere($scope.dsbrdSurvey, {"id":message.survey_param.survey_id});
      if(socDashSurvey && socDashSurvey.id == message.survey_param.survey_id){
        socDashSurvey.actualBuyerInProgress = message.survey_param.actualBuyerInProgress;
      }

      var socLiveSurvey = _.findWhere($scope.liveSurveys, {"id":message.survey_param.survey_id});
      if(socLiveSurvey && socLiveSurvey.id == message.survey_param.survey_id){
        socLiveSurvey.actualBuyerInProgress = message.survey_param.actualBuyerInProgress;
      }
      //console.log('buyerProgressChannel after ',$scope.showAccordianQuota.current);
    });
    // update counters of quota tab while update on BIP, sup_currently_open, in updateQuotaBIPCounterV2 function
    socket.on('quotaTabChannel', function (data){
      //console.log('quotaTabChannel  ',$scope.showAccordianQuota.current);
      //console.log("quotaTabChannel ",JSON.stringify(data));
      if($scope.srvQtaMgeDetails && data.survey_id && data.quotaData){
        if($scope.srvQtaMgeDetails.survey_id == data.survey_id) {
          $scope.srvQtaMgeDetails = data.quotaData[0];
          /*_.each(Object.keys($scope.srvQtaMgeDetails.quotas), function(quotaKey){
            //console.log('quotaKey '+quotaKey);
            _.each($scope.srvQtaMgeDetails['quotas'][quotaKey] , function(quotaSingleObj){
              //console.log('quotaSingleObj '+JSON.stringify(quotaSingleObj));
              var incomingQuotaData = data.quotaData[0]['quotas'][quotaKey];
              //console.log('incomingQuotaData '+JSON.stringify(incomingQuotaData));
              var currentQuota = _.findWhere(incomingQuotaData, {"unique_id":quotaSingleObj.unique_id});
              //console.log('currentQuota '+JSON.stringify(currentQuota));
              if(currentQuota){
                quotaSingleObj['currently_open']  = currentQuota.currently_open;
                quotaSingleObj['sup_currently_open']  = currentQuota.sup_currently_open;
                quotaSingleObj['buyer_in_progress']  = currentQuota.buyer_in_progress;
                quotaSingleObj['remaining']  = currentQuota.remaining;
                quotaSingleObj['achieved']  = currentQuota.achieved;
              }
            });
          });*/ 
        }
        /*if($scope.srvQtaMgeDetails.survey_id == data.survey_id) {
          $scope.srvQtaMgeDetails = data.quotaData[0];
        }*/
      }
      //console.log('quotaTabChannel after ',$scope.showAccordianQuota.current);
    });
    // update counters of supplier tab while update on BIP
    socket.on('supplierBPIChannel', function (data) {
      //console.log('supplierBPIChannel ',$scope.showAccordianQuota.current);
      //console.log("\n\n supplierBPIChannel ",JSON.stringify(data));
      //console.log("$scope.srvSupplierDetails ",JSON.stringify($scope.srvSupplierDetails));
      if($scope.srvQtaMgeDetails != undefined && data.survey_param && data.survey_param.survey_id && data.survey_param.survey_id == $scope.srvQtaMgeDetails.survey_id){ 
        _.each($scope.srvSupplierDetails, function(supIndex){
          if(supIndex.id === data.survey_param.supplier_id) {
            supIndex['buyer_in_progress'] = data.survey_param.actualBuyerInProgress;
          }
        });
      }
      //console.log('supplierBPIChannel after ',$scope.showAccordianQuota.current);
    });
    // update counters of supplier tab while Start Surveys- PD-772
    socket.on('supplierSurveyStartChannel', function (data) {
      //console.log('supplierSurveyStartChannel ',$scope.showAccordianQuota.current);
      //console.log("\n\n Survey Start counter channel ",JSON.stringify(data));
      //console.log("\n\n $scope.srvQtaMgeDetails ",$scope.srvSupplierDetails);
      if($scope.srvSupplierDetails && $scope.srvSupplierDetails.length > 0) {
        _.each($scope.srvSupplierDetails, function(srvSupplr){
            if(srvSupplr.survey_id == data.surveyStartCount.survey_id && srvSupplr.id == data.surveyStartCount.supplier_id) {
               srvSupplr.srvStrtCount = data.surveyStartCount.srvStrtCount;
               srvSupplr.lastSrvDate = data.surveyStartCount.lastSrvDate;
            }
        });
      }  
      //console.log('supplierSurveyStartChannel after ',$scope.showAccordianQuota.current);  
    });

    // update survey details after manual reconcilation- PD-1087
    socket.on('channel_recon', function (surveyManagementDoc) {
      
      var survey_id = surveyManagementDoc.survey_id;
      var user = localStorageService.get('logedInUser');

      if(surveyManagementDoc && $scope.srvMgeDetails && $scope.srvMgeDetails.survey_id == survey_id){
        
        if(surveyManagementDoc.statistics && surveyManagementDoc.statistics.length){
          var sur_st = _.findWhere(surveyManagementDoc.statistics, {"period": "all"});
          if((user.buyerAcssLvls != 'none' && user.cmp == sur_st.buyer.buyer_id) || user.operatorAcssLvls != 'none'){
            $scope.srvMgeDetails.fielded = surveyManagementDoc.fielded;
            $scope.srvMgeDetails.total_cost_current = sur_st.buyer.finance.buyer_amount_after_adj;
            $scope.srvMgeDetails.recCompltCount = sur_st.buyer.completes.buyer_recon;
            $scope.srvMgeDetails.manualFixCompltCount = sur_st.buyer.completes.buyer_manual_fix;

            //Updating Dashboard Completes PD-1301
            _.each($scope.closeSurveys, function(closSrv){
                if(closSrv.id == survey_id) {
                    closSrv.Fielded = surveyManagementDoc.fielded; 
                }
            });
          }

          if(user.supplierAcssLvls != 'none'){
            _.each(sur_st.suppliers, function(sup_st){
              if(sup_st.supplier_id == user.cmp){
                $scope.srvMgeDetails.total_cost_current = sup_st.finance.supplier_amount_after_adj;
              }
            })
          }

        }
        
        //updating supplier tab
        for(supIndex in $scope.srvSupplierDetails){
          var currSupp = _.findWhere(surveyManagementDoc.suppliers, {"id":$scope.srvSupplierDetails[supIndex].id});
          if(currSupp) {
            $scope.srvSupplierDetails[supIndex]['fielded'] = currSupp.achieved;
            $scope.srvSupplierDetails[supIndex]['remaining'] = currSupp.remaining;
            $scope.srvSupplierDetails[supIndex]['blockprice'] = Number(parseFloat((currSupp.block_price) / 0.8).toFixed(2));
          }
        }
      }
    });

    //Update supplier performance by socket PD-1227
    socket.on('supplier_performance', function(data){
      var survey_id = data.supplierData.survey_id;
      if($scope.srvSupplierDetails != undefined){
        if($scope.srvMgeDetails.survey_id == survey_id){
          _.each($scope.srvSupplierDetails, function(snglSupplr){
              if(data.supplierData.supplier_id === snglSupplr.id) {
                 
                  if(_.has(data.supplierData, "performance")){
                    snglSupplr.performance = data.supplierData.performance;
                  }

                  if(_.has(data.supplierData, "valid_click")) {
                    snglSupplr['valid_click'] = data.supplierData.valid_click;
                  }
                  if(_.has(data.supplierData, "valid_click_cost")) {
                    snglSupplr['valid_click_cost'] = data.supplierData.valid_click_cost;
                  }
                  if(_.has(data.supplierData, "total_click_cost")) {
                    snglSupplr['total_click_cost'] = data.supplierData.total_click_cost;
                  }
                  if(_.has(data.supplierData, "valid_click_per")) {
                    snglSupplr['valid_click_per'] = data.supplierData.valid_click_per;
                  }
              }
          });
        }
      }
    });

    /*==========Lock Quota===
    ========================*/

    $scope.lockQuotaImg = "../../img/lock.png";
    $scope.unLockQuotaImg = "../../img/unlock.png";



    $scope.lockQuota = function(surveyId, quotaName, unique_id, flag, index, option_id, quota){

       let quotaDetails = {
        quotas: [],
        type: ''
       };
        $scope.loader.show = true;
        if($rootScope.supplier != 'none') {
            return false;
        }
        if (_.has(quota, 'name') && quota['name'].length) {
          _.each(quota['name'], (quot) => {
            if (_.has(quot, 'from') && _.has(quot, 'to')) {
              quotaDetails['quotas'].push({
                name: quota['qualification_name'],
                condition: quot['from'] + ' - ' + quot['to']
              });
              
            }
            if (_.has(quot, 'name') && !_.has(quot, 'from') && !_.has(quot, 'to')) {
              quotaDetails['quotas'].push({
                name: quota['qualification_name'],
                condition: quot['name']
              });
            }
          })
          quotaDetails['type'] = (quota['qualification_name'] == quotaName) ? 'layered' : quotaName;
        }

        if (_.has(quota, 'combinedOptions') && quota['combinedOptions'].length) {
          _.each(quota['combinedOptions'], (quot) => {
              quotaDetails['quotas'].push({
                name: quot['q_name'],
                condition: ''
              });
          });
          quotaDetails['type'] = quotaName;
        }
        
        createSurvey.lockQuota(surveyId, quotaName, unique_id, flag, option_id, quotaDetails).success(function (data){
          if(data.apiStatus == "Success"){
            $scope.loader.show = false;
            //console.log("quotaName ",quotaName);
            //console.log("index ",index);
            // Checking if quotaName exists in advanceQuotas then go in first condition otherwise check in quotas else nested
            if($scope.srvQtaMgeDetails.advanceQuotas[quotaName]){
              $scope.srvQtaMgeDetails.advanceQuotas[quotaName][index].locked = flag;
            }else if($scope.srvQtaMgeDetails.quotas[quotaName]){
              $scope.srvQtaMgeDetails.quotas[quotaName][index].locked = flag;
            }else if(quotaName == "nested"){
              $scope.srvQtaMgeDetails.nestedQuotas[index].locked = flag;
            }else if(quotaName == "grouped"){
              $scope.srvQtaMgeDetails.groupedCatQuotas[index].locked = flag;
            }

            if(flag == true){
              notify({message:'Quota Locked',classes:'alert-success',duration:2000} );
            }else{
              notify({message:'Quota Unlocked',classes:'alert-success',duration:2000} );
            }
           }
        }).error(function (err) {
            $scope.loader.show = false;
             notify({message:err.msg,classes:'alert-danger',duration:2000} );
        });
    };

    $scope.lockQuotaAgeIncome = function(surveyId, quotaName, min, max, flag, index){
        $scope.loader.show = true;
        if($rootScope.operator != 'none' || $rootScope.supplier != 'none') {
            return false;
        }
        createSurvey.lockQuotaAgeIncome(surveyId, quotaName, min, max, flag).success(function (data){
        if(data.apiStatus == "Success"){
          $scope.loader.show = false;
          if(quotaName == "age"){
            $scope.srvQtaMgeDetails.quotas.age[index].locked = flag;
          }
          else if(quotaName == "houseHoldIncome"){
            $scope.srvQtaMgeDetails.quotas.houseHoldIncome[index].locked = flag;
          }

          if(flag == true){
            notify({message:'Quota Locked',classes:'alert-success',duration:2000} );
          }else{
            notify({message:'Quota Unlocked',classes:'alert-success',duration:2000} );
          }
         }
        }).error(function (err) {
          $scope.loader.show = false;
           notify({message:err.msg,classes:'alert-danger',duration:2000} );
        });
    };

    /*------Open Delete Modal-----*/
    $scope.toDelete={
      id: "",
      encId: "",
      status: ""
    };
    $scope.deleteModal = function(id, encId){
      $scope.deleteSuccessMsg = "";
      $scope.showSuccessMessage = false;

      $scope.toDelete.id =id;
      $scope.toDelete.encId =encId;
    };

    /*--------Delete Survey Function--------*/
    $scope.deleteSurvey = function() {
      $scope.loader.show = true;
      createSurvey.deleteDraftSurvey($scope.toDelete.encId).success(function (data){
          $scope.loader.show = false;
         if(data.apiStatus == "success"){
            $scope.showSuccessMessage = true;
            $scope.deleteSuccessMsg = " #"+$scope.toDelete.id+" is deleted";
            getSurveyesDetails();
            $timeout(function(){
              $("#survey-delete-modal .close").trigger("click");
            },3000);
          }
        })
        .error(function (err) {
          $scope.loader.show = false;
           notify({message:err.msg,classes:'alert-danger',duration:2000} );
       });
    };

    $scope.clearDataFunc = function() {
      $rootScope.clone = false;
      $rootScope.newId = "";
    }

    $scope.config = config; // For making footer links inactive on Prod

    $scope.createNewPriceBlock = function() {
      createSurvey.createNewPriceBlock($scope.surveyDetails.id).success(function(res) {
        notify({message:res.msg,classes:'alert-success',duration:2000} );
      })
      .error(function(err) {
        notify({message:err.msg,classes:'alert-danger',duration:2000} );
      })
    }

    //search for surveys
    $scope.searchSurveys = function(tabName) {
      $scope.dsbrdSurvey=[];
      $scope.liveSurveys = [];
      $scope.pausedSurveys = [];
      $scope.closeSurveys = [];
      $scope.draftSurveys = [];

      if(tabName == 'all') {
        $scope.pageNumbers.allTab = 1;
      }
      if(tabName == '22') {
        $scope.pageNumbers.liveTab = 1;
      }
      if(tabName == '33') {
        $scope.pageNumbers.pauseTab = 1;
      }
      if(tabName == '44') {
        $scope.pageNumbers.closedTab = 1;
      }
      if(tabName == '11') {
        $scope.pageNumbers.draftsTab = 1;
      }

      getPaginatedSurveysList(1, tabName, $scope.searchSurvey.query);
      getSurveysCount();
    };

    // For Zipcodees view button
    $scope.showZipCodes = function(surveyID){
      /*PD-655*/
      var url =  base_url+'/getzipcodebysurveyid/?survey_id=' + surveyID;
      window.location.assign(url);
    }

    $scope.inputBocClick = function() {
      angular.element('#fileModel').trigger('click');
    }
    /*
    @ To Upload the reconcilation file for survey reconcile.
    */
    $scope.param = {};
    $scope.uploadBuyerReconciliationFile = function() {
      $scope.loader.show = true;
      $scope.tabs.makeDisable = true; 
      $scope.uploadFile = document.getElementById('fileModel').files[0];
      var regex = new RegExp("(.*?)\.(csv|xlsx|xls)$");
      if($scope.uploadFile) { 
        var fileName = $scope.uploadFile.name;
        if((regex.test(fileName))) {
          createSurvey.uploadReconciliationFile($scope.uploadFile).success(function(res) {
            $scope.loader.show = false;
            $scope.tabs.makeDisable = false;
            delete $scope.param.file;
            $scope.totalFileTrans = res.msg.totalFileTrans;
            $scope.changeToComplt = res.msg.changeToCompltTrans;
            $scope.rejectTrans = res.msg.rejectedTrans;
            $scope.transStatusComplt = res.msg.statusComplt;
            angular.element("input[type='file']").val(null);
            angular.element("input[type='text']").val(null);
            //console.log("res-------", res, res.msg, res.msg.totalFileTrans, res.msg.changeComplt, res.msg.rejectedTransactions)
            if(res.msg != "error") {
              $scope.openModel = angular.element('#reconcileModal');
            }
            if(res.msg == "error") {
              $scope.openModel = angular.element('#reconcileWarnModal');  
            }

            $scope.openModel.modal('show');
          })
          .error(function(err) {
            $scope.loader.show = false;
            delete $scope.param.file;
            $scope.tabs.makeDisable = false;
            angular.element("input[type='file']").val(null);
            angular.element("input[type='text']").val(null);
            if(err.msg == "error") {
              $scope.openModel = angular.element('#reconcileWarnModal');
              $scope.openModel.modal('show');
            }
            else {
              $scope.tabs.makeDisable = false;  
              notify({message: "Something went wrong" , classes:'alert-danger', duration:2000} );
            }
          })
        }
        else {
          $scope.loader.show = false;
          delete $scope.param.file;
          $scope.tabs.makeDisable = false;  
          notify({message:"Please select .csv/.xls/.xlsx file to upload",classes:'alert-danger',duration:2000} );
        }
      }
      else {
        $scope.loader.show = false;
        $scope.tabs.makeDisable = false;  
        notify({message:"First select the file to upload",classes:'alert-danger',duration:2000} );
      }
    }

   /*
   *@ update STC by upload reconcile file trans IDs
   */
    $scope.confirmReconciliation = function() {
        $scope.loader.show = true;
        $scope.tabs = {
          makeDisable : true
        };
        createSurvey.confirmForReconcile().then(
            function(success) {
                $scope.loader.show = false;
                $scope.tabs.makeDisable = false;              
                notify({message: "File upload Reconciliation done successfully", classes:'alert-success', duration:2000} );
            },
            function(error) {
                $scope.loader.show = false;
                $scope.tabs.makeDisable = false;  
                notify({message : err , classes:'alert-danger', duration:2000} );
            }
      );
    }

    /*
     *@ decline reconciliation
     */
    $scope.declineReconciliation = function(){
        $scope.loader.show = true;
       $scope.tabs = {
          makeDisable : true
        };
       createSurvey.declineReconciliationProcess().then(
           function(success){
              $scope.loader.show = false;
               notify({message: "You decline the reconciliation process", classes:'alert-success', duration:2000} );
               $scope.tabs.makeDisable = false;  
           },
           function(error){
              $scope.loader.show = false;
               notify({message : error , classes:'alert-danger', duration:2000} );
               $scope.tabs.makeDisable = false;  
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



    /*
    *Function to clone Live/Paused/close surveys : PD-709
    */
    $rootScope.checkLive_pus_Clone = false;
    $scope.cloneLiveSurvey = function(survey) {
     	  $rootScope.newId = survey.id;
      	$rootScope.clone = true;
        $rootScope.checkLive_pus_Clone = true;
      	$state.go('dynstate', {'id': 'CreateSurveys', 'locale':encodeDecodeFactory.encode(survey.locale)});
    }


     $scope.approveFlg;
    /*
    *Approve all function to reconcile previous month surveys
    */
    $scope.confirmReconciliationMonth = function() {
      $scope.loader.show = true;
      $scope.apprvObj = {
        "survey_id" : $scope.surveyDetails.id
      }
      if($scope.approveFlg == 1) {
        $scope.apprvObj["apprvFlg"] = 1;
      }
      if($scope.approveFlg == 2) {
        $scope.apprvObj["apprvFlg"] = 2;
      }
      createSurvey.approveReconciliationProcess($scope.apprvObj).then(
          function(success) {
            $scope.loader.show = false;  
             if($scope.approveFlg == 1) {
                $scope.availReconcileSurvey.recon_curnt = 0;
             }
             if($scope.approveFlg == 2) {
                 $scope.availReconcileSurvey.recon_pre = 0;
             }
             notify({message : success.data.success , classes:'alert-success', duration:2000} );
          },
          function(error) {
            $scope.loader.show = false;
            notify({message : error , classes:'alert-danger', duration:2000} );
          }
      );
    }


    $scope.getReconciliationCount = function(apprvFlg) {
      $scope.getCount = {};
      $scope.getCount['survey_id'] = $scope.surveyDetails.id;
      $scope.getCount['apprvFlg'] = apprvFlg;
      
      createSurvey.getReconcileCount($scope.getCount).then(
         function(success) {
            $scope.approveFlg = success.data.success.apprvFlg;
            $scope.completeTrans = success.data.success.completeTransList;
            $scope.rejectedTrans = success.data.success.rejectedTransList;
            $scope.statusChangeTrans = success.data.success.statusChangeList;

            $scope.openModel = angular.element('#reconcileApprvModal');
            $scope.openModel.modal('show');
         },
         function(error) {
            notify({message : error , classes:'alert-danger', duration:2000} );
         }
      );
    }
    
    //PD-821, 1100
    /*
    * Function to update all currently open Quota and maximum on basis Number/Percentage type
    */
    $scope.saveCurrentlyOpendata = function(survey_id) {
      $scope.loader.show = true;
      var selectedQuotaArray = [];
      _.each($scope.srvQtaMgeDetails.quotas, function(quotaDetails){
          var matchedQuotasList = _.filter(quotaDetails, function(filterQuota){
            return filterQuota.editCurrntTrgtActive === true;
          });
          if(matchedQuotasList.length > 0) {
            _.each(matchedQuotasList, function(matchList){
                selectedQuotaArray.push(matchList);
            });
          }
      });

      var matchedNestdQuotasList = _.filter($scope.srvQtaMgeDetails.nestedQuotas, function(filterNstQuota){
            return filterNstQuota.editCurrntTrgtActive === true;
          });

      //Handle Advance Targeting PD-1282
      if(_.has($scope.srvQtaMgeDetails, "advanceQuotas")) {
        _.each($scope.srvQtaMgeDetails.advanceQuotas, function(advanceQuota) {
            var findMatcheObject = _.findWhere(advanceQuota, {"editCurrntTrgtActive": true});
            if(findMatcheObject) {
               selectedQuotaArray.push(findMatcheObject);
            }
        })
      }

      //Handle Grouped Quota
      if(_.has($scope.srvQtaMgeDetails, "groupedCatQuotas")) {

        var finadGroupMtchObj = _.where($scope.srvQtaMgeDetails.groupedCatQuotas, {"editCurrntTrgtActive": true}); 
        if(finadGroupMtchObj.length > 0) {
          _.each(finadGroupMtchObj, function(selectedQuota) {
             selectedQuotaArray.push(selectedQuota); 
          })
        }
      }

      $scope.tabs.makeDisable = true;
      if($scope.editCurrentTarget.value && $scope.editCurrentTarget.type && survey_id) {
        var selectedQuotaObj = {
          "survey_id": survey_id,
          "curr_target": $scope.editCurrentTarget.value,
          "type": $scope.editCurrentTarget.type
        };

        if(selectedQuotaArray && matchedNestdQuotasList) {
          var mergedArray = _.union(matchedNestdQuotasList, selectedQuotaArray);
          if(mergedArray.length > 0) {
            selectedQuotaObj.quotas = mergedArray;
          }
        }
        if(selectedQuotaObj && (selectedQuotaObj.hasOwnProperty('quotas') && selectedQuotaObj.quotas.length > 0)) {

          selectedQuotaObj.editType = "groupEdit";
        }
        else {
          selectedQuotaObj.editType = "allEdit";
        }

        createSurvey.updateAllCurrentlyOpenQuota(selectedQuotaObj).then(
              function(updatedData) {
                  $scope.loader.show = false;
                  $scope.tabs.makeDisable = false;
                  $scope.srvQtaMgeDetails = updatedData.data.Quotas[0];
                  selectedQuotaObj = {};
                  selectedQuotaArrayLockUnlock = []
                  $scope.lockUnlockGroupStatus.fadeoptcitylock = false;//PD-1154
                  $scope.lockUnlockGroupStatus.groupLockUnlockStatus = false;
                  if(updatedData.data.msg && updatedData.data.msg != ''){
                    notify({message : updatedData.data.msg , classes:'alert-warning', duration:2000});
                  }
              },
              function(err) {
                $scope.loader.show = false;
                $scope.tabs.makeDisable = false;
                notify({message : err.data.msg , classes:'alert-danger', duration:2000});
              }
          );
      }
      else {
        $scope.loader.show = false;
        $scope.tabs.makeDisable = false;
        notify({message : "Enter currently Open quantity or percentage" , classes:'alert-danger', duration:2000} );
      }
    }
    
    //Check Group Lock/Unlock Quota PD-1100
    /* Function to maintain Selected Quota Array for Group Lock/Unlock
    *{@Parms} surveyID , quotaName(age, gender....etc.), unique_id(quey id) 
    */
    var selectedQuotaArrayLockUnlock = [];
    $scope.checkGroupLockUnlockQuotaStatus = function(survey_id, quotaName, unique_id) {
      var selectedQuotaArray = [];
      _.each($scope.srvQtaMgeDetails.quotas, function(quotaDetails){
          var matchedQuotasList = _.filter(quotaDetails, function(filterQuota){
            if(filterQuota.editCurrntTrgtActive === true && unique_id ==        filterQuota.unique_id) {
               filterQuota.quota = quotaName;
            }
            return filterQuota.editCurrntTrgtActive === true;
          });
          if(matchedQuotasList.length > 0) {
            _.each(matchedQuotasList, function(matchList){
                selectedQuotaArray.push(matchList);
            });
          }
      });

      var matchedNestdQuotasList = _.filter($scope.srvQtaMgeDetails.nestedQuotas, function(filterNstQuota){
            if(filterNstQuota.editCurrntTrgtActive === true && unique_id ==filterNstQuota.unique_id) {
               filterNstQuota.quota = quotaName;
            }
            return filterNstQuota.editCurrntTrgtActive === true;
      });
     
      //Handle Advance Targeting PD-1282
      if(_.has($scope.srvQtaMgeDetails, "advanceQuotas")) {
        _.each($scope.srvQtaMgeDetails.advanceQuotas, function(advanceQuota) {
            var findMatcheObject = _.findWhere(advanceQuota, {"editCurrntTrgtActive": true});
            if(findMatcheObject) {
               findMatcheObject.quota = quotaName;
               selectedQuotaArray.push(findMatcheObject);
            }
        })
      }

      //Handle Grouped Quota
      if(_.has($scope.srvQtaMgeDetails, "groupedCatQuotas")) {
        
        var finadGroupMtchObj = _.where($scope.srvQtaMgeDetails.groupedCatQuotas, {"editCurrntTrgtActive": true});
        if(finadGroupMtchObj.length > 0) {
          _.each(finadGroupMtchObj, function(selectedQuota) {
            selectedQuota.quota = quotaName;
              selectedQuotaArray.push(selectedQuota);
          })
        }

      }
      
      var mergedArray = _.union(matchedNestdQuotasList, selectedQuotaArray);
      selectedQuotaArrayLockUnlock = mergedArray; //Insert selected quota array 
      var handleAllUnlock = [];
      var handleAllLok = [];
      if(mergedArray.length > 0) {
          handleAllUnlock = _.filter(mergedArray, function(filterLockUnlock){
            return filterLockUnlock.locked === false;
          });

          handleAllLok = _.filter(mergedArray, function(filterLockUnlock){
            return filterLockUnlock.locked === true;
          });
      }
      
      if(handleAllUnlock.length === mergedArray.length) {
          $scope.lockUnlockGroupStatus.groupLockUnlockStatus = false;
          $scope.lockUnlockGroupStatus.fadeoptcitylock = true;//PD-1154
      }
      else if(handleAllUnlock.length > 0 && handleAllLok.length > 0) {
          $scope.lockUnlockGroupStatus.groupLockUnlockStatus = false;
          $scope.lockUnlockGroupStatus.fadeoptcitylock = true;//PD-1154
      }
      else {
        if(handleAllLok.length === mergedArray.length)
          $scope.lockUnlockGroupStatus.groupLockUnlockStatus = true;
      }
       
       //PD-1154
      if(handleAllUnlock.length === 0 && mergedArray.length === 0) {
        $scope.lockUnlockGroupStatus.fadeoptcitylock = false;
      }
    }

    /*Function to Lock/Unlock Group quota
    *{@params} survey_id Unique Id of survey
    */
    $scope.updateLockUnlockQuotaGroup = function(survey_id) {
      $scope.loader.show = true;
      $scope.tabs.makeDisable = true;
       if(selectedQuotaArrayLockUnlock.length > 0) {
        var updateObjData = {
           survey_id : survey_id,
           group_data : selectedQuotaArrayLockUnlock
        }
         if($scope.lockUnlockGroupStatus.groupLockUnlockStatus) {
            updateObjData.updateLock = false;
         }
         else {
            updateObjData.updateLock = true;
         }
         createSurvey.lockUnlockGroupQuota(updateObjData).then(
              function(updatedData) {
                  $scope.loader.show = false;
                  $scope.tabs.makeDisable = false;
                  $scope.srvQtaMgeDetails = updatedData.data.Quotas[0];
                  if(updatedData.data.msg && updatedData.data.msg != ''){
                    notify({message : updatedData.data.msg , classes:'alert-success', duration:2000});
                  }
                  $scope.lockUnlockGroupStatus.groupLockUnlockStatus = false;
                  selectedQuotaArrayLockUnlock = [];
                  $scope.lockUnlockGroupStatus.fadeoptcitylock = false;//PD-1154
              },
              function(err) {
                $scope.loader.show = false;
                $scope.tabs.makeDisable = false;
                notify({message : err.data.msg , classes:'alert-danger', duration:2000});
              }
          );
       }
       else {
        $scope.loader.show = false;
        $scope.tabs.makeDisable = false;
          notify({message : "Please Select the Quota to Lock/Unlock" , classes:'alert-warning', duration:2000});
       }
    }
    //Avoid to select row on click lock/unlock
    $scope.avoidClick = function( e ) { 
       e.stopPropagation();
    }
    $scope.openZipcodesGroupModal = function(srv_id, buyer_ziplist_ref, name){
      console.log('name ',name);
      $scope.loader.show = true;
      $scope.zipcodeDetails = {'zipcode': 'Loading...', 'groupNo':''};
      postCode.getZipcodes(srv_id, buyer_ziplist_ref).success(function(response){
        $scope.loader.show = false;
        if(response.apiStatus == 200 && response.result && response.result[0].values.length > 0){
          $timeout(function(){
            $scope.zipcodeDetails = {
              'zipcode': $filter('convertArrToStr')(response.result[0].values),
              'groupNo' : name
            }
          },100);
        }else{
          $scope.zipcodeDetails = {'zipcode': '', 'groupNo':''};
          notify({message : "No Zipcode Found" , classes:'alert-warning', duration:2000});
        }
      }).error(function(err){
          $scope.loader.show = false;
          $scope.zipcodeDetails = {'zipcode': '', 'groupNo':''};
          notify({message : "Unable to fetch zipcodes" , classes:'alert-warning', duration:2000});
      });
    }

    
    function extractAutoNestedQuota(autoNestedQuotas) {
        //console.log("autoNestedQuotas "+JSON.stringify(autoNestedQuotas));
        if (autoNestedQuotas.length > 0) {
            _.each(autoNestedQuotas, function(nestedQuotas) {
                if(nestedQuotas.combinedOptions && nestedQuotas.combinedOptions.length){
                    _.each(nestedQuotas.combinedOptions, function(singleOpt){
                        //check for duplicates
                        var existIndex = _.findIndex($scope.nestedQuotasQualName, {"quotaname": singleOpt.q_name, "qualID": singleOpt.q_id});
                        if(existIndex != -1){
                            if(singleOpt.id){
                                var idArr = $scope.nestedQuotasQualName[existIndex].id;
                                idArr.push(singleOpt.id);
                                $scope.nestedQuotasQualName[existIndex].id = _.sortBy(_.uniq(idArr));

                            }else if(singleOpt.from){
                                var fromArr = $scope.nestedQuotasQualName[existIndex].from;
                                fromArr.push(singleOpt.from);
                                $scope.nestedQuotasQualName[existIndex].from = _.sortBy(_.uniq(fromArr));
                            }
                        }else{
                            var nestedQualObj = {};
                            nestedQualObj['quotaname'] = singleOpt.q_name;
                            nestedQualObj['qualID'] = singleOpt.q_id;
                            if(singleOpt.id){
                                nestedQualObj['id'] = [singleOpt.id];
                            }else{
                                nestedQualObj['from'] = [singleOpt.from];
                            }
                            $scope.nestedQuotasQualName.push(nestedQualObj);
                        }
                    })
                }
            })
            $scope.nestedQuotasQualName.unshift({"quotaname":'all'});
        }
    } 

    $scope.filterNestedQuotaByQualification = function(sortQuotaDetail) {
       
       var tempNestedSortArr = [];
       if(_.has($scope.srvQtaMgeDetails, "nestedQuotas") && allCaseSortNestedQuota.length > 0 && sortQuotaDetail.quotaname != "all" && sortQuotaDetail.quotaname) {
        if(sortQuotaDetail.quotaname == "age" || sortQuotaDetail.quotaname == "houseHoldIncome" || sortQuotaDetail.quotaname == "child_age") {
            _.each(sortQuotaDetail.from, function(fromRange) {
                _.each(allCaseSortNestedQuota, function(nestedQuota) {
                    var matchQualId = _.findWhere(nestedQuota.combinedOptions, {"q_id": sortQuotaDetail.qualID, "from": fromRange});
                    if(matchQualId) {
                       tempNestedSortArr.push(nestedQuota);
                    }
                })
            })
        }
        else {
           _.each(sortQuotaDetail.id, function(quotaID) {
                _.each(allCaseSortNestedQuota, function(nestedQuota) {
                    var matchQualId = _.findWhere(nestedQuota.combinedOptions, {"q_id": sortQuotaDetail.qualID, "id": quotaID});
                    if(matchQualId) {
                       tempNestedSortArr.push(nestedQuota);
                    }
                })
            })
        }
         tempNestedSortArr = _.uniq(tempNestedSortArr);
         $scope.srvQtaMgeDetails.nestedQuotas = tempNestedSortArr;
       }
       else {
        
        if(allCaseSortNestedQuota.length > 0) {
          $scope.srvQtaMgeDetails.nestedQuotas = allCaseSortNestedQuota;
        }
       }

       $scope.defaultActiveNestedBtn = sortQuotaDetail.quotaname;
    }
    
    //PD-1332
    $scope.showAccordianQuota = {
      current: null
    };

    $scope.checkExpendStatus = function(event) {
      var checkCloseStatus = angular.element(event.currentTarget).hasClass('fa fa-chevron-down rotate down')
      if(checkCloseStatus) {
         $scope.showAccordianQuota.current = null;
      }
    }

    // get survey activity logs

    $scope.getActivityLogs = (surveyId) => {
      $scope.loader = {show: true};
      $scope.isExist = false;
      $scope.showActivities = [];
      createSurvey.getSurveyActivityLogs(surveyId).then((response) => {
        if (!_.isNull(response['data']) && !_.isEmpty(response['data'])){
          $scope.activities = response['data']['activities'];
          if ($scope.activities && $scope.activities.length) {
            angular.forEach($scope.activities, (activity) => {
              let activityDate = new Date(activity['timestamp']);
              let dateString = $filter('date')(activityDate, 'EEEE, MMMM d');
              let timeString = $filter('date')(activityDate, 'HH:mm');
              if (userData['operatorAcssLvls'] != 'none') {
                $scope.showActivities.push({
                  activityString: activity['username'] + ' ' + activity['message'],
                  timeString: dateString + ' @ ' + timeString
                });
              } else if (userData['buyerAcssLvls'] === 'admin') {
                if (activity['buyerAdmin']) {
                  $scope.showActivities.push({
                    activityString: activity['username'] + ' ' + activity['message'],
                    timeString: dateString + ' @ ' + timeString
                  });
                }
              } else if (userData['buyerAcssLvls'] === 'full' && activity['buyerFull'] && userData['eml'] === activity['user_email']) {
                $scope.showActivities.push({
                  activityString: activity['username'] + ' ' + activity['message'],
                  timeString: dateString + '@' + timeString
                });

              }
            });
            
            if ($scope.showActivities.length) {
              $scope.isExist = true;
            }
          }
         
        } 
          $scope.loader = {show: false};
        
      }, (error) => {
        $scope.loader = {show: false};
        console.log("error : ", error);
      })
    }



    // add activity notes

    $scope.addActivityNotes = () => {
      $scope.showActivtityInputBox = true;
    }
    $scope.cancelAcitivityNotes = () => {
      $scope.showActivtityInputBox = false;
    }

    // save activity notes

    $scope.saveAcitivityNotes = (survey_id, msg) => {
      let timestamp = Date.now();
      let activityPayload = {
        survey_id: survey_id,
        user_id: userData['id'],
        user_email: userData['eml'],
        username: userData['usrName'],
        message: 'has added ' + msg,
        type: 'Manual Edit',
        timestamp: timestamp,
        isExpire: false,
        eventHandler: 'user',
        userCmp: userData['cmp'],
        isVisible: true,
        operatorAccess: true,
        buyerAdmin: false,
        buyerFull: false

      };
      createSurvey.addActivityNote(activityPayload).then((response) => {
  
      $scope.showActivtityInputBox = false;
      let activityDate = new Date(timestamp);
      let dateString = $filter('date')(activityDate, 'EEEE, MMMM d');
      let timeString = $filter('date')(activityDate, 'HH:mm');
      $scope.showActivities.unshift({
        activityString: activityPayload['username'] + ' ' + activityPayload['message'],
        timeString: dateString + ' @ ' + timeString
      });
      if ($scope.showActivities.length) {
        $scope.isExist = true;
      }
      },(error) => {
        console.log("error : ", error);
        $scope.showActivtityInputBox = false;
      })
    }


    function setLocationViews(countryCode) {
        var locationViews = {
            "US" :{
                "netrep": {
                    "name":"Nat Rep",
                    "isVisible":true,
                },
                "region": {
                    "name":"Census Region",
                    "isVisible":true,
                },
                "regions": {
                    "name":"Census Region",
                    "isVisible":true,
                },
                "division": {
                    "name":"Census Division",
                    "isVisible":true,
                },
                "divisions": {
                    "name":"Census Division",
                    "isVisible":true,
                },
                "state": {
                    "name":"State",
                    "isVisible":true,
                },
                "states": {
                    "name":"State",
                    "isVisible":true,
                },
                "dma": {
                    "name":"DMA",
                    "isVisible":true,
                },
                "csa": {
                    "name":"CSA",
                    "isVisible":true,
                },
                "msa": {
                    "name":"MSA",
                    "isVisible":true,
                },
                "county": {
                    "name":"County",
                    "isVisible":true,
                },
                "zipcode": {
                    "name":"Zipcode",
                    "isVisible":true,
                },
                "zipcodes": {
                    "name":"Zipcode",
                    "isVisible":true,
                }
            },
            "CA" :{
                "netrep": {
                    "name":"Nat Rep",
                    "isVisible":false,
                },
                "region": {
                    "name":"Census Region",
                    "isVisible":false,
                },
                "regions": {
                    "name":"Census Region",
                    "isVisible":false,
                },
                "state": {
                    "name":"Province",
                    "isVisible":true,
                },
                "states": {
                    "name":"Province",
                    "isVisible":true,
                },
                "zipcode": {
                    "name":"Postal Codes",
                    "isVisible":true,
                },
                "zipcodes": {
                    "name":"Postal Codes",
                    "isVisible":true,
                }
            },
            "IN" :{
                "netrep": {
                    "name":"Nat Rep",
                    "isVisible":false,
                },
                "state": {
                    "name":"State",
                    "isVisible":true,
                },
                "states": {
                    "name":"State",
                    "isVisible":true,
                },
                "zipcode": {
                    "name":"Pin Codes",
                    "isVisible":true,
                },
                "zipcodes": {
                    "name":"Pin Codes",
                    "isVisible":true,
                },
                "dma": {
                    "name":"District",
                    "isVisible":true,
                }
            },
            "UK" :{
                "netrep": {
                    "name":"Nat Rep",
                    "isVisible":false,
                },
                "regions": {
                    "name":"UK Region",
                    "isVisible":true,
                },
                "state": {
                    "name":"State",
                    "isVisible":false,
                },
                "zipcode": {
                    "name":"Postcodes",
                    "isVisible":true,
                },
                "zipcodes": {
                    "name":"Postcodes",
                    "isVisible":true,
                },
                "dma": {
                    "name":"District",
                    "isVisible":false,
                }
            }
        };
        $scope.locationViews = locationViews[countryCode];
    }

    $scope.getLocName = function(locName){
      return $scope.locationViews[locName].name;
    }

}]);
