/**
 * Created by Parveen on 3/9/2016.
 */

angular.module('pureSpectrumApp')

    .controller('priceCardCtrl',['$scope','$http','$state','$cookies','$window','config','localStorageService','pricingService','notify','commonApi' ,'ngProgressLite', '$parse','$rootScope','user',function($scope, $http, $state, $cookies, $window, config, localStorageService, pricingService, notify, commonApi, ngProgressLite, $parse,$rootScope,user){

        $scope.priceCardObj={};
        $scope.dataAll={};
        var cntId = config.countryDefault;
        var lngId = config.languageDefault;
        $scope.deactivateObj = {};
        
        var userInfo= localStorageService.get('logedInUser');
          $rootScope.userEmail=userInfo.eml;
        $scope.priceCardObj.usr_id=userInfo.id;
        $scope.buyerCombo=[
            {
                name: "All",
                id: 0
            }
        ];
        setCountry();
       
        $scope.cntryMaster=[];
        setBuyerCounterParty();
        $scope.lng = 'English';
        $scope.cntry='United States';
        $scope.byrOp='All';
        showLanguagesInCombo();
        $scope.tab = 2;

        $scope.dataAll.country = cntId;
        $scope.dataAll.language = lngId;
        $scope.dataAll.buyerCounterParty = 0;
        getSupplierInfo($scope.dataAll.language, $scope.dataAll.country, $scope.dataAll.buyerCounterParty);


        $scope.getCountry = function(data){
            $scope.dataAll.country=data.id;
            $scope.cntry = data.name;
            getSupplierInfo($scope.dataAll.language, $scope.dataAll.country, 0);
            commonApi.getLanguageByCountry(data.id).success(function (data) {
                $scope.lngMaster=[];
                if(data.languages!=null) {
                    $scope.lngMaster = data.languages;
                    $scope.lng = data.languages[0].name;
                }
            }).error(function (err) {
                notify({message:err.msg,classes:'alert-danger',duration:2000} );
            })
        }

        $scope.getLanguage = function(data){
            $scope.dataAll.language=data.id;
            $scope.lng = data.name;
            getSupplierInfo($scope.dataAll.language, $scope.dataAll.country, $scope.dataAll.buyerCounterParty);
        }

        $scope.getBuyerCounterparty = function(data){
            $scope.dataAll.buyerCounterParty=data.id;
            $scope.byrOp = data.name;
            //getCombinationPriceCard();
            getSupplierInfo($scope.dataAll.language, $scope.dataAll.country, $scope.dataAll.buyerCounterParty);
        }


        function setCountry(){
            ngProgressLite.start();
            commonApi.countries().success(function (data) {
                ngProgressLite.done();
                if(data.countries!=null) {
                    $scope.cntryMaster = data.countries.values;
                }
            }).error(function (err) {
                notify({message:err.msg,classes:'alert-danger',duration:2000} );
            })
        }

        function setBuyerCounterParty(){
            ngProgressLite.start();
            commonApi.getBuyerCounterParty().success(function (data) {
                ngProgressLite.done();
                //$scope.buyerCombo=data.company;
                for (var i = 0; i < data.company.length; i++) {
                    $scope.buyerCombo.push(data.company[i]);
                };
            }).error(function (err) {
                notify({message:err.msg,classes:'alert-danger',duration:2000} );
            })
        }

        $scope.savePricingCardData = function(){
            ngProgressLite.start();

            if(! $scope.dataAll.language ){
                $scope.priceCardObj.language= lngId;
            }
            else{
                $scope.priceCardObj.language=$scope.dataAll.language;
            }
            if(! $scope.dataAll.country){
                $scope.priceCardObj.country= cntId;
            }
            else{
                $scope.priceCardObj.country=$scope.dataAll.country;
            }
            if(! $scope.dataAll.buyerCounterParty){
                $scope.priceCardObj.buyerCounterParty=0;
            }
            else{
                $scope.priceCardObj.buyerCounterParty=$scope.dataAll.buyerCounterParty;
            }
            $scope.priceCardObj.company=userInfo.cmp;
            $scope.priceCardObj.userId=userInfo.id;

            pricingService.addPriceCard($scope.priceCardObj).success(function(data){
                ngProgressLite.done();
                notify({message:'Price card information has been saved successfully',classes:'alert-success',duration:2000} );
                getSupplierInfo($scope.priceCardObj.language, $scope.priceCardObj.country, $scope.priceCardObj.buyerCounterParty);
            }).error(function(err){
                notify({message:'Please provide all required information',classes:'alert-danger',duration:2000} );
            })
        }

        $scope.deactivatePriceCard=function(){
            $scope.priceCardObj.isActive = false;
            //if($scope.deactivateObj && $scope.deactivateObj.supplier && $scope.deactivateObj.supplier.length > 0) {
                ngProgressLite.start();
                pricingService.deactivateSupplier($scope.dataAll).success(function (data) {
                    ngProgressLite.done();
                    $scope.dctEnable = 'false';
                    notify({
                        message: 'Your request has been saved successfully',
                        classes: 'alert-success',
                        duration: 2000
                    });
                    $scope.priceCardObj = '';
                }).error(function (err) {
                    notify({message: err.msg, classes: 'alert-danger', duration: 2000});
                })
            //} else {
            //    console.log("no supplier exist");
            //}
        }

        $scope.cancelSupplier=function(){
            if(! $scope.dataAll.buyerCounterParty){
                $scope.dataAll.buyerCounterParty=0;
            }
            if(! $scope.dataAll.language){
                $scope.dataAll.language=lngId;
            }
            if(! $scope.dataAll.country){
                $scope.dataAll.country=cntId;
            }
            getSupplierInfo($scope.dataAll.language, $scope.dataAll.country, $scope.dataAll.buyerCounterParty);

        }


        function getSupplierInfo(lng, cntry, byr){
            $scope.dctEnable='false';
        
            $scope.pricingMethod='';
            ngProgressLite.start();
            pricingService.getSupplier(lng,cntry, byr).success(function (data) {
                ngProgressLite.done();
                if(data.apiStatus){
                    if(data.supplier.length > 0){
                        $scope.priceCardObj = data.supplier[0];
                        $scope.deactivateObj = data;
                        //$scope.dctEnable='true';
                    }else{
                        //$scope.dctEnable='false';
                    }

                  $scope.pricingMethod =data.pricingMethod; // either formula or manual_price_card
                    if($scope.pricingMethod ==  'formula') {
                        //formula
                        $scope.tab = 2;
                        $scope.dctEnable='true';
                    } else if($scope.pricingMethod ==  'manual_price_card'){
                        //manual_price_card
                        $scope.tab = 3;
                        $scope.dctEnable='true';
                    } else {
                        // 
                        $scope.dctEnable='false'
                        $scope.priceCardObj = '';
                        $scope.tab = 2;
                    }
                }
                else{
                    $scope.priceCardObj='';
                }
            }).error(function (err) {
                notify({message:err.msg,classes:'alert-danger',duration:2000} );
            })
        }

        function getCombinationPriceCard(){
            if(!$scope.dataAll.language){
                $scope.dataAll.language=lngId;
            }
            if(!$scope.dataAll.country){
                $scope.dataAll.country=cntId;
            }
            getSupplierInfo($scope.dataAll.language, $scope.dataAll.country, $scope.dataAll.buyerCounterParty)
        }

        function showLanguagesInCombo() {
            commonApi.getLanguageByCountry(cntId).success(function (data) {
                if (data.languages != null) {
                    $scope.lngMaster = data.languages;
                }
            }).error(function (err) {
                notify({message: err.msg, classes: 'alert-danger', duration: 2000});
            })
        }

        //logout function and reset pssword function
        /*$rootScope.logout = function(){
            console.log("here");
            console.log(JSON.stringify(userInfo)+"  userInfo");
            user.logoutUser(userInfo.id).success(function (data) {
                console.log(data+'  data');
                localStorageService.clearAll();
                sessionStorage.removeItem("token");
                console.log("for logout");
                $state.go('login',{reload : true});
                $state.reload();
            }).error(function (err) {
                notify({message:'Error in logout',classes:'alert-danger',duration:2000} );
            })

        };*/
            
        $rootScope.resetPassword = function() {
            $state.go('resetPassword');
        };

        //PD-557
        $scope.setTab = function(newTab){
          $scope.tab = newTab;
        };

        $scope.isSet = function(tabNum){
          return $scope.tab === tabNum;
        };


        $scope.csv = {
            content: null,
            header: false,
            headerVisible: true,
            separator: ',',
            separatorVisible: true,
            result: null,
            encoding: 'ISO-8859-1',
            encodingVisible: true,
            uploadButtonLabel: "upload a csv file"
        };

        /**
         * Delete all null (or undefined) properties from an object.
         */
        function delete_null_properties(test) {
            for (var i in test) {
                if (test[i] == null ||  isNaN(test[i]) || test[i] == '') {
                    delete test[i];
                }
            }
            return test;
        }



        $scope.saveUploadCSV = function (uploadJson) {
            var json = angular.copy(uploadJson);
            if(json == undefined || json == null || json == '' ) {
                notify({
                    message: "Please upload CSV file",
                    classes: 'alert-danger',
                    duration: 5000
                });
                return;
            }
            delete json.filename
            var header_length = json[0];
            if(header_length) {
                for(var j = 0 ; j <= 100 ; j++) {
                    if(header_length[j] === "" && j === 0) {

                    }
                    else if(header_length[j] !== "") {

                    }
                    else {
                        notify({
                            message: "Uploaded CSV file is invalid",
                            classes: 'alert-danger',
                            duration: 5000
                        });
                        return;
                    }
                }
            }
            delete json[0];
            for(var k in json) {
               if(k == 100) {
                if(json[k][0] == "100%") {

                }
                else {
                    notify({
                        message: "Uploaded CSV file is invalid",
                        classes: 'alert-danger',
                        duration: 5000
                    });
                    return;
                }
               }
            }

            var isCsvCorroup = false;
            var rowCount = 0;
            var columnCount = 0;
            var obj = {};
            var arrObj = [];
            for(var i in json) {
                for(var j in json[i]) {
                    
                    var isCorrect = true;;
                    if(json[i][j].substr(-1) == "%") { // it represent first column (IR)
                        isCorrect = false;  // we are deleting it bcz not going to push it into db
                        delete json[i][j];
                    }

                    if(isCorrect && json[i][j] !== "" && isNaN(parseFloat(json[i][j].trim().slice(1)))) { // if any  column value is not number than will be promp an error
                        console.log("error in this, i=>"+i+' j =>'+j+' value --->'+json[i][j]);
                        isCsvCorroup = true;
                    } else if(isCorrect && (i <= 100 && j <= 100 ) ){
                        // if everthing is correct going to push it into final object array
                        var modVal = json[i][j].trim().slice(1);
                        json[i][j] = parseFloat(modVal);
                        rowCount++;
                        columnCount++;

                    } else {
                        //console.log("else , i=>"+i+' j =>'+j+' value --->'+json[i][j]);
                    }
                }
                       
            }
            if((rowCount < 10000 || columnCount < 10000) && !isCsvCorroup) {

                notify({
                    message: "Error: Upload failed, you must define all 100%IR by 100min loi combinations.",
                    classes: 'alert-danger',
                    duration: 5000
                });
                return;
            }

            if(isCsvCorroup) {
     
                notify({
                    message: "Error: Unexpected characters present in file.  Please check your upload",
                    classes: 'alert-danger',
                    duration: 5000
                });
                return;
            }

            for(var k in json) {
                if (k <= 100) {
                    obj[k] = delete_null_properties(json[k]);
                }
                
            }

            arrObj.push(obj);

            $scope.manualPriceCard = {
                supplier_id: userInfo.cmp,
                user_id: userInfo.id,
                price_card : arrObj
            }
            $scope.manualPriceCard.buyerCounterParty= $scope.dataAll.buyerCounterParty ? $scope.dataAll.buyerCounterParty : 0;

            pricingService.supplierFileUpload( $scope.dataAll.language,  $scope.dataAll.country, $scope.manualPriceCard).then(
                function(response) {
                    notify({
                        message: " Manual Price card csv file successfully uploaded.",
                        classes: 'alert-success',
                        duration: 5000
                    });
                },
                function(error) {
      
                    notify({
                        message: error,
                        classes: 'alert-danger',
                        duration: 5000
                    });
                }
            );
            //}
            /*else {
                notify({message:"First Select the file from browse option",classes:'alert-danger',duration:3000} );
            }*/
                
        };


        $scope.viewLatestUpload = function() {
           $scope.loader = {show: true};
           $scope.arrayForCpiValuesColumnWise = [];

           pricingService.getSupplierManualRateCard($scope.dataAll.language, $scope.dataAll.country, $scope.dataAll.buyerCounterParty).then(function(response) {
            
            $scope.supplierManualCard = response['data']['priceCard'][0];
            $scope.irKeys = Object.keys($scope.supplierManualCard);
            angular.forEach($scope.supplierManualCard, function(manualCards, manualCardsIndex){
                var arrayForCpiValues =[]
              angular.forEach(manualCards, function(card, cardIndex){
                arrayForCpiValues.push(card);
              })
                $scope.arrayForCpiValuesColumnWise.push({
                    index:manualCardsIndex,
                    value:arrayForCpiValues
                });
            });

            $scope.loader.show = false;



           }, function(error) {
            console.log("error : ", error);
           })

        }

        $scope.downloadLatestUpload = function() {
            
            pricingService.downloadSupplierManualCard($scope.dataAll.language, $scope.dataAll.country, $scope.dataAll.buyerCounterParty).then(function(response) {

                response['data'] = response['data'].replace(response['data'].charAt(0), ' ');
                var fileName = 'ManulaPriceCard_'+$scope.dataAll.language+'_'+$scope.dataAll.country+'_'+userInfo.cmp;

                var anchor = angular.element('<a/>');
                anchor.css({display: 'none'}); 
                angular.element(document.body).append(anchor);

                anchor.attr({
                    href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response['data']),
                    target: '_blank',
                    download: fileName+'.csv'
                })[0].click();

                anchor.remove();

            });


        }

    }]);


