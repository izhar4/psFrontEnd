/**
 * Created by Dinesh on 16/10/2016.
 */

angular.module('pureSpectrumApp')

    .controller('buyerSettingController',['$scope','$http','$state','$cookies','$window','config','localStorageService','settingService','notify','commonApi' ,'ngProgressLite', 'buyerSettingService',function($scope, $http, $state, $cookies, $window, config, localStorageService, settingService, notify, commonApi, ngProgressLite, buyerSettingService){
        $scope.buyerSetObj={};
        $scope.decipherCheckData=[];
        $scope.showModal = false;
        var ageIncomeQual =[212,213];
        var qualificationText = false;
        $scope.showAddConditionsTab =false;
        $scope.indexForCondition=0;
        $scope.showAddMappingTab = false;
        $scope.ageIncomeQualExist=false;
        buyerMappings=[];
        var conditionIndex;
        $scope.conditionData={};
        $scope.qualConditionData = {};
        var completeCheckedData ={};
        $scope.transaction_id= { cb : 1, out:'transaction_id', in:'transaction_id'};
        $scope.psid= { cb : 1, out:'psid', in:'psid' };
        $scope.status= { cb : 1 , out:'', in : 'st'};
        $scope.ps_hash= { cb : 1, out:'ps_hash', in : 'ps_hash' };
        $scope.ps_supplier_id= { cb : 0, out:'supplier_id', in : '' };

        // parameter added for PD-369
        $scope.ps_transId2 = { cb : 0, out:'transaction_id2', in : 'transaction_id' };
        $scope.ps_transId3 = { cb : 0, out:'transaction_id3', in : 'transaction_id' };
        $scope.ps_transId4 = { cb : 0, out:'transaction_id4', in : 'transaction_id' };
        var userInfo= localStorageService.get('logedInUser');
        //$scope.buyerSetObj.userName=userInfo.usrName;
        $scope.buyerSetObj.cmp = userInfo.cmp;
        $scope.decipher = "false";
        $scope.mappings             = [{}];
        $scope.qualifications       = [];
        $scope.decipherObj = {};
        $scope.decipherObj.selectedURI          = 'Decipher';
        $scope.decipherObj.selectedSupplierType = 'Main';
        $scope.decipherObj.directory_name = '';
        $scope.decipherObj.if_many = '';
        $scope.decipherObj.if_dsp = '';
        $scope.decipherObj.selectedQualification = { label : '', value : 0};
        $scope.selectedCountry = {id: '', label: '', value : ''};
        $scope.selectedLanguage = {name: '', trans_code : ''};
        $scope.countries = [];
        $scope.lang = [];
        $scope.savedDecipherObj = [];

        

         /* Fetch all Qualifactions*/
        commonApi.getAllMasterData().success(function (data) {
            _.each(data.values,function(record){
                $scope.qualifications.push({
                    label : record.masterKey,
                    value : record.id,
                    conditions: record.values || []
                });
            });
        }).error(function (err) {
            $scope.loader.show = false;
            notify({message: err.msg, classes: 'alert-danger', duration: 2000});
        });

        /* Fetch all Countries */
        commonApi.countries().success(function (data) {
            if(_.has(data,"countries")){
                if(data.countries.values){
                    _.each(data.countries.values,function(countryRecord){
                        $scope.countries.push({
                            id : countryRecord.id,
                            label : countryRecord.name,
                            value : countryRecord.short_Code
                        });
                    });
                    $scope.setCountry({id: '1', label: 'United States', value : 'US'}, 'en');
                }else{
                    console.log({ status: "Failure", msg: "Countries Value's not found !" });
                }
            }else{
                console.log({ status: "Failure", msg: "Countries not found !" });
            }
        }).error(function (err) {
            $scope.loader.show = false;
            notify({message: err.msg, classes: 'alert-danger', duration: 2000});
        });

        getBuyerInfo($scope.buyerSetObj.cmp);

        $scope.selectQualification = function(qualification, index) {
            $scope.showAddMappingTab = false;
            $scope.showAddConditionsTab = false;
            $scope.ageIncomeQualExist = false;
            $scope.conditionData = {};
            $scope.decipherCheckData= {};
            if(qualification && Object.keys(qualification.length > 0)){
                $scope.decipherObj.selectedQualification.label = qualification.label;
                $scope.decipherObj.selectedQualification.value = qualification.value;
                $scope.mappings[index]['qualification'] = qualification;
                if($scope.mappings[index] && $scope.mappings[index].data){
                    if(_.contains(ageIncomeQual, qualification.value)){
                        $scope.ageIncomeQualExist = true;
                    }
                    else if(qualification.conditions && qualification.conditions.length ===0){
                        $scope.showAddMappingTab = true;
                    }
                    else{
                        $scope.showAddConditionsTab = true;
                    }
                }
            }
            if(index < $scope.mappings.length - 1){
                var tempObj = {};
                tempObj[$scope.mappings[index].data]= $scope.mappings[index].qualification.value;
                buyerMappings.splice(index, 1);
                buyerMappings.splice(index, 0, tempObj);
            }
        };


        $scope.setCountry = function(country, lang = '') {
            if(country){
                $scope.selectedCountry.id = country.id;
                $scope.selectedCountry.label = country.label;
                $scope.selectedCountry.value = country.value;
                $scope.selectedLanguage = {name: '', trans_code : ''};
            
                if($scope.savedDecipherObj.length > 0){
                    var data = _.find($scope.savedDecipherObj, function(x){ return x.locale.split("_")[1] ==  country.value; });
                    if(data && Object.keys(data).length > 0){
                        if(data.selectedQualification && data.selectedQualification.length > 0){
                            displayMappings(data.selectedQualification);
                        }else{
                            $scope.mappings = [];
                            buyerMappings = [];
                            $scope.qualConditionData ={};
                            $scope.conditionData ={};
                            $scope.decipherCheckData =[]; 
                            $scope.mappings.push({
                                'data':"",
                                'qualification':""
                            })
                        }

                        $scope.decipherObj.selectedURI          = data.selectedURI;
                        $scope.decipherObj.selectedSupplierType = data.selectedSupplierType;
                        $scope.decipherObj.directory_name = data.directory_name;
                        $scope.decipherObj.if_many = data.if_many;
                        $scope.decipherObj.if_dsp = data.if_dsp;
                        getLanguageDropdownValue(country, data.locale.split("_")[0]);
                    }else{
                        resetData();
                        getLanguageDropdownValue(country, lang);
                    }
                }else{
                    getLanguageDropdownValue(country, lang);
                }
            }
            
        };

        $scope.setDecipher = function(value) {
          $scope.decipher = value;
        };

        $scope.addMapping = function(index) {
            $scope.showAddConditionsTab = false;
            $scope.showAddMappingTab = false;
            $scope.ageIncomeQualExist = false;
            if($scope.mappings && $scope.mappings.length > 0){
                if(buyerMappings[index]){
                    $scope.mappings.push({
                        'data':"",
                        'qualification':""
                    })
                }else{
                    let mappingObj;
                    mappingObj = $scope.mappings[index];
                    if(mappingObj && mappingObj.data && mappingObj.qualification && Object.keys(mappingObj).length > 0){
                        if(!buyerMappings[index]){
                            let tempObj = {};
                            tempObj['decipherCode'] = mappingObj.data.toString();
                            tempObj['psCode']= (mappingObj.qualification.value).toString();
                            buyerMappings.push(tempObj);
                        }
                        
                        if($scope.mappings.length == 1 || !(index < $scope.mappings.length-1)){
                            $scope.mappings.push({
                                'data':"",
                                'qualification':""
                            })
                        }
                    }else{
                        notify({message: "Enter qualification for decipher and ps", classes: 'alert-danger', duration: 2000}); 
                    }
                }
            }
        };

        $scope.closeMapping = function(index){
          $scope.mappings.splice(index, 1);
          if($scope.qualConditionData && $scope.qualConditionData[index]){
            delete $scope.qualConditionData[index];
          }
          buyerMappings.splice(index,1);
        }

        $scope.selectUri = function(uri) {
            $scope.decipherObj.selectedURI = uri;
        };

        $scope.selectSupplierType = function(uri) {
            $scope.decipherObj.selectedSupplierType = uri;
        };

        $scope.checkForTab = function(index){
            if(($scope.mappings[index] && $scope.mappings[index].data && $scope.mappings[index].qualification && $scope.mappings[index].qualification.conditions ) ){
                if($scope.mappings[index].qualification.conditions.length > 0 && $scope.mappings[index].qualification.value && $scope.mappings[index].qualification.value !== 213){
                    return true;
                }else if(_.contains(ageIncomeQual, $scope.mappings[index].qualification.value)){
                    return true;
                }else{
                    return false;
                }
            }
            
        }

       $scope.saveBuyerSetting = function(){
            var variable_mapping = [];
            
            if($scope.transaction_id && $scope.transaction_id.cb) {
                var transaction = {
                    "outgoing" : ($scope.transaction_id.out != '' ? $scope.transaction_id.out : 'transaction_id'), //default transaction_id if empty
                    "incoming" : $scope.transaction_id.in
                }

                variable_mapping.push({"ps_transaction":transaction});
            }
            if($scope.psid && $scope.psid.cb) {
                var psid = {
                    "outgoing" : ($scope.psid.out != '' ? $scope.psid.out : 'psid'), //default psid if empty
                    "incoming" : $scope.psid.in
                }

                variable_mapping.push({"ps_psid":psid});
            }
            if($scope.status && $scope.status.cb) {
                var status = {
                    "outgoing" : $scope.status.out,
                    "incoming" : $scope.status.in
                }

                variable_mapping.push({"ps_status":status});
            }
            if($scope.buyerSetObj.isHashing && $scope.buyerSetObj.private_key != '' && !$scope.ps_hash.cb) {
                angular.element(".ps_hash_cb").trigger("click");
                $scope.ps_hash.cb = 1;
            }
            if($scope.ps_hash && $scope.ps_hash.cb) {
                var ps_hash = {
                    "outgoing" : $scope.ps_hash.out,
                    "incoming" : $scope.ps_hash.in
                }

                variable_mapping.push({"ps_hash":ps_hash});
            }

            // add the parameter transaction_id2 for pd-369

           if($scope.ps_transId2 && $scope.ps_transId2.cb) {
               var transaction_id2 = {
                   "outgoing" : ($scope.ps_transId2.out != '' ? $scope.ps_transId2.out : 'transaction_id2'), //default transaction_id if empty
                   "incoming" : $scope.ps_transId2.in
               }

               variable_mapping.push({"ps_transaction_id2" : transaction_id2});
           }

           // add the parameter transaction_id3 for pd-369

           if($scope.ps_transId3 && $scope.ps_transId3.cb) {
               var transaction_id3 = {
                   "outgoing" : ($scope.ps_transId3.out != '' ? $scope.ps_transId3.out : 'transaction_id3'), //default transaction_id if empty
                   "incoming" : $scope.ps_transId3.in
               }

               variable_mapping.push({"ps_transaction_id3" : transaction_id3});
           }

           // add the parameter transaction_id4 for pd-369

           if($scope.ps_transId4 && $scope.ps_transId4.cb) {
               var transaction_id4 = {
                   "outgoing" : ($scope.ps_transId4.out != '' ? $scope.ps_transId4.out : 'transaction_id4'), //default transaction_id if empty
                   "incoming" : $scope.ps_transId4.in
               }

               variable_mapping.push({"ps_transaction_id4" : transaction_id4});
           }
           // added supplier_id

           if($scope.ps_supplier_id && $scope.ps_supplier_id.cb) {
               var supplier_id = {
                   "outgoing" : ($scope.ps_supplier_id.out != '' ? $scope.ps_supplier_id.out : 'supplier_id'),
                   "incoming" : $scope.ps_supplier_id.in
               }

               variable_mapping.push({"ps_supplier_id" :  supplier_id});
           }
           // Added Hashing Params
           if($scope.buyerSetObj.isHashing == '1') {
                $scope.buyerSetObj.isHashing = true;
           }else {
                $scope.buyerSetObj.isHashing = false;
           }
            $scope.buyerSetObj.variable_mapping = variable_mapping;

            $scope.buyerSetObj.isDecipher = (($scope.decipher == "true") ? true : false);
            var locale = $scope.selectedLanguage.trans_code + "_" + $scope.selectedCountry.value;
            $scope.decipherObj.cmp = $scope.buyerSetObj.cmp;
            $scope.decipherObj.locale = locale;
            $scope.decipherObj.selectedQualification = buyerMappings;
            $scope.buyerSetObj.decipherObj = $scope.decipherObj;
            
            ngProgressLite.start();
            if($scope.buyerSetObj.isDecipher && ($scope.decipherObj.directory_name == "" || $scope.selectedLanguage.trans_code == "")){
              notify({message:'Please provide key information',classes:'alert-danger',duration:2000} );
            }else if ($scope.buyerSetObj.isHashing && $scope.buyerSetObj.private_key == ''){
              notify({message:'Please provide key information',classes:'alert-danger',duration:2000} );
            } else {
              buyerSettingService.updateSetting($scope.buyerSetObj.cmp,$scope.buyerSetObj).success(function(data){
                  ngProgressLite.done();
                  notify({message:'Buyer Setting information has been added successfully',classes:'alert-success',duration:2000} );
              }).error(function(err){
                  ngProgressLite.start();
                  notify({message:'Please provide all required information',classes:'alert-danger',duration:2000} );
              });
            }
         }


        function getBuyerInfo(id){
            ngProgressLite.start();
            buyerSettingService.getSetting(id).success(function (data) {
                ngProgressLite.done();
                var isPSIDExist = false;
                var isPSHashExist = false;
                if(data.apiStatus){
                    $scope.buyerSetObj.cmpName = data.buyer.companyName;
                    $scope.buyerSetObj.isHashing = data.buyer.isHashing;
                    $scope.buyerSetObj.private_key = data.buyer.private_key;
                    $scope.decipher = data.buyer.isDecipher ? "true" : "false";
                    if(data.buyer && data.buyer.decipherObj && data.buyer.decipherObj.length > 0){
                        var obj = data.buyer.decipherObj[0];
                        if(obj && obj.selectedQualification && obj.selectedQualification.length > 0){
                            displayMappings(obj.selectedQualification);
                        }

                        $scope.savedDecipherObj = data.buyer.decipherObj;
                        $scope.decipherObj.selectedURI          = obj.selectedURI;
                        $scope.decipherObj.selectedSupplierType = obj.selectedSupplierType;
                        $scope.decipherObj.directory_name = obj.directory_name;
                        $scope.decipherObj.if_many = obj.if_many;
                        $scope.decipherObj.if_dsp = obj.if_dsp;
                        var sp = obj.locale.split("_");
                        var country = _.findWhere($scope.countries,{value: sp[1]});
                        $scope.setCountry(country, sp[0])
                    }
                    if(data.buyer.variable_mapping){
                        for(var i = 0; i < data.buyer.variable_mapping.length; i++) {
                            for(var j in data.buyer.variable_mapping[i]) {

                                // added supplier_id

                                if(j == "ps_supplier_id") {
                                    $scope.ps_supplier_id.cb = 1;
                                    $scope.ps_supplier_id.in = data.buyer.variable_mapping[i][j].incoming;
                                    $scope.ps_supplier_id.out = data.buyer.variable_mapping[i][j].outgoing;
                                }

                                if(j == "ps_transaction") {
                                    $scope.transaction_id.in = data.buyer.variable_mapping[i][j].incoming;
                                    $scope.transaction_id.out = data.buyer.variable_mapping[i][j].outgoing;
                                }

                                if(j == "ps_transaction") {
                                    $scope.transaction_id.in = data.buyer.variable_mapping[i][j].incoming;
                                    $scope.transaction_id.out = data.buyer.variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_psid") {
                                    isPSIDExist = true;
                                    $scope.psid.in = data.buyer.variable_mapping[i][j].incoming;
                                    $scope.psid.out = data.buyer.variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_status") {
                                    $scope.status.in = data.buyer.variable_mapping[i][j].incoming;
                                    $scope.status.out = data.buyer.variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_hash") {
                                    isPSHashExist = true;
                                    $scope.ps_hash.in = data.buyer.variable_mapping[i][j].incoming;
                                    $scope.ps_hash.out = data.buyer.variable_mapping[i][j].outgoing;
                                }

                                // pd-369

                                if(j == "ps_transaction_id2") {
                                    $scope.ps_transId2.cb = 1;
                                    $scope.ps_transId2.in = data.buyer.variable_mapping[i][j].incoming;
                                    $scope.ps_transId2.out = data.buyer.variable_mapping[i][j].outgoing;
                                }

                                if(j == "ps_transaction_id3") {
                                    $scope.ps_transId3.cb = 1;
                                    $scope.ps_transId3.in = data.buyer.variable_mapping[i][j].incoming;
                                    $scope.ps_transId3.out = data.buyer.variable_mapping[i][j].outgoing;
                                }

                                if(j == "ps_transaction_id4") {
                                    $scope.ps_transId4.cb = 1;
                                    $scope.ps_transId4.in = data.buyer.variable_mapping[i][j].incoming;
                                    $scope.ps_transId4.out = data.buyer.variable_mapping[i][j].outgoing;
                                }
                            
                            }
                        }
                    } 
                    if(!isPSIDExist){
                        $scope.psid.cb = 0;
                    }
                    if(!isPSHashExist) $scope.ps_hash.cb = 0;
                }
            }).error(function (err) {
                ngProgressLite.start();
                notify({message:err.msg,classes:'alert-danger',duration:2000} );
            })
        }
        //Set setting Tab
        $scope.tab = 1;
        $scope.setTab = function(newTab){
          $scope.tab = newTab;
        };

        $scope.isSet = function(tabNum){
          return $scope.tab === tabNum;
        };

        $scope.cancelBuyerSetting=function(){
            
            getBuyerInfo($scope.buyerSetObj.cmp);

        }


        $scope.conditionCheck = function(){
           Object.keys($scope.conditionData.selectedList).forEach(function(key, idx) {
                if(!$scope.conditionData.selectedList[key]){
                    delete $scope.conditionData.selectedList[key];
                }
           }); 
        }
       

        $scope.saveQualifications = function(){
            if(($scope.conditionData.selectedList|| $scope.conditionData.qualConditionTwo) && $scope.conditionData.qualConditionOne && (((typeof $scope.conditionData.selectedList === "object") && Object.keys($scope.conditionData.selectedList).length > 0) || $scope.conditionData.qualConditionTwo) && qualificationText){
                let psCondition;
                let decipherCondition;
                let conditionRecord;
                let checkedConditions =[];
                decipherCondition = $scope.conditionData.qualConditionOne;
                if($scope.ageIncomeQualExist && $scope.conditionData.qualConditionTwo){
                    psCondition = $scope.conditionData.qualConditionTwo;
                }else{
                    checkedConditions = _.keys($scope.conditionData.selectedList);
                    conditionRecord =  _.findWhere( $scope.decipherCheckData, {name: checkedConditions[0]});
                    if(conditionRecord && conditionRecord.id){
                        psCondition =  conditionRecord.id;
                    }
                }
                if(decipherCondition && psCondition){
                    let valueArray=[];
                    let keyArray=[];
                    let tempObj={};
                    let tempKey;
                    let tempValue;
                    let mappingObj;
                        mappingObj = $scope.mappings[conditionIndex];
                        if(mappingObj && mappingObj.data && mappingObj.qualification){
                            tempKey   = mappingObj.data + "." + decipherCondition;
                            tempValue = mappingObj.qualification.value+"." + psCondition
                        }
                        if(tempKey && tempValue){
                            tempObj['decipherCode'] = tempKey;
                            tempObj['psCode'] = tempValue;
                            buyerMappings[conditionIndex] = tempObj;
                        }
                }
                if($scope.mappings[conditionIndex] && $scope.mappings[conditionIndex].decipherCondition){
                    $scope.mappings[conditionIndex].decipherCondition =  $scope.conditionData.qualConditionOne;

                }
                if($scope.mappings[conditionIndex] && $scope.mappings[conditionIndex].psConditionText){
                    $scope.mappings[conditionIndex].psConditionText = $scope.conditionData.qualConditionTwo;
                }
                $scope.showAddMappingTab = true;
                $scope.qualConditionData[conditionIndex] = $scope.conditionData;
                let keyName = _.keys($scope.conditionData.selectedList);
                if(keyName && keyName.length > 0 && $scope.mappings[conditionIndex] && $scope.mappings[conditionIndex] && $scope.mappings[conditionIndex].decipherCheckData){
                    _.each($scope.mappings[conditionIndex].decipherCheckData, function(data){
                        if(data && data.name == keyName){
                        data['selected'] = true;
                        }
                        else if(data.selected){
                        data.selected ="";
                        }
                    })
                }
            }else{
                notify({message: "Incoplete qualification data", classes: 'alert-danger', duration: 2000});
            } 
        }


        $scope.showConditions = function(index){
            $scope.conditionData={};
            conditionIndex = index;
            $scope.indexForCondition = conditionIndex;
            $scope.decipherCheckData=[];
            qualificationText = false;
            if($scope.qualifications && $scope.mappings && $scope.qualifications.length > 0 && $scope.mappings.length > 0 && $scope.mappings[index].qualification && $scope.mappings[index].qualification.value){
                if($scope.mappings[index].data){
                    qualificationText= true;
                }else{
                    qualificationText = false;
                }
                var qualificationCode = $scope.mappings[index].qualification.value;
                var qualificationRecord = _.findWhere($scope.qualifications, {value:qualificationCode});
                    if(qualificationRecord && qualificationRecord.conditions && qualificationRecord.conditions.length > 0){
                          $scope.ageIncomeQualExist = true;
                        _.each(qualificationRecord.conditions, function(record){
                            if(record && record.name){
                                $scope.ageIncomeQualExist = false;
                                $scope.showAddConditionsTab = true;
                                $scope.decipherCheckData.push(record);
                            }
                        })
                    } 
                if($scope.decipherCheckData && $scope.decipherCheckData.length > 0){
                    completeCheckedData[index] = $scope.decipherCheckData;
                }
                if($scope.qualConditionData && $scope.qualConditionData[index] && Object.keys($scope.qualConditionData[index]).length > 0 ){

                    let checkedList;
                    let checkRecord;
                    if($scope.qualConditionData[index].qualConditionTwo){
                        $scope.showAddConditionsTab = false;
                    }
                    $scope.conditionData = $scope.qualConditionData[index];
                    if(completeCheckedData[index]){
                        checkedList = _.keys($scope.conditionData.selectedList);
                        checkRecord = completeCheckedData[index];
                        if(checkedList && checkedList.length > 0 && checkRecord && checkRecord.length > 0){
                            $scope.decipherCheckData=[];
                            _.each(checkedList, function(qualChecked){
                                _.each(checkRecord, function(record){
                                    if(record.name === qualChecked){
                                        record['selected'] = true;
                                    }

                                })
                            })
                            $scope.decipherCheckData =checkRecord;
                        }
                    }
                    
                }
            }
            if($scope.mappings && $scope.mappings.length > 0){
                if($scope.mappings[index].decipherCheckData && $scope.mappings[index].decipherCheckData.length > 0){
                    $scope.decipherCheckData = $scope.mappings[index].decipherCheckData;
                }
                let record;
                record = $scope.mappings[index];
                if(record && record.decipherCondition && ((record.psCondition && Object.keys(record.psCondition).length > 0) || record.psConditionText)){
                    $scope.showAddConditionsTab = true;
                    $scope.ageIncomeQualExist = false;
                    $scope.conditionData.qualConditionOne = record.decipherCondition
                    if(record.psConditionText){
                        $scope.showAddConditionsTab = false;
                        $scope.ageIncomeQualExist = true;
                        $scope.conditionData.qualConditionTwo = record.psConditionText;
                        /*if()*/
                    }
                    if(record.decipherCheckData){
                        $scope.decipherCheckData = record.decipherCheckData;
                        if($scope.decipherCheckData && $scope.decipherCheckData.length > 0){
                            let tempObj={};
                            _.each($scope.decipherCheckData, function(data){
                                if(data.selected){
                                    tempObj[data.name] = data.selected; 
                                }
                            })
                            if(tempObj){
                                $scope.conditionData['selectedList'] = tempObj;
                            }
                        }

                    }

                }
            }
        }
        

        $scope.setLanguage = function(lang){
            $scope.selectedLanguage.name = lang.name;
            $scope.selectedLanguage.trans_code = lang.transalte_code;
            if($scope.savedDecipherObj.length > 0){
                var data = _.find($scope.savedDecipherObj, function(x) { 
                                var locale = x.locale.split("_"); 
                                return ((locale[0] == lang.transalte_code)&&(locale[1] == $scope.selectedCountry.value)); 
                            });
                if(data && Object.keys(data).length > 0){
                    if(data.selectedQualification && data.selectedQualification.length > 0){
                        displayMappings(data.selectedQualification);
                    }else{
                        $scope.mappings = [];
                        buyerMappings = [];
                        $scope.qualConditionData ={};
                        $scope.conditionData ={};
                        $scope.decipherCheckData =[]; 
                        $scope.mappings.push({
                            'data':"",
                            'qualification':""
                        })
                    }

                    $scope.decipherObj.selectedURI          = data.selectedURI;
                    $scope.decipherObj.selectedSupplierType = data.selectedSupplierType;
                    $scope.decipherObj.directory_name = data.directory_name;
                    $scope.decipherObj.if_many = data.if_many;
                    $scope.decipherObj.if_dsp = data.if_dsp;
                }else{
                    resetData();
                }
            }
        }


        function getLanguageDropdownValue(country, selectedLang) {
            commonApi.getLanguageByCountry(country.id).success(function(dataLang) {
                if (dataLang.languages != null) {
                    $scope.lang = dataLang.languages;
                    if(selectedLang != ''){
                      var slang = _.findWhere($scope.lang, {transalte_code: selectedLang});
                      $scope.setLanguage(slang);
                    }
                }
            });
        }


        function resetData(){
            $scope.mappings = [];
            buyerMappings = [];
            $scope.qualConditionData ={};
            $scope.conditionData ={};
            $scope.decipherCheckData =[];
            $scope.decipherObj.selectedURI          = 'Decipher';
            $scope.decipherObj.selectedSupplierType = 'Main';
            $scope.decipherObj.directory_name = '';
            $scope.decipherObj.if_many = '';
            $scope.decipherObj.if_dsp = '';
            $scope.mappings.push({
                'data':"",
                'qualification':""
            })
        }


        function displayMappings(mappingData){
            buyerMappings = mappingData;
            $scope.showAddConditionsTab= false;
            $scope.ageIncomeQualExist = false;
            $scope.mappings=[];
            _.each(mappingData, function(data){
                $scope.showAddConditionsTab= false;
                $scope.ageIncomeQualExist = false;
                let decipherArr = new Array();
                let psArr = new Array();
                let tempObj={};
                if( data && data.decipherCode){
                    decipherArr = data.decipherCode.split(".");
                    tempObj['data'] = decipherArr[0];
                    if(decipherArr[1]){
                        tempObj['decipherCondition'] = decipherArr[1];
                    }
                }
                if(data && data.psCode){
                    let qualCode;
                    let qualificationRecord;
                    psArr    = data.psCode.split(".")
                    qualCode = parseInt(psArr[0]);

                    qualificationRecord = _.findWhere($scope.qualifications, {value:parseInt(qualCode)});
                    tempObj['qualification'] = qualificationRecord;
                    if(qualificationRecord){
                        $scope.decipherCheckData = angular.copy(qualificationRecord.conditions);
                    }
                    if(psArr[1]){
                        let record;
                            if($scope.decipherCheckData){
                                record = _.findWhere($scope.decipherCheckData, {id: parseInt(psArr[1])});
                            }
                            if(record){
                                $scope.showAddConditionsTab = true;
                                record['selected'] = true;
                                tempObj['psCondition'] = record;
                                tempObj['decipherCheckData'] = $scope.decipherCheckData;

                            }else{
                                $scope.ageIncomeQualExist =true;
                                tempObj['psConditionText'] = psArr[1]; 
                            }
                    }else if(qualificationRecord && qualificationRecord.conditions && qualificationRecord.conditions.length > 0){
                        $scope.showAddConditionsTab = true;
                    }
                }
                if(tempObj && Object.keys(tempObj).length > 0){
                    $scope.mappings.push(tempObj);
                }

            })
            $scope.mappings.push({
                'data':"",
                'qualification':""
            })
        }

        $scope.preventSearchToClose = function(event) {
          event.preventDefault();
          event.stopPropagation();
        }

    }]);