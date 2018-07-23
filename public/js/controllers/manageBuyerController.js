angular.module('pureSpectrumApp')
    .controller('manageBuyerCntrl',['$scope','$http','$state','localStorageService','user','notify','supplierService','createSurvey','ngProgressLite','companyService','commonApi','$rootScope','buyerService', function($scope, $http, $state, localStorageService, user, notify, supplierService, createSurvey, ngProgressLite, companyService, commonApi, $rootScope, buyerService){

        $scope.show=false;
        $scope.showCreate = false;
        $scope.dsboardLink = [];
        $scope.buyers = [];
        $scope.blockedBuyList = [];

        var userData = localStorageService.get('logedInUser');

        showDataOnDashboard();
        getCompanyDetails();
        getBuyers();
        

        function checkAccessByRole(cmpInfo) {
           if(cmpInfo.isABuyer || cmpInfo.isASupplier || cmpInfo.isAnOperator) {
               $scope.ManageCmpLink = (cmpInfo.isAnOperator == true) ? cmpInfo.isAnOperator : false;

               user.checkAccess(userData.buyerAcssLvls, userData.supplierAcssLvls, userData.operatorAcssLvls).success(function(dataEtnl){
                   if(dataEtnl.Entitlement){
                       for(var i in dataEtnl.Entitlement){
                           if(dataEtnl.Entitlement[i].featureKey == 'CreateSurveys') {
                               if (dataEtnl.Entitlement[i].buyer.admin == true || dataEtnl.Entitlement[i].buyer.full == true) {
                                   $scope.showCreate = true;
                                        $scope.showManageSurvey  = false;
                               }
                               else {
                                   $scope.showCreate = false;
                               }
                           }
                           if(dataEtnl.Entitlement[i].featureKey == 'manageCompanies' ){
                               if (dataEtnl.Entitlement[i].operator.admin == true || dataEtnl.Entitlement[i].operator.full == true){
                                   $scope.dsboardLink.push({
                                       "featureName":dataEtnl.Entitlement[i].featureName,
                                       "featureKey":dataEtnl.Entitlement[i].featureKey,
                                       "featureLabel":dataEtnl.Entitlement[i].featureLabel
                                   });
                               }
                                $scope.showManageSurvey  = false;
                           }
                           if(dataEtnl.Entitlement[i].featureKey == 'manageSuppliers'){
                               if(dataEtnl.Entitlement[i].buyer.admin == true){
                                   $scope.dsboardLink.push({
                                       "featureName":dataEtnl.Entitlement[i].featureName,
                                       "featureKey":dataEtnl.Entitlement[i].featureKey,
                                       "featureLabel":dataEtnl.Entitlement[i].featureLabel
                                   });
                               }
                                $scope.showManageSurvey  = false;
                           }
                           if(dataEtnl.Entitlement[i].featureKey == 'manageUsers' ){
                               if (dataEtnl.Entitlement[i].operator.admin == true){
                                   $scope.dsboardLink.push({
                                       "featureName":dataEtnl.Entitlement[i].featureName,
                                       "featureKey":dataEtnl.Entitlement[i].featureKey,
                                       "featureLabel":dataEtnl.Entitlement[i].featureLabel
                                   });
                               }
                           }
                           if(dataEtnl.Entitlement[i].featureKey == 'ManageSupplierPricingCard' ){
                               if(dataEtnl.Entitlement[i].supplier.admin || dataEtnl.Entitlement[i].supplier.full) {
                                   $scope.dsboardLink.push({
                                       "featureName": dataEtnl.Entitlement[i].featureName,
                                       "featureKey": dataEtnl.Entitlement[i].featureKey,
                                       "featureLabel": dataEtnl.Entitlement[i].featureLabel
                                   });
                               }
                           }
                           if(dataEtnl.Entitlement[i].featureKey == 'ManageSupplierSettings' ){
                               if(dataEtnl.Entitlement[i].supplier.admin || dataEtnl.Entitlement[i].supplier.full) {
                                   $scope.dsboardLink.push({
                                       "featureName": dataEtnl.Entitlement[i].featureName,
                                       "featureKey": dataEtnl.Entitlement[i].featureKey,
                                       "featureLabel": dataEtnl.Entitlement[i].featureLabel
                                   });
                               }
                           }
                           if(dataEtnl.Entitlement[i].featureKey == 'manageBuyers'){
                               if (dataEtnl.Entitlement[i].supplier.admin || dataEtnl.Entitlement[i].supplier.full){
                                   $scope.dsboardLink.push({
                                       "featureName":dataEtnl.Entitlement[i].featureName,
                                       "featureKey":dataEtnl.Entitlement[i].featureKey,
                                       "featureLabel":dataEtnl.Entitlement[i].featureLabel
                                   });
                               }
                            }
                           if(dataEtnl.Entitlement[i].featureKey == 'manageSurveys' ){
                               if(dataEtnl.Entitlement[i].buyer.limited ) {
                                   $scope.showManageSurvey  = true;
                                   $scope.hideManageSurvey = true;
                               }
                           }
                           if(dataEtnl.Entitlement[i].featureKey == 'downloadReports' ){
                                if(dataEtnl.Entitlement[i].supplier.admin || dataEtnl.Entitlement[i].supplier.full){
                             
                                  $scope.dsboardLink.push({
                                    "featureName":dataEtnl.Entitlement[i].featureName,
                                    "featureKey":dataEtnl.Entitlement[i].featureKey,
                                    "featureLabel":dataEtnl.Entitlement[i].featureLabel
                                  });
                                }
                              }
                           if(dataEtnl.Entitlement[i].supplier.admin == true || dataEtnl.Entitlement[i].supplier.full == true || dataEtnl.Entitlement[i].supplier.limited == true ) {
                                $scope.showManageSurvey  = true;
                                $scope.hideManageSurvey = false;
                                $scope.filterCompanyDetail = true;
                                $scope.hideStatusEdit = true;
                           }
                       }
                       localStorageService.set('accessRole',dataEtnl.Entitlement[0]);
                       showDataOnDashboard();
                   }
               }).error(function (err) {
                   notify({message:err.error,classes:'alert-danger',duration:2000} );
               });
           }
        }

        function showDataOnDashboard(){
            var user=localStorageService.get('logedInUser');
            var access=localStorageService.get('accessRole');

            $scope.userName = user.usrName;
            $scope.buyer = user.buyerAcssLvls;
            $scope.supplier = user.supplierAcssLvls;
            $scope.operator = user.operatorAcssLvls;

            if(!access) {
                $scope.buyerrole='none';
                $scope.supplierrole='none';
            }
            else {
                if(access &&access.buyer.full==true){
                    $scope.buyerrole='full';
                }
                else{
                    $scope.buyerrole='none';
                }
                if(access.buyer.admin==true){
                    $scope.buyerrole='admin';
                }
                else{
                    $scope.buyerrole='none';
                }

                if(access.buyer.limited==true){
                    $scope.buyerrole='limited';
                }
                else{
                    $scope.buyerrole='none';
                }

                if(access.supplier.full==true){
                    $scope.supplierrole='full';
                }
                else{
                    $scope.supplierrole='none';
                }
                if(access.supplier.admin==true){
                    $scope.supplierrole='admin';
                }
                else{
                    $scope.supplierrole='none';
                }
                if(access.supplier.limited==true){
                    $scope.supplierrole='limited';
                }
                else{
                    $scope.supplierrole='none';
                }
            }
        }

        function getBuyers() {
            ngProgressLite.start();
            commonApi.getBuyerCounterParty().success(function (data) {
                $scope.buyers = data.company;
                buyerService.getBlockedBuyer(userData.cmp).success(function(list){
                    ngProgressLite.done();

                    if(list.hasOwnProperty('buyer') && list.buyer.hasOwnProperty('buyerList')) {
                        $scope.blockedBuyList = list.buyer.buyerList;
                        for(var i in $scope.buyers){
                            for(var j in $scope.blockedBuyList){
                                if($scope.buyers[i].id == $scope.blockedBuyList[j].buyerId){
                                    $scope.buyers[i].buyerSt = $scope.blockedBuyList[j].buyerStatus;
                                    $scope.buyers[i].blocked = true;
                                }
                            }
                        }
                    }
                }).error(function(err){
                    notify({message:err.msg,classes:'alert-danger',duration:3000} );
                })
            }).error(function (err) {
                notify({message:err.msg,classes:'alert-danger',duration:3000} );
            });
        }
        
        $scope.setBuyerBlocked = function(index) {
            if($scope.buyers[index].blocked) {
                $scope.buyers[index].buyerSt = "B";
                $scope.buyers[index].blocked = true;
            }else {
                $scope.buyers[index].buyerSt = "";
                $scope.buyers[index].blocked = false;
            }
        };

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
            });
        }

        $scope.saveBuyers = function() {
            var postObj = {
                supplierId: userData.cmp,
                buyerList: []
            };

            for(var i = 0; i < $scope.buyers.length; i++) {
                if($scope.buyers[i].buyerSt != undefined && $scope.buyers[i].buyerSt != null && $scope.buyers[i].buyerSt != "") {
                    if($scope.buyers[i].buyerSt == "B") {
                        postObj.buyerList.push({
                            buyerId: $scope.buyers[i].id,
                            buyerStatus: "B"
                        });
                    }
                }
            }

            buyerService.updateBlockedBuyers(postObj).success(function(data){
                notify({message:"Buyer Status saved successfully",classes:'alert-success',duration:3000} );
            })
            .error(function(error){
                notify({message:error.msg,classes:'alert-danger',duration:3000} );
            });
        };

        $scope.bckDashboard = function() {
            $state.go('home');
        };

    }]);

