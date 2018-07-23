psApp.controller('decipherCtrl', ['$scope', '$http', '$state', '$rootScope', '$window', 'config', 'commonApi', 'createSurvey', 'notify', 'user', 'localStorageService', '$stateParams', '$timeout','$translate', '$location', '$filter', 'decipherService', 'buyerSettingService', function($scope, $http, $state, $rootScope, $window, config, commonApi, createSurvey, notify, user, localStorageService, $stateParams, $timeout, $translate, $location, $filter, decipherService, buyerSettingService) {

    var userData = localStorageService.get('logedInUser');
    console.log('userData ',userData);
    $scope.userDetail = {eml:userData.eml}
    $scope.properties = new Object();
    $scope.showList = false;
    var masterData = new Array();
    var buyerDetails = new Array();
    var indexNumber = {'language': new Number, 'country': new Number()};
    var currencyFx = new Object();
    //Flag used to show quotas after Next buttom
    $scope.showQuota = false;
    $scope.showMap = false;

    $scope.loader = {show: false};//PD-955
    /*--- Show Loader on every http request----*/
    $rootScope.$on('loading:progress', function (){
        $scope.loader.show = true;//PD-955
    });

    $rootScope.$on('loading:finish', function (){
        $scope.loader.show = false;//PD-955
    });
    /*--- Show Loader on every http request----*/

    /*$scope.$watch('masterDataService.get()', function (newValue, oldValue, scope) {
	    //Do anything with $scope.letters
	    console.log('\n\n newValue ',newValue);
	});*/
	/*$timeout(function(){
		masterData = masterDataService.get();
		console.log('\n\n masterData>>>> ',masterData);
	}, 2000);*/
    
	getMasterData();
    getCountries();
    getSampleTitle();
    getBuyerSetting();

    function getBuyerSetting(){
    	//console.log('$scope.userDetail.cmp ',$scope.userDetail);
    	buyerSettingService.getSetting(userData.cmp).then(function(response){
    		if(response && response.data && response.data.apiStatus == 'success'){
    			buyerDetails = response.data.buyer;
    			$scope.properties.uri = buyerDetails.decipherObj[0].selectedURI;
    			$scope.properties.directory = buyerDetails.decipherObj[0].directory_name;
    			console.log('$scope.properties ',JSON.stringify($scope.properties));
    			getTitle();
    		}	
    	}, function(err){
    		console.log('err ',JSON.stringify(err));
    	});
    }
    //Get MasterData
	function getMasterData(){
		createSurvey.getMasterDataByCountryLang().then(
	      function(response){
	        if(response && response.data && response.data.apiStatus == "Success"){
	        	masterData = response.data.values;
	        }
	    }, function(err){
	        console.log('Error Fetching MaterData ',JSON.stringify(err));
	    })
    };


    var selctdCountry = {};
    $scope.setLanguage = function(id) {
        //$scope.properties.language = id;
        if($scope.lang.length > 0) {
            $scope.lang.forEach(function(singleLang){
                if(singleLang.id !== undefined && singleLang.id == id && singleLang.short_code !== undefined) {
                	$scope.properties.survey_localization = singleLang.transalte_code+"_"+$scope.countryCode;
                	indexNumber.language = singleLang.id;
                    //$scope.properties.languageCode = singleLang.short_code;
                    //$scope.properties.languageName = singleLang.name;
                    document.getElementById("languagedrop").innerHTML = singleLang.name; //update value in UI
                    //$scope.properties.languageTranslate = singleLang.transalte_code;
                    $translate.use($scope.properties.languageTranslate);
                    $scope.getCpi();
                }
            })
        }
    }

    var setSelectedCountry = function(item) {
        $scope.lngFlag = true;
        /*$scope.properties.country = item.id;
        $scope.properties.countryCode = item.short_Code;
        $scope.properties.countryName =  item.name;*/
        
        $timeout(function() {
            $scope.countryValue = item.name;
            $scope.countryCode = item.short_Code;
            indexNumber.country = item.id;
        },0);
        

        commonApi.getLanguageByCountry(item.id).success(function(data) {
            //$scope.languageValue = 'Select Language';
            $scope.lang = [];
            // $scope.properties.countryCode = data.short_Code;
            //$scope.properties.countryName =  data.name;
            if (data && data.languages && data.languages.length > 0) {

                //$scope.lang.concat(data.languages.values[0].lang);
                $scope.lang = data.languages;
                $scope.setLanguage(data.languages[0].id);

                $scope.disableQualification = false;
                //getMasterDataByCountryLang($scope.properties.countryCode, data.languages[0].short_code);
                //optionsToDisplay($scope.properties.countryCode);
            }
        }).error(function(err) {
            notify({
                message: "Something went wrong in fetching Languages",
                classes: 'alert-danger',
                duration: 2000
            });
        });

        selctdCountry = {};
    }

    $scope.setCountry = function(event, item) {
        event.preventDefault();
        event.stopPropagation();
        selctdCountry = item;

        if($scope.checkDirty) {
            if($scope.properties.country != item.id) {
                $timeout(function() {
                    angular.element('#cntryModal').trigger('click');
                },0);
            }else{
                setSelectedCountry(item);
            }
        }else {
            setSelectedCountry(item);
        }
        angular.element('#Survey_Country').attr('aria-expanded','false');
        angular.element('#Survey_Country').parent('.dropdown').removeClass('open');
        //clear selected locations
    };

    $scope.setCountrySelected = function() {
        if(selctdCountry && selctdCountry.id) {
            setSelectedCountry(selctdCountry);
            // resetSurveyData();
            $scope.checkDirty = false;
        }
    };

    function getCountries() {
        $scope.country = new Array();
        commonApi.countries().success(function(data) {
            if (data.countries != null) {
                var arr1 = new Array();
                var arr2 = new Array();
                // For making US Canada at top and other are in alphabetical order
                    angular.forEach(data.countries.values, function(value){
                        if(value.short_Code == 'US' || value.short_Code == 'CA'){
                            arr1.push(value);
                        }else{
                            arr2.push(value);
                        }
                    });
                    arr1 = $filter('orderBy')(arr1, '-name');
                    arr2 = $filter('orderBy')(arr2, 'name');
                $scope.country = _.union(arr1, arr2);
                //console.log('$scope.country '+JSON.stringify($scope.country));
                $scope.app.country = data.countries.values;
                var countryDt = data.countries.values[0];
                if($location.search().locale !== undefined) {
                    countryDt = _.findWhere(data.countries.values, {short_Code : surveyLocale.countryCode});
                }
                setSelectedCountry(countryDt);
            }
        }).error(function(err) {
            notify({
                message: "Something went wrong in fetching coutries",
                classes: 'alert-danger',
                duration: 2000
            });
        });
    }

    $scope.getCpi = function(){
    	if(indexNumber.language && indexNumber.country && $scope.properties.expected_loi && $scope.properties.expected_ir){

    		createSurvey.getSurveyHeaderValue(indexNumber.language, indexNumber.country, $scope.properties.expected_loi, $scope.properties.expected_ir).success(function(data) {
    			if(data && data.apiStatus && data.apiStatus == "success"){
    				$scope.properties.offer_price = data.CPI;
    				currencyFx = data.currencyFx;
    			}
    		}).error(function(err){
    			console.log("Error in calculating CPI ",err);
    		})
    		// Check All fields filled to show Condition Map
    		// Also check that Title is selected from the list
    		console.log('titleDetail ',JSON.stringify(titleDetail));
    		var checkValidTitle = _.findIndex(titleDetail, {"title":$scope.properties.survey_title});
    		if(checkValidTitle != -1 && $scope.properties.survey_title && $scope.properties.completes_required && $scope.properties.field_time){
    			$scope.showMap = true;
    		}
    	}else{
    		console.log('All Values are not avialble to calculate Cpi');
    	}
    }

    function getSampleTitle() {
        commonApi.samples().success(function(data) {
            if (data.sample != null) {
                $scope.samples = data.sample.values;
                $scope.app.samples = data.sample.values;
            }
        }).error(function(err) {
            notify({
                message: "Something went wrong in fetching samples",
                classes: 'alert-danger',
                duration: 2000
            });
        });
    }

    $scope.setSample = function(data){
    	$scope.samplesValue = data.name;
    	$scope.properties.survey_category_code = data.id;
    }

    var titleDetail = new Array();
    function getTitle(){
    	//var cmp_id = userData.cmp;
    	var cmp_id = 1;
    	console.log('$scope.properties ',JSON.stringify($scope.properties));
    	decipherService.getTitle($scope.properties.uri, $scope.properties.directory).then(
	    	function(response){
	    		console.log('response ',JSON.stringify(response));
	    		if(response && response.data && response.data.apiStatus == "Success"){
	    			titleDetail = response.data.data;
	    		}
	    }, function(err){
	    	console.log('err ',err);
	    })
    };

    $scope.titleSearch = function(str){
    	console.log('str ',str);
    	if(str){
	    	$scope.titleDetail = _.filter(titleDetail, function(item){
	    		return item.title.toLowerCase().indexOf(str.toLowerCase()) != -1;
	    	})
	    	//console.log('titleDetail ',JSON.stringify(titleDetail));
	    	//console.log('\n\n $scope.titleDetail ',JSON.stringify($scope.titleDetail));
	    }else{
	    	$scope.titleDetail = angular.copy(titleDetail);
	    }
    	$scope.showList = $scope.titleDetail.length > 0 ? true:false;
    }

    $scope.uncheckQual = function(item){
    	console.log('item ',JSON.stringify(item));
    	console.log('$scope.defines ',JSON.stringify($scope.defines));
    	$scope.loader.show = true;
    	//console.log('indexInDefines ',indexInDefines);
    	if(item.isChecked){
    		item.isChecked = false;
    		//var indexInDefines = _.findIndex($scope.defines, {"decipherKey":item.deciQual+'.'+item.conditions[0].deciCondCode});
    		//$scope.defines.splice(indexInDefines, 1);
    		if(item.conditions){
	    		_.each(item.conditions, function(singleCondition){
	    			$scope.defines = _.without($scope.defines, _.findWhere($scope.defines, {
							  	"decipherKey": item.deciQual+'.'+singleCondition.deciCondCode
							}));
	    		})
	    	}
    		console.log('$scope.defines removed ',JSON.stringify($scope.defines));
    		//$scope.defines[indexInDefines].isChecked = false;
    	}else{
			item.isChecked = true;
			console.log('item ',JSON.stringify(item));
			if(item.conditions[0].value.indexOf('-') == -1){
				_.each(item.conditions, function(singleCondition){
					$scope.defines.push({
						"decipherKey": item.deciQual+'.'+singleCondition.deciCondCode,
						"value": singleCondition.value,
						"markerKey": singleCondition.markerKey,
						"goal": parseInt(singleCondition.goal),
						"locked": false,
						"current_target": parseInt(singleCondition.goal),
						"psQualCode": parseInt(item.psQualCode),
						"condition_codes":[
							singleCondition.psCondCode
						]
					})
				})
			}else{
				_.each(item.conditions, function(singleRange){
					var range = singleRange.value.split('-');
					$scope.defines.push({
						"decipherKey": item.deciQual+'.'+singleRange.deciCondCode,
						"value": singleRange.value,
						"markerKey": singleRange.markerKey,
						"goal": parseInt(singleRange.goal),
						"locked": false,
						"current_target": parseInt(singleRange.goal),
						"psQualCode": parseInt(item.psQualCode),
						"range_sets":[{
							"units": 311,
							"from":parseInt(range[0]),
							"to":parseInt(range[1])
						}]
					})
				})
			}
			//$scope.defines[indexInDefines].isChecked = true;
			console.log('$scope.defines added ',JSON.stringify($scope.defines));
    	}
    	$scope.loader.show = false;
    }

    $scope.defines = new Array();
    $scope.definesForView = new Array();
    //$scope.quotaView = new Array();

    $scope.titleClick = function(item){
    	$scope.properties.survey_title = item.title;
    	$scope.properties.path = item.path;
    	
    	decipherService.getQuotas($scope.properties.uri, item.path).then(
    		function(response){
    			if(response && response.data && response.data.apiStatus == "Success"){
    				console.log('response ',JSON.stringify(response));
    				$scope.defines = response.data.defines;
    				/*$scope.defines = [
				        {
				            "decipherKey": "Q4.r2",
				            "value": "18-24",
				            "markerKey": "vqO36",
				            "goal": 179
				        },
				        {
				            "decipherKey": "Q3.r1",
				            "value": "Male",
				            "markerKey": "YFuXl",
				            "goal": 637
				        },
				        {
				            "decipherKey": "Q4.r3",
				            "value": "25-44",
				            "markerKey": "h2WcC",
				            "goal": 644
				        },
				        {
				            "decipherKey": "Q3.r2",
				            "value": "Female",
				            "markerKey": "duyvU",
				            "goal": 630
				        },
				        {
				            "decipherKey": "Q4.r5 or Q4.r6",
				            "value": "45-64",
				            "markerKey": "DOF8i",
				            "goal": 444
				        }
				    ];*/
    				// Create a array to show defines on view
    				_.each($scope.defines, function(item){
    					console.log('item ',JSON.stringify(item.decipherKey));
    					console.log('buyerDetails.decipherObj[0].selectedQualification ',JSON.stringify(buyerDetails.decipherObj[0].selectedQualification));
    					// To remove or conditons from decipherKey
    					if(item.decipherKey.indexOf('or') != -1){
    						var newKey = item.decipherKey.split('or');
    						console.log('newKey 1 ',newKey);
    						newKey = newKey[0].toString().replace(/\s/g, "");
    						console.log('newKey 2 ',newKey);
    						item.decipherKey = newKey;
    						console.log('decipherKey 3 ',item.decipherKey);
    					}

    					var condition = item.decipherKey.split('.');
    					var deciQualCode = condition[0];
    					var deciCondCode = condition[1];

    					//find pskey using decipherKey from buyerSettings
    					//console.log('buyerDetails.decipherObj[0].selectedQualification ',JSON.stringify(buyerDetails.decipherObj[0].selectedQualification));
    					var psKey = _.findWhere(buyerDetails.decipherObj[0].selectedQualification, {'decipherCode': item.decipherKey});
    					console.log('psKey ',psKey);
    					psKey = psKey.psCode.split('.');
    					var psQualCode = psKey[0];
    					var psCondCode = psKey[1];
    					var psQualName = _.findWhere(masterData, {id: parseInt(psKey[0])}).masterKey; 

    					//Adding value in Quota Array need to create Survey
    					item['locked'] = false;
    					item['current_target'] = item.goal;
    					item['psQualCode'] = parseInt(psQualCode);
    					if(psCondCode.indexOf('-') == -1){
    						item['condition_codes'] = new Array();
    						item.condition_codes.push(psCondCode.toString());
    					}else{
    						var range = psCondCode.split('-');
    						item['range_sets'] = new Array();
    						item.range_sets.push({
    							"units":311,
								"from":parseInt(range[0]),
								"to":parseInt(range[1])
    						});
    					}

    					//console.log('psQualName ',psQualName);

    					var qualExist = _.findIndex($scope.definesForView, {'deciQual':deciQualCode});
    					if(qualExist == -1){
    						$scope.definesForView.push({
    							'deciQual':deciQualCode,
    							'psQualName': psQualName,
    							'psQualCode': psQualCode,
    							'isChecked' : true,
    							'conditions' : [{
    								'deciCondCode':deciCondCode,
    								'psCondCode':psCondCode,
    								'markerKey': item.markerKey,
    								'goal':item.goal,
    								'value':item.value
    							}]
    						})
    					}else{
    						// Check if the Qual Exist then Add the condition Code
    						var condExist = _.findIndex($scope.definesForView[qualExist].conditions, {'deciQual':deciQualCode});
    						if(condExist == -1){
    							$scope.definesForView[qualExist].conditions.push({
    								'deciCondCode':deciCondCode,
    								'psCondCode':psCondCode,
    								'markerKey': item.markerKey,
    								'goal':item.goal,
    								'value':item.value
    							})
    						}else{
    							console.log('No need to add QualCode');
    						}
    					}

    					// Quota View
    					/*var quotaExist = _.findIndex($scope.quotaView, {'markerKey':item.markerKey});
    					if(quotaExist == -1){
    						$scope.quotaView.push({
    							"markerKey":item.markerKey,
    							"value": item.value,
    							"goal" : item.goal,
    							"current_target" : item.goal
    						});
    					}*/

    				});
    				console.log('$scope.definesForView ',JSON.stringify($scope.definesForView));
    			}
    			$scope.getCpi();
    			//$scope.loader.show = false;
    	}, function(err){
    		console.log('err in Fetching Quotas ',err);
    		//$scope.loader.show = false;
    	});
    	$scope.showList = false;

    }

    $scope.openMappingModal = function(qualDetail){
    	$scope.decModalData = qualDetail;
    }

    $scope.clearModalData = function(){
    	$scope.decModalData = {};
    }

    $scope.showQuotaView = function(){
    	$scope.showQuota = !$scope.showQuota;
    }

    $scope.lockQuotaImg = "../../img/lock.png";
    $scope.unLockQuotaImg = "../../img/unlock.png";
    $scope.lockQuota = function(item){
    	if(item.locked){
	    	item.locked = false;
	    	item.current_target = item.goal;
	    }else{
	    	item.locked = true;
	    	item.current_target = 0;
	    }
    }

    $scope.saveSurvey = function(){
    	$scope.loader.show = true;//PD-955
    	console.log('$scope.defines ',JSON.stringify($scope.defines));
    	var tempDefine = new Array();
    	_.each($scope.defines, function(item){
    		var singleObj = new Object();
    		singleObj[item.decipherKey.toString()] = item.value;
    		singleObj['markerKey'] = item.markerKey;
    		singleObj['goal'] = item.goal;
    		singleObj['qualification_code'] = item.psQualCode;
    		if(item.condition_codes){
    			singleObj['condition_codes'] = item.condition_codes;
    		}else if(item.range_sets){
    			singleObj['range_sets'] = item.range_sets;
    		}
    		console.log('singleObj ',JSON.stringify(singleObj));
    		tempDefine.push(singleObj);
    	});
    	$scope.properties['defines'] = tempDefine;
    	// Converting string value to Int
    	$scope.properties.completes_required = parseInt($scope.properties.completes_required);
    	$scope.properties.expected_ir = parseInt($scope.properties.completes_required);
    	$scope.properties.expected_loi = parseInt($scope.properties.completes_required);

    	console.log('$scope.properties ',JSON.stringify($scope.properties));

    	decipherService.createSurvey($scope.properties).success(function(response){
    		if(response && response.apiStatus == 'Success'){
    			$state.go('choosesuppliers', {
                    surveyid: response.ps_survey_id
                });
                $scope.loader.show = false;//PD-955
                notify({message: "Survey Created Successfully", classes: 'alert-success', duration: 2000});
    		}
    	}).error(function(err){
    		console.log('Error in Creating Survey ',err);
    		notify({message: "Error in Saving Survey", classes: 'alert-danger', duration: 2000});
    	})

    }

}]);