


angular.module('pureSpectrumApp')
    .controller('suppliersCntrl',['$scope','$http','$state','localStorageService','user','notify','supplierService','createSurvey','ngProgressLite','companyService','buyerService', function($scope, $http, $state, localStorageService, user, notify, supplierService, createSurvey, ngProgressLite, companyService, buyerService){
        
        $scope.show=false;
        $scope.showCreate = false;
        $scope.dsboardLink=[];
        var userData = localStorageService.get('logedInUser');
        showDataOnDashboard();
        getCompanyDetails();
        getSuppliers(userData.cmp);

        $scope.suppliers = [];
        $scope.supplierTypes = {
            preferredTypes: [],
            blockedTypes: []
        };

        function checkAccessByRole(cmpInfo){
           if(cmpInfo.isABuyer || cmpInfo.isASupplier || cmpInfo.isAnOperator){
               if(cmpInfo.isAnOperator==true){
                   $scope.ManageCmpLink=true;
               }
               else{
                   $scope.ManageCmpLink=false;
               }
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
                                       "featureLabel":dataEtnl.Entitlement[i].featureLabel
                                   });
                               }
                           }

                           if(dataEtnl.Entitlement[i].featureKey == 'ManageSupplierSettings' ){
                               if(dataEtnl.Entitlement[i].supplier.admin || dataEtnl.Entitlement[i].supplier.full) {
                                   $scope.dsboardLink.push({
                                       "featureName": dataEtnl.Entitlement[i].featureName,
                                       "featureKey": dataEtnl.Entitlement[i].featureKey,
                                       "featureLabel":dataEtnl.Entitlement[i].featureLabel
                                   });
                               }
                           }

                           if(dataEtnl.Entitlement[i].featureKey == 'manageSurveys' ){
                               if(dataEtnl.Entitlement[i].buyer.limited ) {
                                   // getSurveyesDetails();
                                   $scope.showManageSurvey  = true;
                                   $scope.hideManageSurvey = true;
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
               })
           }
        }


        function showDataOnDashboard(){
            var user=localStorageService.get('logedInUser');
            var access=localStorageService.get('accessRole');
            $scope.userName=user.usrName;
            $scope.buyer=user.buyerAcssLvls;
            $scope.supplier=user.supplierAcssLvls;
            $scope.operator=user.operatorAcssLvls;

            if(!access){
                $scope.buyerrole='none';
                $scope.supplierrole='none';
            }
            else{

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

        /*$scope.logout=function(event){
            ngProgressLite.start();
            event.preventDefault();
            user.logoutUser(userData.id).success(function (data) {
                ngProgressLite.done();
                localStorageService.clearAll();
                sessionStorage.removeItem("token");
                window.location.reload();

            }).error(function (err) {
                notify({message:'Error in logout',classes:'alert-danger',duration:2000} );
            })

        }*/

        function getSuppliers(id) {
            ngProgressLite.start();
            supplierService.getAllSuppliersData(id).success(function (data) {
                ngProgressLite.done();
                $scope.suppliers = data.supplierList;
                  /*buyerService.getAllBlockedBuyers().success(function(blcokedBuyers){
                      $scope.blockedBuyList = blcokedBuyers.buyer;
                      //console.log(JSON.stringify($scope.blockedBuyList));
                      for(var i in $scope.suppliers){
                            if($scope.suppliers[i].id == $scope.blockedBuyList.supplierId){
                                for (var j in $scope.blockedBuyList.buyerList){
                                  if(userData.cmp == $scope.blockedBuyList.buyerList[j].buyerId){
                                    $scope.suppliers.splice(i, 1);
                                    //console.log('in');
                                  }
                                }
                            }
                      }
                  }).error(function(err){
                      notify({message:err.msg,classes:'alert-danger',duration:3000} );
                  })*/
                for(var i=0; i<data.supplierList.length; i++) {
                    if(data.supplierList[i].supplrSt != undefined && data.supplierList[i].supplrSt != null) {
                        if(data.supplierList[i].supplrSt == "P") {
                            $scope.supplierTypes.preferredTypes[i] = true;
                            $scope.supplierTypes.blockedTypes[i] = false; 
                        }else if(data.supplierList[i].supplrSt == "B") {
                            $scope.supplierTypes.preferredTypes[i] = false;
                            $scope.supplierTypes.blockedTypes[i] = true; 
                        }else {
                            $scope.supplierTypes.blockedTypes[i] = false;
                            $scope.supplierTypes.preferredTypes[i] = false;
                        }
                    }
                }
            }).error(function (err) {
                notify({message:err.msg,classes:'alert-danger',duration:3000} );
            })
        }

        $scope.setPreffered = function(index) {
            if($scope.supplierTypes.preferredTypes[index]) {
                $scope.suppliers[index].supplrSt = "P";
                $scope.supplierTypes.blockedTypes[index] = false;
            }else {
                $scope.suppliers[index].supplrSt = "";
            }
        };

        $scope.setBlocked = function(index) {
            if($scope.supplierTypes.blockedTypes[index]) {
                $scope.suppliers[index].supplrSt = "B";
                $scope.supplierTypes.preferredTypes[index] = false;
            }else {
                $scope.suppliers[index].supplrSt = "";
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
            })
        }

        $scope.saveSuppliers = function() {
            var postObj = {
                companyId: userData.cmp,
                supplierList: []
            };
            for(var i=0; i<$scope.suppliers.length; i++) {
                if($scope.suppliers[i].supplrSt != undefined && $scope.suppliers[i].supplrSt != null && $scope.suppliers[i].supplrSt != "") {
                    if($scope.suppliers[i].supplrSt == "P") {
                        postObj.supplierList.push({
                            supplierId: $scope.suppliers[i].id,
                            supplierStatus: "P"
                        });
                    }else if($scope.suppliers[i].supplrSt == "B") {
                        postObj.supplierList.push({
                            supplierId: $scope.suppliers[i].id,
                            supplierStatus: "B"
                        });
                    }
                }
            }

            supplierService.setPrfBlkSuppliers(postObj).success(function(data){
                notify({message:"Suppliers Status saved successfully",classes:'alert-success',duration:3000} );
            })
            .error(function(error){
                notify({message:error.msg,classes:'alert-danger',duration:3000} );
            });
        };

        $scope.bckDashboard = function() {
            $state.go('home');
        };


    }]);

