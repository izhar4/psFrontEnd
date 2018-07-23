/**
 * Created by Vikas on 7/12/2016.
 */

angular.module('pureSpectrumApp')

    .controller('suppSettingCtrl',['$scope','$http','$state','$cookies','$window','config','localStorageService','settingService','notify','commonApi' ,'ngProgressLite',function($scope, $http, $state, $cookies, $window, config, localStorageService, settingService, notify, commonApi, ngProgressLite){
        $scope.suppSetObj= new Object();
        $scope.suppSetObj["isRecontact"] = "0";
        $scope.suppSetObj["isPostalCode"] = "0";
        $scope.dataAll={};
        //req_types dropdown for augument survey
        $scope.req_types = [
            {
                "key" : "no_auth",
                "value" : "No Auth"
            },
            {
                "key" : "access_token",
                "value" : "Access Token"
            },
            {
                "key" : "sha1_hash",
                "value" : "SHA1 Hash"
            },
            {
                "key" : "adv_auth_supp_script",
                "value" : "Advanced Auth - Supplier Script"
            }
        ]
        //augument survey variable
        $scope.compReqObj = new Object();
        $scope.compReqObj["enable"] = "0";
        $scope.compReqObj["url"] = "";
        $scope.sessReqObj = new Object();
        $scope.sessReqObj["enable"] = "0";
        $scope.sessReqObj["url"] = "";
        $scope.reqAuthObj = new Object();
        $scope.reqAuthObj["type"] = "no_auth";
        $scope.reqAuthObj["value"] = "";

        var userInfo= localStorageService.get('logedInUser');

        $scope.suppSetObj.usr_id=userInfo.id;
        $scope.suppSetObj.cmp=userInfo.cmp;
        
        getSupplierInfo($scope.suppSetObj.cmp);
        $scope.cntryMaster=[];

        $scope.saveSettingData = function(){
            var variable_mapping = [];
            
            
            if($scope.uniquesessionid_in.defaultval && $scope.uniquesessionid_out.defaultval) {
                if(Object.keys($scope.uniquesessionid_in.defaultval).length != 0 && Object.keys($scope.uniquesessionid_out.defaultval).length != 0) {
                    variable_mapping.push(
                        {
                            ps_supplier_sid : {
                                incoming : $scope.uniquesessionid_in.defaultval,
                                outgoing : $scope.uniquesessionid_out.defaultval 
                            }
                        });
                }
                
            }
            if($scope.uniquesessionid_in.defaultval && !$scope.uniquesessionid_out.defaultval) {
                if(Object.keys($scope.uniquesessionid_in.defaultval.defaultval).length != 0) {
                    variable_mapping.push(
                        {
                            ps_supplier_sid : {
                                incoming : $scope.uniquesessionid_in.defaultval,
                                outgoing : $scope.uniquesessionid_in.defaultval 
                            }
                        });
                }
            }
            
            
            if($scope.uniquemember_in.defaultval && $scope.uniquemember_out.defaultval) {
                if(Object.keys($scope.uniquemember_in.defaultval).length != 0  && Object.keys($scope.uniquemember_out.defaultval).length != 0 ) {
                    variable_mapping.push(
                        {
                            ps_supplier_respondent_id : {
                                incoming : $scope.uniquemember_in.defaultval,
                                outgoing : $scope.uniquemember_out.defaultval 
                            }
                        });
                }
                
            }
            if($scope.uniquemember_in.defaultval && !$scope.uniquemember_out.defaultval) {
                if(Object.keys($scope.uniquemember_in.defaultval).length != 0) {
                    variable_mapping.push(
                        {
                            ps_supplier_respondent_id : {
                                incoming : $scope.uniquemember_in.defaultval,
                                outgoing : $scope.uniquemember_in.defaultval 
                            }
                        });
                }
            }
            if($scope.customevar1_in.defaultval && $scope.customevar1_out.defaultval) {
                if(Object.keys($scope.customevar1_in.defaultval).length != 0  && Object.keys($scope.customevar1_out.defaultval).length != 0 ) {
                    variable_mapping.push(
                        {
                            ps_custom_svar1 : {
                                incoming : $scope.customevar1_in.defaultval,
                                outgoing : $scope.customevar1_out.defaultval 
                            }
                        });
                }
                
            }
            if($scope.customevar1_in.defaultval && !$scope.customevar1_out.defaultval) {
                if(Object.keys($scope.customevar1_in.defaultval).length != 0) {
                    variable_mapping.push(
                        {
                            ps_custom_svar1 : {
                                incoming : $scope.customevar1_in.defaultval,
                                outgoing : $scope.customevar1_in.defaultval 
                            }
                        });
                }
                
            }
            if($scope.customevar2_in.defaultval && $scope.customevar2_out.defaultval) {
                if(Object.keys($scope.customevar2_in.defaultval).length != 0  && Object.keys($scope.customevar2_out.defaultval).length != 0 ) {
                    variable_mapping.push(
                        {
                            ps_custom_svar2 : {
                                incoming : $scope.customevar2_in.defaultval,
                                outgoing : $scope.customevar2_out.defaultval 
                            }
                        });
                }
                
            }
            if($scope.customevar2_in.defaultval && !$scope.customevar2_out.defaultval) {
                if(Object.keys($scope.customevar2_in.defaultval).length != 0) {
                    variable_mapping.push(
                        {
                            ps_custom_svar2 : {
                                incoming : $scope.customevar2_in.defaultval,
                                outgoing : $scope.customevar2_in.defaultval 
                            }
                        });
                }
            }

            if($scope.ps_oqid.defaultval) {
                    variable_mapping.push(
                        {
                            "ps_oqid" : {
                                "incoming" : "",
                                "outgoing" : $scope.ps_oqid.defaultval
                            }
                        }
                    );
            }

            if($scope.suppSetObj.isNotify == '1') {
                $scope.suppSetObj.isNotify = true
            }
            else{
                $scope.suppSetObj.isNotify = false;
            }

            if($scope.suppSetObj.isRecontact == '1') {
                $scope.suppSetObj.isRecontact = true;
            }
            else {
                $scope.suppSetObj.isRecontact = false;
            }

            if($scope.suppSetObj.isPostalCode == '1') {
                $scope.suppSetObj.isPostalCode = true;
            }
            else {
                $scope.suppSetObj.isPostalCode = false;
            }

            // Added Hashing Params
            if($scope.suppSetObj.isHashing == '1') {
                $scope.suppSetObj.isHashing = true;
            }else {
                $scope.suppSetObj.isHashing = false;
            }

            if($scope.compReqObj["enable"] == '1'){
                $scope.suppSetObj.complete_request = new Object();
                $scope.suppSetObj.complete_request["enable"] = true;
                $scope.suppSetObj.complete_request["url"] = $scope.compReqObj["url"];
            }else{
                $scope.suppSetObj.complete_request = new Object();
                $scope.suppSetObj.complete_request["enable"] = false;
                $scope.suppSetObj.complete_request["url"] = "";
            }
            if($scope.sessReqObj["enable"] == '1'){
                $scope.suppSetObj.sessionid_request = new Object();
                $scope.suppSetObj.sessionid_request["enable"] = true;
                $scope.suppSetObj.sessionid_request["url"] = $scope.sessReqObj["url"];
            }else{
                $scope.suppSetObj.sessionid_request = new Object();
                $scope.suppSetObj.sessionid_request["enable"] = false;
                $scope.suppSetObj.sessionid_request["url"] = "";
            }
            if($scope.reqAuthObj["type"] == 'access_token'){
                $scope.suppSetObj.req_auth = new Object();
                $scope.suppSetObj.req_auth["type"] = "access_token";
                $scope.suppSetObj.req_auth["value"] = $scope.reqAuthObj["value"];
            }else{
                $scope.suppSetObj.req_auth = new Object();
                $scope.suppSetObj.req_auth["type"] = $scope.reqAuthObj["type"];
                $scope.suppSetObj.req_auth["value"] = "";
            }
           
            if(variable_mapping.length != 0) {
                
                $scope.suppSetObj.variable_mapping = variable_mapping;
            }
            

            ngProgressLite.start();
           if($scope.suppSetObj.cmp != undefined)
           {
                if ($scope.suppSetObj.isHashing && $scope.suppSetObj.private_key == ''){
                    notify({message:'Please provide key information',classes:'alert-danger',duration:2000} );
                    return (false);
                }
                settingService.updateSetting($scope.suppSetObj.cmp, $scope.suppSetObj).success(function(data){
                ngProgressLite.done();
                notify({message:'Supplier Setting information has been Updated successfully',classes:'alert-success',duration:2000} );
                getSupplierInfo($scope.suppSetObj.cmp);
            }).error(function(err){
                notify({message:'Please provide all required information',classes:'alert-danger',duration:2000} );
             })
           }
           else
           {
                if ($scope.suppSetObj.isHashing && $scope.suppSetObj.private_key == ''){
                    notify({message:'Please provide key information',classes:'alert-danger',duration:2000} );
                    return (false);
                }
                $scope.suppSetObj.cmp=userInfo.cmp;
                settingService.addSetting($scope.suppSetObj).success(function(data){
                ngProgressLite.done();
                notify({message:'Supplier Setting information has been saved successfully',classes:'alert-success',duration:2000} );
                getSupplierInfo($scope.suppSetObj.cmp);
            }).error(function(err){
                notify({message:'Please provide all required information',classes:'alert-danger',duration:2000} );
            })
           }
        }


        $scope.cancelSupplier=function(){
            
            getSupplierInfo($scope.suppSetObj.cmp);

        }


        function getSupplierInfo(id){
            $scope.ps_oqid = {};
            $scope.dctEnable='false';
            ngProgressLite.start();
            settingService.getSetting(id).success(function (data) {
                ngProgressLite.done();

                if(data.apiStatus){
                    if(data.supplier[0].variable_mapping){
                        for(var i = 0; i < data.supplier[0].variable_mapping.length; i++) {
                            for(var j in data.supplier[0].variable_mapping[i]) {
                                if(j == "ps_supplier_sid") {
                                    $scope.uniquesessionid_in.defaultval = data.supplier[0].variable_mapping[i][j].incoming;
                                    $scope.uniquesessionid_out.defaultval = data.supplier[0].variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_supplier_respondent_id") {
                                    $scope.uniquemember_in.defaultval = data.supplier[0].variable_mapping[i][j].incoming;
                                    $scope.uniquemember_out.defaultval = data.supplier[0].variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_custom_svar1") {
                                   $scope.customevar1_in.defaultval = data.supplier[0].variable_mapping[i][j].incoming;
                                    $scope.customevar1_out.defaultval = data.supplier[0].variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_custom_svar2") {
                                    $scope.customevar2_in.defaultval = data.supplier[0].variable_mapping[i][j].incoming;
                                    $scope.customevar2_out.defaultval = data.supplier[0].variable_mapping[i][j].outgoing;
                                }
                                if(j == "ps_oqid") {
                                    $scope.ps_oqid.defaultval = data.supplier[0].variable_mapping[i][j].outgoing;
                                }
                            }
                        }
                    }
                    //setting default value for augument survey variables
                    if(data.supplier[0].complete_request){
                        $scope.compReqObj["enable"] = data.supplier[0].complete_request.enable;
                        $scope.compReqObj["url"] = data.supplier[0].complete_request.url;;
                    }
                    if(data.supplier[0].sessionid_request){
                        $scope.sessReqObj["enable"] = data.supplier[0].sessionid_request.enable;
                        $scope.sessReqObj["url"] = data.supplier[0].sessionid_request.url;;
                    }
                    if(data.supplier[0].req_auth){
                        $scope.reqAuthObj["type"] = data.supplier[0].req_auth.type;
                        $scope.reqAuthObj["value"] = data.supplier[0].req_auth.value;;
                    }

                    if(!_.has(data.supplier[0], "isRecontact") && !_.has(data.supplier[0], "isPostalCode") && _.has($scope.suppSetObj, "isRecontact") && _.has($scope.suppSetObj, "isPostalCode")) {
                        data.supplier[0]["isRecontact"] = "0";
                        data.supplier[0]["isPostalCode"] = "0";
                    }

                    $scope.suppSetObj = data.supplier[0];
                    $scope.dctEnable='true';
                }
                else{
                    $scope.suppSetObj= new Object();
                    $scope.suppSetObj["isRecontact"] = "0";
                    $scope.suppSetObj["isPostalCode"] = "0";
                }
            }).error(function (err) {
                notify({message:err.msg,classes:'alert-danger',duration:2000} );
            })
        }


        $scope.tab = 1;
        $scope.setTab = function(newTab){
          $scope.tab = newTab;
        };

        $scope.isSet = function(tabNum){
          return $scope.tab === tabNum;
        };

        //Excluding Countries and locations dropdown
        

        $scope.exlang =[
              'US English',
              'Spanish',
              'Canada English',
              'French',
              'UK English'
           ];

        $scope.geoExclusion = [
            'CSA',
            'MSA',
            'DMA',
            'Country',
            'Provinces'
        ];


    }]);
