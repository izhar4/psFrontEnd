angular.module('pureSpectrumApp')
    .controller('manageUserCtrl',['$scope', '$http', '$state', '$timeout', 'localStorageService','user','notify', 'companyService', 'createSurvey', 'ngProgressLite', '$rootScope', 'config', '$stateParams', function($scope, $http, $state, $timeout, localStorageService, user, notify, companyService, createSurvey, ngProgressLite, $rootScope, config, $stateParams){
            $scope.show=false;
            $rootScope.showCreate = false;
            $rootScope.dsboardLink=[];
            $scope.allSurveySearch = "";
            $scope.isCompanyDisabled = false;
            $scope.isOperatorDisabled = false;
            $scope.isSupplierDisabled = false;
            $scope.isBuyerDisabled = false;
            $scope.userDetails ={};
            $scope.shUpdate=false;
            $scope.shDelete=false;
            $scope.shSave=true;
            var userData = localStorageService.get('logedInUser');
            getCompanyDetails();
            getUsersDetails();
            


            
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
                                       $rootScope.showCreate = true;
               $scope.showManageSurvey  = false;
                                   }
                                   else {
                                       $rootScope.showCreate = false;
                                   }
                               }
                               if(dataEtnl.Entitlement[i].featureKey == 'manageCompanies' ){
                                   if (dataEtnl.Entitlement[i].operator.admin == true || dataEtnl.Entitlement[i].operator.full == true){
                                       $rootScope.dsboardLink.push({
                                           "featureName":dataEtnl.Entitlement[i].featureName,
                                           "featureKey":dataEtnl.Entitlement[i].featureKey,
                                           "featureLabel":dataEtnl.Entitlement[i].featureLabel
                                       });
                                   }
             $scope.showManageSurvey  = false;
                               }
                               if(dataEtnl.Entitlement[i].featureKey == 'manageSuppliers'){
                                   if(dataEtnl.Entitlement[i].buyer.admin == true){
                                       $rootScope.dsboardLink.push({
                                           "featureName":dataEtnl.Entitlement[i].featureName,
                                           "featureKey":dataEtnl.Entitlement[i].featureKey,
                                           "featureLabel":dataEtnl.Entitlement[i].featureLabel
                                       });
                                   }
            $scope.showManageSurvey  = false;
                               }
                               if(dataEtnl.Entitlement[i].featureKey == 'manageUsers' ){
                                   if (dataEtnl.Entitlement[i].operator.admin == true){
                                       $rootScope.dsboardLink.push({
                                           "featureName":dataEtnl.Entitlement[i].featureName,
                                           "featureKey":dataEtnl.Entitlement[i].featureKey,
                                           "featureLabel":dataEtnl.Entitlement[i].featureLabel
                                       });
                                   }
                               }
                               if(dataEtnl.Entitlement[i].featureKey == 'ManageSupplierPricingCard' ){
                                   if(dataEtnl.Entitlement[i].supplier.admin || dataEtnl.Entitlement[i].supplier.full) {
                                       $rootScope.dsboardLink.push({
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
                           //showDataOnDashboard();
                       }
                   }).error(function (err) {
                       notify({message:err.error,classes:'alert-danger',duration:2000} );
                   })
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

           function getUsersDetails(){
                  user.getUserData().success(function (data) {
                      if(data.companies){
                          $scope.users = data.companies;
                         companyService.getAllCompaniesData().success(function (data) {
                  if(data.companies){
                       $scope.companies = data.companies;
                  }
                  
              }).error(function (err) {
                  notify({message:'Error in Company',classes:'alert-danger',duration:2000} );
              });
                      }
                  }).error(function (err) {
                      notify({message:err.msg,classes:'alert-danger',duration:2000} );
                  })
          }
  
            /*****************updated company flag dropdown****/
            $scope.updateLevelDropdown = function (id) {
              $scope.isOperatorDisabled = false;
              $scope.isSupplierDisabled = false;
              $scope.isBuyerDisabled = false;
              for(var i in $scope.companies){
                  if($scope.companies[i].id == id){
                    if($scope.companies[i].isAnOperator == false)
                         $scope.isOperatorDisabled = true;
                     if($scope.companies[i].isASupplier == false)
                         $scope.isSupplierDisabled = true;
                      if($scope.companies[i].isABuyer == false)
                         $scope.isBuyerDisabled = true;
                      break;
                  }
               }
            }
      
            $scope.fetchUserData= function (data) {

                $scope.userDetails=angular.copy(data);
                $scope.shDelete=true;
                $scope.shUpdate=true;
                $scope.shSave=false;
            }
  
            /**************** Clear user form *******************/
            $scope.clearUserDetail = function (userData) {
                $scope.userDetails={};
                $scope.isOperatorDisabled = false;
                $scope.isSupplierDisabled = false;
                $scope.isBuyerDisabled = false;
                $scope.isCompanyDisabled = false;
            }

        /*************** creating new user ****************************/
      
        
        $scope.saveUserDetails = function (cmpData) 
    {
          
            ngProgressLite.start();
             if($scope.userDetails.email == undefined || $scope.userDetails.email == null || $scope.userDetails.email == "") {
                notify({message: 'Please Enter the User Id', classes:'alert-danger',duration:3000} );
                return false;
            }

            if($scope.userDetails.name == undefined || $scope.userDetails.name == null || $scope.userDetails.name == "") {
                notify({message: 'Please Enter the Name', classes:'alert-danger',duration:3000} );
                return false;
            }

            if($scope.userDetails.company == undefined || $scope.userDetails.company == null || $scope.userDetails.company == "") {
                notify({message: 'Please Select the Company', classes:'alert-danger',duration:3000} );
                return false;
            }
            if(cmpData.id == undefined)
            {

              if($scope.userDetails.password == undefined || $scope.userDetails.password == null || $scope.userDetails.password == "") {
                  notify({message: 'Please Enter the Password', classes:'alert-danger',duration:3000} );
                  return false;
              }
            }
             
             
             
                  var count ='';
            for(var i in $scope.companies)
            {
              if($scope.companies[i].id == cmpData.company)
              {
                count=i;
                break;
                
              }
            }

            if($scope.companies[count].isABuyer == false)
                    cmpData.buyerSideAccessLevels = "none";
                  else
                  {
                    if( $scope.userDetails.buyerSideAccessLevels == null || $scope.userDetails.buyerSideAccessLevels == "") {
                notify({message: 'Please Select the  Buyer Access Leve', classes:'alert-danger',duration:3000} );
                return false;
            }
                  }

            if($scope.companies[count].isASupplier == false)
                    cmpData.supplierSideAccessLevels = "none";
                  else
                  {
                    if( $scope.userDetails.supplierSideAccessLevels == null || $scope.userDetails.supplierSideAccessLevels == "") {
              
                cmpData.supplierSideAccessLevels = "none";
            }
                  }

            if($scope.companies[count].isAnOperator == false)
                    cmpData.operatorAccessLevels = "none";
              else
              {
                if( $scope.userDetails.operatorAccessLevels == null || $scope.userDetails.operatorAccessLevels == "") {
              
                cmpData.operatorAccessLevels = "none";
            }
              }
                


            if(cmpData.id != undefined)
            {   

                 if(cmpData.status =='Active')
                    cmpData.status =1;
                else
                    cmpData.status =2;
              user.updateUserDetails(cmpData).success(function (data) {
                ngProgressLite.done();
                notify({message:data.msg,classes:'alert-success',duration:3000} );
                getUsersDetails();
                 $scope.userDetails={};

                }).error(function (err) {
                 notify({message:err.msg,classes:'alert-danger',duration:3000} );
                });
                

            }
            else
            {
              user.saveUserDetails(cmpData).success(function (data) {
                ngProgressLite.done();
                notify({message:data.msg,classes:'alert-success',duration:3000} );
                getUsersDetails();
                $scope.userDetails={};
                }).error(function (err) {
                 notify({message:err.msg,classes:'alert-danger',duration:3000} );
                });

            }

            
            
        }

/*******************/

        $scope.toUpdate = {
          id: "",
          encId: "",
          status: "",
          name:""
        };
        $scope.statusUpdateMsg = "";
        $scope.showSuccessMessage = false;

        /*----------Put Survey Data in Survey Status Change Modal------*/
        $scope.openStatusModal = function(id, encId, status) {
          $scope.statusUpdateMsg = "";
          $scope.showSuccessMessage = false;

          $scope.toUpdate.id =id;
          $scope.toUpdate.encId =encId;
          $scope.toUpdate.status =status;
        };

        /*----------Put User Data in User Status Change Modal------*/
        $scope.openUserStatusModal = function(id, name, status) {
          $scope.statusUpdateMsg = "";
          $scope.showSuccessMessage = false;

          $scope.toUpdate.id =id;
            $scope.toUpdate.name =name;
          $scope.toUpdate.status =status;
        };

         /*---------Updates user Status in Table after change-------*/
        $scope.updateUserStatus = function(){
          user.updateStatus($scope.toUpdate.id, $scope.toUpdate).success(function (data){
             if(data.apiStatus == "success"){
                $scope.showSuccessMessage = true;
                $scope.statusUpdateMsg = " "+$scope.toUpdate.name+" is in "+$scope.toUpdate.status+" state.";
                getUsersDetails();
                $timeout(function(){
                  $("#status-change-modal .close").trigger("click");
                },3000);
              }
            }).error(function (err) {
               notify({message:err.msg,classes:'alert-danger',duration:2000} );
           });
        };

            /*--------Open Survey Details------*/
            $scope.openUserDetails = function(user){
              $scope.showUserDetails = true;
              $scope.isCompanyDisabled = true;
              $scope.userDetails = user;
              $scope.isOperatorDisabled = false;
              $scope.isSupplierDisabled = false;
              $scope.isBuyerDisabled = false;
                for(var i in $scope.companies){
                  if($scope.companies[i].id == user.company){
                    if($scope.companies[i].isAnOperator == false){
                      $scope.isOperatorDisabled = true;
                    }
                    if($scope.companies[i].isASupplier == false){
                      $scope.isSupplierDisabled = true;
                    }
                    if($scope.companies[i].isABuyer == false){
                      $scope.isBuyerDisabled = true;
                    }
                    break;
                }
              }
            };

    }]);
