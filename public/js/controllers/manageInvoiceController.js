/*
 * controller for Invoice 
 * 
*/
angular.module('pureSpectrumApp')
.controller('invoiceCtrl',['$scope','$state', '$timeout','localStorageService','user','notify','companyService', 'settingService', 'createSurvey','ngProgressLite', '$rootScope','config','$stateParams','encodeDecodeFactory', 'invoiceService', 'FileSaver', 'Blob', function($scope, $state, $timeout, localStorageService, user, notify, companyService, settingService, createSurvey, ngProgressLite, $rootScope, config,$stateParams, encodeDecodeFactory, invoiceService, FileSaver, Blob){

	var base_url = config.pureSpecturm.url;
	//list of companies
	$scope.companies = [];
	//selected company 
	$scope.selectedCompany = {
		name : 'All',
		id : 0
	};
	//selected month
	$scope.selectedMonth = {
		mm : '01',
		month : 'January'
	}
	//seleted year
	$scope.selectedYear = 2018;

	//Loader
	$scope.tabs = {
      makeDisable : false
    };

	//get list of companies
	var getCompanies = function() {
		companyService.getInvoiceCompaniesData().then(
			function(response) {
				if(response && response.data && response.data.companies && response.data.companies.length > 0) {
					$scope.companies = response.data.companies;
				}else {
					//no companies found
					notify({message:"No companies found",classes:'alert-warning',duration:3000} );
				}
			}, 
			function(error) {
				notify({message:"Error getting Compnies",classes:'alert-danger',duration:3000} );
			});
	};

	//init function
	$scope.initData = function() {
		getCompanies();
	};

	//select company
	$scope.selectCompany = function(company) {
		if(company == 'all') {
			$scope.selectedCompany.name = 'All';
			$scope.selectedCompany.id = 0;
		}else {
			$scope.selectedCompany.name = company.name;
			$scope.selectedCompany.id = company.id;
		}
	};

	//select month
	$scope.monthSelect = function(mm, month) {
		$scope.selectedMonth.mm = mm;
		$scope.selectedMonth.month = month;
	}

	$scope.selectYear = function(yr) {
		$scope.selectedYear = yr;
	}

	//download invoice
	$scope.downloadInvoice = function() {
		var url =  base_url+'/survey/finance?company_id=' + $scope.selectedCompany.id + '&company_name=' + $scope.selectedCompany.name + '&period=' + $scope.selectedYear.toString() + $scope.selectedMonth.mm.toString();
        /*window.location.assign(url);*/
		invoiceService.fetchInvoiceFile($scope.selectedCompany.id, $scope.selectedCompany.name, $scope.selectedYear.toString() + $scope.selectedMonth.mm.toString()).then(
			function(response) {
				var fileName = response.data.fileName;
				window.open(invoiceService.downloadInvoice(fileName));

				// invoiceService.downloadInvoice(fileName).then(
				// 	function(response) {
				// 		console.log("response", response);
				// 	}, 
				// 	function(error) {
				// 		console.log("error is ", JSON.stringify(error));
				// 		notify({message: error.data.msg, classes:'alert-danger',duration:3000} );
				// 	});
			}, 
			function(error) {
				console.log("error is ", JSON.stringify(error));
				notify({message: error.data.msg, classes:'alert-danger',duration:3000} );
			});
	};

/*
*Function To download Buyer/Supplier Invoice statement monthly
*/
	$scope.downloadPdfInvoice = function(type) {
		$scope.tabs = {
	      makeDisable : true
	    };
		$scope.buyerInvoicePdfObj = {};
		$scope.supplierInvoicePdfObj = {};
		$scope.buyerInvoiceXlsxObj = {};
		$scope.supplierInvoiceXlsxObj = {};
		if(type === "buyerInvoiceReport" && type!=null && type!= undefined){
			$scope.buyerInvoicePdfObj.company_id = $scope.selectedCompany.id;
			$scope.buyerInvoicePdfObj.company_name = $scope.selectedCompany.name;
			$scope.buyerInvoicePdfObj.period = $scope.selectedYear.toString() + $scope.selectedMonth.mm.toString();
			$scope.buyerInvoicePdfObj.pdf_type = "buyerPdf";
			invoiceService.downloadPdfInvoiceFile($scope.buyerInvoicePdfObj).then(
				function(response) {
	  				var file = new Blob([response.data], {type: 'application/pdf'});
	                FileSaver.saveAs(file, ($scope.selectedCompany.name).replace(/ /g,'') + "-" +$scope.buyerInvoicePdfObj.period + ".pdf");
	                $scope.tabs = {
				      makeDisable : false
				    };

				}, 
				function(error) {
					$scope.tabs = {
				      makeDisable : false
				    };
					console.log("error---", JSON.stringify(error));
					var outBuff = arrayBufferToString(error.data);
					notify({message: outBuff, classes:'alert-danger',duration:3000} );
				});
		}
		else if(type === "supplierInvoiceReport" && type!=null && type!= undefined){
			$scope.supplierInvoicePdfObj.company_id = $scope.selectedCompany.id;
			$scope.supplierInvoicePdfObj.company_name = $scope.selectedCompany.name;
			$scope.supplierInvoicePdfObj.period = $scope.selectedYear.toString() + $scope.selectedMonth.mm.toString();
			$scope.supplierInvoicePdfObj.pdf_type = "supplierPdf";
			invoiceService.downloadPdfInvoiceFile($scope.supplierInvoicePdfObj).then(
				function(response) {
	  				var file = new Blob([response.data], {type: 'application/pdf'});
	                FileSaver.saveAs(file, ($scope.selectedCompany.name).replace(/ /g,'') + "-" +$scope.supplierInvoicePdfObj.period +".pdf");
	                $scope.tabs = {
				      makeDisable : false
				    };
				}, 
				function(error) {
					$scope.tabs = {
				      makeDisable : false
				    };
					console.log("error---", JSON.stringify(error));
					var outBuff = arrayBufferToString(error.data);
					notify({message: outBuff, classes:'alert-danger',duration:3000} );
				});
		}
		if(type === "buyerInvoiceXlsxReport" && type!=null && type!= undefined){
			$scope.buyerInvoiceXlsxObj.company_id = $scope.selectedCompany.id;
			$scope.buyerInvoiceXlsxObj.company_name = $scope.selectedCompany.name;
			$scope.buyerInvoiceXlsxObj.period = $scope.selectedYear.toString() + $scope.selectedMonth.mm.toString();
			$scope.buyerInvoiceXlsxObj.pdf_type = "buyerXlsx";
			
			invoiceService.downloadPdfInvoiceFile($scope.buyerInvoiceXlsxObj).then(
				function(response) {
	  				var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
	  			
	                FileSaver.saveAs(file, ($scope.selectedCompany.name).replace(/ /g,'') + "-" +$scope.buyerInvoiceXlsxObj.period +".xlsx");
	                $scope.tabs = {
				      makeDisable : false
				    };
				}, 
				function(error) {
					$scope.tabs = {
				      makeDisable : false
				    };
					console.log("error---", JSON.stringify(error));
					var outBuff = arrayBufferToString(error.data);
					notify({message: outBuff, classes:'alert-danger',duration:3000} );
				});
		}
		else {
			if(type === "supplierInvoiceXlsxReport" && type!=null && type!= undefined){
				$scope.supplierInvoiceXlsxObj.company_id = $scope.selectedCompany.id;
				$scope.supplierInvoiceXlsxObj.company_name = $scope.selectedCompany.name;
				$scope.supplierInvoiceXlsxObj.period = $scope.selectedYear.toString() + $scope.selectedMonth.mm.toString();
				$scope.supplierInvoiceXlsxObj.pdf_type = "supplierXlsx";
				invoiceService.downloadPdfInvoiceFile($scope.supplierInvoiceXlsxObj).then(
					function(response) {
		  				var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
		                FileSaver.saveAs(file, ($scope.selectedCompany.name).replace(/ /g,'') + "-" +$scope.supplierInvoiceXlsxObj.period +".xlsx");
		                $scope.tabs = {
					      makeDisable : false
					    };
					}, 
					function(error) {
						$scope.tabs = {
					      makeDisable : false
					    };
						console.log("error---", JSON.stringify(error));
						var outBuff = arrayBufferToString(error.data);
						notify({message: outBuff, classes:'alert-danger',duration:3000} );
					});
			}
		}
	};


	//Convert arrayBuffer to string
	function arrayBufferToString(buffer){
	    var arr = new Uint8Array(buffer);
	    var str = String.fromCharCode.apply(String, arr);
	    if(/[\u0080-\uffff]/.test(str)){
	        throw new Error("this string seems to contain (still encoded) multibytes");
	    }
	    return str;
	}

}]);

   