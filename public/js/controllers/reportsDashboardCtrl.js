psApp.controller('reportsDashboardCtrl', ['$scope','localStorageService','$http','$state','user','authenticationService','notify', 'createSurvey','DTOptionsBuilder', 'DTColumnDefBuilder', 'commonApi', 'companyService', 'reportService', 'config', function($scope, localStorageService, $http, $state, user, authenticationService, notify, createSurvey,DTOptionsBuilder, DTColumnDefBuilder, commonApi, companyService, reportService, config){

	$scope.active = {reportTab: 'performance'};
	$scope.loader = {show: false};
	$scope.countries = [];
	$scope.languageCnt = [];
	$scope.selectedLanguage = [];
	$scope.suppliers = [];
	$scope.buyersArr = [];
	$scope.psidReportArr = [];
	$scope.profileDataReporrt = [];
	$scope.supplierHistoryData = [];
	$scope.surveyTrafficRecord = [];
	$scope.selectedBuyersArr = [];
	$scope.selectedSuppliersArr = [];
	$scope.transactionStatusArr = [];
	$scope.totalTransStatus = {};
	$scope.selectedCountry = {
		contryName : 'All',
		short_code: ''
	};

	$scope.selectedContries = [];
	$scope.mainSettings = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true
    };

	$scope.selectedSupplier = {
		name: 'All',
		id: 0
	}

	$scope.selectedBuyers = {
		name: 'All',
		id: 0
	}

	$scope.psidTransObject = {
		psid: "",
		transaction_id: "",
		resp_id: "",
		session_id: ""
	};

	$scope.inputBoxStatus = {
		psid_input: false,
		transaction_input : false,
		respondent_input: false,
		session_input: false
	}

	$scope.psidCheckModels = {
		reportType: "survey_data"
	};
	
	$scope.selectedTransStatus = [];
	if(_.has(config, "transStatus")) {
		$scope.transactionStatus = config.transStatus;
		_.each(config.transStatus, function(snglTrans) {
			$scope.selectedTransStatus.push({id: snglTrans.id});
		})
	}

	$scope.setReportTab = function(newTab){
      $scope.operatorReportData = {};
      $scope.active.reportTab = newTab;
       $scope.psidTransObject = {
			psid: "",
			transaction_id: "",
			resp_id: "",
			session_id: ""
		};
      $scope.checkInputBoxStatus();
    };
    $scope.isReportSet = function(tabNum){
        return $scope.active.reportTab === tabNum;
    };
    var statusCodeArr = [16,17,18,19,20,21,30,31,33];
    getCountries();
    getAllSuppliesr();
    getAllBuyers();

    function getCountries() {
        $scope.loader.show = true;
        $scope.country = new Array();
        commonApi.countries().success(function(data) {
            if (data.countries != null) {
                $scope.countries = data.countries.values;
                _.each($scope.countries, function(cntVal) {
                	$scope.selectedContries.push({"name": cntVal.name, "id": cntVal.id});
                	 _.each(cntVal.lang, function(cntLang) {
                	 	var object = {
                	 		"cntArr" : [],
                	 		"name": cntLang.name,
                	 		"l_id": cntLang.id
                	 	}
                	 	var findLang = _.findWhere($scope.languageCnt, {"name": cntLang.name});
                	 	if(findLang) {
                	 		var findIndex = _.indexOf($scope.languageCnt, findLang);
                	 		if(findIndex > -1) {
                	 			$scope.languageCnt[findIndex].cntArr.push(cntVal.id);
                	 		}
                	 	}
                	 	else {	
                	 		object.cntArr.push(cntVal.id);
                	 	    $scope.languageCnt.push(object);
                	 	}

                	 	$scope.selectedLanguage.push({"name": cntLang.name, "l_id": cntLang.id});
                	 })
                })
                $scope.selectedLanguage = _.uniq($scope.selectedLanguage, "name");
                for(var i = 1; i <= $scope.selectedLanguage.length; i++) {
                	$scope.selectedLanguage[i-1]["id"] = i;
                	$scope.languageCnt[i-1]["id"] = i;
                }
            }
            $scope.loader.show = false;
        }).error(function(err) {
            $scope.loader.show = false;
            notify({
                message: err.msg,
                classes: 'alert-danger',
                duration: 2000
            });
        });
    }

    //get list of Suppliers
	function getAllSuppliesr() {
		$scope.loader.show = true;
		var bodyObjet = {
			"supplier_type": "public",
			"isBuyr" : false
		}
		companyService.getAllSuppliersData(bodyObjet).then(
			function(response) {
				if(response && response.data && response.data.companies && response.data.companies.length > 0) {
					$scope.suppliers = response.data.companies;
					_.each(response.data.companies, function(supplr) {
						$scope.selectedSuppliersArr.push({name: supplr.name, id: supplr.id});
					})
					$scope.loader.show = false;
				}else {
					$scope.loader.show = false;
					notify({message:"No Suppliers found",classes:'alert-warning',duration:3000} );
				}
			}, 
			function(error) {
				$scope.loader.show = false;
				notify({message:"Error getting Suppliers",classes:'alert-danger',duration:3000} );
			});
	};

	//get list of Buyers
	function getAllBuyers() {
		$scope.loader.show = true;
		var bodyObjet = {
			"isSpplr": false,
			"isBuyr" : true
		}
		companyService.getAllBuyersData(bodyObjet).then(
			function(response) {
				if(response && response.data && response.data.companies && response.data.companies.length > 0) {
					$scope.buyersArr = response.data.companies;
					_.each(response.data.companies, function(buyer) {
						$scope.selectedBuyersArr.push({name: buyer.name, id: buyer.id});
					})
					$scope.loader.show = false;
				}else {
					$scope.loader.show = false;
					notify({message:"No Buyers found",classes:'alert-warning',duration:3000} );
				}
			}, 
			function(error) {
				$scope.loader.show = false;
				notify({message:"Error getting Buyers",classes:'alert-danger',duration:3000} );
			});
	};

    //select country
	$scope.selectCountry = function(country) {
		if(country == 'all') {
			$scope.selectedCountry.contryName = 'All';
			$scope.selectedCountry.short_code = 'All';
		}else {
			$scope.selectedCountry.contryName = country.name;
			$scope.selectedCountry.short_code = country.short_Code;
		}
	};

	//select Suppliers
	$scope.selectSupplier = function(supplr) {
		if(supplr == 'all') {
			$scope.selectedSupplier.name = 'All';
			$scope.selectedSupplier.id = 0;
		}else {
			$scope.selectedSupplier.name = supplr.name;
			$scope.selectedSupplier.id = supplr.id;
		}
	};

	//select Buyers
	$scope.selectBuyers = function(supplr) {
		if(supplr == 'all') {
			$scope.selectedBuyers.name = 'All';
			$scope.selectedBuyers.id = 0;
		}else {
			$scope.selectedBuyers.name = supplr.name;
			$scope.selectedBuyers.id = supplr.id;
		}
	};

    $scope.getReport = function(dateRange, reportCategory){
      if(dateRange && dateRange.startDate && dateRange.endDate && reportCategory){
      	$scope.loader.show = true;
        dateRange.startDate = moment(dateRange.startDate).format("YYYY-MM-DD");
        dateRange.endDate = moment(dateRange.endDate).format("YYYY-MM-DD");
        console.log('dateRange ',JSON.stringify(dateRange));
        console.log('reportCategory ',reportCategory);

        if(reportCategory == 'performance'){
        	if($scope.selectedTransStatus.length > 0 && $scope.selectedBuyersArr.length > 0) {
        		var performanceObj = {
        			buyers: $scope.selectedBuyersArr,
        			status: $scope.selectedTransStatus
        		}
	        	createSurvey.getPerformanceReport(dateRange, $scope.selectedCountry.short_code, performanceObj).success(function(response){
	        		if(response && response.apiStatus == "success" && response.result.length > 0){
	        			//console.log('performance response ',JSON.stringify(response));
	        			/*Empty the other Table response*/
	        			$scope.statsData = [];
	        			$scope.transData = [];
	        			$scope.salesData = [];
	        			$scope.supplierData = [];
	        			$scope.psidReportArr = [];
	        			$scope.profileDataReporrt = [];
		                $scope.supplierHistoryData = [];
		                $scope.surveyTrafficRecord = [];
		                $scope.transactionStatusArr = [];
	        			/*Empty the other Table response*/

	        			$scope.performance = response.result;
	        			_.each($scope.performance, function(eachPer){
	        				var buyerRevenue = new Number(),
			                	supplierRevenue = new Number(),
			                 	completes = new Number(),
			                 	validClicks = new Number(),
			                 	buyerClicks = new Number(),
			                 	totalClicks = new Number(),
			                 	loi = new Number(),
			                 	countabc = new Number(),
			                 	surveyName = new String(),
			                 	bName = new String()

		                 	_.each(eachPer.Payload, function(eachPayload){ 
		                 		if(eachPayload.statusCode == 21){
		                 			buyerRevenue = eachPayload.buyerRevenue;
			                        supplierRevenue = eachPayload.supplierRevenue;
			                        completes = eachPayload.total;
			                        loi = eachPayload.resLoi;
			                	}
			                	if (eachPayload.statusCode == 21 || eachPayload.statusCode == 18 || eachPayload.statusCode == 17 || eachPayload.statusCode == 19 ) {
			                        validClicks += eachPayload.total;
			                    }
			                    if (eachPayload.statusCode  == 21 || eachPayload.statusCode  == 18 || eachPayload.statusCode  == 17 || eachPayload.statusCode  == 19 || eachPayload.statusCode  == 20 || eachPayload.statusCode  == 30) {
			                        buyerClicks += eachPayload.total;
			                    }

			                    totalClicks += eachPayload.total;
			                    surveyName = eachPayload.surveyName;
			                    bName = eachPayload.bName;
					    	});
					    	

					    	eachPer.surveyName = surveyName;
					    	eachPer.bName = bName;
					    	if(eachPer.surveyManagementData[0]) {
						    	if(_.has(eachPer.surveyManagementData[0], "cpi_current")) {
						    		eachPer.cpi = eachPer.surveyManagementData[0].cpi_current.toFixed(2);	
						    	}

						    	eachPer.buyerRevenue = (Math.round((buyerRevenue) * 100) / 100);
						    	eachPer.supplierRevenue = (Math.round((supplierRevenue) * 100) / 100);
						    	eachPer.margin = Math.round((eachPer.buyerRevenue - eachPer.supplierRevenue) * 100) / 100 ;
						    	eachPer.completesInTimeFrame = completes;
						    	eachPer.totalCompletes = eachPer.surveyManagementData[0].fielded;
						    	eachPer.completesRemaining = eachPer.surveyManagementData[0].goal - eachPer.surveyManagementData[0].fielded;
						    	eachPer.loi_launch = Math.round( eachPer.surveyManagementData[0].loi_launch );
						    	eachPer.incidence_launch = Math.round(eachPer.surveyManagementData[0].incidence_launch);
					    	}
					    	eachPer.loi = Math.round( loi  * 100) / 100;
					    	eachPer.incidence_current = Math.round(( validClicks / totalClicks ) * 100 * 100) / 100;
					    	eachPer.totalClicks = totalClicks;
					    	eachPer.buyerClicks = buyerClicks;
					    	eachPer.validClicks = validClicks;
					    	eachPer.totalEPC = Math.round((buyerRevenue / totalClicks) * 100) / 100;
					    	eachPer.buyerEPC = Math.round((buyerRevenue / buyerClicks) * 100) / 100;
					    	eachPer.validEPC = Math.round((buyerRevenue  / validClicks) * 100) / 100;
				        });
	        		}
	        		else {
	        			notify({message : "No Record Found For Performance Report With Selected Criteria" , classes:'alert-danger', duration:2000});
	        		}
	        		$scope.loader.show = false;
	        	}).error(function(err){
	        		$scope.loader.show = false;
	        		notify({message : err , classes:'alert-danger', duration:2000});
					console.log('err ',JSON.stringify(err));
	        	});
            }
            else {
	    		$scope.loader.show = false;
				notify({message:"Please Enter Date Range and Select Values From Drop Down",classes:'alert-danger',duration:3000} );
    	    }
        }else if(reportCategory == 'stats'){
        	createSurvey.getDailyStatsReport(dateRange, $scope.selectedCountry.short_code).success(function(response){
        		if(response && response.apiStatus == "success"){
        			/*Empty the other Table response*/
        			$scope.performance = [];
        			$scope.transData = [];
        			$scope.salesData = [];
        			$scope.supplierData = [];
        			$scope.psidReportArr = [];
        			$scope.profileDataReporrt = [];
	                $scope.supplierHistoryData = [];
	                $scope.surveyTrafficRecord = [];
	                $scope.transactionStatusArr = [];
        			/*Empty the other Table response*/
        			//console.log('statsData '+JSON.stringify($scope.statsData));
        			$scope.statsData = [];
        			var	buyerRevenue = new Number(),
			                supplierRevenue  = new Number(),
			                completes = new Number(),
			                totalClicks = new Number(),
			                validClicks  = new Number(),
			                buyerClicks = new Number();

        			_.each(response.result, function(eachStats){

		                /*console.log('eachSale '+JSON.stringify(eachSale));*/
		                _.each(eachStats.Payload, function(eachStatsPayload){
		                	//console.log('eachStatsPayload '+JSON.stringify(eachStatsPayload));
		                	if(eachStatsPayload.statusCode == 21){
	                        	buyerRevenue += eachStatsPayload.buyerRevenue;
		                        completes += eachStatsPayload.total;
		                        supplierRevenue += eachStatsPayload.supplierRevenue;
		                	}
		                	if(eachStatsPayload.statusCode == 21 || eachStatsPayload.statusCode == 18 || eachStatsPayload.statusCode == 17 || eachStatsPayload.statusCode == 19) {
		                        validClicks += eachStatsPayload.total;
		                    }
		                    if (eachStatsPayload.statusCode == 21 || eachStatsPayload.statusCode == 18 || eachStatsPayload.statusCode == 17 || eachStatsPayload.statusCode == 19 || eachStatsPayload.statusCode == 20 || eachStatsPayload.statusCode == 30) {
		                    	buyerClicks +=  eachStatsPayload.total;
		                    }
		                    
		                    totalClicks += eachStatsPayload.total;
		                    
		                });

	                });
	                var tempStatsObj = {
	                	buyerRevenue: (Math.round(buyerRevenue * 100) / 100),
	                	overallCpi: (Math.round((buyerRevenue/completes) * 100) / 100),
	                	supplierRevenue: (Math.round(supplierRevenue * 100) / 100),
	                	margin : (Math.round((buyerRevenue - supplierRevenue) * 100) / 100),
	                	completes: completes,
	                	marginPerComplete: (Math.round(((buyerRevenue - supplierRevenue) / completes) * 100) / 100),
	                	totalClicks: totalClicks,
	                	buyerClicks: buyerClicks,
	                	validClicks: validClicks
	                };
	                $scope.statsData.push(tempStatsObj);
        		}
        		//console.log('$scope.statsData ',JSON.stringify($scope.statsData));
        		$scope.loader.show = false;
        	}).error(function(err){
        		$scope.loader.show = false;
        		notify({message : err , classes:'alert-danger', duration:2000});
            	console.log(err);
        	})

        }else if(reportCategory == 'trans'){
        	createSurvey.getSurveyTransReport(dateRange, $scope.selectedCountry.short_code).success(function(response){
        		if(response && response.apiStatus == "success"){
        			/*Empty the other Table response*/
        			$scope.performance = [];
        			$scope.statsData = [];
        			$scope.salesData = [];
        			$scope.supplierData = [];
        			$scope.psidReportArr = [];
        			$scope.profileDataReporrt = [];
	                $scope.supplierHistoryData = [];
	                $scope.surveyTrafficRecord = [];
	                $scope.transactionStatusArr = [];
        			/*Empty the other Table response*/
        			$scope.transData = response.result;
        			
        			var	buyerRevenue = new Number(),
		                supplierRevenue  = new Number(),
		                validClicks  = new Number(),
		                completes = new Number(),
		                buyerClicks = new Number(),
		                totalClicks = new Number();

        			_.each($scope.transData, function(eachTrans){
        				var surveyName = new String(),
	                		buyerRevenue = new Number(),
			                supplierRevenue  = new Number(),
			                validClicks  = new Number(),
			                completes = new Number(),
			                buyerClicks = new Number(),
			                totalClicks = new Number();


		                /*console.log('eachSale '+JSON.stringify(eachSale));*/
		                _.each(eachTrans.Payload, function(eachTransPayload){
		                	//console.log('eachTransPayload '+JSON.stringify(eachTransPayload));
		                	if(eachTransPayload.statusCode == 21){
	                        	buyerRevenue = eachTransPayload.buyerRevenue;
		                        supplierRevenue = eachTransPayload.supplierRevenue;
		                        completes = eachTransPayload.total;
		                	}
		                	if(eachTransPayload.statusCode == 21 || eachTransPayload.statusCode == 18 || eachTransPayload.statusCode == 17 || eachTransPayload.statusCode == 19) {
		                        validClicks += eachTransPayload.total;
		                    }
		                    if (eachTransPayload.statusCode == 21 || eachTransPayload.statusCode == 18 || eachTransPayload.statusCode == 17 || eachTransPayload.statusCode == 19 || eachTransPayload.statusCode == 20 || eachTransPayload.statusCode == 30) {
		                    	buyerClicks +=  eachTransPayload.total;
		                    }
		                    
		                    totalClicks += eachTransPayload.total;
		                    surveyName = eachTransPayload.surveyName;
		                    
		                });
		                eachTrans.surveyName = surveyName;
		                eachTrans.buyerRevenue = (Math.round((buyerRevenue) * 100) / 100);
		                eachTrans.supplierRevenue = (Math.round((supplierRevenue) * 100) / 100);
		                eachTrans.margin = Math.round((eachTrans.buyerRevenue - eachTrans.supplierRevenue) * 100) / 100;
		                eachTrans.completes = completes;
		                eachTrans.totalClicks = totalClicks;
		                eachTrans.buyerClicks = buyerClicks;
		                eachTrans.validClicks = validClicks;
		                eachTrans.totalEpc = (Math.round((buyerRevenue / totalClicks) * 100) / 100);
		                eachTrans.buyerEpc = (Math.round((buyerRevenue / buyerClicks) * 100) / 100);
		                eachTrans.validEpc = (Math.round((buyerRevenue / validClicks) * 100) / 100)
	                });
        		}
        		$scope.loader.show = false;
        	}).error(function(err){
        		$scope.loader.show = false;
        		notify({message : err , classes:'alert-danger', duration:2000});
            	console.log(err);
        	})
        }else if(reportCategory == 'sales'){
          	createSurvey.getBuyerSalesReport(dateRange, $scope.selectedCountry.short_code, $scope.selectedSupplier.id).success(function(response){
	            //console.log('response ',JSON.stringify(response));
	            if(response && response.apiStatus == "success"){
	            	/*Empty the other Table response*/
        			$scope.performance = [];
        			$scope.statsData = [];
        			$scope.transData = [];
        			$scope.supplierData = [];
        			$scope.psidReportArr = [];
        			$scope.profileDataReporrt = [];
	                $scope.supplierHistoryData = [];
	                $scope.surveyTrafficRecord = [];
	                $scope.transactionStatusArr = [];
        			/*Empty the other Table response*/
	            	$scope.salesData = response.result;
	            	// For Total of the Data
	            	$scope.grandTotal = {
		            	buyerRevenue : new Number(),
			            completes : new Number(),
			            validClicks : new Number(),
			            totalClicks : new Number(),
			            epc : new Number(),
			            totalEpc : new Number()
			        }

	                _.each($scope.salesData, function(eachSale){
	                	var buyerRevenue = new Number();
		                var completes = new Number();
		                var totalClicks = new Number();
		                var validClicks = new Number();
		                var buyerName = new String();
		                var epc = new Number();

		                /*console.log('eachSale '+JSON.stringify(eachSale));*/
		                _.each(eachSale.Payload, function(eachSaleTrans){
		                	//console.log('eachSaleTrans '+JSON.stringify(eachSaleTrans));
		                	if(eachSaleTrans.statusCode == 21){
		                		buyerRevenue = eachSaleTrans.buyerRevenue;
	                        	completes = eachSaleTrans.total;
		                	}
		                	if (eachSaleTrans.statusCode == 21 || eachSaleTrans.statusCode == 18 || eachSaleTrans.statusCode == 17 || eachSaleTrans.statusCode == 19) {
		                        validClicks += eachSaleTrans.total;
		                    }
		                    buyerName = eachSaleTrans.buyerName;
		                    if(_.contains(statusCodeArr, eachSaleTrans.statusCode)) {
		                    	totalClicks += eachSaleTrans.total;
		                    }
		                    epc = (Math.round((buyerRevenue / validClicks) * 100) / 100);
		                });

		                eachSale.buyerName = buyerName;
		                eachSale.buyerRevenue = Math.round(buyerRevenue * 100) /100;
		                eachSale.completes = completes;
		                eachSale.validClicks = validClicks;
		                eachSale.totalClicks = totalClicks;
		                eachSale.epc = epc;
		                eachSale.totalEpc = (Math.round((buyerRevenue / totalClicks) * 100) / 100);

		                $scope.grandTotal.buyerRevenue += (Math.round(buyerRevenue * 100) / 100);
		                $scope.grandTotal.completes += completes;
	                	$scope.grandTotal.validClicks += validClicks;
	                	$scope.grandTotal.totalClicks += totalClicks;
	                });
	                $scope.grandTotal.epc += (Math.round(($scope.grandTotal.buyerRevenue / $scope.grandTotal.validClicks) * 100) / 100);
	                $scope.grandTotal.totalEpc += (Math.round(($scope.grandTotal.buyerRevenue / $scope.grandTotal.totalClicks) * 100) / 100);
	                $scope.grandTotal.buyerRevenue = $scope.grandTotal.buyerRevenue.toFixed(2);
	                //console.log('$scope.salesData ', JSON.stringify($scope.salesData));
	            }
	            $scope.loader.show = false;
          	}).error(function(err){
          		$scope.loader.show = false;
          		notify({message : err , classes:'alert-danger', duration:2000});
            	console.log(err);
          	});
        }
        else if(reportCategory == 'suplr_report') {
        	createSurvey.getSuppliersReport(dateRange, $scope.selectedCountry.short_code,$scope.selectedBuyers.id).success(function(response){
	            //console.log('response ',JSON.stringify(response));
	            if(response && response.apiStatus == "success"){
	            	/*Empty the other Table response*/
        			$scope.performance = [];
        			$scope.statsData = [];
        			$scope.transData = [];
        			$scope.salesData = [];
        			$scope.psidReportArr = [];
        			$scope.profileDataReporrt = [];
	                $scope.supplierHistoryData = [];
	                $scope.surveyTrafficRecord = [];
	                $scope.transactionStatusArr = [];
        			$scope.supplierData = response.result;
        			// For Total of the Data
	            	$scope.grandTotal = {
		            	supplierRevenue : new Number(),
			            completes : new Number(),
			            validClicks : new Number(),
			            totalClicks : new Number(),
			            epc : new Number(),
			            totalEpc : new Number()
			        }
        			/*Empty the other Table response*/

        			_.each($scope.supplierData, function(eachSuplr){
		                var completes = new Number();
		                var totalClicks = new Number();
		                var validClicks = new Number();
		                var epc = new Number();
		                var totalEpc = new Number();
	                	var supplierRevenue = new Number();
		                var supplierName = new String();

		                /******************************/
		                _.each(eachSuplr.Payload, function(eachSupTrans){
		                	if(eachSupTrans.statusCode == 21) {
		                		supplierRevenue = eachSupTrans.supplierRevenue;
	                            completes = eachSupTrans.total;
		                	}
		                	if (eachSupTrans.statusCode == 21 || eachSupTrans.statusCode == 18 || eachSupTrans.statusCode == 17 || eachSupTrans.statusCode == 19 || eachSupTrans.statusCode == 16) {
		                		validClicks += eachSupTrans.total;
		                	}
		     
	                        
		                    supplierName = eachSupTrans.Supplier_name;
		                    totalClicks += eachSupTrans.total;
		                    /*if(_.contains(statusCodeArr, eachSupTrans.statusCode)) {
		                    }*/
		                    epc = (Math.round((supplierRevenue / validClicks) * 100) / 100);
		                });
		                /******************************/

		                eachSuplr.supplierName = supplierName;
		                eachSuplr.supplierRevenue = Math.round(supplierRevenue * 100) / 100;
		                eachSuplr.completes = completes;
		                eachSuplr.validClicks = validClicks;
		                eachSuplr.totalClicks = totalClicks;
		                eachSuplr.epc = epc;
		                eachSuplr.totalEpc = (Math.round((supplierRevenue / totalClicks) * 100) / 100);

		                $scope.grandTotal.supplierRevenue += (Math.round(supplierRevenue * 100) / 100);
		                $scope.grandTotal.completes += completes;
	                	$scope.grandTotal.validClicks += validClicks;
	                	$scope.grandTotal.totalClicks += totalClicks;
	                });

	                $scope.grandTotal.epc += (Math.round(($scope.grandTotal.supplierRevenue / $scope.grandTotal.validClicks) * 100) / 100);
	                $scope.grandTotal.totalEpc += (Math.round(($scope.grandTotal.supplierRevenue / $scope.grandTotal.totalClicks) * 100) / 100);
	                $scope.grandTotal.supplierRevenue = $scope.grandTotal.supplierRevenue.toFixed(2);
	            	
	            }
	            $scope.loader.show = false;
          	}).error(function(err){
          		$scope.loader.show = false;
          		notify({message : err , classes:'alert-danger', duration:2000});
            	console.log(err);
          	});
        }
        else {
        	 notify({message : "Unrecognized category" , classes:'alert-danger', duration:2000});
        }
      }else{
        notify({message : "Please select the date range" , classes:'alert-danger', duration:2000});
      }
    }

  //Function to check the value of Input Box and make rest disabled PD-1509
    $scope.checkInputBoxStatus = function() {
    	if($scope.psidTransObject.psid != "") {
    		$scope.inputBoxStatus.psid_input = false;
    		$scope.inputBoxStatus.transaction_input = true;
    		$scope.inputBoxStatus.respondent_input = true;
    		$scope.inputBoxStatus.session_input = true;
    	}
    	else if($scope.psidTransObject.transaction_id != "") {
    		$scope.inputBoxStatus.psid_input = true;
    		$scope.inputBoxStatus.transaction_input = false;
    		$scope.inputBoxStatus.respondent_input = true;
    		$scope.inputBoxStatus.session_input = true;
    	}
    	else if($scope.psidTransObject.resp_id != "") {
    		$scope.inputBoxStatus.psid_input = true;
    		$scope.inputBoxStatus.transaction_input = true;
    		$scope.inputBoxStatus.respondent_input = false;
    		$scope.inputBoxStatus.session_input = true;
    	}
    	else if($scope.psidTransObject.session_id != "") {
    		$scope.inputBoxStatus.psid_input = true;
    		$scope.inputBoxStatus.transaction_input = true;
    		$scope.inputBoxStatus.respondent_input = true;
    		$scope.inputBoxStatus.session_input = false;
    	}
    	else {
    		$scope.inputBoxStatus.psid_input = false;
    		$scope.inputBoxStatus.transaction_input = false;
    		$scope.inputBoxStatus.respondent_input = false;
    		$scope.inputBoxStatus.session_input = false;
    	}
    }
    
    //Function to Fetch report Data PD-1509
    $scope.psidTransactionReport = function() {
    	$scope.loader.show = true;
    	$scope.performance = [];
		$scope.statsData = [];
		$scope.transData = [];
		$scope.salesData = [];
		$scope.profileDataReporrt = [];
	    $scope.supplierHistoryData = [];
	    $scope.psidReportArr = [];
		$scope.supplierData = [];
		$scope.surveyTrafficRecord = [];
		$scope.transactionStatusArr = [];
        if(_.has($scope.psidCheckModels, "reportType") && $scope.psidCheckModels.reportType != "") {
 
        	if($scope.psidTransObject.psid != "" || $scope.psidTransObject.transaction_id != ""|| $scope.psidTransObject.resp_id != "" || $scope.psidTransObject.session_id != ""){
			  reportService.getPsidTransIdreport($scope.psidCheckModels.reportType, $scope.psidTransObject).then(
			  	 function(res) {
			  	 	if($scope.psidCheckModels.reportType == "survey_data") {
			  	 		if(res.data.result.length > 0) {
			  	 	     $scope.psidReportArr = res.data.result;
			  	 		}
			  	 		else {
			  	 			notify({message:"No Record Found", classes:'alert-danger',duration:3000} );
			  	 		}
			  	 	} 
			  	 	if($scope.psidCheckModels.reportType == "profile") {
			  	 		if(res.data.result.length > 0){
			  	 	     $scope.profileDataReporrt = res.data.result;
			  	 		}
			  	 		else {
			  	 			notify({message:"No Record Found", classes:'alert-danger',duration:3000} );
			  	 		}
			  	 	} 
			  	 	if($scope.psidCheckModels.reportType == "supplier_data") {
			  	 		if(res.data.result.length > 0){
			  	 	     $scope.supplierHistoryData = res.data.result;
			  	 	     _.each($scope.supplierHistoryData, function(sngldata) {
			  	 	     	if(_.has(sngldata, "cpi_total")) {
			  	 	     		sngldata.cpi_total = sngldata.cpi_total.toFixed(2);
			  	 	     	}
			  	 	     })
			  	 		}
			  	 		else {
			  	 			notify({message:"No Record Found", classes:'alert-danger',duration:3000} );
			  	 		}
			  	 	} 
			  	 	$scope.loader.show = false;
			  	 },
			  	 function(error) {
			  	 	$scope.loader.show = false;
			  	 	notify({message:error.data.msg,classes:'alert-danger',duration:3000} );
			  	 }
			  )
			}
			else {
				$scope.loader.show = false;
				notify({message:"Please Enter values",classes:'alert-danger',duration:3000} );
			}
        }
        else {
        	$scope.loader.show = false;
        	notify({message:"Please Select Atleast one Report Type",classes:'alert-danger',duration:3000} );
        }
    }
/*Function to show Survey Traffic Record PD-1508
*/
    $scope.surveyTrafficReport = function() {
    	$scope.loader.show = true;
    	$scope.loader.show = true;
    	$scope.performance = [];
		$scope.statsData = [];
		$scope.transData = [];
		$scope.salesData = [];
		$scope.profileDataReporrt = [];
	    $scope.supplierHistoryData = [];
	    $scope.psidReportArr = [];
		$scope.supplierData = [];
		$scope.transactionStatusArr = [];
		$scope.surveyTrafficRecord = [];
    	if($scope.psidTransObject.psid != "" || $scope.psidTransObject.transaction_id != ""|| $scope.psidTransObject.resp_id != "" || $scope.psidTransObject.session_id != "") {
    		reportService.getSurveyTransReport($scope.psidTransObject).then(
	    		function(res) {
	    			if(res.data.result.length > 0) {
		  	 	         $scope.surveyTrafficRecord = res.data.result;
		  	 		}
		  	 		else {
		  	 			notify({message:"No Record Found", classes:'alert-danger',duration:3000} );
		  	 		}
	    			$scope.loader.show = false;
	    		},
	    		function(err) {
	    			$scope.loader.show = false;
	    			notify({message:err.data.msg,classes:'alert-danger',duration:3000} );
	    		}
	    	);
    	}
    	else {
			$scope.loader.show = false;
			notify({message:"Please Enter values",classes:'alert-danger',duration:3000} );
		}
    }
/*Function to Generate Transaction Status Report
*/
    $scope.transactionStatusReport = function(dateRange) {
    	$scope.statsData = [];
		$scope.transData = [];
		$scope.salesData = [];
		$scope.supplierData = [];
		$scope.psidReportArr = [];
		$scope.profileDataReporrt = [];
	    $scope.supplierHistoryData = [];
	    $scope.surveyTrafficRecord = [];
    	$scope.transactionStatusArr = [];
    	
      	$scope.loader.show = true;
    	if($scope.selectedContries.length > 0 && $scope.selectedLanguage.length > 0 && $scope.selectedTransStatus.length > 0 && $scope.selectedBuyersArr.length > 0 && $scope.selectedSuppliersArr.length > 0 && dateRange && dateRange.startDate && dateRange.endDate) {
    		/*PD-1656*/
    		var langIds = _.pluck($scope.selectedLanguage, "l_id");
    		var selctedLngNm = [];
    		_.each($scope.selectedLanguage, function(langCd) {
    			var findLng = _.where($scope.languageCnt, {"l_id": langCd.l_id, "name": langCd.name});
    			if(findLng.length > 0) {
    				selctedLngNm = _.union(selctedLngNm, _.pluck(findLng, "name"))
    			}
    		})
    		var matchLangFlg = false;
    		_.each($scope.selectedContries, function(snglcnt) {
    			var matchCntLang = _.findWhere($scope.countries, {"id": snglcnt.id});
    			
    			if(matchCntLang) {
    				var langShortCd = _.pluck(matchCntLang.lang, "name")
    				var checkExistLang = _.intersection(selctedLngNm, langShortCd);
    				if(!checkExistLang.length) {
    					matchLangFlg = true;
    				}
    			}
    		})

    		if(matchLangFlg) {
    		    notify({message:"Language Not supported For Selected Country",classes:'alert-danger',duration:3000} );
    		    $scope.loader.show = false;
    		    return;
    		}

    		dateRange.startDate = moment(dateRange.startDate).format("YYYY-MM-DD");
            dateRange.endDate = moment(dateRange.endDate).format("YYYY-MM-DD");
            var PayloadObj = {
            	dateRange: dateRange,
            	country: $scope.selectedContries,
            	language: $scope.selectedLanguage,
            	tranStatue: $scope.selectedTransStatus,
            	buyers: $scope.selectedBuyersArr,
            	suppliers: $scope.selectedSuppliersArr
            }
            reportService.getTransactionStatusReport(PayloadObj).then(
            	function(resp) {
            		if(resp.data.result.length > 0) {
            			$scope.transactionStatusArr = resp.data.result;
            			$scope.totalTransStatus["grandTotal"] = $scope.transactionStatusArr[0].total;
            		}
            		else {
            			notify({message:"No Record Found For Transaction Status", classes:'alert-danger',duration:3000});
            		}
            		$scope.loader.show = false;
            	},
            	function(err) {
            		notify({message:err.data.msg, classes:'alert-danger',duration:3000} );
            		$scope.loader.show = false;
            	}
            );
    	}
    	else {
    		$scope.loader.show = false;
			notify({message:"Please Enter Date Range and Select Values From Drop Down",classes:'alert-danger',duration:3000} );
    	}
    }

    /*------------For Datatable---------*/
   $scope.dtOption = DTOptionsBuilder.newOptions().withOption('bLengthChange', false).withOption('paging', false).withOption('aaSorting', [1, 'desc']).withOption('bFilter', false);
    $scope.dtColumnDef = [];

    $scope.avoidClick = function( e ) { 
       e.stopPropagation();
    }

}]);