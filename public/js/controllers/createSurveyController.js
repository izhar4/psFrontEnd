/**
 * Created by Parveen on 3/8/2016.
 */
//angular.module('pureSpectrumApp')

psApp.controller('surveyCtrl', ['$scope', '$http', '$state', '$cookies', '$window', 'config', 'commonApi', 'createSurvey', 'notify', 'user', 'localStorageService', 'ngProgressLite', '$stateParams', '$rootScope', 'Upload', '$timeout','$translate', '$location', 'encodeDecodeFactory', '$filter', function($scope, $htpt, $state, $cookies, $window, config, commonApi, createSurvey, notify, user, localStorageService, ngProgressLite, $stateParams, $rootScope, Upload, $timeout, $translate, $location, encodeDecodeFactory, $filter) {
    var userData = localStorageService.get('logedInUser');
    $scope.cntryCombo = new Object();
    $scope.sltGender = new Array();
    $scope.sltDevice = new Array();
    $scope.sltRelation = new Array();
    $scope.sltEducation = new Array();
    $scope.sltEmployment = new Array();
    $scope.sltRelation = new Array();
    $scope.sltRace = new Array();
    $scope.sltChildren = new Array();

    $scope.sltRaceBera = new Array();
    $scope.hispanicOrigin = new Array();
    var saveAllThreePageData = new Array(); //PD-1003

    $scope.cpi = 0;
    $scope.completes = 0;
    $scope.total = 0;
    $scope.currency_symbol = '';
    $scope.currencyFx = {fx: 321,symbol: '$'};
    $scope.blrFld = {};
    //when creating survey status is 00
    $scope.surveyStatus = 00;
    $scope.totalCompletes = 0;
    $scope.ageData = {
        "min": 18,
        "max": 99
    };
    $scope.houseHoldIncome = {
        "min": 0,
        "max": 999999
    };

    //show loader icon
    $scope.loader = {
        show : false
    };
    $scope.manageEdit = false;
    if($stateParams.edit){
        if($stateParams.edit == 'editStep1'){
            $scope.manageEdit = true;
        }else{
            $state.go('home');
        }
    }
    $scope.field_time = 0; //PD-569

    // Quota Related Flags
    $scope.raceQuotaFlag = {
        resetRace : true,
        hasRaceFlag: false,
        editRaceFlag: false,
        raceFlxValue: '0',
        raceFlx: true
    }
    $scope.gndrQuotaFlag = {
        resetGen : true,
        hasGndrFlag: false,
        editGndrFlag: false,
        gndrFlxValue: '0',
        gndrFlx: true
    }
    $scope.rlnQuotaFlag = {
        resetRel : true,
        hasRlnFlag: false,
        editRlnFlag: false,
        rlnFlxValue: '0',
        rlnFlx: true
    } 
    $scope.empQuotaFlag = {
        resetEmp : true,
        hasEmpFlag: false,
        editEmpFlag: false,
        empFlxValue: '0',
        empFlx: true
    } 
    $scope.eduQuotaFlag = {
        resetEdu : true,
        hasEduFlag: false,
        editEduFlag: false,
        eduFlxValue: '0',
        eduFlx: true
    } 
    $scope.dvcQuotaFlag = {
        resetDev : true,
        hasDeviceFlag: false,
        editDvcFlag: false,
        dvcFlxValue: '0',
        dvcFlx: true
    }
    $scope.rbQuotaFlag = {
        resetRb : true,
        hasRbFlag: false,
        editRbFlag: false,
        rbFlxValue: '0',
        raceBeraFlx: true
    }   
    $scope.hisQuotaFlag = {
        resetHisOri : true,
        hasHisOriFlag: false,
        editHisOriFlag: false,
        hispanicFlxValue: '0',
        hispanicFlx: true
    }
    $scope.regQuotaFlag = {
        resetReg : true,
        hasRegionFlag: false,
        editRegionFlag: false,
        regionFlxValue: '0',
        regionFlx: true
    } 
    $scope.dvsnQuotaFlag = {
        resetDivi : true,
        hasDivisionFlag: false,
        editDivisionFlag: false,
        divisionFlxValue: '0',
        divisionFlx: true
    }
    $scope.childQuotaFlag = {
        resetChild: true,
        hasChldFlag: false,
        editChldFlag: false,
        chldFlxValue : '0',
        chldFlx: true
    }
    $scope.ageQuotaFlag = {
        resetAge: true,
        hasAgeFlag: false,
        editAgeFlag: false,
        ageFlxValue : '0',
        ageFlx: true,
        clearAgeFlag: false
    }
    $scope.incomeQuotaFlag = {
        resetInc: true,
        hasIncomeFlag: false,
        editIncomeFlag: false,
        incomeFlxValue : '0',
        incFlx: true,
        clearIncomeFlag: false
    }

    //PD-1130
    $scope.censusRepoFlag = {
        hasCensusRepoGndr : false,
        hasCensusRepoAge : false,
        hasCensusRepoIncome : false,
        hasCensusRepoRace : false,
        hasCensusRepoHis : false,
        hasCensusRepoEdu : false,
        hasCensusRepoEmploy : false
    }

    $scope.ageTlt = true;
    $scope.incmTlt = true;
   
    $scope.goFinalSurvey = false;

    $scope.ageTempArr = new Array();
    $scope.incomeTempArr = new Array();
    $scope.chldTempArr = new Object();
    $scope.lngFlag = false;
    
    
    $scope.diableAdvanceTarget = false;
    
    $scope.totalRemRace = 0;
    $scope.selectionRegion = true;
    $scope.selectionDivision = true;
    $scope.selectionState = true;

    $scope.sltDivision = [];
    $scope.division = [];

    $scope.sltRegion = [];
    $scope.region = [];

    $scope.properties = {};
    $scope.properties.clickBalance = 0;
    $scope.properties.quotas = new Array();
    $scope.allProperties = {};
    $scope.countryCh = new Array();
    //$scope.age = new Array();
    //$scope.houseHoldIncome=[];

    $scope.comArray = [];
    $scope.srvId = $stateParams.key;

    $scope.incomeInputBoxVal = {
        "maxlength":6,
        "placeholder":999999
    }

    //Reset modal
    $scope.resetStateQuotas = true;


    //Variable used for grouping
    $scope.raceGrouping = {check: false};
    $scope.empGrouping = {check: false};
    $scope.eduGrouping = {check: false};
    $scope.rlnGrouping = {check: false};
    //PD-1402
    $scope.raceBeraGrouping = {check: false};
    $scope.deviceGrouping = {check : false};
    $scope.censusRegnGrouping = {check : false};
    $scope.devisionGrouping = {check: false};
    $scope.stateGrouping = {check: false};
    $scope.dmaGrouping = {check: false};
    $scope.csaGrouping = {check: false};
    $scope.msaGrouping = {check: false};
    $scope.countyGrouping = {check: false};
    $scope.AdvGrouping = {check: false};

    getCountries();
    getSampleTitle();

    $scope.mainSettings = {
        scrollableHeight: '200px',
        scrollable: true
    };

    $scope.location = {
        zipcode: {
            values: []
        }
    };

    //Variables used for condition grouping PD-961
    $scope.conditionGroupingArray = new Object();
    $scope.newraceModal = new Array();
    $scope.newrelationModal = new Array();
    $scope.groupingemploymentModal = new Array();
    $scope.groupingeducationModal = new Array();
    var raceModelLiveEdit = new Array();
    var relationModelLiveEdit = new Array();
    var employmentModelLiveEdit = new Array();
    var educationModelLiveEdit = new Array();
    //PD-1402
    $scope.groupingRaceBeraModel = new Array();
    var raceBeraModelLiveEdit = new Array();
    $scope.groupingDeviceModel = new Array();
    var deviceModelLiveEdit = new Array();
    $scope.groupingCensusRgnModel = new Array();
    var censusRgnModelLiveEdit = new Array();
    $scope.groupingDivisionModel = new Array();
    var divisionModelLiveEdit = new Array();
    $scope.groupingStateModel = new Array();
    $scope.groupingDmaModel = new Array();
    $scope.groupingCsaModel = new Array();
    $scope.groupingMsaModel = new Array();
    $scope.groupingCountyModel = new Array();

    
    //Check fielded value less than Allocations in quota modal
    $scope.gndrAllocationsLessThanFielded = false;
    $scope.ageAllocationsLessThanFielded = false;
    $scope.incomeAllocationsLessThanFielded = false;
    $scope.raceAllocationsLessThanFielded = false;
    $scope.rlnAllocationsLessThanFielded = false;
    $scope.chldAllocationsLessThanFielded = false;
    $scope.eduAllocationsLessThanFielded = false;
    $scope.empAllocationsLessThanFielded = false;
    $scope.deviceAllocationsLessThanFielded = false;
    $scope.rgnAllocationsLessThanFielded = false;
    $scope.dvsnAllocationsLessThanFielded = false;
    $scope.dmaAllocationsLessThanFielded = false;
    $scope.csaAllocationsLessThanFielded = false;
    $scope.msaAllocationsLessThanFielded = false;
    $scope.countyAllocationsLessThanFielded = false;
    $scope.stateAllocationsLessThanFielded = false;
    $scope.zipcodeAllocationsLessThanFielded = false;

    $scope.liveSurveyEditingStep = $state.params.edit;
    //zipcodes values out scope
    var zipcodesDataArr = [];
    var zipcodeFilePath = "";
    //call this method after completing getMasterData call 
    //getSurveyDetailsForUpdate($stateParams.key);
    $scope.disableQualification = true;

    $scope.properties.country = 1; //US
    $scope.properties.language = 1; //english
    $scope.blrFld.cntry = 1;
    $scope.blrFld.lang = 1;
    $scope.languageValue = "";

    //make child drop-down enable only in UAT
    $scope.childDisabled = true;
    /*if(config.app == "pureSpectrumApp-Staging"){
        $scope.childDisabled = false;
    }*/

    // PD-711 Quota Management V2
    var genderQual = new Array();
    var ageQual = new Array();
    var incomeQual = new Array();
    var raceQual = new Array();
    var relationQual = new Array();
    var empQual = new Array();
    var eduQual = new Array();
    var devQual = new Array();
    var statesQual = new Array();
    var csaQual = new Array();
    var msaQual = new Array();
    var dmaQual = new Array();
    var countyQual = new Array();
    var regionQual = new Array();
    var divisionQual = new Array();
    var raceBeraQual = new Array();
    var hispanicQual = new Array();
    var childQual = new Array();

    /*-------Auto Nesting Variables-------*/

    $scope.nestingQuotasArr = new Array();   // Only Stores the names of the nested quotas
    $scope.nestingQuotasArrFinal = new Array(); // Stores Nested Array names which are applied
    var nestingQuotasDetailObj = new Object();  //Stores Raw Data for making Cartesian product of Arrays
    var nestingResults = new Array();    // Store the data comes after catesian product
    $scope.nestedQuotasUiObj = new Array();     // Used to show Data on UI 
    $scope.nestedQuota = {has : false};
    var nestedTempQuotaData = new Array();    // temp array to hold all nested Quotas till saving

    /*-------Auto Nesting Variables Ends-------*/

    /*--------Advance targeting Variables------*/
    $scope.selectedOptions = new Array();  // Hold selected Options
    var advanceQual = new Array();       // Used for the advance qualifications
    var advanceData = new Array();      // Using for creating payload
    $scope.tempAdvArray = new Array();   // Using for showing buttons and their data
    var advQuota = new Array();
    /*-----Advance targeting Variables Ends----*/

    var surveyLocale = ($location.search().locale !== undefined ? encodeDecodeFactory.decode($location.search().locale) : '');
    $scope.properties.countryCode = (surveyLocale !== '' ? surveyLocale.countryCode : 'US' ); // set in query string of update survey
    $scope.properties.countryName = (surveyLocale !== '' ? surveyLocale.countryName : 'United States' );//'United States';
    setLocationViews($scope.properties.countryCode);

    $scope.properties.languageCode = (surveyLocale !== '' ? surveyLocale.languageCode : 'eng' );
    $scope.properties.languageName = (surveyLocale !== '' ? surveyLocale.languageName : 'English' ); 
    $scope.properties.languageTranslate = (surveyLocale !== '' ? surveyLocale.languageTranslate : 'en' );

    //get survey id of survey
    //console.log("$location.search().survey_id ",$location.search().survey_id)
    if($location.search().survey_id !== undefined) {
        $scope.newId = parseInt($location.search().survey_id);
        $rootScope.clone = true;
    }

    $scope.setSample = function(id) {
        $scope.properties.samplesType = id;
    };

    //toggle flags for fields
    $scope.fieldsFlags = {
        relationship : true,
        race : true,
        children : true,
        employment : true,
        education : true,
        device : true,
        advTarget : false,
        location : true,
        bera: false,  // Added for Bera
        census: true,
        clickBal: false
    };

    /*---For Bera-----*/
    if(_.contains(config.bera, userData.cmp) || userData.operatorAcssLvls == 'admin'){
        $scope.fieldsFlags.bera = true;
    }
    /*---For Adavnce Targetting----PD-1344*/
    var adavnceTargetEnableDisable = function() {
        if(_.contains(config.advanceTarget, userData.cmp) || userData.operatorAcssLvls == 'admin' || config.app == "pureSpectrumApp-Dev"){
            $scope.fieldsFlags.advTarget = true;
        }
    }
    //options to show when country is selected
    var optionsToDisplay = function(country) {
        $scope.fieldsFlags.gender = _.contains(config.countryInQuals.gender, country)? true:false;
        $scope.fieldsFlags.age = _.contains(config.countryInQuals.age, country)?true:false;
        $scope.fieldsFlags.hhi = _.contains(config.countryInQuals.hhi, country)?true:false;
        $scope.fieldsFlags.race = _.contains(config.countryInQuals.race, country)?true:false;
        $scope.fieldsFlags.relationship = _.contains(config.countryInQuals.relationship, country)?true:false;
        $scope.fieldsFlags.children = _.contains(config.countryInQuals.children, country)?true:false;
        $scope.fieldsFlags.employment = _.contains(config.countryInQuals.employment, country)?true:false;
        $scope.fieldsFlags.education = _.contains(config.countryInQuals.education, country)?true:false;
        $scope.fieldsFlags.device = _.contains(config.countryInQuals.device, country)?true:false;
        $scope.fieldsFlags.location = _.contains(config.countryInQuals.location, country)?true:false;

        $scope.fieldsFlags.census = _.contains(config.countryInQuals.census, country)?true:false;
        if(_.contains(config.countryInQuals.bera, country)){
            if(_.contains(config.bera, userData.cmp) || userData.operatorAcssLvls == 'admin' || config.app == "pureSpectrumApp-Dev" || config.app == "pureSpectrumApp-Staging"){
                $scope.fieldsFlags.bera = true;
            }else{
                $scope.fieldsFlags.bera = false;
            }
        }else{
            $scope.fieldsFlags.bera = false;
        }
        if(_.contains(config.clickBal, userData.cmp) || userData.operatorAcssLvls == 'admin' || config.app == "pureSpectrumApp-Dev" || config.app == "pureSpectrumApp-Staging"){
            $scope.fieldsFlags.clickBal = true;
        }
        adavnceTargetEnableDisable();//PD-1344
    };

    //reset survey data
    var resetSurveyData = function() {
        $scope.clearAllLocation();

        $scope.raceQuotaFlag = {
            resetRace : true,
            hasRaceFlag: false,
            editRaceFlag: false,
            raceFlxValue: '0',
            raceFlx: true
        }
        $scope.gndrQuotaFlag = {
            resetGen : true,
            hasGndrFlag: false,
            editGndrFlag: false,
            gndrFlxValue: '0',
            gndrFlx: true
        }
        $scope.rlnQuotaFlag = {
            resetRel : true,
            hasRlnFlag: false,
            editRlnFlag: false,
            rlnFlxValue: '0',
            rlnFlx: true
        } 
        $scope.empQuotaFlag = {
            resetEmp : true,
            hasEmpFlag: false,
            editEmpFlag: false,
            empFlxValue: '0',
            empFlx: true
        } 
        $scope.eduQuotaFlag = {
            resetEdu : true,
            hasEduFlag: false,
            editEduFlag: false,
            eduFlxValue: '0',
            eduFlx: true
        } 
        $scope.dvcQuotaFlag = {
            resetDev : true,
            hasDeviceFlag: false,
            editDvcFlag: false,
            dvcFlxValue: '0',
            dvcFlx: true
        }
        $scope.rbQuotaFlag = {
            resetRb : true,
            hasRbFlag: false,
            editRbFlag: false,
            rbFlxValue: '0',
            raceBeraFlx: true
        }   
        $scope.hisQuotaFlag = {
            resetHisOri : true,
            hasHisOriFlag: false,
            editHisOriFlag: false,
            hispanicFlxValue: '0',
            hispanicFlx: true
        }
        $scope.regQuotaFlag = {
            resetReg : true,
            hasRegionFlag: false,
            editRegionFlag: false,
            regionFlxValue: '0',
            regionFlx: true
        } 
        $scope.dvsnQuotaFlag = {
            resetDivi : true,
            hasDivisionFlag: false,
            editDivisionFlag: false,
            divisionFlxValue: '0',
            divisionFlx: true
        }
        $scope.childQuotaFlag = {
            resetChild: true,
            hasChldFlag: false,
            editChldFlag: false,
            chldFlxValue : '0',
            chldFlx: true
        }
        $scope.ageQuotaFlag = {
            resetAge: true,
            hasAgeFlag: false,
            editAgeFlag: false,
            ageFlxValue : '0',
            ageFlx: true,
            clearAgeFlag: false
        }
        $scope.incomeQuotaFlag = {
            resetInc: true,
            hasIncomeFlag: false,
            editIncomeFlag: false,
            incomeFlxValue : '0',
            incFlx: true,
            clearIncomeFlag: false
        }

        //PD-1130
        $scope.censusRepoFlag = {
            hasCensusRepoGndr : false,
            hasCensusRepoAge : false,
            hasCensusRepoIncome : false,
            hasCensusRepoRace : false,
            hasCensusRepoHis : false,
            hasCensusRepoEdu : false,
            hasCensusRepoEmploy : false
        }
        //$scope.resetGen = true;
        //$scope.resetInc = true;

        $scope.ageSltBoxVal();
        $scope.incomeSltBoxVal();
        
        $scope.genderResetModal();
        $scope.empResetModal();
        $scope.raceResetModal();
        $scope.relationResetModal();
        $scope.eduResetModal();
        $scope.childResetModal();
        $scope.deviceResetModal();
        $scope.rbResetModal();
        $scope.hispanicResetModal();

        $scope.clearFields();
        $scope.clearNesting();
        $scope.removeAllAdvTarget();
    }

    //selected country
    var selctdCountry = {};
    var setSelectedCountry = function(item) {
        $scope.lngFlag = true;
        $scope.properties.country = item.id;
        $scope.properties.countryCode = item.short_Code;
        $scope.properties.countryName =  item.name;
        
        $timeout(function() {
            $scope.countryValue = item.name;
        },0);
        
    
        $scope.blrFld.cntry = item.id;

        if ($scope.blrFld.lang && $scope.blrFld.cntry && $scope.blrFld.LOI && $scope.blrFld.incd) {
            getSurveyHeaderPricingValue($scope.blrFld.lang, $scope.blrFld.cntry, $scope.blrFld.LOI, $scope.blrFld.incd)
        }

        commonApi.getLanguageByCountry(item.id).success(function(data) {
            //$scope.languageValue = 'Select Language';
            $scope.lang = [];
            // $scope.properties.countryCode = data.short_Code;
            //$scope.properties.countryName =  data.name;
            setLocationViews($scope.properties.countryCode);
            if (data && data.languages && data.languages.length > 0) {

                //$scope.lang.concat(data.languages.values[0].lang);
                $scope.lang = data.languages;
                $scope.setLanguage(data.languages[0].id);

                $scope.disableQualification = false;
                getMasterDataByCountryLang($scope.properties.countryCode, data.languages[0].short_code);
                optionsToDisplay($scope.properties.countryCode);
            }
        }).error(function(err) {
            notify({
                message: "Something went wrong in fetching Languages",
                classes: 'alert-danger',
                duration: 2000
            });
        });

        selctdCountry = {};
        resetSurveyData();
    }
    
    $scope.checkDirty = false;
    
    $scope.setCountry = function(event, item) {
        event.preventDefault();
        event.stopPropagation();
        selctdCountry = item;
        // When Country changes remove the current Location Data
        $scope.locationData = {"type":"","selected":false,"currentClickItem":"","currIndex":0,"currItem":{},"achieved":0};
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

    }

    $scope.setCountrySelected = function() {
        if(selctdCountry && selctdCountry.id) {
            setSelectedCountry(selctdCountry);
            // resetSurveyData();
            $scope.checkDirty = false;
        }
    };

    $scope.cancelCountrySelected = function() {
        selctdCountry = {};
        var item = _.find($scope.country, function(n) {
            return (n.id == $scope.properties.country)
            
        });
        setSelectedCountry(item);   
    }

    $scope.setLanguage = function(id) {
        $scope.blrFld.lang = id;
        $scope.properties.language = id;
        if($scope.lang.length > 0) {
            $scope.lang.forEach(function(singleLang){
                if(singleLang.id !== undefined && singleLang.id == id && singleLang.short_code !== undefined) {
                    $scope.properties.languageCode = singleLang.short_code;
                    $scope.properties.languageName = singleLang.name;
                    document.getElementById("languagedrop").innerHTML = singleLang.name; //update value in UI
                    $scope.properties.languageTranslate = singleLang.transalte_code;
                    $translate.use($scope.properties.languageTranslate);
                }
            })
        }
        if ($scope.blrFld.lang && $scope.blrFld.cntry && $scope.blrFld.LOI && $scope.blrFld.incd) {
            getSurveyHeaderPricingValue($scope.blrFld.lang, $scope.blrFld.cntry, $scope.blrFld.LOI, $scope.blrFld.incd)
        }


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
                "division": {
                    "name":"Census Division",
                    "isVisible":true,
                },
                "state": {
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
                "state": {
                    "name":"Province",
                    "isVisible":true,
                },
                "zipcode": {
                    "name":"Postal Codes",
                    "isVisible":true,
                }
            },
            "IN" :{
                "netrep": {
                    "name":"Nat Rep",
                    "isVisible":false,
                },
                "region": {
                    "name":"Census Region",
                    "isVisible":false,
                },
                "state": {
                    "name":"State",
                    "isVisible":true,
                },
                "zipcode": {
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
                "region": {
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
                "dma": {
                    "name":"District",
                    "isVisible":false,
                }
            }
        };
        $scope.locationViews = locationViews[countryCode];
    }

    // Defining masterData globally to use in quota Structures V2
    var masterData = [];
    var currency_units = new Number();
    var age_units = new Object();
    function getMasterDataByCountryLang(countryCode, languageCode){
        ngProgressLite.start();
        $scope.loader.show = true;
        createSurvey.getMasterDataByCountryLang(countryCode, languageCode).success(function(data){
            ngProgressLite.done();
            $scope.loader.show = false;
            if(data.apiStatus == "Success"){
                var defaultLanguage = 'eng'; // to show all the options in create survey page in english only whether selected language may be different
                masterData = data.values;  // MasterData Values stored in this variable for further use
                _.each(masterData, function(elm){
                    if(elm.data && elm.data[countryCode] && elm.data[countryCode][defaultLanguage] && elm.category == 'simple') {
                        if(elm.masterKey == "gender"){
                            $scope.sltGender = [];
                            $scope.genderInfo = elm.data[countryCode][defaultLanguage];
                            $scope.app.gender = elm.data[countryCode][defaultLanguage];
                            genderQual.push({
                                "qualification_code": elm.id,
                                "q_type": "normal",
                                "q_category": "basic",
                                "q_name": elm.masterKey,
                                "is_default":true,
                                "conditions":[]
                            });
                            _.each($scope.genderInfo, function(gender){
                                gender.selected = true;
                                gender.fieldName = "Gender";
                                gender.qual_id = elm.id;
                                gender.qual_name = elm.masterKey;
                                $scope.sltGender.push({
                                    "id": gender.id,
                                    "qual_id":elm.id
                                });
                                //genderQual[0].conditions.push(gender.id);
                            });
                        } 
                        if(elm.masterKey == "race"){
                            $scope.sltRace = [];
                            $scope.race = elm.data[countryCode][defaultLanguage];
                            $scope.app.race = elm.data[countryCode][defaultLanguage];
                            raceQual.push({
                                "qualification_code": elm.id,
                                "q_type": "normal",
                                "q_category": "basic",
                                "q_name": elm.masterKey,
                                "is_default":true,
                                "conditions":[]
                            });
                            _.each($scope.race, function(race){
                                race.selected = true;
                                race.fieldName = "Race";
                                race.qual_id = elm.id;
                                race.qual_name = elm.masterKey;
                                $scope.sltRace.push({
                                    "id": race.id,
                                    "qual_id":elm.id
                                });
                                //raceQual[0].conditions.push(race.id);
                            });

                        } 
                        if(elm.masterKey == "relationships"){
                            $scope.sltRelation = [];
                            $scope.relation = elm.data[countryCode][defaultLanguage];
                            $scope.app.relation = elm.data[countryCode][defaultLanguage];
                            relationQual.push({
                                "qualification_code": elm.id,
                                "q_type": "normal",
                                "q_category": "basic",
                                "q_name": elm.masterKey,
                                "is_default":true,
                                "range_sets":[]
                            });
                            _.each($scope.relation, function(relation){
                                relation.selected = true;
                                relation.fieldName = "Relationship";
                                relation.qual_id = elm.id;
                                relation.qual_name = elm.masterKey;
                                $scope.sltRelation.push({
                                    "id": relation.id,
                                    "qual_id":elm.id
                                });
                                //relationQual[0].conditions.push(relation.id);
                            });
                        } 
                        if(elm.masterKey == "children"){
                            $scope.chldTempArr = {};
                            $scope.children = elm.data[countryCode][defaultLanguage];
                            $scope.app.children = elm.data[countryCode][defaultLanguage];
                            childQual.push({
                                "qualification_code": elm.id,
                                "q_type": "normal",
                                "q_category": "basic",
                                "q_name": elm.masterKey,
                                "is_default":true,
                                "conditions":[]
                            });
                            _.each($scope.children, function(children){
                                children.selected = true;
                                children.fieldName = "Children";
                                children.qual_id = elm.id;
                                children.qual_name = elm.masterKey;
                                $scope.sltChildren.push({
                                    "id": children.id,
                                    "qual_id":elm.id
                                });
                            });
                            $scope.chldTempArr = {
                                'no':[{ 'flexPer':0, 'min':'', 'max':'', 'id':111, 'qual_id': elm.id, 'qual_name': elm.masterKey}],
                                'have':[{'flexPer':0, 'min':'', 'max':'', 'id':112, 'qual_id': elm.id, 'qual_name': elm.masterKey}]
                            };
                        } 
                        if(elm.masterKey == "employments"){
                            $scope.sltEmployment = [];
                            $scope.employement = elm.data[countryCode][defaultLanguage];
                            $scope.app.employement = elm.data[countryCode][defaultLanguage];
                            empQual.push({
                                "qualification_code": elm.id,
                                "q_type": "normal",
                                "q_category": "basic",
                                "q_name": elm.masterKey,
                                "is_default":true,
                                "conditions":[]
                            });
                            _.each($scope.employement, function(employement){
                                employement.selected = true;
                                employement.fieldName = "Employment";
                                employement.qual_id = elm.id;
                                employement.qual_name = elm.masterKey;
                                $scope.sltEmployment.push({
                                    "id": employement.id,
                                    "qual_id":elm.id
                                });
                                //empQual[0].conditions.push(employement.id);
                            });
                        } 
                        if(elm.masterKey == "educations"){
                            $scope.sltEducation = [];
                            $scope.education = elm.data[countryCode][defaultLanguage];
                            $scope.app.education = elm.data[countryCode][defaultLanguage];
                            eduQual.push({
                                "qualification_code": elm.id,
                                "q_type": "normal",
                                "q_category": "basic",
                                "q_name": elm.masterKey,
                                "is_default":true,
                                "conditions":[]
                            });
                            _.each($scope.education, function(education){
                                education.selected = true;
                                education.fieldName = "Education";
                                education.qual_id = elm.id;
                                education.qual_name = elm.masterKey;
                                $scope.sltEducation.push({
                                    "id": education.id,
                                    "qual_id":elm.id
                                });
                                //eduQual[0].conditions.push(education.id);
                            });
                        } 
                        if(elm.masterKey == "device"){
                            $scope.sltDevice = [];
                            $scope.deviceInfo = elm.data[countryCode][defaultLanguage];
                            $scope.app.device = elm.data[countryCode][defaultLanguage];
                            devQual.push({
                                "qualification_code": elm.id,
                                "q_type": "normal",
                                "q_category": "basic",
                                "q_name": elm.masterKey,
                                "is_default":true,
                                "conditions":[]
                            });
                            _.each($scope.deviceInfo, function(device){
                                device.selected = true;
                                device.fieldName = "Device";
                                device.qual_id = elm.id;
                                device.qual_name = elm.masterKey;
                                $scope.sltDevice.push({
                                    "id": device.id,
                                    "qual_id":elm.id
                                });
                                //devQual[0].conditions.push(device.id);
                            });
                        } 
                        // add race-bera and hispanic- origin for Bera project.
                        if(elm.masterKey == "raceBera"){
                            $scope.sltRaceBera = [];
                            $scope.raceBera = elm.data[countryCode][defaultLanguage];
                            $scope.app.raceBera = elm.data[countryCode][defaultLanguage];

                            raceBeraQual.push({
                                "qualification_code": elm.id,
                                "q_type": "normal",
                                "q_category": "basic",
                                "q_name": elm.masterKey,
                                "is_default":true,
                                "conditions":[]
                            });
                            _.each($scope.raceBera, function(raceBera){
                                raceBera.selected = true;
                                raceBera.fieldName = "raceBera";
                                raceBera.qual_id = elm.id;
                                raceBera.qual_name = elm.masterKey;
                                $scope.sltRaceBera.push({
                                    "id": raceBera.id,
                                    "qual_id":elm.id
                                });
                            });
                        }
                        if(elm.masterKey == "hispanicOrigin"){
                            $scope.hispanicOrigin = [];
                            $scope.hispanic = elm.data[countryCode][defaultLanguage];
                            $scope.app.hispanic = elm.data[countryCode][defaultLanguage];
                            hispanicQual.push({
                                "qualification_code": elm.id,
                                "q_type": "normal",
                                "q_category": "basic",
                                "q_name": elm.masterKey,
                                "is_default":true,
                                "conditions":[]
                            });
                            _.each($scope.hispanic, function(hispanic){
                                hispanic.selected = true;
                                hispanic.fieldName = "hispanic";
                                hispanic.qual_id = elm.id;
                                hispanic.qual_name = elm.masterKey;
                                $scope.hispanicOrigin.push({
                                    "id": hispanic.id,
                                    "qual_id":elm.id
                                });
                            });
                        }
                        if(elm.masterKey == "regions"){
                            $scope.region = elm.data[countryCode][defaultLanguage];
                            regionQual.push({
                                "qualification_code": elm.id,
                                "q_type": "normal",
                                "q_category": "basic",
                                "q_name": elm.masterKey,
                                "is_default":false,
                                "conditions":[]
                            });
                            _.each($scope.region, function(region){
                                region.qual_id = elm.id;
                                region.qual_name = elm.masterKey;
                            });
                        } 
                        if(elm.masterKey == "divisions"){
                            $scope.division = elm.data[countryCode][defaultLanguage];
                            divisionQual.push({
                                "qualification_code": elm.id,
                                "q_type": "normal",
                                "q_category": "basic",
                                "q_name": elm.masterKey,
                                "is_default":false,
                                "conditions":[]
                            });
                            _.each($scope.division, function(division){
                                division.qual_id = elm.id;
                                division.qual_name = elm.masterKey;
                            });
                        }
                        
                    }
                    //PD-711 For adding qualification code according to quota V2
                    if(elm.masterKey == "age"){
                        ageQual.push({
                            "qualification_code": elm.id,
                            "q_type": "range",
                            "q_category": "basic",
                            "q_name": elm.masterKey,
                            "is_default":true,
                            "range_sets":[]
                        });
                    } 
                    if(elm.masterKey == "houseHoldIncome"){
                        incomeQual.push({
                            "qualification_code": elm.id,
                            "q_type": "range",
                            "q_category": "basic",
                            "q_name": elm.masterKey,
                            "is_default":true,
                            "range_sets":[]
                        });
                    } 
                    if(elm.masterKey == "states"){
                        statesQual.push({
                            "qualification_code": elm.id,
                            "q_type": "normal",
                            "q_category": "basic",
                            "q_name": elm.masterKey,
                            "is_default":false,
                            "conditions":[]
                        });
                    }
                    if(elm.masterKey == "csa"){
                        csaQual.push({
                            "qualification_code": elm.id,
                            "q_type": "normal",
                            "q_category": "basic",
                            "q_name": elm.masterKey,
                            "is_default":false,
                            "conditions":[]
                        });
                    }
                    if(elm.masterKey == "msa"){
                        msaQual.push({
                            "qualification_code": elm.id,
                            "q_type": "normal",
                            "q_category": "basic",
                            "q_name": elm.masterKey,
                            "is_default":false,
                            "conditions":[]
                        });
                    }
                    if(elm.masterKey == "county"){
                        countyQual.push({
                            "qualification_code": elm.id,
                            "q_type": "normal",
                            "q_category": "basic",
                            "q_name": elm.masterKey,
                            "is_default":false,
                            "conditions":[]
                        });
                    }
                    if(elm.masterKey == "dma"){
                        dmaQual.push({
                            "qualification_code": elm.id,
                            "q_type": "normal",
                            "q_category": "basic",
                            "q_name": elm.masterKey,
                            "is_default":false,
                            "conditions":[]
                        });
                    }
                    // 
                    if(elm.masterKey == "units"){
                        currency_units = elm.data.currency_cd[countryCode];
                        age_units = elm.data.age_cd;
                        $scope.houseHoldIncome.units = currency_units;
                        if(currency_units == 325){
                            $scope.incomeInputBoxVal = {
                                "maxlength":9,
                                "placeholder":100000000
                            }
                        }else if(currency_units == 326){
                            $scope.incomeInputBoxVal = {
                                "maxlength":8,
                                "placeholder":10000000
                            }
                        }else if(currency_units == 327 || currency_units == 328 || currency_units == 331 || currency_units == 344 || currency_units == 345 || currency_units == 349 || currency_units == 350 || currency_units == 353 || currency_units == 352){
                            $scope.incomeInputBoxVal = {
                                "maxlength":7,
                                "placeholder":9999999
                            }
                        }else if(currency_units == 329 || currency_units == 351){
                            $scope.incomeInputBoxVal = {
                                "maxlength":8,
                                "placeholder":99999999
                            }
                        }else if(currency_units == 330 || currency_units == 337 || currency_units == 339){
                            $scope.incomeInputBoxVal = {
                                "maxlength":9,
                                "placeholder":999999999
                            }
                        }else if(currency_units == 334){
                            $scope.incomeInputBoxVal = {
                                "maxlength":10,
                                "placeholder":9999999999
                            }
                        }
                    }
                });
            }
            //get survey data after finishing getMasterData Call- Place here to support Draft clone and live clone
            if($stateParams.id == 'CreateSurveys' && ($scope.newId != undefined || $scope.newId != null ||  $scope.newId != "") && $rootScope.clone == true){   
                    //console.log(" if of create getSurveyDetailsForUpdate ")
                    getSurveyDetailsForUpdate($scope.newId);
            }else{
                //console.log(" else of create getSurveyDetailsForUpdate ")
                getSurveyDetailsForUpdate($stateParams.key);
            }
        }).error(function(err){
            $scope.loader.show = false;
            ngProgressLite.done();
            notify({
                message: "Something went wrong in fetching MasterData",
                classes: 'alert-danger',
                duration: 2000
            });
        })
    }

    //child age unit
    $scope.childAgeUnit = {
        name : 'month',
        value : 312
    };
    $scope.onChangeChildAgeUnit = function(unitname) {
        var name = $scope.childAgeUnit.name ;
        $scope.childAgeUnit.name = unitname;
        if(name != $scope.childAgeUnit.name && $scope.chldTempArr.have.length >1){
            if(!confirm("Modifying the Unit Name will delete the quotas")){
                $scope.childAgeUnit.name = name;
            }else{
                _.each($scope.chldTempArr.have, function(value,index){
                    if(index != 0){
                         $scope.chldTempArr.have.splice([index]);
                    }else{
                        $scope.chldTempArr.have[index].min="";
                    }
                })
                $scope.chldTotalRemRace = $scope.completesNeeded;
            }
        }
        $scope.childAgeUnit.value = age_units[unitname.toLowerCase()];
    };

    function getCountries() {
        ngProgressLite.start();
        $scope.loader.show = true;
        $scope.country = new Array();
        commonApi.countries().success(function(data) {
            ngProgressLite.done();
            $scope.loader.show = false;
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
            $scope.loader.show = false;
            notify({
                message: "Something went wrong in fetching coutries",
                classes: 'alert-danger',
                duration: 2000
            });
        });
    }


    function getSampleTitle() {
        ngProgressLite.start();
        $scope.loader.show = true;
        commonApi.samples().success(function(data) {
            ngProgressLite.done();
            $scope.loader.show = false;
            if (data.sample != null) {
                $scope.samples = data.sample.values;
                $scope.app.samples = data.sample.values;
            }
        }).error(function(err) {
            $scope.loader.show = false;
            ngProgressLite.done();
            notify({
                message: "Something went wrong in fetching samples",
                classes: 'alert-danger',
                duration: 2000
            });
        });
    }

    //PD-321
    var setSelectedDivisonData = function(id, selected, options, index) {
        var removeIds = [];
        $scope.quotaTotalRemRace = $scope.completesNeeded;

        if (!options || options == undefined) {
            return false;
        }
        _.each(options, function(option,index){
            var hasdivisionQuota =  _.findWhere($scope.sltDivision,{"hasValidQuotas":true});
           if(hasdivisionQuota){
             hasdivisionQuota =hasdivisionQuota['hasValidQuotas'];
                if(hasdivisionQuota && $scope.liveSurveyEditingStep !== 'editStep1'){
                    $scope.clearCensusDivision();
                }
           }
             if (option.id == id) {
                if (selected == true) {
                    if($scope.liveSurveyEditingStep == 'editStep1' && hasdivisionQuota){
                         if(!confirm("Modifying the qualifications will delete the current quotas")) {
                                $scope.division[index].selected = !$scope.division[index].selected;
                                return false;
                            }else{
                                $scope.clearCensusDivision();
                                $scope.sltDivision.push({
                                        "id": id
                                    });

                                    if (option.number != undefined && option.number != 0) {
                                        $scope.quotaTotalRemRace = $scope.quotaTotalRemRace - option.number;
                                    }
                            }
                     }else{
                            $scope.sltDivision.push({
                                    "id": id
                            });

                            if (option.number != undefined && option.number != 0) {
                                $scope.quotaTotalRemRace = $scope.quotaTotalRemRace - option.number;
                            }
                     }
                    
                }
                else {
                    if($scope.liveSurveyEditingStep == 'editStep1' && hasdivisionQuota){
                            if(!confirm("Modifying the qualifications will delete the current quotas")) {
                                $scope.division[index].selected  = !$scope.division[index].selected;
                                return false;
                            }else{
                                 $scope.clearCensusDivision();
                                removeIds.push(id);
                            }
                    }else{
                            removeIds.push(id);
                            if(hasdivisionQuota){
                                $scope.clearCensusDivision();
                            }
                    }
                }
            }
            else if (option.selected === true && option.number != undefined && option.number != 0) {
                $scope.quotaTotalRemRace = $scope.quotaTotalRemRace - option.number;
            }
        });

        var temp = $scope.sltDivision.filter(function (item) {
            return !(removeIds.indexOf(item.id) !== -1);
        });

        $scope.sltDivision = temp;

        temp = $scope.division.map(function (item) {
            if (removeIds.indexOf(item.id) !== -1) {
                return {id: item.id, selected: item.selected, name: item.name, cnt: item.cnt};
            }
            else {
                return item;
            }
        });

        $scope.division = temp;
    };

    $scope.setSelectDivision = function(id, selected, $event, options, index) {

        //check for any other location is selected or not
        if($scope.locationData.selected) {
            //if already seleted
            if($scope.locationData.type == "division") {
                //call fun to select item
                setSelectedDivisonData(id, selected, options, index);
            }else {
                //timeout because trigger causes to rootscope issue
                $timeout(function() {
                    $scope.locationData.currentClickItem = "division";
                    $scope.locationData.currIndex = index;
                    angular.element('#clrmodel').trigger('click');
                },0);
            }            
        }else {

            $scope.locationData.selected = true;
            $scope.locationData.type = "division";

            setSelectedDivisonData(id, selected, options, index);
        }
    };

    //PD-321
    var setSelectedRegionData = function (id, selected, options, index) {
        var removeIds = [];
        $scope.quotaTotalRemRace = $scope.completesNeeded;
        
        if (!options || options == undefined) {
            return false;
        }
        _.each(options, function(option,index){
           var hasRgnQuota =  _.findWhere($scope.sltRegion,{"hasValidQuotas":true});
           if(hasRgnQuota){
             hasRgnQuota =hasRgnQuota['hasValidQuotas'];
                if(hasRgnQuota && $scope.liveSurveyEditingStep!== 'editStep1'){
                    $scope.clearCensusRegion();
                }
           }
            if (option.id == id) {
                if (selected == true) {
                    if($scope.liveSurveyEditingStep == 'editStep1' && hasRgnQuota){
                         if(!confirm("Modifying the qualifications will delete the current quotas")) {
                                $scope.region[index].selected = !$scope.region[index].selected;
                                 //$scope.locationData.selected  = false;
                                return false;
                            }else{
                                $scope.clearCensusRegion();
                                $scope.sltRegion.push({
                                "id": id
                                });

                                if (option.number != undefined && option.number != 0) {
                                    $scope.quotaTotalRemRace = $scope.quotaTotalRemRace - option.number;
                                }
                            }
                     }else{
                            $scope.sltRegion.push({
                                "id": id
                            });

                            if (option.number != undefined && option.number != 0) {
                                $scope.quotaTotalRemRace = $scope.quotaTotalRemRace - option.number;
                            }
                     }
                    
                }
                else {
                    if($scope.liveSurveyEditingStep == 'editStep1' && hasRgnQuota){
                            if(!confirm("Modifying the qualifications will delete the current quotas")) {
                                 $scope.region[index].selected  = !$scope.region[index].selected;
                                return false;
                            }else{
                                 $scope.clearCensusRegion();
                                removeIds.push(id);
                            }
                    }else{
                        removeIds.push(id);
                        if(hasRgnQuota){
                            $scope.clearCensusRegion();
                        }
                    }
                }
            }
            else if (option.selected === true && option.number != undefined && option.number != 0) {
                $scope.quotaTotalRemRace = $scope.quotaTotalRemRace - option.number;
            }
        });

        var temp = $scope.sltRegion.filter(function (item) {
            return !(removeIds.indexOf(item.id) !== -1);
        });

        $scope.sltRegion = temp;

        temp = $scope.region.map(function (item) {
            if (removeIds.indexOf(item.id) !== -1) {
                return {id: item.id, selected: item.selected, name: item.name, cnt: item.cnt};
            }
            else {
                return item;
            }
        });
        $scope.region = temp;
    };

    $scope.setSelectRegion = function (id, selected, $event, options, index) {
        //check for any other location is selected or not
        if($scope.locationData.selected) {
            //if already selected
            if($scope.locationData.type == "region") {
                //call fun to select item
                setSelectedRegionData(id, selected, options, index);
            }else {
                $timeout(function() {
                    $scope.locationData.currentClickItem = "region";
                    $scope.locationData.currIndex = index;
                    angular.element('#clrmodel').trigger('click'); 
                },0);
                 
            }          
        }else {
            $scope.locationData.selected = true;
            $scope.locationData.type = "region";
            setSelectedRegionData(id, selected, options, index);
        }        
    };

    $scope.showLoader = '';  // Variable for Disabling Next Page Button Until Api Calls Finishes
    $scope.saveSurvey = function(msg){
        $scope.showLoader = 'DataLoading';
        ngProgressLite.start();
        $scope.loader.show = true;
        // In live edit if completes less than fielded
        if($scope.completesNeeded > 0 && $scope.totalFielded > $scope.completesNeeded){
            notify({
                message: "You can't set completes less than total fielded",
                classes: 'alert-warning',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }
        if($scope.properties.surveyTitle == undefined || $scope.properties.surveyTitle == null || $scope.properties.surveyTitle == "") {
            notify({
                message: 'Please Enter Title of Survey',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }
        if($scope.properties.samplesType == undefined || $scope.properties.samplesType == null || $scope.properties.samplesType == "") {
            notify({
                message: 'Please Select Category',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }
        if($scope.properties.country == undefined || $scope.properties.country == null || $scope.properties.country == "") {
            notify({message: 'Please Select Country', classes:'alert-danger',duration:3000} );
            $scope.properties.country = 1;
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }
        if($scope.properties.language == undefined || $scope.properties.language == null || $scope.properties.language == "") {
            notify({message: 'Please Select Language', classes:'alert-danger',duration:3000} );
            $scope.properties.language = 1;
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;  
        }
        if($scope.properties.numberOfCompletes === '') {
            notify({
                message: 'Please Enter Number of Completes',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }
        if($scope.properties.lengthOfSurvey == undefined || $scope.properties.lengthOfSurvey == null || $scope.properties.lengthOfSurvey == "" || $scope.properties.lengthOfSurvey > 60 || $scope.properties.lengthOfSurvey<=0) {
            notify({
                message: 'Please Enter Length of Survey Minimum of 1 Minute and Maximum of 60 Minutes',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }
        if($scope.properties.field_time == undefined || $scope.properties.field_time == null || $scope.properties.field_time == "") {
            notify({
                message: 'Please Enter Field Time',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }
        if($scope.incidence == undefined || $scope.incidence == null || $scope.incidence == "") {
            notify({
                message: 'Please Enter Incidence',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }

        if($scope.incidence <= 0) {
            notify({
                message: 'Incidence Can not be 0',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }

        if($scope.countryValue == 'Japan' && $scope.houseHoldIncome.max > 100000000 || $scope.countryValue == 'Philippines' && $scope.houseHoldIncome.max > 10000000){
           if($scope.countryValue == 'Japan'){
                notify({
                    message: "Income can't be greater than 100 million",                    
                    classes: 'alert-danger',
                    duration: 3000
                });
            }else{
                notify({
                    message: "Income can't be greater than 10 million",
                    classes: 'alert-danger',
                    duration: 3000
                });
            }
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }
        
        if($scope.sltGender == undefined || $scope.sltGender == null || $scope.sltGender == "") {
            notify({
                message: 'Please Select Gender',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }
        
        if(($scope.sltDevice == undefined || $scope.sltDevice == null || $scope.sltDevice == "") && $scope.fieldsFlags.device) {
            notify({
                message: 'Please Select Device',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }
        if(($scope.sltRace == undefined || $scope.sltRace == null || $scope.sltRace == "") && $scope.fieldsFlags.race) {
            notify({
                message: 'Please Select Race',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }

        if(($scope.sltRelation == undefined || $scope.sltRelation == null || $scope.sltRelation == "") && $scope.fieldsFlags.relationship) {
            notify({
                message: 'Please Select Relationship',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }
        if(($scope.sltEmployment == undefined || $scope.sltEmployment == null || $scope.sltEmployment == "") && $scope.fieldsFlags.employment) {
            notify({
                message: 'Please Select Employement',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        }

        if(($scope.sltEducation == undefined || $scope.sltEducation == null || $scope.sltEducation == "") && $scope.fieldsFlags.education) {
            notify({
                message: 'Please Select Education',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        } 
        if(($scope.sltChildren == undefined || $scope.sltChildren == null || $scope.sltChildren == "") && $scope.fieldsFlags.children) {
            notify({
                message: 'Please Select Children',
                classes: 'alert-danger',
                duration: 3000
            });
            $scope.showLoader = "";
            ngProgressLite.done();
            $scope.loader.show = false;
            return false;
        } 
        /*-------Income Qual-----*/
        if($scope.incomeTempArr != undefined && $scope.incomeTempArr.length > 1) {
            $scope.incomeTempArr.splice(0, 1);
            incomeQual[0].range_sets = [];
            _.each($scope.incomeTempArr, function(income){
                incomeQual[0].range_sets.push({
                    "from" : parseInt(income.min),
                    "to" : parseInt(income.max),
                    "units": currency_units
                });
            });
            incomeQual[0]["is_default"] = false;
        }else if($scope.houseHoldIncome.min !== '' && $scope.houseHoldIncome.max !== '') {
            $scope.incomeTempArr = [{
                min : parseInt($scope.houseHoldIncome.min),
                max : parseInt($scope.houseHoldIncome.max)
            }];
            incomeQual[0].range_sets = [];
            incomeQual[0].range_sets.push({
                "from" : parseInt($scope.houseHoldIncome.min),
                "to" : parseInt($scope.houseHoldIncome.max),
                "units":currency_units
            });
            incomeQual[0]["is_default"] = false;
        }else{
            var maxVal = 999999;
            // Changing max income range for Japan and Philippines
            if(currency_units == 325){
                maxVal = 100000000;  // 9 digits
            }else if(currency_units == 326){
                maxVal = 10000000;   // 8 digits
            }else if(currency_units == 327 || currency_units == 328 || currency_units == 331 || currency_units == 342 || currency_units == 344 || currency_units == 345 || currency_units == 346 || currency_units == 349 || currency_units == 350 || currency_units == 353 || currency_units == 352){
                maxVal = 9999999;   // 7 digits
            }else if(currency_units == 329 || currency_units == 351){
                maxVal = 99999999;  // 8 digits
            }else if(currency_units == 330 || currency_units == 337 || currency_units == 339){
                maxVal = 999999999; // 9 digits
            }else if(currency_units == 334){
                maxVal = 9999999999;  // 10 digits
            }
            //PD-1540
            $scope.incomeTempArr = [{
                min : $scope.houseHoldIncome.min? $scope.houseHoldIncome.min:0,
                max : maxVal
            }];
            incomeQual[0].range_sets = [];
            incomeQual[0].range_sets.push({
                "from" : $scope.houseHoldIncome.min? $scope.houseHoldIncome.min:0,
                "to" : maxVal,
                "units":currency_units
            });
        }
        /*----Only for Vietnam-----*/
        if($scope.properties.countryCode == 'VN' || $scope.properties.countryCode == 'RU' || $scope.properties.countryCode == 'TH'){
            incomeQual[0].range_sets = [];
        }
        /*----Only for Vietnam-----*/

        /*-------Age Qual-----*/
        if($scope.ageTempArr != undefined && $scope.ageTempArr.length > 1) {
            $scope.ageTempArr.splice(0, 1);
            ageQual[0].range_sets = [];
            _.each($scope.ageTempArr, function(age){
                ageQual[0].range_sets.push({
                    "from" : parseInt(age.min),
                    "to" : parseInt(age.max),
                    "units":age_units.year
                });
            });
        }else if($scope.ageData.min !== '' && $scope.ageData.max !== '') {
            $scope.ageTempArr = [{
                min : parseInt($scope.ageData.min),
                max : parseInt($scope.ageData.max)
            }];
            ageQual[0].range_sets = [];
            ageQual[0].range_sets.push({
                "from" : parseInt($scope.ageData.min),
                "to" : parseInt($scope.ageData.max),
                "units":age_units.year
            });
        }else{
            $scope.ageTempArr = [{
                min : $scope.ageData.min ? $scope.ageData.min:18,
                max : 99
            }];
            ageQual[0].range_sets = [];
            ageQual[0].range_sets.push({
                "from" : $scope.ageData.min ? $scope.ageData.min:18,
                "to" : 99,
                "units":age_units.year
            });
        }
        // For Removing extra hash Keys fields from the Age income Array
        ageQual = angular.copy(ageQual);
        incomeQual = angular.copy(incomeQual);
        //location targeting data
        var statesData = angular.copy($scope.selectedStates);
        var csaData = angular.copy($scope.selectedCSAs);
        var dmaData = angular.copy($scope.selectedDMAs);
        var msaData = angular.copy($scope.selectedMSAs);
        var countyData = angular.copy($scope.selectedCountys);
        var zipCodeData = angular.copy($scope.selectedZipcodes);
        
        /*-----Temporary Done For PL Data-----*/
        var locaArr = [statesData, csaData, dmaData, msaData, countyData];
        _.each(locaArr, function(location){
            if(location.length > 0){
                _.each(location, function(all){
                    if(all.percent){
                        all['percentage'] = all.percent;
                        delete all.percent;
                    }
                });
            }
        });
        /*-----Temporary Done For PL Data-----*/

        // PD-711 Saving Qualifications for locations in Quota Management V2
            genderQual[0].conditions = [];
            _.each($scope.genderInfo, function(gender){
                if(gender.id && gender.selected){
                    genderQual[0].conditions.push({
                        "id":gender.id.toString(),
                        "name":gender.name
                    });
                }
            });
            // Setting is_default for qualification
            var gndrMstrData = _.findWhere(masterData, {"masterKey" : "gender"});
            genderQual[0].is_default = ($scope.gndrQuotaFlag.hasGndrFlag || genderQual[0].conditions.length !== gndrMstrData.data[$scope.properties.countryCode][$scope.properties.languageCode].length)?false:true;
            if(_.contains(config.countryInQuals.employment, $scope.properties.countryCode)){
                empQual[0].conditions = [];
                //PD-961
                var tempEmployQuotaArr = [];
                if (employmentModelLiveEdit.length > 0) {
                    tempEmployQuotaArr = employmentModelLiveEdit;
                }
                else {
                    tempEmployQuotaArr = $scope.employement;
                }
                _.each(tempEmployQuotaArr, function (employement) {
                    if (employement.id && employement.selected) {
                        empQual[0].conditions.push({
                            "id": employement.id.toString(),
                            "name": employement.name
                        });
                    }
                });
                // Setting is_default for qualification
                var empMstrData = _.findWhere(masterData, {"masterKey" : "employments"});
                empQual[0].is_default = ($scope.empQuotaFlag.hasEmpFlag || empQual[0].conditions.length !== empMstrData.data[$scope.properties.countryCode][$scope.properties.languageCode].length)?false:true;
            }
            if(_.contains(config.countryInQuals.children, $scope.properties.countryCode)){
                childQual[0].conditions = [];
                _.each($scope.children, function(children){
                    if(children.id && children.selected){
                        childQual[0].conditions.push({
                            "id":children.id.toString(),
                            "name":children.name
                        });
                    }
                });
                // Setting is_default for qualification
                var chldMstrData = _.findWhere(masterData, {"masterKey" : "children"});
                childQual[0].is_default = ($scope.childQuotaFlag.hasChldFlag || childQual[0].conditions.length !== chldMstrData.data[$scope.properties.countryCode][$scope.properties.languageCode].length)?false:true;
            }
            // Prechecked Data Qualifications will only be filled if the country is US and CA
            
            if(_.contains(config.countryInQuals.race, $scope.properties.countryCode)){
                raceQual[0].conditions = [];
                //PD-961
                var tempRaceQuotaArr = [];
                if(raceModelLiveEdit.length > 0) {
                    tempRaceQuotaArr = raceModelLiveEdit;
                }
                else {
                    tempRaceQuotaArr = $scope.race;
                }
                _.each(tempRaceQuotaArr, function(race){
                    if(race.id && race.selected){
                        raceQual[0].conditions.push({
                            "id":race.id.toString(),
                            "name":race.name
                        });
                    }
                })
                // Setting is_default for qualification
                var raceMstrData = _.findWhere(masterData, {"masterKey" : "race"});
                raceQual[0].is_default = ($scope.raceQuotaFlag.hasRaceFlag || raceQual[0].conditions.length !== raceMstrData.data[$scope.properties.countryCode][$scope.properties.languageCode].length)?false:true;
            }
            if(_.contains(config.countryInQuals.education, $scope.properties.countryCode)){
                eduQual[0].conditions = [];
                var tempEducationQuotaArr = [];
                if(educationModelLiveEdit.length > 0) {
                    tempEducationQuotaArr = educationModelLiveEdit;
                }
                else {
                    tempEducationQuotaArr = $scope.education;
                }
                _.each(tempEducationQuotaArr, function(education){
                    if(education.id && education.selected){
                        eduQual[0].conditions.push({
                            "id":education.id.toString(),
                            "name":education.name
                        });
                    }
                });
                // Setting is_default for qualification
                var eduMstrData = _.findWhere(masterData, {"masterKey" : "educations"});
                eduQual[0].is_default = ($scope.eduQuotaFlag.hasEduFlag || eduQual[0].conditions.length !== eduMstrData.data[$scope.properties.countryCode][$scope.properties.languageCode].length)?false:true;
            }
            if(_.contains(config.countryInQuals.relationship, $scope.properties.countryCode)){
                //PD-961
                relationQual[0].conditions = [];
                var tempRelationQuotaArr = [];
                if(relationModelLiveEdit.length > 0) {
                    tempRelationQuotaArr = relationModelLiveEdit;
                }
                else {
                    tempRelationQuotaArr = $scope.relation;
                }
                _.each(tempRelationQuotaArr, function(relation){
                    if(relation.id && relation.selected){
                        relationQual[0].conditions.push({
                            "id":relation.id.toString(),
                            "name":relation.name
                        });
                    }
                });
                // Setting is_default for qualification
                var rlnMstrData = _.findWhere(masterData, {"masterKey" : "relationships"});
                relationQual[0].is_default = ($scope.rlnQuotaFlag.hasRlnFlag || relationQual[0].conditions.length !== rlnMstrData.data[$scope.properties.countryCode][$scope.properties.languageCode].length)?false:true;
            }
            if($scope.fieldsFlags.bera){
                raceBeraQual[0].conditions = [];
                //PD-1402
                var tempRaceBeraQuotaArr = [];
                if(raceBeraModelLiveEdit.length > 0) {
                    tempRaceBeraQuotaArr = raceBeraModelLiveEdit;
                }
                else {
                    tempRaceBeraQuotaArr = $scope.raceBera;
                }
                _.each(tempRaceBeraQuotaArr, function(raceBera){
                    if(raceBera.id && raceBera.selected){
                        raceBeraQual[0].conditions.push({
                            "id":raceBera.id.toString(),
                            "name":raceBera.name
                        });
                    }
                });
                // Setting is_default for qualification
                var rbMstrData = _.findWhere(masterData, {"masterKey" : "raceBera"});
                raceBeraQual[0].is_default = ($scope.rbQuotaFlag.hasRbFlag || raceBeraQual[0].conditions.length !== rbMstrData.data[$scope.properties.countryCode][$scope.properties.languageCode].length)?false:true;

                hispanicQual[0].conditions = [];
                _.each($scope.hispanic, function(hisOri){
                    if(hisOri.id && hisOri.selected){
                        hispanicQual[0].conditions.push({
                            "id":hisOri.id.toString(),
                            "name":hisOri.name
                        });
                    }
                });
                // Setting is_default for qualification
                var hisOriMstrData = _.findWhere(masterData, {"masterKey" : "hispanicOrigin"});
                hispanicQual[0].is_default = ($scope.hisQuotaFlag.hasHisOriFlag || hispanicQual[0].conditions.length !== hisOriMstrData.data[$scope.properties.countryCode][$scope.properties.languageCode].length)?false:true;
            }
            //PD-1402
            var tempDeviceQuotaArr = [];
            if(deviceModelLiveEdit.length > 0) {
                tempDeviceQuotaArr = deviceModelLiveEdit;
            }else {
                tempDeviceQuotaArr = $scope.deviceInfo;
            }
            //devQual[0].conditions = [];
            _.each(tempDeviceQuotaArr, function(device){
                if(device.id && device.selected){
                    devQual[0].conditions.push({
                        "id":device.id.toString(),
                        "name":device.name
                    });
                }
            });
            // Setting is_default for qualification
            var devMstrData = _.findWhere(masterData, {"masterKey" : "device"});
            devQual[0].is_default = ($scope.dvcQuotaFlag.hasDeviceFlag || devQual[0].conditions.length !== devMstrData.data[$scope.properties.countryCode][$scope.properties.languageCode].length)?false:true;

            statesQual[0].conditions = [];
            _.each(statesData, function(stateCode){
                if(stateCode.id){
                    statesQual[0].conditions.push({
                        "id":stateCode.id.toString(),
                        "name":stateCode.name
                    });
                }
            });
            csaQual[0].conditions = [];
            _.each(csaData, function(csaCode){
                if(csaCode.id){
                    csaQual[0].conditions.push({
                        "id":csaCode.id.toString(),
                        "name":csaCode.name
                    });
                }
            });
            dmaQual[0].conditions = [];
            _.each(dmaData, function(dmaCode){
                if(dmaCode.id){
                    dmaQual[0].conditions.push({
                        "id":dmaCode.id.toString(),
                        "name":dmaCode.name
                    });
                }
            });
            msaQual[0].conditions = [];
            _.each(msaData, function(msaCode){
                if(msaCode.id){
                    msaQual[0].conditions.push({
                        "id":msaCode.id.toString(),
                        "name":msaCode.name
                    });
                }
            });
            countyQual[0].conditions = [];
            _.each(countyData, function(countyCode){
                if(countyCode.id){
                    countyQual[0].conditions.push({
                        "id":countyCode.id.toString(),
                        "name":countyCode.name
                    });
                }
            });
            if($scope.properties.countryCode == 'US' || $scope.properties.countryCode == 'CA' || $scope.properties.countryCode == 'UK'){
                regionQual[0].conditions = [];
                //PD-1402
                var tempRegionQuotaArr = [];
                if(censusRgnModelLiveEdit.length > 0) {
                    tempRegionQuotaArr = censusRgnModelLiveEdit;
                }
                else {
                    tempRegionQuotaArr = $scope.region;
                }
                _.each(tempRegionQuotaArr, function(regionCode){
                    if(regionCode.id && regionCode.selected){
                        regionQual[0].conditions.push({
                            "id":regionCode.id.toString(),
                            "name":regionCode.name
                        });
                    }
                });
            }
            if($scope.properties.countryCode == 'US' || $scope.properties.countryCode == 'CA'){
                divisionQual[0].conditions = [];
                //PD-1402
                var tempDivisionQuotaArr = [];
                if(divisionModelLiveEdit.length > 0) {
                    tempDivisionQuotaArr = divisionModelLiveEdit;
                }
                else {
                    tempDivisionQuotaArr = $scope.division;
                }
                _.each(tempDivisionQuotaArr, function(divisionCode){
                    if(divisionCode.id && divisionCode.selected){
                        divisionQual[0].conditions.push({
                            "id":divisionCode.id.toString(),
                            "name":divisionCode.name
                        });
                    }
                });
            }
            // Grouping all qualifications in a single array
            $scope.properties.qualifications = _.flatten([genderQual, ageQual, incomeQual, raceQual, eduQual, relationQual, empQual, devQual, statesQual, csaQual, dmaQual, msaQual, countyQual, regionQual, divisionQual, raceBeraQual, hispanicQual, childQual], true);
            // Removing qualifications which have no conditions
            $scope.properties.qualifications = _.filter($scope.properties.qualifications, function(qualification){
                if(qualification.conditions){
                    return qualification.conditions.length > 0;
                }
                if(qualification.range_sets){
                    return qualification.range_sets.length > 0;
                }
            });
        // PD-711 Ends

        // PD-335 Both for checking the quotas equals to completes in live survey and adding default quotas
            _.each($scope.sltGender, function(genderQuota){
                if(genderQuota.number && $scope.gndrQuotaFlag.hasGndrFlag){
                    //gndrTotalAllocations = gndrTotalAllocations + genderQuota.number;
                }else if(!$scope.gndrQuotaFlag.hasGndrFlag){
                    // For adding achieved value if the quotas are not added
                    genderQuota.flexible =  true;
                    genderQuota.flexiblePer =  100;
                    genderQuota.number =  parseInt($scope.completesNeeded);
                    genderQuota.minimum =  0;
                    genderQuota.maximum =  parseInt($scope.completesNeeded);
                    genderQuota.percentage =  100;
                    genderQuota.hasValidQuotas =  false;
                }
            });
            _.each($scope.sltRaceBera, function(rbQuota){
                if(rbQuota.number && $scope.rbQuotaFlag.hasRbFlag){
                    //gndrTotalAllocations = gndrTotalAllocations + genderQuota.number;
                }else if(!$scope.rbQuotaFlag.hasRbFlag){
                    // For adding achieved value if the quotas are not added
                    rbQuota.flexible =  true;
                    rbQuota.flexiblePer =  100;
                    rbQuota.number =  parseInt($scope.completesNeeded);
                    rbQuota.minimum =  0;
                    rbQuota.maximum =  parseInt($scope.completesNeeded);
                    rbQuota.percentage =  100;
                    rbQuota.hasValidQuotas =  false;
                }
            });
            _.each($scope.hispanicOrigin, function(hispanicQuota){
                if(hispanicQuota.number && $scope.hisQuotaFlag.hasHisOriFlag){
                    //gndrTotalAllocations = gndrTotalAllocations + genderQuota.number;
                }else if(!$scope.hisQuotaFlag.hasHisOriFlag){
                    // For adding achieved value if the quotas are not added
                    hispanicQuota.flexible =  true;
                    hispanicQuota.flexiblePer =  100;
                    hispanicQuota.number =  parseInt($scope.completesNeeded);
                    hispanicQuota.minimum =  0;
                    hispanicQuota.maximum =  parseInt($scope.completesNeeded);
                    hispanicQuota.percentage =  100;
                    hispanicQuota.hasValidQuotas =  false;
                }
            });
            _.each($scope.ageTempArr, function(age){
                if(age.number && $scope.ageQuotaFlag.hasAgeFlag){
                    //ageTotalAllocations = ageTotalAllocations + age.number;
                }else if(!$scope.ageQuotaFlag.hasAgeFlag){
                    // For adding achieved value if the quotas are not added
                    age.max =  parseInt($scope.ageTempArr[0].max);
                    age.min =  parseInt($scope.ageTempArr[0].min);
                    age.per =  100;
                    age.flexible =  true;
                    age.number =  parseInt($scope.completesNeeded);
                    age.minimum =  0;
                    age.maximum =  parseInt($scope.completesNeeded);
                    age.totalRem =  0;
                    age.flexiblePer =  100;
                    age.percentage =  100;
                    age.hasValidQuotas =  false;
                }
            });
            _.each($scope.incomeTempArr, function(income){
                if(income.number && $scope.incomeQuotaFlag.hasIncomeFlag){
                    //incomeTotalAllocations = incomeTotalAllocations + income.number;
                }else if(!$scope.incomeQuotaFlag.hasIncomeFlag){
                    // For adding achieved value if the quotas are not added
                    income.max =  parseInt($scope.incomeTempArr[0].max);
                    income.min =  parseInt($scope.incomeTempArr[0].min);
                    income.per =  100;
                    income.flexible =  true;
                    income.number =  parseInt($scope.completesNeeded);
                    income.minimum =  0;
                    income.maximum =  parseInt($scope.completesNeeded);
                    income.totalRem =  0;
                    income.flexiblePer =  100;
                    income.percentage =  100;
                    income.hasValidQuotas =  false;
                }
            });
            _.each($scope.sltRace, function(race, index){
                if(race.number && $scope.raceQuotaFlag.hasRaceFlag){
                    //raceTotalAllocations = raceTotalAllocations + race.number;
                }else if(!$scope.raceQuotaFlag.hasRaceFlag){
                    // For adding achieved value if the quotas are not added
                    race.flexible =  true;
                    race.flexiblePer =  100;
                    race.number =  parseInt($scope.completesNeeded);
                    race.minimum =  0;
                    race.maximum =  parseInt($scope.completesNeeded);
                    race.percentage =  100;
                    race.hasValidQuotas =  false;
                }
            });
            _.each($scope.sltRelation, function(rln){
                if(rln.number && $scope.rlnQuotaFlag.hasRlnFlag){
                    //rlnTotalAllocations = rlnTotalAllocations + rln.number;
                }else if(!$scope.rlnQuotaFlag.hasRlnFlag){
                    // For adding achieved value if the quotas are not added
                    rln.flexible =  true;
                    rln.flexiblePer =  100;
                    rln.number =  parseInt($scope.completesNeeded);
                    rln.minimum =  0;
                    rln.maximum =  parseInt($scope.completesNeeded);
                    rln.percentage =  100;
                    rln.hasValidQuotas =  false;
                }
            });
            _.each($scope.sltEmployment, function(emp){
                if(emp.number && $scope.empQuotaFlag.hasEmpFlag){
                    //empTotalAllocations = empTotalAllocations + emp.number;
                }else if(!$scope.empQuotaFlag.hasEmpFlag){
                    // For adding achieved value if the quotas are not added
                    emp.flexible =  true;
                    emp.flexiblePer =  100;
                    emp.number =  parseInt($scope.completesNeeded);
                    emp.minimum =  0;
                    emp.maximum =  parseInt($scope.completesNeeded);
                    emp.percentage =  100;
                    emp.hasValidQuotas =  false;
                }
            });
            _.each($scope.sltEducation, function(edu){
                if(edu.number && $scope.eduQuotaFlag.hasEduFlag){
                    //eduTotalAllocations = eduTotalAllocations + edu.number;
                }else if(!$scope.eduQuotaFlag.hasEduFlag){
                    // For adding achieved value if the quotas are not added
                    edu.flexible =  true;
                    edu.flexiblePer =  100;
                    edu.number =  parseInt($scope.completesNeeded);
                    edu.minimum =  0;
                    edu.maximum =  parseInt($scope.completesNeeded);
                    edu.percentage =  100;
                    edu.hasValidQuotas =  false;
                }
            });
            _.each($scope.sltDevice, function(dev){
                if(dev.number && $scope.dvcQuotaFlag.hasDeviceFlag){
                    //devTotalAllocations = devTotalAllocations + dev.number;
                }else if(!$scope.dvcQuotaFlag.hasDeviceFlag){
                    // For adding achieved value if the quotas are not added
                    dev.flexible =  true;
                    dev.flexiblePer =  100;
                    dev.number =  parseInt($scope.completesNeeded);
                    dev.minimum =  0;
                    dev.maximum =  parseInt($scope.completesNeeded);
                    dev.percentage =  100;
                    dev.hasValidQuotas =  false;
                }
            });
        // PD-335 end

        var tmpCpi = parseFloat($scope.cpi).toFixed(2);
        $scope.properties.numberOfCompletes = parseInt($scope.properties.numberOfCompletes);
        $scope.properties.currencyFx = $scope.currencyFx;
        $scope.properties.lengthOfSurvey = parseInt($scope.properties.lengthOfSurvey);
        $scope.properties.cpi = Math.round(tmpCpi *100 ) / 100;
        //Fix CPI on Live clone
        if($rootScope.clone && $scope.checkLive_pus_Clone) {
            $rootScope.liveCloneCPI = Math.round(tmpCpi *100 ) / 100;
        }
        $scope.properties.supplier_user_id = userData.id;
        //now getting zipcodes from uploaded file on server end
        //no need to send from 
        //$scope.properties.location = {zipcode: {values: zipcodesDataArr}};
        $scope.properties.incidence = parseInt($scope.incidence);
        if($scope.fieldsFlags.hhi && $scope.incomeQuotaFlag.hasIncomeFlag) {
            $scope.allProperties.houseHoldIncome = $scope.incomeTempArr;
        } else {
            delete $scope.allProperties.houseHoldIncome;
        }
        if($scope.fieldsFlags.age && $scope.ageQuotaFlag.hasAgeFlag) {
            $scope.allProperties.age = $scope.ageTempArr;
        } else {
            delete $scope.allProperties.age;
        }
        if($scope.fieldsFlags.gender) {
            $scope.allProperties.gender = $scope.sltGender;
        } else {
            delete $scope.allProperties.gender;
        }
        if($scope.fieldsFlags.device) {
            //PD-1402
            $scope.allProperties.device = $scope.sltDevice; 
            excludeGroupingFromSlt($scope.allProperties.device);
        } else {
            delete $scope.allProperties.device;
        }
        if($scope.fieldsFlags.race){
            //PD-961
            $scope.allProperties.race = $scope.sltRace; 
            excludeGroupingFromSlt($scope.allProperties.race);
        } else {
            delete $scope.allProperties.race;
        }
        if($scope.fieldsFlags.education) {
            //PD-961
            $scope.allProperties.educations = $scope.sltEducation;
            excludeGroupingFromSlt($scope.allProperties.educations);
        } else {
            delete $scope.allProperties.educations;
        }
        if($scope.fieldsFlags.employment) {
            //PD-961
            $scope.allProperties.employments = $scope.sltEmployment;
            excludeGroupingFromSlt($scope.allProperties.employments);
        } else {
            delete $scope.allProperties.employments;
        }
        if($scope.fieldsFlags.relationship) {
            //PD-961
            $scope.allProperties.relationships = $scope.sltRelation;
            excludeGroupingFromSlt($scope.allProperties.relationships);
        } else {
            delete $scope.allProperties.relationships;
        }

        if($scope.fieldsFlags.children){
            $scope.allProperties.children = $scope.chldTempArr;
        } else {
            delete $scope.allProperties.children;
        }

        
        if($scope.fieldsFlags.location) {
            //PD-1402
            $scope.allProperties.regions = $scope.sltRegion;
            excludeGroupingFromSlt($scope.allProperties.regions);
        } else {
            delete $scope.allProperties.regions;
        }
        if($scope.fieldsFlags.location) {
            //PD-1402
            $scope.allProperties.divisions = $scope.sltDivision;
            excludeGroupingFromSlt($scope.allProperties.divisions);
        } else {
            delete $scope.allProperties.divisions;
        }
        if($scope.fieldsFlags.location) {
            //PD-1402
            if($scope.isGrouped('states')) {
                $scope.allProperties.states = statesData;
                excludeGroupingFromSlt($scope.allProperties.states);
            }
            else {
                $scope.allProperties.states = statesData;
            }
        } else {
            delete $scope.allProperties.states;
        }
        if($scope.fieldsFlags.location) {
            //PD-1402
            if($scope.isGrouped('dma')) {
                $scope.allProperties.dma = dmaData;
                excludeGroupingFromSlt($scope.allProperties.dma);
            }
            else {
                $scope.allProperties.dma = dmaData;
            }
            
        } else {
            delete $scope.allProperties.dma;
        }
        if($scope.fieldsFlags.location) {

            //PD-1402
            if($scope.isGrouped('csa')) {
                $scope.allProperties.csa = csaData;
                excludeGroupingFromSlt($scope.allProperties.csa);
            }
            else {
                $scope.allProperties.csa = csaData;
            }
            
        } else {
            delete $scope.allProperties.csa;
        }
        if($scope.fieldsFlags.location) {
            //PD-1402
            if($scope.isGrouped('msa')) {
                $scope.allProperties.msa = msaData;
                excludeGroupingFromSlt($scope.allProperties.msa);
            }
            else {
               $scope.allProperties.msa = msaData;
            }
            
        } else {
            delete $scope.allProperties.msa;
        }
        if($scope.fieldsFlags.location) {
            //PD-1402
            if($scope.isGrouped('county')) {
                $scope.allProperties.county = countyData;
                 excludeGroupingFromSlt($scope.allProperties.county);
            }
            else {
               $scope.allProperties.county = countyData;
            }
            
        } else {
            delete $scope.allProperties.county;
        }
        //Added for Bera
        if($scope.fieldsFlags.bera){
            /***********************************/
            //PD-1402
            $scope.allProperties.raceBera = $scope.sltRaceBera;
            excludeGroupingFromSlt($scope.allProperties.raceBera);
            /***********************************/
            $scope.allProperties.hispanicOrigin = $scope.hispanicOrigin;
        }else{
            delete $scope.allProperties.raceBera;
            delete $scope.allProperties.hispanicOrigin;
        }
        //Old Quotas payload will be intact until Quota V2 works fine
        $scope.properties.target = $scope.allProperties;   //Old Quotas
        if($scope.fieldsFlags.location) {
               $scope.allProperties.zipcodes = zipCodeData;
        } else {
            delete $scope.allProperties.zipcodes;
        }

        /*------Pushing nested Quotas in Properties------*/
        _.each(nestedTempQuotaData, function(nestedItem){
            _.each(nestedItem.criteria, function(singleCriteria){
                if(singleCriteria.qualification_code == config.zipcodesQual.id){
                    singleCriteria.conditions = [];
                }
            });
            $scope.properties.quotas.push(nestedItem);
        });
        /*---------Pushing Advance Targeting Data in Properties-------*/
        $scope.properties.advance_target = new Array();
        _.each(advanceData, function(advanceItem){
            _.each(advanceItem.answers[advanceItem.qualification_id[0]].answer_data, function(option){
                // Having problem in saving this key in db
                delete option.$order;
            });
            $scope.properties.advance_target.push(advanceItem);
        });
        // Advance Qualifications
        _.each(advanceQual, function(qual){
            $scope.properties.qualifications.push(qual);
        });
        /*---------Pushing Advance Targeting Data in Propertiers Ends-------*/


        //PD-711 Sending Quota Data as Version 2 Structure
        _.each(Object.keys($scope.allProperties), function(quotakey){
            // Remove Quotas which are AutoNested
            if(_.indexOf($scope.nestingQuotasArrFinal, quotakey) == -1){
                var qual_id = new Number;
                //PD-711 (Quota V2) Importing Qualification Details From masterData and saving in payload (Quota V2)
                _.each(masterData, function(master){
                    if(master.masterKey == quotakey){
                        qual_id = master.id;
                        qual_name = master.masterKey;
                    }
                });
                //PD-711 (Quota V2) Creating Quota V2 payload Structure
                _.each($scope.allProperties[quotakey], function(quotaelm){
                    // Also removing default quotas sending for Quota V1
                    // For Age and Income (range sets).
                    if(_.findIndex(quotaelm, {'qual_id':config.childMasterQual.id}) != -1 && $scope.childQuotaFlag.hasChldFlag){
                        _.each(quotaelm, function(singleChildRow){
                            // Add census Repo field if it not exists
                                var quotaQuantities = {
                                    "minimum":singleChildRow.minimum,
                                    "maximum":singleChildRow.maximum,
                                    "flexibility":singleChildRow.flexiblePer,
                                    "isFlexible":singleChildRow.flexible,
                                    "number":singleChildRow.number,
                                    "percentage":singleChildRow.percentage,
                                    "hasValidQuotas": true,
                                    "achieved": 0,
                                    "remaining":singleChildRow.maximum,
                                    "currently_open":singleChildRow.maximum,
                                    "sup_currently_open":singleChildRow.maximum,
                                    "current_target": singleChildRow.maximum
                                }
                                if(_.has(quotaelm, "hasCensusRepoQuota")) {
                                   quotaQuantities.hasCensusRepoQuota = quotaelm.hasCensusRepoQuota;
                                }
                            // Add census Repo field if it not exists ends
                            if(singleChildRow.id == 111 && singleChildRow.minimum && singleChildRow.maximum){
                                $scope.properties.quotas.push({
                                    "type": 0,
                                    "isActive":true,
                                    "quotaCategory":"layered",
                                    "locked": false,
                                    "criteria":[
                                        {
                                            "qualification_code":qual_id,
                                            "qualification_name":qual_name,
                                            "q_type":"normal",
                                            "layered_percent":parseInt(singleChildRow.percentage),
                                            "conditions": [{
                                                "id":singleChildRow.id.toString(),
                                                "name": singleChildRow.name
                                            }]
                                        }
                                    ],
                                    "quantities": quotaQuantities
                                });
                            }else if(singleChildRow.id == 112 && singleChildRow.minimum && singleChildRow.maximum){
                                var gender_conditions = new Array();
                                if(singleChildRow.gender == 'both'){
                                    gender_conditions = [{
                                            "id": "111",
                                            "name": "Boy"
                                        },
                                        {
                                            "id": "112",
                                            "name": "Girl"
                                    }];
                                }else{
                                    gender_conditions = [{
                                        "id":singleChildRow.gender.toString(),
                                        "name": singleChildRow.gender == "111" ? "Boy":"Girl"
                                    }]
                                }
                                $scope.properties.quotas.push({
                                    "type": 0,
                                    "isActive":true,
                                    "quotaCategory":"layered",
                                    "locked": false,
                                    "criteria":[
                                        {
                                            "qualification_code":qual_id,
                                            "qualification_name":qual_name,
                                            "q_type":"normal",
                                            "layered_percent":parseInt(singleChildRow.percentage),
                                            "conditions": [{
                                                "id":singleChildRow.id.toString(),
                                                "name": singleChildRow.name
                                            }]
                                        },
                                        {
                                            "qualification_code": parseInt(config.childMasterQual.gender),
                                            "qualification_name":(_.findWhere(masterData, {"id":parseInt(config.childMasterQual.gender)})).masterKey,
                                            "q_type":"normal",
                                            "layered_percent":parseInt(singleChildRow.percentage),
                                            "conditions": gender_conditions
                                        },
                                        {
                                            "qualification_code":parseInt(config.childMasterQual.age),
                                            "qualification_name":(_.findWhere(masterData, {"id":parseInt(config.childMasterQual.age)})).masterKey,
                                            "q_type":"range_sets",
                                            "layered_percent":parseInt(singleChildRow.percentage),
                                            "range_sets": [{"from":singleChildRow.min, "to":singleChildRow.max, "units": (qual_name == 'age'? age_units.year : (qual_name == 'children') ? $scope.childAgeUnit.value : currency_units)}]
                                        }

                                    ],
                                    "quantities": quotaQuantities
                                });
                            }
                        });
                    }else if(quotaelm.hasOwnProperty('min') && quotaelm.hasOwnProperty('max') && quotaelm.percentage && quotaelm.hasValidQuotas){
                        var quotaQuantities = {
                            "minimum":quotaelm.minimum,
                            "maximum":quotaelm.maximum,
                            "flexibility":quotaelm.flexiblePer,
                            "isFlexible":quotaelm.flexible,
                            "number":quotaelm.number,
                            "percentage":quotaelm.percentage,
                            "hasValidQuotas": true,
                            "achieved": 0,
                            "remaining":quotaelm.maximum,
                            "currently_open":quotaelm.maximum,
                            "sup_currently_open":quotaelm.maximum,
                            "current_target": quotaelm.maximum
                        }
                        if(_.has(quotaelm, "hasCensusRepoQuota")) {
                           quotaQuantities.hasCensusRepoQuota = quotaelm.hasCensusRepoQuota;
                        }
                        $scope.properties.quotas.push({
                            "type": 0,
                            "isActive":true,
                            "quotaCategory":"layered",
                            "locked": false,
                            "criteria":[
                                {
                                    "qualification_code":qual_id,
                                    "qualification_name":qual_name,
                                    "q_type":"range_sets",
                                    "layered_percent":parseInt(quotaelm.percentage),
                                    "range_sets": [{"from":quotaelm.min, "to":quotaelm.max, "units": (qual_name == 'age'? age_units.year : (qual_name == 'children') ? $scope.childAgeUnit.value : currency_units)}]
                                }
                            ],
                            "quantities":quotaQuantities
                        });
                    // For Normal Quotas (Without Ranges)
                    }else if(!quotaelm.hasOwnProperty('min') && !quotaelm.hasOwnProperty('max') && quotaelm.hasValidQuotas && !quotaelm.hasOwnProperty("condditionGroup") && quotaelm.percentage){
                        var quotaQuantities = {
                            "minimum":quotaelm.minimum,
                            "maximum":quotaelm.maximum,
                            "flexibility":quotaelm.flexiblePer,
                            "isFlexible":quotaelm.flexible,
                            "number":quotaelm.number,
                            "percentage":quotaelm.percentage,
                            "hasValidQuotas": true,
                            "achieved": 0,
                            "remaining":quotaelm.maximum,
                            "currently_open":quotaelm.maximum,
                            "sup_currently_open":quotaelm.maximum,
                            "current_target": quotaelm.maximum
                        }
                        if(_.has(quotaelm, "hasCensusRepoQuota")) {
                           quotaQuantities.hasCensusRepoQuota = quotaelm.hasCensusRepoQuota;
                        }
                        if(quotakey == "zipcodes") {
                            var conditionArr = [];
                            
                            var quotaCategory = "grouped"
                            if(_.has(quotaelm, "buyer_ziplist_ref")) {
                                var criteriaObjet = [
                                    {
                                        "qualification_code":qual_id,
                                        "qualification_name":qual_name,
                                        "q_type":"normal",
                                        "layered_percent":parseInt(quotaelm.percentage),
                                        "conditions": conditionArr,
                                        "buyer_ziplist_ref": quotaelm.buyer_ziplist_ref
                                    }
                                ]
                                if($rootScope.clone) {
                                    criteriaObjet[0]["group_qtaNm"] = quotaelm.name;
                                }
                                if(_.has(quotaelm, "zipWithNoQuota") && quotaelm.zipWithNoQuota) {
                                    criteriaObjet[0]["group_qtaNm"] = quotaelm.name;
                                }
                            }
                            else {
                               var criteriaObjet = [
                                    {
                                        "qualification_code":qual_id,
                                        "qualification_name":qual_name,
                                        "q_type":"normal",
                                        "layered_percent":parseInt(quotaelm.percentage),
                                        "conditions": conditionArr,
                                        "group_qtaNm": quotaelm.name
                                    }
                                ] 
                            }
                        }
                        else {
                            var conditionArr = [{
                                "id":quotaelm.id.toString(),
                                "name": quotaelm.name
                            }]
                            var quotaCategory = "layered"
                            var criteriaObjet = [
                                {
                                    "qualification_code":qual_id,
                                    "qualification_name":qual_name,
                                    "q_type":"normal",
                                    "layered_percent":parseInt(quotaelm.percentage),
                                    "conditions": conditionArr
                                }
                            ] 
                        }
                        
                        $scope.properties.quotas.push({
                            "type": 0,
                            "isActive":true,
                            "quotaCategory":quotaCategory,
                            "locked": false,
                            "criteria":criteriaObjet,
                            "quantities":quotaQuantities
                        });
                    }
                });
                // Grouped Quota Payload for Race, Employment, Education, Relation PD-961
                if((quotakey == 'race' || quotakey == 'employments' || quotakey == 'educations' || quotakey == 'relationships' || quotakey == 'raceBera' || quotakey == 'device' || quotakey == 'regions' || quotakey == 'divisions' || quotakey == 'states' || quotakey == 'dma' || quotakey == 'csa' || quotakey == 'msa' || quotakey == 'county') && $scope.isGrouped(quotakey)){
            
                    //console.log('\n\n\nquotakey ',JSON.stringify($scope.allProperties[quotakey]), quotakey);
                    if(quotakey == 'race'){
                        if($scope.newraceModal.length > 0) {
                            var findGroupObjects = _.filter($scope.newraceModal, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                            if(findGroupObjects.length > 0) {
                               _.each(findGroupObjects, function(conditionMatch) {
                                    var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.race);
                                    $scope.properties.quotas.push(groupPropetiesObject);
                                })

                            }
                        }
                    }else if(quotakey == 'relationships'){
                        if($scope.newrelationModal.length > 0) {
                            var findGroupObjects = _.filter($scope.newrelationModal, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                            if(findGroupObjects) {
                               _.each(findGroupObjects, function(conditionMatch) {
                                    var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.relation);
                                    $scope.properties.quotas.push(groupPropetiesObject);
                                })

                            }
                        }
                    }else if(quotakey == 'employments'){
                        if($scope.groupingemploymentModal.length > 0) {
                             var findGroupObjects = _.filter($scope.groupingemploymentModal, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                            if(findGroupObjects) {
                               _.each(findGroupObjects, function(conditionMatch) {
                                    var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.employement);
                                    $scope.properties.quotas.push(groupPropetiesObject);
                                })

                            }
                        }
                    }else if(quotakey == 'educations'){
                        if($scope.groupingeducationModal.length > 0) {
                            var findGroupObjects = _.filter($scope.groupingeducationModal, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                            if(findGroupObjects) {
                               _.each(findGroupObjects, function(conditionMatch) {
                                    var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.education);
                                    $scope.properties.quotas.push(groupPropetiesObject);
                                })

                            }
                        }
                    }
                    else if(quotakey == 'raceBera') {
                       if($scope.groupingRaceBeraModel.length > 0) {
                            var findGroupObjects = _.filter($scope.groupingRaceBeraModel, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                            if(findGroupObjects) {
                               _.each(findGroupObjects, function(conditionMatch) {
                                    var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.raceBera);
                                    $scope.properties.quotas.push(groupPropetiesObject);
                                })

                            }
                        } 
                    }
                    else if(quotakey == 'device') {
                     if($scope.groupingDeviceModel.length > 0) {
                        var findGroupObjects = _.filter($scope.groupingDeviceModel, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                        if(findGroupObjects) {
                           _.each(findGroupObjects, function(conditionMatch) {
                                var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.deviceInfo);
                                $scope.properties.quotas.push(groupPropetiesObject);
                            })

                        }
                    }
                   } 
                    else if(quotakey == 'regions') {
                        if($scope.groupingCensusRgnModel.length > 0) {
                            var findGroupObjects = _.filter($scope.groupingCensusRgnModel, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                            if(findGroupObjects) {
                               _.each(findGroupObjects, function(conditionMatch) {
                                    var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.region);
                                    $scope.properties.quotas.push(groupPropetiesObject);
                                })

                            }
                        }
                    }
                    else if(quotakey == 'divisions') {
                        if($scope.groupingDivisionModel.length > 0) {
                            var findGroupObjects = _.filter($scope.groupingDivisionModel, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                            if(findGroupObjects) {
                               _.each(findGroupObjects, function(conditionMatch) {
                                    var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.division);
                                    $scope.properties.quotas.push(groupPropetiesObject);
                                })

                            }
                        }
                    }
                    else if(quotakey == 'states') {
                        if($scope.groupingStateModel.length > 0) {
                            var findGroupObjects = _.filter($scope.groupingStateModel, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                            if(findGroupObjects) {
                               _.each(findGroupObjects, function(conditionMatch) {
                                    var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.selectedStates);
                                    $scope.properties.quotas.push(groupPropetiesObject);
                                })

                            }
                        }
                    }
                    else if(quotakey == 'csa') {
                        if($scope.groupingCsaModel.length > 0) {
                            var findGroupObjects = _.filter($scope.groupingCsaModel, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                            if(findGroupObjects) {
                               _.each(findGroupObjects, function(conditionMatch) {
                                    var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.selectedCSAs);
                                    $scope.properties.quotas.push(groupPropetiesObject);
                                })

                            }
                        }
                    }
                    else if(quotakey == 'dma') {
                        if($scope.groupingDmaModel.length > 0) {
                            var findGroupObjects = _.filter($scope.groupingDmaModel, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                            if(findGroupObjects) {
                               _.each(findGroupObjects, function(conditionMatch) {
                                    var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.selectedDMAs);
                                    $scope.properties.quotas.push(groupPropetiesObject);
                                })

                            }
                        }
                    }
                    else if(quotakey == 'msa') {
                        if($scope.groupingMsaModel.length > 0) {
                            var findGroupObjects = _.filter($scope.groupingMsaModel, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                            if(findGroupObjects) {
                               _.each(findGroupObjects, function(conditionMatch) {
                                    var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.selectedMSAs);
                                    $scope.properties.quotas.push(groupPropetiesObject);
                                })

                            }
                        }
                    }
                    else {
                        if(quotakey == 'county') {
                           if($scope.groupingCountyModel.length > 0) {
                                var findGroupObjects = _.filter($scope.groupingCountyModel, function(conditionTrue){ return (conditionTrue.condditionGroup == true && (conditionTrue.number != "" || conditionTrue.number != 0)); });
                                if(findGroupObjects) {
                                   _.each(findGroupObjects, function(conditionMatch) {
                                        var groupPropetiesObject = setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, $scope.allProperties[quotakey][0], quotakey, $scope.selectedCountys);
                                        $scope.properties.quotas.push(groupPropetiesObject);
                                    })

                                }
                            } 
                        }
                    }
                }
            }else{
                console.log(quotakey+' Quotas not added because of autoNesting');
            }
        });
        // Insert Advance Quotas
        _.each(advQuota, function(singleQuota){
            console.log('\n\nsingleQuota.criteria[0].qualification_name ',singleQuota.criteria[0].qualification_name);
            var existInNested = _.indexOf($scope.nestingQuotasArrFinal, singleQuota.criteria[0].qualification_name);
            if(existInNested == -1){
                $scope.properties.quotas.push(singleQuota);
            }else{
                console.log(' deleting ');
                $scope.delAdvQuota(singleQuota.criteria[0].qualification_code, $scope.tempAdvArray);
            }
            // console.log('existInNested ',existInNested);
            // console.log('$scope.nestingQuotasArrFinal ',JSON.stringify($scope.nestingQuotasArrFinal));
            // console.log('singleQuota ',JSON.stringify(singleQuota));
            // $scope.properties.quotas.push(singleQuota);
        });
        // If there is no quotas defined we send default quota for Age
        if($scope.properties.quotas.length == 0){
            var ageRange = new Object();
            // If user defines age qualification then default quota age will be same
            if($scope.ageData.min && $scope.ageData.max){
                ageRange = {"from":parseInt($scope.ageData.min), "to":parseInt($scope.ageData.max), "units":age_units.year}
            }else{
                ageRange = {"from":$scope.ageData.min?$scope.ageData.min:18, "to":99, "units":age_units.year}
            }
            $scope.properties.quotas.push({
                "type": 0,
                "isActive":true,
                "quotaCategory":"default",
                "locked": false,
                "criteria":[
                    {
                        "qualification_code":212,
                        "qualification_name":"age",
                        "q_type":"range_sets",
                        "layered_percent":100,
                        "range_sets": [ageRange]
                    }
                ],
                "quantities":{
                    "minimum":$scope.completesNeeded,
                    "maximum":$scope.completesNeeded,
                    "flexibility":0,
                    "isFlexible":false,
                    "number":$scope.completesNeeded,
                    "percentage":100,
                    "hasValidQuotas": true,
                    "achieved": 0,
                    "remaining":$scope.completesNeeded,
                    "currently_open":$scope.completesNeeded,
                    "sup_currently_open":$scope.completesNeeded,
                    "current_target": $scope.completesNeeded
                }
            });
        }
        // PD-711 ends
        $scope.properties.company = userData.cmp;
        $scope.properties.zipcodeFilePath = zipcodeFilePath;
        //send selected location name as key in request PD-321
        $scope.properties.locationKey = $scope.locationData.type;

        $scope.properties.locale = {
            'countryCode' :$scope.properties.countryCode,
            'countryName' :$scope.properties.countryName,
            'languageCode' :$scope.properties.languageCode,
            'languageName' :$scope.properties.languageName,
            'languageTranslate' :$scope.properties.languageTranslate
        }
        
        // Self Correction that if a qualification is nested then it should also be present in qualification
        _.each(nestedTempQuotaData, function(nestedQuota){
            //console.log('singleQuota Detail '+JSON.stringify(nestedQuota));
            _.each(nestedQuota.criteria, function(criteria){
                if(criteria.q_type == 'normal'){
                    var matchedArr = _.findWhere($scope.properties.qualifications, {"qualification_code":criteria.qualification_code});
                    if(matchedArr && !(_.find(matchedArr.conditions, criteria.conditions[0]))){
                        var index = _.indexOf($scope.properties.qualifications, matchedArr);
                        $scope.properties.qualifications[index].conditions.push(criteria.conditions[0]);
                        
                    }
                }
            });
        });
        // For V1, we need to send the qualifications for Income and Age for which the quota array is removed
        delete $scope.properties.target.children; // Do not save children in V1
        //Commented code for Do not save Income & Age in V1

        /*For clearing popup fields
        $scope.clearFields();*/
        console.log('$scope.properties.quotas ',JSON.stringify($scope.properties.quotas));
        if(!$stateParams.key) {
            //PD-1003
            var launchSurveyPropsArr = ["IsURLTransform", "buyerMsg", "catExcl", "fldOverTime", "launchPercentile", "launchQuantity", "liveUrl", "maxInPrgs", "maxInPrgsNo", "softLaunch", "surveyClient", "survey_external_id", "survey_grouping", "survey_po", "teamMember", "testUrl", "sftLaunch_bss_start"];
            if(msg == 'save') {
                _.each(launchSurveyPropsArr, function(surveyProps) {
                    if(_.has(saveAllThreePageData[0], surveyProps)) {
                        if(surveyProps == "teamMember" && saveAllThreePageData[0][surveyProps] == null) {
                            saveAllThreePageData[0][surveyProps] = "";
                        }
                        $scope.properties[surveyProps] = saveAllThreePageData[0][surveyProps];
                    }
                });
            }
            
            createSurvey.saveSurveyData($scope.properties).success(function(data) {
                // Clearing the quotas and qualifications on save
                $scope.properties.quotas = [];
                $scope.properties.qualifications = [];
                ngProgressLite.done();
                $scope.showLoader = "";
                if (msg == 'save' || msg == 'saveAndNew') {
                    notify({
                        message: 'Survey Saved',
                        classes: 'alert-success',
                        duration: 3000
                    });
                    if(msg == 'saveAndNew'){
                        $rootScope.clone = false;
                        $state.go('dynstate', {id: 'CreateSurveys'}, {reload:true});   /*PD-709*/
                    }else{
                        getSurveyDetailsForUpdate(data.survey.id);
                        $state.go('updatesurvey', {key: data.survey.id});
                    }
                }
                if (msg == 'moveToNext') {
                    notify({
                        message: 'Survey data has been saved successfully',
                        classes: 'alert-success',
                        duration: 3000
                    });
                    $state.go('choosesuppliers', {
                        surveyid: data.survey.id
                    });
                }
                if (msg == 'saveAndClone') {
                    notify({message: 'Survey Saved', classes: 'alert-success', duration: 3000});
                    if(data.survey.surveyTitle.substring(0,5) == 'CLONE') {
                            if(data.survey.surveyTitle.charAt(6) == '-') {
                                var count = 1;
                                var surveyTte = parseInt(data.survey.surveyTitle.charAt(5)) + count;
                                var surveyTtle = data.survey.surveyTitle.split('-');
                                var newString = surveyTtle[0].slice(0, -1);
                                $scope.properties.surveyTitle = newString + surveyTte +'-' + surveyTtle[1];
                            }
                            else {
                                var count = 2;
                                var surveyTtle = data.survey.surveyTitle.split('-');
                                if(surveyTtle[1] == undefined || surveyTtle[1] == 'undefined') {
                                    surveyTtle[1] = surveyTtle[0];
                                    $scope.properties.surveyTitle = surveyTtle[0]  +'-' + surveyTtle[1];
                                }
                                else{
                                    $scope.properties.surveyTitle = surveyTtle[0] + count +'-' + surveyTtle[1];
                                }
                            }
                    }
                    else{
                        $scope.properties.surveyTitle = 'CLONE-' + data.survey.surveyTitle;  
                    }  
                    $state.go('dynstate', {'id': 'CreateSurveys','locale':encodeDecodeFactory.encode(data.survey.locale), 'survey_id': data.survey.id});
                }

            }).error(function(err) {
                // Clearing the quotas and qualifications on error
                $scope.properties.quotas = [];
                $scope.properties.qualifications = [];
                ngProgressLite.done();
                $scope.showLoader = "";
                $scope.properties.target = {};
                $scope.properties.quotas = [];
                notify({
                    message : "Something went wrong in saving survey",
                    classes: 'alert-danger',
                    duration: 3000
                });
            })
        }else if(msg == 'goToManageSurvey'){
            console.log("properties : ", $scope.properties);
            createSurvey.updateSurveyFromManageStep1($stateParams.key, $scope.properties).success(function(data) {
                // Clearing the quotas and qualifications on save
                $scope.properties.quotas = [];
                $scope.properties.qualifications = [];
                ngProgressLite.done();
                $scope.showLoader = "";
                notify({
                    message: data.msg,
                    classes: 'alert-success',
                    duration: 3000
                });
                $state.go('editSurvey', {key: $stateParams.key});
            }).error(function(err) {
                // Clearing the quotas and qualifications on error
                $scope.properties.quotas = [];
                $scope.properties.qualifications = [];
                ngProgressLite.done();
                $scope.showLoader = "";
                notify({
                    message: "Something went wrong in saving survey",
                    classes: 'alert-danger',
                    duration: 3000
                });
            })
        }else{
            createSurvey.updateSurvey($stateParams.key, $scope.properties).success(function(data) {
                // Clearing the quotas and qualifications on save
                $scope.properties.quotas = [];
                $scope.properties.qualifications = [];
                ngProgressLite.done();
                $scope.showLoader = "";
                notify({
                    message: data.msg,
                    classes: 'alert-success',
                    duration: 3000
                });

                if(msg == 'saveAndNew') {
                    $rootScope.clone = false;
                    $state.go('dynstate', {id: 'CreateSurveys'});   
                }
                
                if (msg == 'saveAndClone') {
                    if(!$scope.newId){
                        $scope.newId = $stateParams.key;
                    }
                    createSurvey.getSurveyById($scope.newId).success(function(surveyDetails) {
                        if(surveyDetails.survey[0].surveyTitle.substring(0,5) == 'CLONE') {
                            if(surveyDetails.survey[0].surveyTitle.charAt(6) == '-') {
                                var count = 1;
                                var surveyTte = parseInt(surveyDetails.survey[0].surveyTitle.charAt(5)) + count;
                                var surveyTtle = surveyDetails.survey[0].surveyTitle.split('-');
                                var newString = surveyTtle[0].slice(0, -1);
                                $scope.properties.surveyTitle = newString + surveyTte +'-' + surveyTtle[1];
                            }
                            else {
                                var count = 2;
                                var surveyTtle = surveyDetails.survey[0].surveyTitle.split('-');
                                $scope.properties.surveyTitle = surveyTtle[0] + count +'-' + surveyTtle[1];
                            }
                        }else{
                            $scope.properties.surveyTitle = 'CLONE-' + surveyDetails.survey[0].surveyTitle;
                        } 

                        $state.go('dynstate', {'id': 'CreateSurveys','locale':encodeDecodeFactory.encode(surveyDetails.survey[0].locale), 'survey_id': $scope.newId});
                    });
                }

                if (msg == 'moveToNext') {
                    $state.go('choosesuppliers', {
                        surveyid: $stateParams.key
                    });
                }
                if(msg == 'save') {
                    // For Clearing Nesting Arrays before page reload to prevent duplicates
                    $scope.clearNesting();
                    getSurveyDetailsForUpdate($stateParams.key);
                }
            }).error(function(err) {
                // Clearing the quotas and qualifications on error
                $scope.properties.quotas = [];
                $scope.properties.qualifications = [];
                ngProgressLite.done();
                $scope.showLoader = "";
                notify({
                    message: "Something went wrong in saving survey",
                    classes: 'alert-danger',
                    duration: 3000
                });
            })
        }
    };

    $scope.getLOS = function(value) {
        $scope.blrFld.LOI = value;
        if ($scope.blrFld.lang && $scope.blrFld.cntry && $scope.blrFld.LOI && $scope.blrFld.incd) {
            getSurveyHeaderPricingValue($scope.blrFld.lang, $scope.blrFld.cntry, $scope.blrFld.LOI, $scope.blrFld.incd);
        } else {
            $scope.cpi = 0;
            $scope.total = 0;
        }

    };

    $scope.getINS = function(value) {
        $scope.blrFld.incd = parseInt(value);
        if ($scope.blrFld.lang && $scope.blrFld.cntry && $scope.blrFld.LOI && $scope.blrFld.incd) {
            getSurveyHeaderPricingValue($scope.blrFld.lang, $scope.blrFld.cntry, $scope.blrFld.LOI, $scope.blrFld.incd)
        } else {
            $scope.cpi = 0;
            $scope.total = 0;
        }
        // To calculate Valid Clicks
        if($scope.properties.clickBalance == 1){
            $rootScope.$broadcast('calculateTotalCliks',{});
        }
    };

    $scope.getCompletes = function(value) {
        $scope.comArray = [];
        $scope.completes = value;
        if($scope.completes && $scope.cpi) {
            calculateTotalCost();
        }else{
            $scope.total = 0;
        }
        $scope.comArray.push($scope.race, $scope.genderInfo, $scope.relation, $scope.children, $scope.employement, $scope.education);
        
        
        if($scope.properties.clickBalance == 1){
            $rootScope.$broadcast('calculateTotalCliks',{});
        }else{
            $scope.completesNeeded = value;
        }
        
        // addQuotaCalculation(value, $scope.comArray);
        $scope.updateQuotasOnChange();
    };

    $scope.getFieldTime = function(value, creationDate){
        $scope.field_time = value;
        var time = new Date();
        var creationDate = new Date(creationDate);
        if($scope.liveSurveyEditingStep == 'editStep1'){
            $scope.properties.End_Date = creationDate.setDate(creationDate.getDate()+ parseInt(value));
        }else{
            $scope.properties.End_Date = time.setDate(time.getDate()+ parseInt(value));
        }
    };

    function calculateTotalCost() {
        var tol = ($scope.completes * $scope.cpi);
        $scope.total = parseFloat(tol).toFixed(2);
    }

    function getSurveyHeaderPricingValue(lang, ctry, LOI, incd) {
        ngProgressLite.start();
        createSurvey.getSurveyHeaderValue(lang, ctry, LOI, incd).success(function(data) {
            ngProgressLite.done();
            if (data.CPI) {
                var orgCpi = parseFloat(data.CPI).toFixed(2);
                $scope.cpi = Math.round(orgCpi *100)/100;
                if ($scope.completes && $scope.cpi) {
                    calculateTotalCost();
                } else {
                    $scope.total = 0;
                }
            }
            if(data.currencyFx && data.currencyFx.symbol) {
                $scope.currency_symbol = data.currencyFx.symbol;
                $scope.currencyFx = data.currencyFx;
            }
        }).error(function(err) {
            notify({
                message: "Something went wrong in fetching header pricing values",
                classes: 'alert-danger',
                duration: 2000
            });
        })
    }

    $scope.checkAgeMin = function() {
        if ($scope.ageData.min < 13) {
            notify({
                message: "Please Enter the min age greater than or equal to 13",
                classes: 'alert-danger',
                duration: 2000
            });
            $scope.ageData.min = '18';
        }
        if ($scope.ageData.max && $scope.ageData.min > $scope.ageData.max) {
            notify({
                message: "Please Enter the min age less than max age and greater than 13",
                classes: 'alert-danger',
                duration: 2000
            });
            $scope.ageData.min = '18';
        }
        if ($scope.ageTempArr.length >= 1 && $scope.ageQuotaFlag.editAgeFlag === true) {
            $scope.ageQuotaFlag.editAgeFlag = false;
            notify({
                message: "If you edit the age parameters, you're existing quotas will be deleted.Would you like to proceed?",
                classes: 'alert-danger',
                duration: 2000
            });
        }
    };

    $scope.checkAgeMax = function() {
        if ($scope.ageData.min > $scope.ageData.max) {
            notify({
                message: "Please Enter the max age greater than to min age",
                classes: 'alert-danger',
                duration: 2000
            });
            $scope.ageData.max = '99';
        }
        if ($scope.ageTempArr.length >= 1 && $scope.ageQuotaFlag.editAgeFlag === true) {
            $scope.ageQuotaFlag.editAgeFlag = false;
            notify({
                message: "If you edit the age parameters, you're existing quotas will be deleted.Would you like to proceed?",
                classes: 'alert-danger',
                duration: 2000
            })
        }
    };

    $scope.checkIncomeMin = function() {
        if ($scope.houseHoldIncome.min < 0) {
            notify({
                message: "Please Enter the min income greater than or equal to 0",
                classes: 'alert-danger',
                duration: 2000
            });
            $scope.houseHoldIncome.min = 0;
        }
        if ($scope.houseHoldIncome.max && $scope.houseHoldIncome.min > $scope.houseHoldIncome.max) {
            notify({
                message: "Please Enter the min income less than max income",
                classes: 'alert-danger',
                duration: 2000
            });
            $scope.houseHoldIncome.min = 0;
        }
        if ($scope.incomeTempArr.length >= 1 && $scope.incomeQuotaFlag.editIncomeFlag === true) {
            $scope.incomeQuotaFlag.editIncomeFlag = false;
            notify({
                message: "If you edit the income parameters, you're existing quotas will be deleted. Would you like to proceed?",
                classes: 'alert-danger',
                duration: 2000
            })
        }
    };

    $scope.checkIncomeMax = function() {
        if(parseInt($scope.houseHoldIncome.min) > parseInt($scope.houseHoldIncome.max)){
            notify({
                message: "Please Enter the max income greater than to min income",
                classes: 'alert-danger',
                duration: 2000
            });
            $scope.houseHoldIncome.max = 999999;
        }
        if($scope.incomeTempArr.length >= 1 && $scope.incomeQuotaFlag.editIncomeFlag === true) {
            $scope.incomeQuotaFlag.editIncomeFlag = false;
            notify({
                message: "If you edit the income parameters, you're existing quotas will be deleted.Would you like to proceed?",
                classes: 'alert-danger',
                duration: 2000
            });
        }
    };

    $scope.ageSltBoxTlt = function() {
        $scope.ageTlt = false;
        $scope.ageShow = true;
    };

    $scope.ageSltBoxVal = function() {
        if ($scope.ageTempArr.length > 0) {
           
            $scope.ageTempArr = [];
            $scope.ageFlag = false;
            $scope.ageTempArr[0] = {
                "min": parseInt($scope.ageData.min),
                "max": parseInt($scope.ageData.max),
                'flexPer': 0
            };
            $scope.ageQuotaFlag.ageFlxValue = 0;
            $scope.ageTotalRemRace = $scope.completesNeeded;

        }
        /*notify({message:"Quotas deleted successfully",classes:'alert-success',duration:2000})*/
        $scope.ageQuotaFlag.hasAgeFlag = false;
        $scope.ageQuotaFlag.editAgeFlag = false;
        $scope.ageQuotaFlag.clearAgeFlag = false;
        $scope.censusRepoFlag.hasCensusRepoAge = false;
    };

    $scope.incomeSltBoxTlt = function() {
        $scope.incmTlt = false;
        $scope.incmShow = true;
    };

    $scope.incomeSltBoxVal = function() {
        if ($scope.incomeTempArr.length > 0) {
            $scope.incomeTempArr = [];
            $scope.incmFlag = false;
            $scope.incomeTempArr[0] = {
                "min": parseInt($scope.houseHoldIncome.min),
                "max": parseInt($scope.houseHoldIncome.max),
                'flexPer': 0
            };
            $scope.incomeTotalRemRace = $scope.completesNeeded;
        }
        $scope.incomeQuotaFlag.incomeFlxValue = 0;
        /*notify({message:"Quotas deleted successfully",classes:'alert-success',duration:2000})*/
        $scope.incomeQuotaFlag.hasIncomeFlag = false;
        $scope.incomeQuotaFlag.editIncomeFlag = false;
        $scope.incomeQuotaFlag.clearIncomeFlag = false;
        $scope.censusRepoFlag.hasCensusRepoIncome = false;
    };
    $scope.childSltBoxVal = function(){
        if($scope.chldTempArr.length > 0) {
            $scope.chldTempArr = [];
            $scope.incmFlag = false;
            $scope.chldTempArr[0] = {
                "min": '',
                "max": '',
                'flexPer': 0
            };
        }
        $scope.childQuotaFlag.chldFlxValue = 0;
        $scope.chldTotalRemRace = $scope.completesNeeded;
        /*notify({message:"Quotas deleted successfully",classes:'alert-success',duration:2000})*/

        $scope.childQuotaFlag.editChldFlag = false;
        $scope.childQuotaFlag.hasChldFlag = false;
    };

    $scope.genderQuota = function(gndrFlxValue, $event) {
        // Census Rep should be set to false if quota applied manually
        if($scope.censusRepoFlag.hasCensusRepoGndr){
            $scope.censusRepoFlag.hasCensusRepoGndr = false;
        }
        $scope.quotaNumberChange('id', $scope.genderInfo , $scope.gndrQuotaFlag.gndrFlxValue, 'gndr');
        var removeIds = [];
        if(!gndrFlxValue){
            $scope.gndrQuotaFlag.gndrFlxValue = "0";
        }
        _.each($scope.sltGender, function(genderQuota){
            if (genderQuota.id) {
                genderQuota.flexible = angular.element("#gndr").is(":checked");
                genderQuota.flexiblePer = parseInt(gndrFlxValue) || 0;
            }
            if($scope.genderInfo) {
                _.each($scope.genderInfo, function(genderInfo){
                    if(genderInfo.id == genderQuota.id) {
                        if(genderInfo.hasOwnProperty('number') && genderInfo.number != 0 || genderInfo.hasOwnProperty('number') && $scope.liveSurveyEditingStep == 'editStep1'){
                            genderInfo.selected = true;
                            genderQuota.number = parseInt(genderInfo.number) || 0;
                            // For verifying that quota exists
                            genderQuota.hasValidQuotas = true;
                            genderQuota.selected = true;
                            genderQuota.name = genderInfo.name;

                            if ($scope.gndrQuotaFlag.gndrFlxValue) {
                                genderQuota.minimum = genderInfo.minimum;
                                genderQuota.maximum = genderInfo.maximum;
                                genderQuota.percentage = genderInfo.per;
                                genderQuota.per = genderInfo.per;
                            }

                            if($scope.gndrQuotaFlag.gndrFlxValue && $scope.liveSurveyEditingStep == 'editStep1' && (genderInfo.number == undefined || genderInfo.number == null || genderInfo.number == '')){
                                genderQuota.minimum = 0;
                                genderQuota.maximum = 0;
                                genderQuota.percentage = 0;
                                genderQuota.per = 0;
                            }
                                
                        }
                        else {
                            genderInfo.selected = false;
                            removeIds.push(genderInfo.id);
                        }
                    }
                });
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.genderInfo);

        var temp = $scope.sltGender.filter(function (item) {
           return !(removeIds.indexOf(item.id) !== -1);
        });

        $scope.sltGender = temp;

        $scope.gndrQuotaFlag.resetGen = false;
        $scope.gndrQuotaFlag.editGndrFlag = true;
        $scope.gndrQuotaFlag.hasGndrFlag = true;
        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        // If AutoNested
        if($scope.isNested('gender')){
            $scope.activateNesting('gender', $scope.genderInfo, $event);
            $scope.applyNesting();
        }
    };

    $scope.chldQuota = function($event) {
        $scope.chldFlag = true;
        var totalnumber=0;
        var id = 111;
        var tempChldArr = [];
        if(!$scope.childQuotaFlag.chldFlxValue){
            $scope.childQuotaFlag.chldFlxValue = "0";
        }
        var childMasterData = _.findWhere(masterData, {"masterKey" : "children"});
        if($scope.chldTempArr){
            _.each(_.keys($scope.chldTempArr), function(singlekey){
                _.each($scope.chldTempArr[singlekey], function(singleKeyItem, index){
                    if(singlekey == 'no' || (singlekey == 'have' && index != 0)){
                        singleKeyItem.min = isNaN(parseInt(singleKeyItem.min)) ? 0 : parseInt(singleKeyItem.min);
                        singleKeyItem.max = isNaN(parseInt(singleKeyItem.max)) ? 0 : parseInt(singleKeyItem.max);
                        singleKeyItem.minimum = parseInt(singleKeyItem.minimum) || 0;
                        singleKeyItem.maximum = parseInt(singleKeyItem.maximum) || 0;
                        singleKeyItem.flexiblePer = parseInt($scope.childQuotaFlag.chldFlxValue) || 0;
                        singleKeyItem.percentage = singleKeyItem.per;
                        singleKeyItem.achieved = parseInt(singleKeyItem.achieved) || 0;
                        singleKeyItem.id = singleKeyItem.id;          // Have children condition code
                        singleKeyItem.name = (_.findWhere(childMasterData.values, {"id":parseInt(singleKeyItem.id)})).name;
                        //PD-711 Adding qual_id in Children Quota Array for AutoNesting
                        singleKeyItem.qual_id = childMasterData.id;

                        // Check that the valid quota exists
                        singleKeyItem.hasValidQuotas =  true;
                        if($scope.childQuotaFlag.chldFlx) {
                            singleKeyItem.flexible = true;
                        }else{
                            singleKeyItem.flexible = false;
                        }

                        tempChldArr.push(singleKeyItem);
                    }
                });
            });
            //PD-132
            checkQuotaExceedCmplts(tempChldArr);

            $scope.childQuotaFlag.editChldFlag = true;
            $scope.childQuotaFlag.hasChldFlag = true;
            $scope.childQuotaFlag.resetChild = false;
            notify({
                message: 'Quotas applied',
                classes: 'alert-success',
                duration: 2000
            });
            // If AutoNested
            if($scope.isNested('children')){
                $scope.activateNesting('children', $scope.chldTempArr, $event);
                $scope.applyNesting();
            }
        }
    };

    $scope.ageQuota = function(event) {
        // Census Rep should be set to false if quota applied manually
        if($scope.censusRepoFlag.hasCensusRepoAge){
            $scope.censusRepoFlag.hasCensusRepoAge = false;
        }
        var totalRangeDiff = 0; //Range Validation PD-388
        if(!$scope.ageQuotaFlag.ageFlxValue){
            $scope.ageQuotaFlag.ageFlxValue = "0";
        }
        $scope.ageFlag = true;
        if ($scope.ageTempArr) {
            for (var i = 1 in $scope.ageTempArr) {
                $scope.ageTempArr[i].min = isNaN(parseInt($scope.ageTempArr[i].min)) ? 0 : parseInt($scope.ageTempArr[i].min);
                $scope.ageTempArr[i].max = isNaN(parseInt($scope.ageTempArr[i].max)) ? 0 : parseInt($scope.ageTempArr[i].max);
                $scope.ageTempArr[i].minimum = parseInt($scope.ageTempArr[i].minimum) || 0;
                $scope.ageTempArr[i].maximum = parseInt($scope.ageTempArr[i].maximum) || 0;
                $scope.ageTempArr[i].flexiblePer = parseInt($scope.ageQuotaFlag.ageFlxValue) || 0;
                $scope.ageTempArr[i].percentage = $scope.ageTempArr[i].per;
                $scope.ageTempArr[i].achieved = parseInt($scope.ageTempArr[i].achieved) || 0;

                //PD-711 Adding qual_id in Age Quota Array for AutoNesting
                var ageMasterData = _.findWhere(masterData, {"masterKey" : "age"});
                $scope.ageTempArr[i].qual_id = ageMasterData.id; 

                // Check that the valid quota exists
                $scope.ageTempArr[i].hasValidQuotas =  true;
                if ($scope.ageTempArr[i].ageFlx == true) {
                    $scope.ageTempArr[i].flexible = true;
                }
                if ($scope.ageTempArr[i].ageFlx == false) {
                    $scope.ageTempArr[i].flexible = false;
                }
                // Range Validation PD-388
                if(i != 0 && ($scope.ageTempArr[i].max > $scope.ageTempArr[i].min)){
                    totalRangeDiff = totalRangeDiff + ($scope.ageTempArr[i].max - $scope.ageTempArr[i].min);
                }
            }
            //$scope.allProperties.age = $scope.ageTempArr;
        }
        //PD-132
        checkQuotaExceedCmplts($scope.ageTempArr);

        var totalAgeDiff = $scope.ageData.max - $scope.ageData.min;
        var row_count = $scope.ageTempArr.length - 2;
        totalRangeDiff = totalRangeDiff + row_count;

        if(totalAgeDiff == totalRangeDiff){
            notify({
                message: 'Quotas applied',
                classes: 'alert-success',
                duration: 2000
            });
            $scope.ageQuotaFlag.editAgeFlag = true;
            $scope.ageQuotaFlag.clearAgeFlag = true;
            $scope.ageQuotaFlag.hasAgeFlag = true;
            $scope.ageQuotaFlag.resetAge = false;
        }else{
            notify({
                message: 'Please define all ranges',
                classes: 'alert-warning',
                duration: 4000
            });
            event.preventDefault();
            event.stopPropagation();
        }
        // If AutoNested
        if($scope.isNested('age')){
            $scope.activateNesting('age', $scope.ageTempArr, event);
            $scope.applyNesting();
        }
    };

    $scope.incomeQuota = function(event) {
        // Census Rep should be set to false if quota applied manually
        if($scope.censusRepoFlag.hasCensusRepoIncome){
            $scope.censusRepoFlag.hasCensusRepoIncome = false;
        }
        var totalRangeDiff = 0; //Range Validation PD-388
        $scope.incmFlag = true;
        if(!$scope.incomeQuotaFlag.incomeFlxValue){
            $scope.incomeQuotaFlag.incomeFlxValue = "0";
        }
        if ($scope.incomeTempArr) {
            _.each($scope.incomeTempArr, function(incomeQuota, index){
                incomeQuota.min = isNaN(parseInt(incomeQuota.min)) ? 0 : parseInt(incomeQuota.min);
                incomeQuota.max = isNaN(parseInt(incomeQuota.max)) ? 0 : parseInt(incomeQuota.max);
                incomeQuota.minimum = parseInt(incomeQuota.minimum) || 0;
                incomeQuota.maximum = parseInt(incomeQuota.maximum) || 0;
                incomeQuota.flexiblePer = parseInt($scope.incomeQuotaFlag.incomeFlxValue) || 0;
                incomeQuota.percentage = incomeQuota.per;
                incomeQuota.achieved = parseInt(incomeQuota.achieved) || 0;

                //PD-711 Adding qual_id in Income Quota Array for AutoNesting
                var incomeMasterData = _.findWhere(masterData, {"masterKey" : "houseHoldIncome"});
                incomeQuota.qual_id = incomeMasterData.id;

                // Check that the valid quota exists
                incomeQuota.hasValidQuotas =  true;

                if (incomeQuota.incFlx == true) {
                   incomeQuota.flexible = true;
                }
                if (incomeQuota.incFlx == false) {
                    incomeQuota.flexible = false;
                }
                // Range Validation PD-388
                if(index != 0 && (incomeQuota.max > incomeQuota.min)){
                    totalRangeDiff = totalRangeDiff + (incomeQuota.max - incomeQuota.min);
                }
            });
            
        }
        //PD-132
        checkQuotaExceedCmplts($scope.incomeTempArr);

        var totalIncomeDiff = $scope.houseHoldIncome.max - $scope.houseHoldIncome.min;
        var row_count = $scope.incomeTempArr.length - 2;
        totalRangeDiff = totalRangeDiff + row_count;

        if(totalIncomeDiff == totalRangeDiff){
            notify({
                message: 'Quotas applied',
                classes: 'alert-success',
                duration: 2000
            });
            $scope.incomeQuotaFlag.editIncomeFlag = true;
            $scope.incomeQuotaFlag.clearIncomeFlag = true;
            $scope.incomeQuotaFlag.hasIncomeFlag = true;
            $scope.incomeQuotaFlag.resetInc = false;
        }else{
            notify({
                message: 'Please define all ranges',
                classes: 'alert-warning',
                duration: 4000
            });
            event.preventDefault();
            event.stopPropagation();
        }
        // If AutoNested
        if($scope.isNested('houseHoldIncome')){
            $scope.activateNesting('houseHoldIncome', $scope.incomeTempArr, event);
            $scope.applyNesting();
        }

    };

    $scope.deviceQuota = function(dvcFlxValue, $event) {
        //PD-1402
        if($scope.isGrouped('device')) {
            $scope.quotaNumberChange('data', $scope.groupingDeviceModel, $scope.dvcQuotaFlag.dvcFlxValue, 'devcSw');
        }
        else {
          $scope.quotaNumberChange('data', $scope.deviceInfo, $scope.dvcQuotaFlag.dvcFlxValue, 'devcSw');  
        }
        
        if(!dvcFlxValue){
            $scope.dvcQuotaFlag.dvcFlxValue = "0";
        }
        var removeItems = [];
        _.each($scope.sltDevice, function(deviceQuota){
            if (deviceQuota.id) {
                deviceQuota.flexible = angular.element("#devcSw").is(":checked");
                deviceQuota.flexiblePer = parseInt(dvcFlxValue) || 0;
            }
            if ($scope.deviceInfo) {
                _.each($scope.deviceInfo, function(deviceInfo){
                    if(deviceInfo.id == deviceQuota.id) {
                        if(deviceInfo.hasOwnProperty('number') && deviceInfo.number != 0 || (deviceInfo.hasOwnProperty('number') && $scope.liveSurveyEditingStep == 'editStep1' && deviceInfo.number != 0) || (deviceInfo.hasOwnProperty('number') && deviceInfo.number != "" && deviceInfo.number != 0) || (deviceInfo.hasOwnProperty('setGrupActive') && deviceInfo.setGrupActive)) {
                            deviceInfo.selected = true;
                            // Check that the valid quota exists
                            deviceQuota.hasValidQuotas =  true;
                            deviceQuota.selected =  true;
                            deviceQuota.name =  deviceInfo.name;

                            deviceQuota.number = parseInt(deviceInfo.number) || 0;
                            if ($scope.dvcQuotaFlag.dvcFlxValue) {
                                deviceQuota.minimum = parseInt(deviceInfo.minimum) || 0;
                                deviceQuota.maximum = parseInt(deviceInfo.maximum) || 0;
                                deviceQuota.percentage = parseInt(deviceInfo.per) || 0;
                            }
                            if($scope.dvcQuotaFlag.dvcFlxValue && $scope.liveSurveyEditingStep == 'editStep1' && (deviceInfo.number == undefined || deviceInfo.number == null || deviceInfo.number == '')){
                                deviceQuota.minimum = 0;
                                deviceQuota.maximum = 0;
                                deviceQuota.percentage = 0;
                            }
                        }
                        else {
                            deviceInfo.selected = false;
                            removeItems.push(deviceInfo.id);
                        }
                    }
                });
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.deviceInfo);

        var temp = $scope.sltDevice.filter(function (item) {
           return !(removeItems.indexOf(item.id) !== -1);
        });

        $scope.sltDevice = temp;

        //PD-1402
        
        var matchedForBlankGroupQuota = _.where($scope.groupingDeviceModel, {"condditionGroup": true});
        if(matchedForBlankGroupQuota.length >0) {
            removeGroupedUnallocatedQuals(matchedForBlankGroupQuota, $scope.sltDevice, $scope.deviceInfo, $scope.groupingDeviceModel);
        }

        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        $scope.dvcQuotaFlag.editDvcFlag = true;
        $scope.dvcQuotaFlag.hasDeviceFlag = true;
        $scope.dvcQuotaFlag.resetDev = false;
        // If AutoNested
        if($scope.isNested('device')){
            $scope.activateNesting('device', $scope.deviceInfo, $event);
            $scope.applyNesting();
        }
    };

    $scope.addRaceQuota = function(raceFlxValue, $event) {
        // Census Rep should be set to false if quota applied manually
        if($scope.censusRepoFlag.hasCensusRepoRace){
            $scope.censusRepoFlag.hasCensusRepoRace = false;
        }
        //PD-961
        if($scope.isGrouped('race')) {
            $scope.quotaNumberChange('data' ,$scope.newraceModal, $scope.raceQuotaFlag.raceFlxValue, 'raceSw');
        }
        else {
           $scope.quotaNumberChange('data' ,$scope.race, $scope.raceQuotaFlag.raceFlxValue, 'raceSw'); 
        }
        
        if(!raceFlxValue){
            $scope.raceQuotaFlag.raceFlxValue = "0";
        }
        var removeItems = [];
        _.each($scope.sltRace, function(raceQuota){
            if(raceQuota.id) {
                raceQuota.flexible = angular.element("#raceSw").is(":checked");
                raceQuota.flexiblePer = parseInt(raceFlxValue) || 0;
            }
            if($scope.race) {
                _.each($scope.race, function(race){
                    if (raceQuota.id == race.id) {
                        if((race.hasOwnProperty('number') && race.number != 0) || (race.hasOwnProperty('number') && race.number != 0 && $scope.liveSurveyEditingStep == 'editStep1') || (race.hasOwnProperty('number') && race.number != "" && race.number != 0) || (race.hasOwnProperty('setGrupActive') && race.setGrupActive)){
                            race.selected = true;
                            raceQuota.number = parseInt(race.number) || 0;
                            // Check that the valid quota exists
                            raceQuota.hasValidQuotas =  true;
                            raceQuota.selected =  true;
                            raceQuota.name =  race.name;
                            if ($scope.raceQuotaFlag.raceFlxValue) {
                                raceQuota.minimum = parseInt(race.minimum) || 0;
                                raceQuota.maximum = parseInt(race.maximum) || 0;
                                raceQuota.percentage = parseInt(race.per) || 0;
                                raceQuota.per = parseInt(race.per) || 0;
                            }
                            if($scope.raceQuotaFlag.raceFlxValue && $scope.liveSurveyEditingStep == 'editStep1' && (race.number == undefined || race.number == null || race.number == '')){
                                raceQuota.minimum = 0;
                                raceQuota.maximum = 0;
                                raceQuota.percentage = 0;
                                raceQuota.per = 0;
                            }
                        }else {
                            race.selected = false;
                            removeItems.push(race.id);
                        }
                    }
                });
            }
        });
        //PD-132
        checkQuotaExceedCmplts($scope.race);

        var temp = $scope.sltRace.filter(function (item) {
           return !(removeItems.indexOf(item.id) !== -1);
        });

        $scope.sltRace = temp;
        //PD-961
        var matchedForBlankGroupQuota = _.where($scope.newraceModal, {"condditionGroup": true});
        if(matchedForBlankGroupQuota.length >0) {
            removeGroupedUnallocatedQuals(matchedForBlankGroupQuota, $scope.sltRace, $scope.race, $scope.newraceModal);
        }

        $scope.raceQuotaFlag.editRaceFlag = true;
        $scope.raceQuotaFlag.resetRace = false;
        $scope.raceQuotaFlag.hasRaceFlag = true;
        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        // If AutoNested is clicked
        if($scope.isNested('race')){
            $scope.activateNesting('race', $scope.race, $event);
            $scope.applyNesting();
        }
       
    };

    $scope.addRbQuota = function(rbFlxValue, $event) {
        //PD-1402
        if($scope.isGrouped('raceBera')) {
            $scope.quotaNumberChange('data', $scope.groupingRaceBeraModel, $scope.rbQuotaFlag.rbFlxValue, 'rbSw');
        }
        else {
            $scope.quotaNumberChange('data', $scope.raceBera, $scope.rbQuotaFlag.rbFlxValue, 'rbSw');
        }
        
        if(!rbFlxValue){
            $scope.rbQuotaFlag.rbFlxValue = "0";
        }
        var removeItems = [];
        _.each($scope.sltRaceBera, function(rbQuota){
            if(rbQuota.id) {
                rbQuota.flexible = angular.element("#rbSw").is(":checked");
                rbQuota.flexiblePer = parseInt(rbFlxValue) || 0;
            }
            if($scope.raceBera) {
                _.each($scope.raceBera, function(rb){
                    if (rbQuota.id == rb.id) {
                        if((rb.hasOwnProperty('number') && rb.number != 0) || (rb.hasOwnProperty('number') && rb.number != 0 && $scope.liveSurveyEditingStep == 'editStep1') || (rb.hasOwnProperty('number') && rb.number != "" && rb.number != 0 ) || (rb.hasOwnProperty('setGrupActive') && rb.setGrupActive)){
                            rb.selected = true;
                            rbQuota.number = parseInt(rb.number) || 0;
                            // Check that the valid quota exists
                            rbQuota.hasValidQuotas =  true;
                            rbQuota.selected =  true;
                            rbQuota.name =  rb.name;
                            if ($scope.rbQuotaFlag.rbFlxValue) {
                                rbQuota.minimum = parseInt(rb.minimum) || 0;
                                rbQuota.maximum = parseInt(rb.maximum) || 0;
                                rbQuota.percentage = parseInt(rb.per) || 0;
                                rbQuota.per = parseInt(rb.per) || 0;
                            }
                            if($scope.rbQuotaFlag.rbFlxValue && $scope.liveSurveyEditingStep == 'editStep1' && (rb.number == undefined || rb.number == null || rb.number == '')){
                                rbQuota.minimum = 0;
                                rbQuota.maximum = 0;
                                rbQuota.percentage = 0;
                                rbQuota.per = 0;
                            }
                        }else {
                            rb.selected = false;
                            removeItems.push(rb.id);
                        }
                    }
                });
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.raceBera);

        var temp = $scope.sltRaceBera.filter(function (item) {
           return !(removeItems.indexOf(item.id) !== -1);
        });

        $scope.sltRaceBera = temp;

        //PD-1402
        
        var matchedForBlankGroupQuota = _.where($scope.groupingRaceBeraModel, {"condditionGroup": true});
        if(matchedForBlankGroupQuota.length >0) {
            removeGroupedUnallocatedQuals(matchedForBlankGroupQuota, $scope.sltRaceBera, $scope.raceBera, $scope.groupingRaceBeraModel);
        }
        
        $scope.rbQuotaFlag.editRbFlag = true;
        $scope.rbQuotaFlag.resetRb = false;
        $scope.rbQuotaFlag.hasRbFlag = true;
        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        // If AutoNested is clicked
        if($scope.isNested('raceBera')){
            $scope.activateNesting('raceBera', $scope.raceBera, $event);
            $scope.applyNesting();
        }
    };

    $scope.addHispanicQuota = function(hispanicFlxValue, $event) {
        // Census Rep should be set to false if quota applied manually
        if($scope.censusRepoFlag.hasCensusRepoHis){
            $scope.censusRepoFlag.hasCensusRepoHis = false;
        }
        $scope.quotaNumberChange('data', $scope.hispanic, $scope.hisQuotaFlag.hispanicFlxValue, 'hispanicSw');
        if(!hispanicFlxValue){
            $scope.hisQuotaFlag.hispanicFlxValue = "0";
        }
        var removeItems = [];
        _.each($scope.hispanicOrigin, function(hispanicQuota){
            if(hispanicQuota.id) {
                hispanicQuota.flexible = angular.element("#hispanicSw").is(":checked");
                hispanicQuota.flexiblePer = parseInt(hispanicFlxValue) || 0;
            }
            if($scope.hispanic) {
                _.each($scope.hispanic, function(hispanic){
                    if (hispanicQuota.id == hispanic.id) {
                        if((hispanic.hasOwnProperty('number') && hispanic.number != 0) || (hispanic.hasOwnProperty('number') && $scope.liveSurveyEditingStep == 'editStep1') || (hispanic.hasOwnProperty('number') && $scope.raceGrouping.check)){
                            hispanic.selected = true;
                            hispanicQuota.number = parseInt(hispanic.number) || 0;
                            // Check that the valid quota exists
                            hispanicQuota.hasValidQuotas =  true;
                            hispanicQuota.selected =  true;
                            hispanicQuota.name =  hispanic.name;
                            if ($scope.hisQuotaFlag.hispanicFlxValue) {
                                hispanicQuota.minimum = hispanic.minimum;
                                hispanicQuota.maximum = hispanic.maximum;
                                hispanicQuota.percentage = hispanic.per;
                                hispanicQuota.per = hispanic.per;
                            }
                            if($scope.hisQuotaFlag.hispanicFlxValue && $scope.liveSurveyEditingStep == 'editStep1' && (hispanic.number == undefined || hispanic.number == null || hispanic.number == '')){
                                hispanicQuota.minimum = 0;
                                hispanicQuota.maximum = 0;
                                hispanicQuota.percentage = 0;
                                hispanicQuota.per = 0;
                            }
                        }else {
                            hispanic.selected = false;
                            removeItems.push(hispanic.id);
                        }
                    }
                });
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.hispanic);

        var temp = $scope.hispanicOrigin.filter(function (item) {
           return !(removeItems.indexOf(item.id) !== -1);
        });

        $scope.hispanicOrigin = temp;
        
        $scope.hisQuotaFlag.editHisOriFlag = true;
        $scope.hisQuotaFlag.resetHisOri = false;
        $scope.hisQuotaFlag.hasHisOriFlag = true;
        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        // If AutoNested is clicked
        if($scope.isNested('hispanicOrigin')){
            $scope.activateNesting('hispanicOrigin', $scope.hispanic, $event);
            $scope.applyNesting();
        }
    };

    $scope.addDivisionQuota = function (divisionFlxValue, $event) {
        var removeItems = [];
        // Adding Qualification for Quota V2
        var qualiId = _.findWhere(masterData, {"masterKey":"divisions"});
        if(!divisionFlxValue){
            $scope.dvsnQuotaFlag.divisionFlxValue = "0";
        }
        if ($scope.sltDivision.length > 0) {
            _.each($scope.sltDivision, function(divisionQuota){
                if (divisionQuota.id) {
                    divisionQuota.flexible = angular.element("#divisionSw").is(":checked");
                    divisionQuota.flexiblePer = parseInt(divisionFlxValue) || 0;
                }
                if ($scope.division) {
                    _.each($scope.division, function(division){
                        if (divisionQuota.id == division.id) {
                            if (division.hasOwnProperty('number') && division.number != 0 || (division.hasOwnProperty('number') && $scope.liveSurveyEditingStep == 'editStep1' && division.number != 0) || (division.hasOwnProperty('number') && division.number != "" && division.number != 0) || (division.hasOwnProperty('setGrupActive') && division.setGrupActive)){
                                division.selected = true;
                                // Check that the valid quota exists
                                divisionQuota.hasValidQuotas =  true;
                                divisionQuota.selected =  true;
                                divisionQuota.qual_id = qualiId.id;  // For Quota V2
                                divisionQuota.name =  division.name;
                                divisionQuota.number = parseInt(division.number) || 0;
                                if ($scope.dvsnQuotaFlag.divisionFlxValue) {
                                    divisionQuota.minimum = parseInt(division.minimum) || 0;
                                    divisionQuota.maximum = parseInt(division.maximum) || 0;
                                    divisionQuota.percentage = parseInt(division.per) || 0;
                                }
                                if($scope.dvsnQuotaFlag.divisionFlxValue && $scope.liveSurveyEditingStep == 'editStep1' && (division.number == undefined || division.number == null || division.number == '')){
                                    divisionQuota.minimum = 0;
                                    divisionQuota.maximum = 0;
                                    divisionQuota.percentage = 0;
                                }
                            }
                            else {
                                division.selected = false;
                                removeItems.push(division.id);
                            }
                        }
                    });
                }
            });

            //PD-132
            checkQuotaExceedCmplts($scope.division);

            var temp = $scope.sltDivision.filter(function (item) {
                return !(removeItems.indexOf(item.id) !== -1);
            });

            $scope.sltDivision = temp;
            //PD-1402

            var matchedForBlankGroupQuota = _.where($scope.groupingDivisionModel, {"condditionGroup": true});
            if(matchedForBlankGroupQuota.length >0) {
                removeGroupedUnallocatedQuals(matchedForBlankGroupQuota, $scope.sltDivision, $scope.division, $scope.groupingDivisionModel);
            }

            notify({
                message: 'Quotas applied',
                classes: 'alert-success',
                duration: 2000
            });
            $scope.dvsnQuotaFlag.editDivisionFlag = true;
            $scope.dvsnQuotaFlag.hasDivisionFlag = true;
            $scope.dvsnQuotaFlag.resetDivi = false;
            // If AutoNested
            if($scope.isNested('divisions')){
                $scope.activateNesting('divisions', $scope.division, $event);
                $scope.applyNesting();
            }
        }
    };

    //apply states quota
    $scope.addStateQuota = function($event) {
        _.each($scope.selectedStates, function(stateQuota){
            if(stateQuota.number != undefined && stateQuota.number != null && stateQuota.number != "" || (stateQuota.hasOwnProperty('setGrupActive') && stateQuota.setGrupActive)) {
                stateQuota.flexiblePer = $scope.stateFlexibility.flxValue;
                stateQuota.flexible = $scope.stateFlexibility.isFlexible;
                stateQuota.hasValidQuotas = true;
                //Adding qual_id in State Quota Array for AutoNesting
                var stateMasterData = _.findWhere(masterData, {"masterKey" : "states"});
                stateQuota.qual_id = stateMasterData.id;
                stateQuota.qual_name = stateMasterData.masterKey;
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.selectedStates);
    
        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        $scope.editStateFlag = true;
        $scope.hasStateFlag = true;
        $scope.resetStateQuotas = false;
        // If AutoNested
        if($scope.isNested('states')){
            $scope.activateNesting('states', $scope.selectedStates, $event);
            $scope.applyNesting();
        }
    };

    //apply DMA quota
    $scope.addDMAQuota = function($event) {
        _.each($scope.selectedDMAs, function(dmaQuota){
            if(dmaQuota.number != undefined && dmaQuota.number != null && dmaQuota.number != "" || (dmaQuota.hasOwnProperty('setGrupActive') && dmaQuota.setGrupActive)) {
                dmaQuota.flexiblePer = $scope.dmaFlexibility.flxValue;
                dmaQuota.flexible = $scope.dmaFlexibility.isFlexible;
                dmaQuota.hasValidQuotas = true;
                //Adding qual_id in Dma Array for AutoNesting
                var dmaMasterData = _.findWhere(masterData, {"masterKey" : "dma"});
                dmaQuota.qual_id = dmaMasterData.id;
                dmaQuota.qual_name = dmaMasterData.masterKey;
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.selectedDMAs);

        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        $scope.editDMAFlag = true;
        $scope.hasDMAFlag = true;
        $scope.resetDMAQuotas = false;
        // If AutoNested
        if($scope.isNested('dma')){
            $scope.activateNesting('dma', $scope.selectedDMAs, $event);
            $scope.applyNesting();
        }
    };

    //apply CSA quota
    $scope.addCSAQuota = function($event) {
        _.each($scope.selectedCSAs, function(csaQuota){
            if(csaQuota.number != undefined && csaQuota.number != null && csaQuota.number != "" || (csaQuota.hasOwnProperty('setGrupActive') && csaQuota.setGrupActive)) {
                csaQuota.flexiblePer = $scope.csaFlexibility.flxValue;
                csaQuota.flexible = $scope.csaFlexibility.isFlexible;
                csaQuota.hasValidQuotas = true;
                //Adding qual_id in Csa Array for AutoNesting
                var csaMasterData = _.findWhere(masterData, {"masterKey" : "csa"});
                csaQuota.qual_id = csaMasterData.id;
                csaQuota.qual_name = csaMasterData.masterkey;
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.selectedCSAs);

        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        $scope.editCSAFlag = true;
        $scope.hasCSAFlag = true;
        $scope.resetCSAQuotas = false;
        // If AutoNested
        if($scope.isNested('csa')){
            $scope.activateNesting('csa', $scope.selectedCSAs, $event);
            $scope.applyNesting();
        }
    };

    //apply MSA quota
    $scope.addMSAQuota = function($event) {
        _.each($scope.selectedMSAs, function(msaQuota){
            if(msaQuota.number != undefined && msaQuota.number != null && msaQuota.number != "" || (msaQuota.hasOwnProperty('setGrupActive') && msaQuota.setGrupActive)) {
                msaQuota.flexiblePer = $scope.msaFlexibility.flxValue;
                msaQuota.flexible = $scope.msaFlexibility.isFlexible;
                msaQuota.hasValidQuotas = true;
                //Adding qual_id in Msa Array for AutoNesting
                var msaMasterData = _.findWhere(masterData, {"masterKey" : "msa"});
                msaQuota.qual_id = msaMasterData.id;
                msaQuota.qual_name = msaMasterData.masterkey;
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.selectedMSAs);

        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        $scope.editMSAFlag = true;
        $scope.hasMSAFlag = true;
        $scope.resetMSAQuotas = false;
        // If AutoNested
        if($scope.isNested('msa')){
            $scope.activateNesting('msa', $scope.selectedMSAs, $event);
            $scope.applyNesting();
        }
    };

    //apply County quota
    $scope.addCountyQuota = function($event) {
        _.each($scope.selectedCountys, function(countyQuota){
            if(countyQuota.number != undefined && countyQuota.number != null && countyQuota.number != "" || (countyQuota.hasOwnProperty('setGrupActive') && countyQuota.setGrupActive)) {
                countyQuota.flexiblePer = $scope.countyFlexibility.flxValue;
                countyQuota.flexible = $scope.countyFlexibility.isFlexible;
                countyQuota.hasValidQuotas = true;
                //Adding qual_id in County Array for AutoNesting
                var countyMasterData = _.findWhere(masterData, {"masterKey" : "county"});
                countyQuota.qual_id = countyMasterData.id;
                countyQuota.qual_name = countyMasterData.masterkey;
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.selectedCountys);

        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        $scope.editCountyFlag = true;
        $scope.hasCountyFlag = true;
        $scope.resetCountyQuotas = false;
        // If AutoNested
        if($scope.isNested('county')){
            $scope.activateNesting('county', $scope.selectedCountys, $event);
            $scope.applyNesting();
        }
    };

    $scope.addRegionQuota = function(regionFlxValue, $event) {
        // Added for Quota V2
        var qualiId = _.findWhere(masterData, {"masterKey":"regions"});
        if(!regionFlxValue){
            $scope.regQuotaFlag.regionFlxValue = "0";
        }
        if ($scope.sltRegion.length > 0) {
            var removeItem = [];
            _.each($scope.sltRegion, function(regQuota){
                if (regQuota.id) {
                    regQuota.flexible = angular.element("#regionSw").is(":checked");
                    regQuota.flexiblePer = parseInt(regionFlxValue) || 0;
                }
                if ($scope.region) {
                    _.each($scope.region, function(region){
                        if(regQuota.id == region.id) {
                            if((region.hasOwnProperty('number') && region.number != 0) || (region.hasOwnProperty('number') && $scope.liveSurveyEditingStep == 'editStep1' && region.number != 0) || (region.hasOwnProperty('number') && region.number != "" && region.number != 0) || (region.hasOwnProperty('setGrupActive') && region.setGrupActive) ) {
                                region.selected = true;
                                regQuota.qual_id = qualiId.id;  //For Quota V2
                                regQuota.number = parseInt(region.number) || 0;
                                regQuota.hasValidQuotas =  true;
                                regQuota.selected =  true;
                                regQuota.name =  region.name;

                                if ($scope.regQuotaFlag.regionFlxValue) {
                                    regQuota.minimum = parseInt(region.minimum) || 0;
                                    regQuota.maximum = parseInt(region.maximum) || 0;
                                    regQuota.percentage = parseInt(region.per) || 0;
                                }
                                if($scope.regQuotaFlag.regionFlxValue && $scope.liveSurveyEditingStep == 'editStep1' && (region.number == undefined || region.number == null || region.number == '')){
                                    regQuota.minimum = 0;
                                    regQuota.maximum = 0;
                                    regQuota.percentage = 0;
                                }

                            }
                            else {
                                region.selected = false;
                                removeItem.push(region.id);
                            }
                        }
                    });
                }
            });

            //PD-132
            checkQuotaExceedCmplts($scope.region);

            var temp = $scope.sltRegion.filter(function (item) {
               return !(removeItem.indexOf(item.id) !== -1);
            });

            $scope.sltRegion = temp;

            //PD-1402
            
            var matchedForBlankGroupQuota = _.where($scope.groupingCensusRgnModel, {"condditionGroup": true});
            if(matchedForBlankGroupQuota.length >0) {
                removeGroupedUnallocatedQuals(matchedForBlankGroupQuota, $scope.sltRegion, $scope.region, $scope.groupingCensusRgnModel);
            }

            notify({
                message: 'Quotas applied',
                classes: 'alert-success',
                duration: 2000
            });
            $scope.regQuotaFlag.editRegionFlag = true;
            $scope.regQuotaFlag.hasRegionFlag = true;
            $scope.regQuotaFlag.resetReg = false;
            // If AutoNested
            if($scope.isNested('regions')){
                $scope.activateNesting('regions', $scope.region, $event);
                $scope.applyNesting();
            }
        }
    };

    $scope.addRelationshipQuota = function(rlnFlxValue, $event) {
        //PD-961
        if($scope.isGrouped('relationships')) {
            $scope.quotaNumberChange('data', $scope.newrelationModal, $scope.rlnQuotaFlag.rlnFlxValue, 'rlnSw');
        }
        else {
           $scope.quotaNumberChange('data', $scope.relation, $scope.rlnQuotaFlag.rlnFlxValue, 'rlnSw');  
        }
        
        var removeItem = [];
        if(!rlnFlxValue){
            $scope.rlnQuotaFlag.rlnFlxValue = "0";
        }
        
        _.each($scope.sltRelation, function(rlnQuota){
            if (rlnQuota.id) {
                rlnQuota.flexible = angular.element("#rlnSw").is(":checked");
                rlnQuota.flexiblePer = parseInt(rlnFlxValue) || 0;
            }
            if ($scope.relation) {
                _.each($scope.relation, function(relation){
                    if (rlnQuota.id == relation.id) {
                        if((relation.hasOwnProperty('number') && relation.number != 0) || (relation.hasOwnProperty('number') && relation.number != 0 && $scope.liveSurveyEditingStep == 'editStep1') || (relation.hasOwnProperty('number') && relation.number != "" && relation.number != 0) || (relation.hasOwnProperty('setGrupActive') && relation.setGrupActive)) {
                            relation.selected = true;
                            rlnQuota.number = parseInt(relation.number) || 0;
                            // Check that the valid quota exists
                            rlnQuota.hasValidQuotas =  true;
                            rlnQuota.selected =  true;
                            rlnQuota.name =  relation.name;

                            if ($scope.rlnQuotaFlag.rlnFlxValue) {
                                rlnQuota.minimum = parseInt(relation.minimum) || 0;
                                rlnQuota.maximum = parseInt(relation.maximum) || 0;
                                rlnQuota.percentage = parseInt(relation.per) || 0;
                            }

                            if($scope.rlnQuotaFlag.rlnFlxValue && $scope.liveSurveyEditingStep == 'editStep1' && (relation.number == null || relation.number == undefined || relation.number == '')){
                                rlnQuota.minimum = 0;
                                rlnQuota.maximum = 0;
                                rlnQuota.percentage = 0;
                            }
                        }
                        else {
                            relation.selected = false;
                            removeItem.push(relation.id);
                        }
                    }
                });
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.relation);

        var temp = $scope.sltRelation.filter(function (item) {
           return !(removeItem.indexOf(item.id) !== -1);
        });

        $scope.sltRelation = temp;

        //PD-961

        var matchedForBlankGroupQuota = _.where($scope.newrelationModal, {"condditionGroup": true});
        if(matchedForBlankGroupQuota.length >0) {
            removeGroupedUnallocatedQuals(matchedForBlankGroupQuota, $scope.sltRelation, $scope.relation, $scope.newrelationModal);
        }

        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });

        $scope.rlnQuotaFlag.editRlnFlag = true;
        $scope.rlnQuotaFlag.hasRlnFlag = true;
        $scope.rlnQuotaFlag.resetRel = false;
        // If AutoNested
        if($scope.isNested('relationships')){
            $scope.activateNesting('relationships', $scope.relation, $event);
            $scope.applyNesting();
        }
    };

    //PD-321 clear natrep quota
    $scope.clearNatRepQuota = function() {
        //if location selected than check
        if($scope.locationData.selected && $scope.locationData.type == "natrep") {
                $timeout(function() {
                    angular.element('#clrmodel').trigger('click');
                    $scope.locationData.currentClickItem = "regionquota";
                },0);
        }
    };

    $scope.clearCensusRegion = function () {
        _.each($scope.region, function(region){
            region.number = '';
            region.per = '';
            region.minimum = '';
            region.maximum = '';
            if(_.has(region, "setGrupActive")) {
                region.setGrupActive = false; //PD-1402
            }
            
        });
        for (var i in $scope.sltRegion) {
            var id = $scope.sltRegion[i].id;
            $scope.sltRegion[i] = {id: id};
        }
    //PD-1402
        $scope.groupingCensusRgnModel = [];
        censusRgnModelLiveEdit = [];
        removeGroupingOnResetQuota("regions");
        $scope.quotaTotalRemRace = $scope.completesNeeded;
        $scope.regQuotaFlag.editRegionFlag = false;
        $scope.regQuotaFlag.hasRegionFlag = false;
        $scope.regQuotaFlag.resetReg = true;
    };

    $scope.clearCensusDivision = function () {
        _.each($scope.division, function(division){
            division.number = '';
            division.per = '';
            division.minimum = '';
            division.maximum = '';
            if(_.has(division, "setGrupActive")) {
                division.setGrupActive = false; //PD-1402
            }
        });

        for (var i in $scope.sltDivision) {
            var id = $scope.sltDivision[i].id;
            $scope.sltDivision[i] = {id: id};
        }
        //PD-1402
        $scope.groupingDivisionModel = [];
        divisionModelLiveEdit = [];
        removeGroupingOnResetQuota("divisions");

        $scope.quotaTotalRemRace = $scope.completesNeeded;
        $scope.dvsnQuotaFlag.editDivisionFlag = false;
        $scope.dvsnQuotaFlag.hasDivisionFlag = false;
        $scope.dvsnQuotaFlag.resetDivi = true;
    };

    $scope.addEmployementQuota = function(empFlxValue, $event) {
        // Census Rep should be set to false if quota applied manually
        if($scope.censusRepoFlag.hasCensusRepoEmploy){
            $scope.censusRepoFlag.hasCensusRepoEmploy = false;
        }
        //PD-961
        if($scope.isGrouped('employments')) {
           $scope.quotaNumberChange('data', $scope.groupingemploymentModal, $scope.empQuotaFlag.empFlxValue, 'empSw'); 
        }
        else{
            $scope.quotaNumberChange('data', $scope.employement, $scope.empQuotaFlag.empFlxValue, 'empSw');
        }
        
        var removeItem = [];
        if(!empFlxValue){
            $scope.empQuotaFlag.empFlxValue = "0";
        }
        _.each($scope.sltEmployment, function(empQuota){
            if (empQuota.id) {
                empQuota.flexible = angular.element("#empSw").is(":checked");
                empQuota.flexiblePer = parseInt(empFlxValue) || 0;
            }
            if ($scope.employement) {
                _.each($scope.employement, function(employment){
                    if (employment.id == empQuota.id) {
                        if((employment.hasOwnProperty('number') && employment.number != 0) || (employment.hasOwnProperty('number') && employment.number != 0 && $scope.liveSurveyEditingStep == 'editStep1') || (employment.hasOwnProperty('number') && employment.number != ""&& employment.number != 0) || (employment.hasOwnProperty('setGrupActive') && employment.setGrupActive)) {

                            employment.selected = true;
                            empQuota.number = parseInt(employment.number) || 0;
                            empQuota.selected = true;
                            empQuota.name =  employment.name;

                            if ($scope.empQuotaFlag.empFlxValue) {
                                empQuota.minimum = parseInt(employment.minimum) || 0;
                                empQuota.maximum = parseInt(employment.maximum) || 0;
                                empQuota.percentage = parseInt(employment.per) || 0;
                                empQuota.per = parseInt(employment.per) || 0;
                                // Check that the valid quota exists
                                empQuota.hasValidQuotas =  true;
                            }

                            if($scope.empQuotaFlag.empFlxValue && $scope.liveSurveyEditingStep == 'editStep1' && (employment.number == undefined || employment.number == null || employment.number == '')){
                                empQuota.number = 0;
                                empQuota.minimum = 0;
                                empQuota.maximum = 0;
                                empQuota.percentage = 0;
                                empQuota.per = 0;
                            }
                        }
                        else {
                            employment.selected = false;
                            removeItem.push(employment.id);
                        }
                    }
                });
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.employement);

        var temp = $scope.sltEmployment.filter(function (item) {
            return !(removeItem.indexOf(item.id) !== -1);
        });
        $scope.sltEmployment = temp;

        //PD-961

        var matchedForBlankGroupQuota = _.where($scope.groupingemploymentModal, {"condditionGroup": true});
        if(matchedForBlankGroupQuota.length >0) {
            removeGroupedUnallocatedQuals(matchedForBlankGroupQuota, $scope.sltEmployment, $scope.employement, $scope.groupingemploymentModal);
        }
        
        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        $scope.empQuotaFlag.editEmpFlag = true;
        $scope.empQuotaFlag.hasEmpFlag = true;
        $scope.empQuotaFlag.resetEmp = false;
        // If AutoNested
        if($scope.isNested('employments')){
            $scope.activateNesting('employments', $scope.employement, $event);
            $scope.applyNesting();
        }
    };

    $scope.addEducationQuota = function(eduFlxValue, $event) {
        // Census Rep should be set to false if quota applied manually
        if($scope.censusRepoFlag.hasCensusRepoEdu){
            $scope.censusRepoFlag.hasCensusRepoEdu = false;
        }
        //PD-961
        if($scope.isGrouped('educations')) {
            $scope.quotaNumberChange('data', $scope.groupingeducationModal, $scope.eduQuotaFlag.eduFlxValue, 'eduSw');
        }
        else {
          $scope.quotaNumberChange('data', $scope.education, $scope.eduQuotaFlag.eduFlxValue, 'eduSw');   
        }
        
        var removeItem = [];
        if(!eduFlxValue){
            $scope.eduQuotaFlag.eduFlxValue = "0";
        }
        
        _.each($scope.sltEducation, function(eduQuota){
            if (eduQuota.id) {
                eduQuota.flexible = angular.element("#eduSw").is(":checked");
                eduQuota.flexiblePer = parseInt($scope.eduQuotaFlag.eduFlxValue) || 0;
            }
            if ($scope.education) {
                _.each($scope.education, function(education){
                    if(education.id == eduQuota.id) {
                        if((education.hasOwnProperty('number') && education.number != 0) || (education.hasOwnProperty('number') && education.number != 0 && $scope.liveSurveyEditingStep == 'editStep1') || (education.hasOwnProperty('number') && education.number != "" && education.number != 0) || (education.hasOwnProperty('setGrupActive') && education.setGrupActive)) {
                            education.selected = true;

                            eduQuota.number = parseInt(education.number) || 0;
                            eduQuota.selected = true;
                            eduQuota.name =  education.name;
                            if ($scope.eduQuotaFlag.eduFlxValue) {
                                eduQuota.minimum = parseInt(education.minimum) || 0;
                                eduQuota.maximum = parseInt(education.maximum) || 0;
                                eduQuota.percentage = parseInt(education.per) || 0;
                                eduQuota.per = parseInt(education.per) || 0;
                                // Check that the valid quota exists
                                eduQuota.hasValidQuotas =  true;
                            }
                            if($scope.eduQuotaFlag.eduFlxValue && $scope.liveSurveyEditingStep == 'editStep1' && (education.number == undefined || education.number == null || education.number == '')){
                                eduQuota.minimum = 0;
                                eduQuota.maximum = 0;
                                eduQuota.percentage = 0;
                                eduQuota.per = 0;
                            }
                        }
                        else {
                            education.selected = false;
                            removeItem.push(education.id);
                        }
                    }
                });
            }
        });

        //PD-132
        checkQuotaExceedCmplts($scope.education);

        var temp = $scope.sltEducation.filter(function (item) {
            return !(removeItem.indexOf(item.id) !== -1);
        });

        $scope.sltEducation = temp;
        //PD-961
        var matchedForBlankGroupQuota = _.where($scope.groupingeducationModal, {"condditionGroup": true});
        if(matchedForBlankGroupQuota.length >0) {
            removeGroupedUnallocatedQuals(matchedForBlankGroupQuota, $scope.sltEducation, $scope.education, $scope.groupingeducationModal);
        }
        

        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        $scope.eduQuotaFlag.editEduFlag = true;
        $scope.eduQuotaFlag.hasEduFlag = true;
        $scope.eduQuotaFlag.resetEdu = false;
        // If AutoNested
        if($scope.isNested('educations')){
            $scope.activateNesting('educations', $scope.education, $event);
            $scope.applyNesting();
        }
    };

    $scope.checkedOption = function(id, selected, optn, rmFromArr, value, number,modalName) {
        _.each(optn, function(elm){
            if (elm.id == id && selected == true) {
                rmFromArr.push({
                    "id": id
                });
            }

            if (elm.id == id && selected == false) {
                
                elm.selected = false;
                unSelectCheckbox(id, rmFromArr, optn, value);

            }  
        });
        $scope.quotaNumberChange(id, optn, value,modalName);
    };

    function unSelectCheckbox(id, arr, optn, value) {
        var tmp = 0;
        _.each(arr, function(elm, index){
            if (elm.id == id) {
                arr.splice(index, 1);
            }
        });
        _.each(optn, function(elm){
            if (elm.selected == true) {

            } else {
                elm.number = '';
                elm.per = '';
                elm.minimum = '';
                elm.maximum = '';
            }

            elm.totalRem = parseInt($scope.completesNeeded - tmp);
        });
    }

    $scope.quotaPercentageChange = function(dataArr, value) {
        if (dataArr) {
            var tmp = 0;
            var mx = 0;
            var min = 0;
            if(!value){
                value = 0;
            }
            _.each(dataArr, function(arr){
                if (arr.minimum != undefined && arr.minimum != null && arr.number != undefined && arr.number != null) {
                    min = min + (arr.number - (arr.number * parseInt(value)) / 100);
                }
            });
            _.each(dataArr, function(arr){
                if (arr.selected == true && arr.number != undefined) {
                    if(arr.number == $scope.completesNeeded){
                        arr.minimum = parseInt($scope.completesNeeded);
                        arr.maximum = parseInt($scope.completesNeeded);
                    }else{
                        arr.minimum = Math.round(arr.number - (arr.number * parseInt(value)) / 100);
                        arr.maximum = Math.min(parseInt(arr.number + (arr.number * parseInt(value)) / 100), Math.round($scope.completesNeeded - (min - arr.minimum)));
                    }
                    tmp = parseInt(tmp + arr.number);
                    /*------if minimum value = 0 then makes it 1--------*/
                    arr.minimum = arr.number > 0 && arr.minimum == 0 ? 1:arr.minimum;
                    /*------if minimum value = 0 then makes it 1--------*/
                    
                    mx = parseInt(mx + arr.maximum);
                    arr.totalRem = $scope.completesNeeded - tmp;
                    //arr.max = mx;
                }     
            });
        }


    };

    function getArrayLength(data) {
        var count = 0;
        for (var i in data) {
            if (data[i].selected == true) {
                count = count + 1;
            }
        }
        return count;
    }

    $scope.clearNumberChange = function(dataArr, index) {
        dataArr[index].per = 0;
        dataArr[index].minimum = 0;
        dataArr[index].maximum = 0;
    };

    $scope.quotaNumberChange = function(id, dataArr, value, modalName) {
        var tmp = 0;
        var mx = 0;
        var min = 0;
        var totalNumber = 0;
        if(!value){
            value = 0;
        }
        _.each(dataArr, function(arr){
            if(arr.minimum != undefined && arr.minimum != null && arr.minimum != '' && arr.number != undefined && arr.number != null && arr.number != '') {
                min = min + (arr.number - (arr.number * parseInt(value)) / 100);
            }
            if(arr.number != undefined && arr.number != null && arr.number != '') {
                totalNumber = parseInt(totalNumber + arr.number);
            }else {
                arr.minimum = '';
                arr.number = '';
                arr.maximum = '';
                arr.per = '';
            }
        });
        
        for (var i in dataArr) {
            if (dataArr[i].selected == true) {
                if(dataArr[i].number != null && dataArr[i].number != undefined && dataArr[i].number != ''){
                    dataArr[i].per = Math.round((dataArr[i].number * 100) / $scope.completesNeeded);
                    dataArr[i].percentage = Math.round((dataArr[i].number * 100) / $scope.completesNeeded);
                    if (angular.element("#" + modalName).is(":checked") == true) {
                        // If Allocation are equal to completes
                        if(dataArr[i].number == $scope.completesNeeded){
                            dataArr[i].minimum = parseInt($scope.completesNeeded);
                            dataArr[i].maximum = parseInt($scope.completesNeeded);
                        }else{
                            dataArr[i].minimum = Math.round(dataArr[i].number - (dataArr[i].number * parseInt(value)) / 100);
                            dataArr[i].maximum = Math.min(parseInt(dataArr[i].number + (dataArr[i].number * parseInt(value)) / 100), Math.round($scope.completesNeeded - (min - dataArr[i].minimum)));
                        }
                        /*------if minimum value = 0 then makes it 1--------*/
                        dataArr[i].minimum = dataArr[i].number > 0 && dataArr[i].minimum == 0 ? 1:dataArr[i].minimum;
                        /*------if minimum value = 0 then makes it 1--------*/
                    } else {
                        dataArr[i].minimum = dataArr[i].number;
                        dataArr[i].maximum = dataArr[i].number;
                    }
                }
            }
        }
        $scope.quotaTotalRemRace = $scope.completesNeeded - totalNumber;
        // When allcoations or percentages increased by total completes
        if($scope.quotaTotalRemRace < 0){
            notify({
                message: "The total number of completes allocated in the quotas doesn't equal the total number of completes remaining",
                classes: 'alert-warning',
                duration: 2000
            });
        }
        quotaChange(dataArr, modalName);
    }; 
    /*it is used to change the number and min,max when insert percentage in quota*/
    $scope.quotaPerChange = function(id, dataArr, value, modalName){
        var tmp = 0;
        var mx = 0;
        var min = 0;
        var totalNumber = 0;
        if(!value){
            value = 0;
        }
        _.each(dataArr, function(arr){
            // To find total min value we need to calc the number first
            if(arr.per != undefined && arr.per != null && arr.per != ''){
                arr.number = Math.round(($scope.completesNeeded * arr.per) / 100);
            }
            else {
                arr.minimum = '';
                arr.number = '';
                arr.maximum = '';
                arr.per = '';
            }
            if (arr.minimum != undefined && arr.minimum != null && arr.minimum != '' && arr.number != undefined && arr.number != null && arr.number != '') {
                min = min + (arr.number - (arr.number * parseInt(value)) / 100);
            }
            if(arr.number != undefined && arr.number != null && arr.number != ''){
                totalNumber += arr.number;
            }
           
        });
        for (var i in dataArr) {
            if (dataArr[i].selected == true) {
                if(dataArr[i].per){
                    dataArr[i].number = Math.round(($scope.completesNeeded * dataArr[i].per) / 100);
                        dataArr[i].per = parseInt(dataArr[i].per);
                        dataArr[i].percentage = parseInt(dataArr[i].per);
                    if (angular.element("#" + modalName).is(":checked") == true) {
                        // If Allocation are equal to completes
                        if(dataArr[i].number == $scope.completesNeeded){
                            dataArr[i].minimum = parseInt($scope.completesNeeded);
                            dataArr[i].maximum = parseInt($scope.completesNeeded);
                        }else{
                            dataArr[i].minimum = Math.round(dataArr[i].number - (dataArr[i].number * parseInt(value)) / 100);
                            dataArr[i].maximum = Math.min(parseInt(dataArr[i].number + (dataArr[i].number * parseInt(value)) / 100), Math.round($scope.completesNeeded - (min - dataArr[i].minimum)));
                        }
                        /*------if minimum value = 0 then makes it 1--------*/
                        dataArr[i].minimum = dataArr[i].number > 0 && dataArr[i].minimum == 0 ? 1:dataArr[i].minimum;
                        /*------if minimum value = 0 then makes it 1--------*/
                    } else {
                        dataArr[i].minimum = dataArr[i].number;
                        dataArr[i].maximum = dataArr[i].number;
                    }
                }else{ 
                        dataArr[i].minimum = '';
                        dataArr[i].number = '';
                        dataArr[i].maximum = '';
                        dataArr[i].per = '';
                }
            }
        }
        $scope.quotaTotalRemRace = $scope.completesNeeded - totalNumber;
        // When allcoations or percentages increased by total completes
        if($scope.quotaTotalRemRace < 0){
            notify({
                message: "The total number of completes allocated in the quotas doesn't equal the total number of completes remaining",
                classes: 'alert-warning',
                duration: 2000
            });
        }
        quotaChange(dataArr,modalName);
    }; 
    /* Show error if allocation inserted is less than fielded */ 
    function quotaChange(dataArr, modalName){
         for (var i in dataArr) {
            if (dataArr[i].selected == true) {
                if((dataArr[i].achieved != undefined || dataArr[i].achieved != null || dataArr[i].achieved != '') && dataArr[i].number < dataArr[i].achieved){
                    notify({
                        message: 'Please change allocation greater than their fielded',
                        classes: 'alert-warning',
                        duration: 2000
                    });
                    if(modalName == "gndr"){
                        $scope.gndrAllocationsLessThanFielded = true;
                    }else if(modalName == "raceSw"){
                        $scope.raceAllocationsLessThanFielded = true;
                    }else if(modalName == "rlnSw"){
                        $scope.rlnAllocationsLessThanFielded = true;
                    }else if(modalName == "eduSw"){
                        $scope.eduAllocationsLessThanFielded = true;
                    }else if(modalName == "empSw"){
                        $scope.empAllocationsLessThanFielded = true;
                    }else if(modalName == "devcSw"){
                        $scope.deviceAllocationsLessThanFielded = true;
                    }else if(modalName == "regionSw"){
                        $scope.rgnAllocationsLessThanFielded = true;
                    }else if(modalName == "divisionSw"){
                        $scope.dvsnAllocationsLessThanFielded = true;
                    }else if(modalName == "csaSw"){
                        $scope.csaAllocationsLessThanFielded = true;
                    }else if(modalName == "msaSw"){
                        $scope.msaAllocationsLessThanFielded = true;
                    }else if(modalName == "countySw"){
                        $scope.countyAllocationsLessThanFielded = true;
                    }else if(modalName == "stateSw"){
                        $scope.stateAllocationsLessThanFielded = true;
                    }else if(modalName == "dmaSw"){
                        $scope.dmaAllocationsLessThanFielded = true;
                    }
                    else if(modalName == "zipcodeSw") {
                        $scope.zipcodeAllocationsLessThanFielded = true;
                    }
                    break;
                }else{
                    $scope.gndrAllocationsLessThanFielded = false;
                    $scope.raceAllocationsLessThanFielded = false;
                    $scope.rlnAllocationsLessThanFielded = false;
                    $scope.chldAllocationsLessThanFielded = false;
                    $scope.eduAllocationsLessThanFielded = false;
                    $scope.empAllocationsLessThanFielded = false;
                    $scope.deviceAllocationsLessThanFielded = false;
                    $scope.rgnAllocationsLessThanFielded = false;
                    $scope.dvsnAllocationsLessThanFielded = false;
                    $scope.dmaAllocationsLessThanFielded = false;
                    $scope.csaAllocationsLessThanFielded = false;
                    $scope.msaAllocationsLessThanFielded = false;
                    $scope.countyAllocationsLessThanFielded = false;
                    $scope.stateAllocationsLessThanFielded = false;
                    $scope.zipcodeAllocationsLessThanFielded = false;
                }
            }    
        }        
    };
    
    function calculateMaxMin(max, id, arr) {
        var min = 0;
        var num = 0;
        for (var i in arr) {
            if (arr[i].selected == true && arr[i].id != id) {
                if (arr[i].minimum) {
                    min = min + arr[i].minimum;
                }

            }
            num = parseInt(num + arr[i].number);

            if (max + min > $scope.completesNeeded) {
                return $scope.completesNeeded - min;
            }

            if (arr[i].selected == true && arr[i].id == id) {
                var sum = parseInt(max + min);

                if (sum > num) {
                    var dif = sum - num;
                    arr[i].maximum = arr[i].maximum - dif;
                    return parseInt(arr[i].maximum);
                } else {
                    return parseInt(arr[i].maximum);
                }

            }
        }

    }

    $scope.openAgeModal = function() {
        $scope.ageTotalRemRace = $scope.completesNeeded;

        if ($scope.ageData.min && $scope.ageData.max && $scope.completesNeeded && $scope.ageTempArr.length >= 0) {
            if ($scope.ageTempArr.length == 0) {
                $scope.ageFlag = false;
                $scope.ageTempArr[0] = {
                    "flexPer": 0
                }
            }
            else {
                $scope.ageFlag = true;
                for (var i in $scope.ageTempArr) {
                    $scope.ageTempArr[i].flexPer = $scope.ageTempArr[i].flexiblePer;
                    $scope.ageTempArr[i].per = parseInt($scope.ageTempArr[i].number * 100 / $scope.completesNeeded);
                    $scope.ageTempArr[i].flexible = $scope.ageQuotaFlag.ageFlx;

                    if($scope.ageTempArr[i].number)
                        $scope.ageTotalRemRace = $scope.ageTotalRemRace - $scope.ageTempArr[i].number;
                }
            }
        }
        
    };

    $scope.addChldNewRow = function(index) {
        var validRange = false;
        //checking min, max, gender and number is present before adding row.
        if($scope.chldTempArr.have[index].number  && $scope.chldTempArr.have[index].max && $scope.chldTempArr.have[index].min != undefined && $scope.chldTempArr.have[index].min != null && $scope.chldTempArr.have[index].gender && (($scope.childAgeUnit.name == "year" && $scope.chldTempArr.have[index].min<=18 && $scope.chldTempArr.have[index].max<=18) || ($scope.childAgeUnit.name == "month" && $scope.chldTempArr.have[index].min <= 48 && $scope.chldTempArr.have[index].max <= 48))){ 
            var breakloop=false;
            _.each($scope.chldTempArr.have, function(values,index){
                if(breakloop == false){
                    if(index !=0 && ($scope.chldTempArr.have[0].gender == $scope.chldTempArr.have[index].gender ||( $scope.chldTempArr.have[0].gender == 3 || $scope.chldTempArr.have[index].gender ==3))){
                        if(($scope.chldTempArr.have[0].min < $scope.chldTempArr.have[index].min || $scope.chldTempArr.have[0].min > $scope.chldTempArr.have[index].max) && ($scope.chldTempArr.have[0].max < $scope.chldTempArr.have[index].min || $scope.chldTempArr.have[0].max > $scope.chldTempArr.have[index].max ) && ($scope.chldTempArr.have[0].min != $scope.chldTempArr.have[0].max)){
                            validRange = true;
                        }else{
                            validRange = false;
                             notify({
                                message: 'Defined ranges are not valid',
                                classes: 'alert-warning',
                                duration: 4000
                               
                            });
                            event.preventDefault();
                            event.stopPropagation();
                            breakloop = true;
                        }
                    }
                }
            });
            if($scope.chldTempArr.have.length ==1 || validRange || !breakloop){
                    $scope.chldTempArr.have.unshift({
                        "id":$scope.chldTempArr.have[0].id,
                        "min": '',
                        "max": '',
                        "gender":'',
                        "number": '',
                        "per": '',
                        "flexiblePer": '0',
                        "flexible": $scope.chldTempArr.have[0].flexible
                    });
                    var num = 0;
                    _.each(_.keys($scope.chldTempArr), function(singleKey){
                        _.each($scope.chldTempArr[singleKey], function(singleRow, rowNo){
                            if(singleRow.number != null && singleRow.number != undefined && singleRow.number != '' && !isNaN(singleRow.number)){
                                num += parseInt(singleRow.number);
                            }
                            singleRow.totalRem = $scope.completesNeeded - num;
                            /*if (singleKey == 'no' || (singleKey == 'have' && rowNo != 0)) {
                                singleRow.min = parseInt(singleRow.max) + parseInt(1) < 100 ? parseInt(singleRow.max) + parseInt(1) : 0;
                                //$scope.chldTempArr[index].max = 17;
                            }*/
                        });
                    });
                $scope.chldTotalRemRace = $scope.completesNeeded - num;
            }
            
        }else{
            if(!$scope.chldTempArr.have[index].gender){
                notify({
                    message: "Please select gender",
                    classes: 'alert-danger',
                    duration: 2000
                })
            }else if(($scope.childAgeUnit.name == "year" && ($scope.chldTempArr.have[0].min >18 || $scope.chldTempArr.have[0].max >18)) || ($scope.childAgeUnit.name == "month" && ($scope.chldTempArr.have[0].min>48 || $scope.chldTempArr.have[0].max>48))){
                    notify({
                        message: "Age can't be greater 18 for years and 48 for months",
                        classes: 'alert-danger',
                        duration: 4000
                    })
            }else{
                notify({
                    message: "Row can not be empty",
                    classes: 'alert-danger',
                    duration: 2000
                })
            }
        }
    };

    $scope.removeChldNewRow = function(index) {
        $scope.chldTempArr.have.splice(index, 1);
        var num = 0;
        _.each(_.keys($scope.chldTempArr), function(singleKey){
            _.each($scope.chldTempArr[singleKey], function(singleRow){
                if(singleRow.number != null && singleRow.number != undefined && singleRow.number != '' && !isNaN(singleRow.number)){
                    num += parseInt(singleRow.number);
                }
            });
        });
        $scope.chldTotalRemRace = $scope.completesNeeded - num;
    };

    $scope.addAgeNewRow = function (index) {
        if ($scope.ageTempArr[index].min < $scope.ageData.min) {
            notify({
                message: "age can\'t less than min age",
                classes: 'alert-danger',
                duration: 3000
            });
            return false;
        }

        if ($scope.ageTempArr[index].max > $scope.ageData.max) {
            notify({
                message: "age can\'t exceed than max age",
                classes: 'alert-danger',
                duration: 2000
            });
            return false;
        }
        if ($scope.ageTempArr[index].number != '' && $scope.ageTempArr[index].number != null && $scope.ageTempArr[index].number != 0) {

            $scope.ageTempArr.unshift({
                "min": '',
                "max": '',
                "number": '',
                "per": '',
                "flexPer": '',
                "flexible": $scope.ageQuotaFlag.ageFlx
            });
            var num = 0;
            for (var i in $scope.ageTempArr) {
                num = parseInt($scope.completesNeeded / $scope.ageTempArr.length);
                num = parseInt(num + $scope.ageTempArr[i].number);
                $scope.ageTempArr[i].totalRem = $scope.completesNeeded - num;

                if (parseInt(i) !== index) {
                    $scope.ageTempArr[index].min = parseInt($scope.ageTempArr[index + 1].max) + parseInt(1) < 100 ? parseInt($scope.ageTempArr[index + 1].max) + parseInt(1) : 0;
                }
            }
        } else {
            notify({
                message: "Row can not be empty",
                classes: 'alert-danger',
                duration: 2000
            });
        }
        var totalNumber = 0;
        for (var j in $scope.ageTempArr) {
            if ($scope.ageTempArr[j].number != undefined && $scope.ageTempArr[j].number != null) {
                totalNumber = parseInt(totalNumber + $scope.ageTempArr[j].number);
            }
        }
        $scope.ageTotalRemRace = $scope.completesNeeded - totalNumber;
    };

    $scope.removeAgeNewRow = function(index) {
        $scope.ageTotalRemRace = $scope.ageTotalRemRace + $scope.ageTempArr[index].number;
        $scope.ageTempArr.splice(index, 1);

        var num = 0;
        for (var i in $scope.ageTempArr) {
            //$scope.ageTempArr[i].number = parseInt($scope.completesNeeded/$scope.ageTempArr.length);
            //$scope.ageTempArr[i].per = parseInt(( $scope.ageTempArr[i].number * 100) / $scope.completesNeeded);
            num = parseInt($scope.completesNeeded / $scope.ageTempArr.length);
            num = parseInt(num + $scope.ageTempArr[i].number);
            $scope.ageTempArr[i].totalRem = $scope.completesNeeded - num;
        }
        //$scope.ageTotalRemRace = $scope.completesNeeded - totalNumber;
    };
    
    $scope.chldNumberChange = function(value, flexibility, rowNum) {
        var num = 0;
        var min = 0;
        var totalNumber = 0;
        if(!flexibility){
            flexibility = 0;
        }
        _.each(_.keys($scope.chldTempArr), function(singlekey){
            _.each($scope.chldTempArr[singlekey], function(singleKeyItem){
                if(singleKeyItem && singleKeyItem.number){
                    min = parseInt(min + parseInt(singleKeyItem.number - (singleKeyItem.number * parseInt(flexibility)) / 100));
                    totalNumber = parseInt(totalNumber + singleKeyItem.number);
                }
            });
        });
        _.each(_.keys($scope.chldTempArr), function(singlekey){
            _.each($scope.chldTempArr[singlekey], function(singleKeyItem){
                singleKeyItem.per = parseInt((singleKeyItem.number * 100) / $scope.completesNeeded); 
                if(angular.element("#chldSw").is(":checked") == true){
                    // if number is equal to completes then min=max=completes
                    if(singleKeyItem.number ==  $scope.completesNeeded){
                        singleKeyItem.minimum = parseInt($scope.completesNeeded);
                        singleKeyItem.maximum = parseInt($scope.completesNeeded);
                    }else{
                        singleKeyItem.minimum = Math.round(singleKeyItem.number - (singleKeyItem.number * parseInt(flexibility)) / 100);
                        singleKeyItem.maximum = Math.min(parseInt(singleKeyItem.number + (singleKeyItem.number * parseInt(flexibility)) / 100), Math.round($scope.completesNeeded - (min - singleKeyItem.minimum)));
                    }
                    /*------if minimum value = 0 then makes it 1--------*/
                    singleKeyItem.minimum = singleKeyItem.number > 0 && singleKeyItem.minimum == 0 ? 1:singleKeyItem.minimum;
                    /*------if minimum value = 0 then makes it 1--------*/
                    // Check weather completes are less than achieved values
                    if(singleKeyItem.number < singleKeyItem.achieved){
                        notify({
                            message: 'Please change allocation greater than their fielded',
                            classes: 'alert-warning',
                            duration: 2000
                        });
                        $scope.chldAllocationsLessThanFielded = true;
                    }else{
                        $scope.chldAllocationsLessThanFielded = false;
                    }
                }else {
                    singleKeyItem.minimum = singleKeyItem.number;
                    singleKeyItem.maximum = singleKeyItem.number;
                } 
                if(singlekey == 'no' || (singlekey == 'have' && rowNum != 0)){
                    if(singleKeyItem.number != null && singleKeyItem.number != undefined && singleKeyItem.number != '' && !isNaN(singleKeyItem.number)){
                        num += parseInt(singleKeyItem.number);
                    }
                }
            });
        });
        if(rowNum != 0){
            num = isNaN(num)? 0:num;
            $scope.chldTotalRemRace = $scope.completesNeeded - num;
        }
        //$scope.chldTotalRemRace = $scope.completesNeeded - num;
        //If user enters allocations or percentage > completes
        if($scope.chldTotalRemRace < 0){
            notify({
                message: "The total number of completes allocated in the quotas doesn't equal the total number of completes remaining",
                classes: 'alert-warning',
                duration: 2000
            });
        }
    };
    // child per change 
    $scope.chldPerChange = function(value, flexibility, rowNum){
        var num = 0;
        var min = 0;
        var totalNumber = 0;
        if(!flexibility){
            flexibility = 0;
        }
        _.each(_.keys($scope.chldTempArr), function(singlekey){
            _.each($scope.chldTempArr[singlekey], function(singleKeyItem){
                singleKeyItem.number = Math.round((singleKeyItem.per * $scope.completesNeeded) / 100);
                if(singleKeyItem && singleKeyItem.number){
                    min = parseInt(min + parseInt(singleKeyItem.number - (singleKeyItem.number * parseInt(flexibility)) / 100));
                    totalNumber = parseInt(totalNumber + singleKeyItem.number);
                }
            });
        });
        _.each(_.keys($scope.chldTempArr), function(singlekey){
            _.each($scope.chldTempArr[singlekey], function(singleKeyItem){
                singleKeyItem.per = parseInt(singleKeyItem.per);
                singleKeyItem.number = Math.round((singleKeyItem.per * $scope.completesNeeded) / 100);
                if(angular.element("#chldSw").is(":checked") == true){
                    // if number is equal to completes then min=max=completes
                    if(singleKeyItem.number ==  $scope.completesNeeded){
                        singleKeyItem.minimum = parseInt($scope.completesNeeded);
                        singleKeyItem.maximum = parseInt($scope.completesNeeded);
                    }else{
                        singleKeyItem.minimum = Math.round(singleKeyItem.number - (singleKeyItem.number * parseInt(flexibility)) / 100);
                        singleKeyItem.maximum = Math.min(parseInt(singleKeyItem.number + (singleKeyItem.number * parseInt(flexibility)) / 100), Math.round($scope.completesNeeded - (min - singleKeyItem.minimum)));
                    }
                    /*------if minimum value = 0 then makes it 1--------*/
                    singleKeyItem.minimum = singleKeyItem.number > 0 && singleKeyItem.minimum == 0 ? 1:singleKeyItem.minimum;
                    /*------if minimum value = 0 then makes it 1--------*/
                    // Check weather completes are less than achieved values
                    if(singleKeyItem.number < singleKeyItem.achieved){
                        notify({
                            message: 'Please change allocation greater than their fielded',
                            classes: 'alert-warning',
                            duration: 2000
                        });
                        $scope.chldAllocationsLessThanFielded = true;
                    }else{
                        $scope.chldAllocationsLessThanFielded = false;
                    }
                }else {
                    singleKeyItem.minimum = singleKeyItem.number;
                    singleKeyItem.maximum = singleKeyItem.number;
                }
                
                if(singlekey == 'no' || (singlekey == 'have' && rowNum != 0)){
                    if(singleKeyItem.number != null && singleKeyItem.number != undefined && singleKeyItem.number != '' && !isNaN(singleKeyItem.number)){
                        num += parseInt(singleKeyItem.number);
                    }
                }
            });
        });
        
        if(rowNum != 0){
            num = isNaN(num)? 0:num;
            $scope.chldTotalRemRace = $scope.completesNeeded - num;
        }
        //$scope.chldTotalRemRace = $scope.completesNeeded - num;
        //If user enters allocations or percentage > completes
        if($scope.chldTotalRemRace < 0){
            notify({
                message: "The total number of completes allocated in the quotas doesn't equal the total number of completes remaining",
                classes: 'alert-warning',
                duration: 2000
            });
        }
    };

    $scope.chldPercentageChange = function(dataArr, value) {
        var min = 0;
        var max = 0;
        if(!value){
            value ="0";
        }
        _.each(_.keys(dataArr), function(singlekey){
            _.each(dataArr[singlekey], function(singleKeyItem){
                if(singleKeyItem && singleKeyItem.number){
                    min += parseInt(singleKeyItem.number - (singleKeyItem.number * parseInt(value)) / 100);
                }
            });
        });
        _.each(_.keys(dataArr), function(singlekey){
            _.each(dataArr[singlekey], function(singleKeyItem){
                if (value) {
                    singleKeyItem.minimum = parseInt(singleKeyItem.number - (singleKeyItem.number * parseInt(value)) / 100);
                    /*------if minimum value = 0 then makes it 1--------*/
                    singleKeyItem.minimum = singleKeyItem.number > 0 && singleKeyItem.minimum == 0 ? 1:singleKeyItem.minimum;
                    /*------if minimum value = 0 then makes it 1--------*/
                    singleKeyItem.maximum = Math.min(parseInt(singleKeyItem.number + (singleKeyItem.number * parseInt(value)) / 100), $scope.completesNeeded - (min - singleKeyItem.minimum));
                } else {
                    singleKeyItem.minimum = '';
                    singleKeyItem.maximum = '';
                }
                singleKeyItem.flexible = $scope.childQuotaFlag.chldFlx;
            });
        });
        
    };

    $scope.ageNumberChange = function(value, flexibility, ageRow) {
        var num = 0;
        var min = 0;
        var totalNumber = 0;
        if(!flexibility){
            flexibility = 0;
        }
        for (var j in $scope.ageTempArr) {
            if (value) {
                if ($scope.ageTempArr[j].minimum != null && $scope.ageTempArr[j].minimum != undefined) {
                    min = min + ($scope.ageTempArr[j].number - ($scope.ageTempArr[j].number * parseInt(flexibility)) / 100);
                }
                if ($scope.ageTempArr[j].number != undefined && $scope.ageTempArr[j].number != null) {
                    totalNumber = parseInt(totalNumber + $scope.ageTempArr[j].number);
                }
            }
        }
        for (var i in $scope.ageTempArr) {
            if (value) {
                $scope.ageTempArr[i].per = Math.round(($scope.ageTempArr[i].number * 100) / $scope.completesNeeded);
                if (angular.element("#age").is(":checked") == true) {
                    // if number is equal to completes then min=max=completes
                    if($scope.ageTempArr[i].number ==  $scope.completesNeeded){
                        $scope.ageTempArr[i].minimum = parseInt($scope.completesNeeded);
                        $scope.ageTempArr[i].maximum = parseInt($scope.completesNeeded);
                    }else{
                        $scope.ageTempArr[i].minimum = Math.round($scope.ageTempArr[i].number - ($scope.ageTempArr[i].number * parseInt(flexibility)) / 100);
                        $scope.ageTempArr[i].maximum = Math.min(parseInt($scope.ageTempArr[i].number + ($scope.ageTempArr[i].number * parseInt(flexibility)) / 100), Math.round($scope.completesNeeded - (min - $scope.ageTempArr[i].minimum)));
                    }
                    /*------if minimum value = 0 then makes it 1--------*/
                    $scope.ageTempArr[i].minimum = $scope.ageTempArr[i].number > 0 && $scope.ageTempArr[i].minimum == 0 ? 1:$scope.ageTempArr[i].minimum;
                    /*------if minimum value = 0 then makes it 1--------*/
                } else {
                    $scope.ageTempArr[i].minimum = $scope.ageTempArr[i].number;
                    $scope.ageTempArr[i].maximum = $scope.ageTempArr[i].number;
                }
                num = isNaN(parseInt(num + $scope.ageTempArr[i].number))? 0:parseInt(num + $scope.ageTempArr[i].number);

                // Check weather completes are less than achieved values
                if($scope.ageTempArr[i].number < $scope.ageTempArr[i].achieved){
                    notify({
                        message: 'Please change allocation greater than their fielded',
                        classes: 'alert-warning',
                        duration: 2000
                    });
                    $scope.ageAllocationsLessThanFielded = true;
                }else{
                    $scope.ageAllocationsLessThanFielded = false;
                }
            } else {
                $scope.ageTempArr[i].per = '';
                $scope.ageTempArr[i].minimum = '';
                $scope.ageTempArr[i].maximum = '';
            }
            //$scope.ageTempArr[i].maximum = minMaxForAgeIncome($scope.ageTempArr[i].maximum, i, $scope.ageTempArr);
        }
        if(ageRow != 0){
            $scope.ageTotalRemRace = $scope.completesNeeded - num;
        }
        //$scope.ageTotalRemRace = $scope.completesNeeded - num;
        //If user enters allocations or percentage > completes
        if($scope.ageTotalRemRace < 0){
            notify({
                message: "The total number of completes allocated in the quotas doesn't equal the total number of completes remaining",
                classes: 'alert-warning',
                duration: 2000
            });
        }
    };
    /*it is use insert percentage to show min,max and number*/
    $scope.agePerChange = function(value, flexibility, ageRow){
        var num = 0;
        var min = 0;
        var totalNumber = 0;
        if(!flexibility){
            flexibility = 0;
        }
        for (var j in $scope.ageTempArr) {
            if (value) {
                $scope.ageTempArr[j].number = Math.round(($scope.ageTempArr[j].per * $scope.completesNeeded) / 100);
                if ($scope.ageTempArr[j].minimum != null && $scope.ageTempArr[j].minimum != undefined) {
                    min = min + ($scope.ageTempArr[j].number - ($scope.ageTempArr[j].number * parseInt(flexibility)) / 100);
                }
                if ($scope.ageTempArr[j].number != undefined && $scope.ageTempArr[j].number != null) {
                    totalNumber = parseInt(totalNumber + $scope.ageTempArr[j].number);
                }
            }
        }
        for (var i in $scope.ageTempArr) {
            if (value) {
                $scope.ageTempArr[i].number = Math.round(($scope.ageTempArr[i].per * $scope.completesNeeded) / 100);
                  $scope.ageTempArr[i].per = parseInt($scope.ageTempArr[i].per);
                 
                if (angular.element("#age").is(":checked") == true) {
                    // if number is equal to completes then min=max=completes
                    if($scope.ageTempArr[i].number == parseInt($scope.completesNeeded)){
                        $scope.ageTempArr[i].minimum = parseInt($scope.completesNeeded);
                        $scope.ageTempArr[i].maximum = parseInt($scope.completesNeeded);
                    }else{
                        $scope.ageTempArr[i].minimum = Math.round($scope.ageTempArr[i].number - ($scope.ageTempArr[i].number * parseInt(flexibility)) / 100);
                        $scope.ageTempArr[i].maximum = Math.min(parseInt($scope.ageTempArr[i].number + ($scope.ageTempArr[i].number * parseInt(flexibility)) / 100), Math.round($scope.completesNeeded - (min - $scope.ageTempArr[i].minimum)));
                    }
                    /*------if minimum value = 0 then makes it 1--------*/
                    $scope.ageTempArr[i].minimum = $scope.ageTempArr[i].number > 0 && $scope.ageTempArr[i].minimum == 0 ? 1:$scope.ageTempArr[i].minimum;
                    /*------if minimum value = 0 then makes it 1--------*/
                } else {
                    $scope.ageTempArr[i].minimum = $scope.ageTempArr[i].number;
                    $scope.ageTempArr[i].maximum = $scope.ageTempArr[i].number;
                }
                num = isNaN(parseInt(num + $scope.ageTempArr[i].number))?0:parseInt(num + $scope.ageTempArr[i].number);

                // Check weather completes are less than achieved values
                if($scope.ageTempArr[i].number < $scope.ageTempArr[i].achieved){
                    notify({
                        message: 'Please change allocation greater than their fielded',
                        classes: 'alert-warning',
                        duration: 2000
                    });
                    $scope.ageAllocationsLessThanFielded = true;
                }else{
                    $scope.ageAllocationsLessThanFielded = false;
                }
            } else {
                $scope.ageTempArr[i].per = '';
                $scope.ageTempArr[i].minimum = '';
                $scope.ageTempArr[i].maximum = '';
            }
            //$scope.ageTempArr[i].maximum = minMaxForAgeIncome($scope.ageTempArr[i].maximum, i, $scope.ageTempArr);
        }
        if(ageRow != 0){
            $scope.ageTotalRemRace = $scope.completesNeeded - num;
        }
        //If user enters allocations or percentage > completes
        if($scope.ageTotalRemRace < 0){
            notify({
                message: "The total number of completes allocated in the quotas doesn't equal the total number of completes remaining",
                classes: 'alert-warning',
                duration: 2000
            });
        }
    };

    $scope.agePercentageChange = function(dataArr, value) {
        var min = 0;
        var max = 0;
        if(!value){
            value = "0";
        }
        for (var j in dataArr) {
            if(value){
                if ($scope.ageTempArr[j].minimum != null && $scope.ageTempArr[j].minimum != undefined) {
                    min = min + ($scope.ageTempArr[j].number - ($scope.ageTempArr[j].number * parseInt(value)) / 100);
                }
            }
        }
        for (var i in dataArr) {
            if (value) {
                if($scope.ageTempArr[i].number == parseInt($scope.completesNeeded)){
                    $scope.ageTempArr[i].minimum = parseInt($scope.completesNeeded);
                    $scope.ageTempArr[i].maximum = parseInt($scope.completesNeeded);
                }else{
                    $scope.ageTempArr[i].minimum = $scope.ageTempArr[i].number == $scope.completesNeeded? parseInt($scope.completesNeeded) : Math.round($scope.ageTempArr[i].number - ($scope.ageTempArr[i].number * parseInt(value)) / 100);
                    // if number is equal to completes then min=max=completes
                    $scope.ageTempArr[i].maximum = $scope.ageTempArr[i].number == $scope.completesNeeded? parseInt($scope.completesNeeded) : Math.min(parseInt($scope.ageTempArr[i].number + ($scope.ageTempArr[i].number * parseInt(value)) / 100), Math.round($scope.completesNeeded - (min - $scope.ageTempArr[i].minimum)));
                }
                /*------if minimum value = 0 then makes it 1--------*/
                $scope.ageTempArr[i].minimum = $scope.ageTempArr[i].number > 0 && $scope.ageTempArr[i].minimum == 0 ? 1:$scope.ageTempArr[i].minimum;
                /*------if minimum value = 0 then makes it 1--------*/
                
                $scope.ageTempArr[i].flexible = $scope.ageQuotaFlag.ageFlx;
            } else {
                $scope.ageTempArr[i].minimum = '';
                $scope.ageTempArr[i].maximum = '';
            }
        }
    };


    $scope.addIncomeNewRow = function(index) {
        if(isNaN(parseInt($scope.incomeTempArr[index].min)) || isNaN(parseInt($scope.incomeTempArr[index ].max))) {
            notify({
                message: "Please insert proper values",
                classes: 'alert-danger',
                duration: 2000
            });
            return false;
        }
        else {
            $scope.incomeTempArr[index].min = parseInt($scope.incomeTempArr[index].min);
            $scope.incomeTempArr[index].max = parseInt($scope.incomeTempArr[index].max);
        }

        if($scope.incomeTempArr[index ].min < $scope.houseHoldIncome.min) {
            notify({
                message: "income cann\'t less than min household income",
                classes: 'alert-danger',
                duration: 2000
            });
            return false;
        }

        if($scope.incomeTempArr[index ].max > $scope.houseHoldIncome.max) {
            notify({
                message: "income cann\'t exceed than max household income",
                classes: 'alert-danger',
                duration: 2000
            });
            return false;
        }

        if($scope.incomeTempArr[index].number != '' && $scope.incomeTempArr[index].number != null && $scope.incomeTempArr[index].number != 0){
            $scope.incomeTempArr.unshift({
                "min": '',
                "max": '',
                "number": '',
                "per": '',
                "flexPer": '0',
                "flexible": $scope.incFlx
            });

        var num = 0;
        for (var i in $scope.incomeTempArr) {
            //$scope.incomeTempArr[i].number = parseInt($scope.completesNeeded/$scope.incomeTempArr.length);
            //$scope.incomeTempArr[i].per = parseInt(( $scope.incomeTempArr[i].number * 100) / $scope.completesNeeded);
            num = parseInt($scope.completesNeeded / $scope.incomeTempArr.length);
            num = parseInt(num + $scope.incomeTempArr[i].number);
            $scope.incomeTempArr[i].totalRem = $scope.completesNeeded - num;

            if (parseInt(i) !== index) {
                $scope.incomeTempArr[index].min = parseInt($scope.incomeTempArr[index].max) + parseInt(1);
                $scope.incomeTempArr[index].max = parseInt($scope.incomeTempArr[index].min + 1);
            }
        }
        var totalNumber = 0;
        for (var j in $scope.incomeTempArr) {
            if ($scope.incomeTempArr[j].number != undefined && $scope.incomeTempArr[j].number != null) {
                totalNumber = parseInt(totalNumber + $scope.incomeTempArr[j].number);
            }
        }
        $scope.incomeTotalRemRace = $scope.completesNeeded - totalNumber;
        } else {
            notify({
                message: "Row can not be empty",
                classes: 'alert-danger',
                duration: 2000
            })
        }
    };

    $scope.removeIncomeNewRow = function(index) {
        $scope.incomeTotalRemRace += parseInt($scope.incomeTempArr[index].number);
        $scope.incomeTempArr.splice(index, 1);
        var num = 0;
        for (var i in $scope.incomeTempArr) {
            //$scope.incomeTempArr[i].number = parseInt($scope.completesNeeded/$scope.incomeTempArr.length);
            //$scope.incomeTempArr[i].per = parseInt(( $scope.incomeTempArr[i].number * 100) / $scope.completesNeeded);
            num = parseInt($scope.completesNeeded / $scope.incomeTempArr.length);
            num = parseInt(num + $scope.incomeTempArr[i].number);
            //$scope.incomeTempArr[i].totalRem = $scope.completesNeeded - num;
        }
        //$scope.incomeTotalRemRace = $scope.completesNeeded - totalNumber;
    };


    function minMaxForAgeIncome(max, index, arr) {
        var min = 0;
        var num = 0;
        for (var i in arr) {
            if (i != index) {
                if (arr[i].minimum) {
                    min = min + arr[i].minimum;

                }

            }
            num = parseInt(num + arr[i].number);

            if (max + min > $scope.completesNeeded) {
                return $scope.completesNeeded - min;
            }

            if (i == index) {
                var sum = parseInt(max + min);

                if (sum > num) {
                    var dif = sum - num;
                    arr[i].maximum = arr[i].maximum - dif;
                    return parseInt(arr[i].maximum);
                } else {
                    return parseInt(arr[i].maximum);
                }

            }
        }

    }

    $scope.openIncomeModal = function() {
        $scope.incomeTotalRemRace = $scope.completesNeeded;
        var condition1 = $scope.houseHoldIncome.min !== '' && $scope.houseHoldIncome.min !== undefined && $scope.houseHoldIncome.min !== null;

        if (condition1 && $scope.houseHoldIncome.max && $scope.completesNeeded && $scope.incomeTempArr.length >= 0) {
            if ($scope.incomeTempArr.length == 0) {
                $scope.incmFlag = false;
                $scope.incomeTempArr[0] = {
                    "flexPer": 0
                };
            }
            else {
                $scope.incmFlag = true;
                for (var i in $scope.incomeTempArr) {
                    $scope.incomeTempArr[i].flexPer = $scope.incomeTempArr[i].flexiblePer;
                    //$scope.incomeTempArr[i].flexiblePer = $scope.incomeTempArr[i].flexiblePer;
                    $scope.incomeTempArr[i].per = parseInt($scope.incomeTempArr[i].number * 100 / $scope.completesNeeded);
                    $scope.incomeTempArr[i].flexible = $scope.incFlx;
                    if($scope.incomeTempArr[i].number)
                        $scope.incomeTotalRemRace = $scope.incomeTotalRemRace - $scope.incomeTempArr[i].number;
                }
            }
        }
    };

    $scope.deleteAgeQuotas = function() {
        if ($scope.ageTempArr.length > 0) {
            notify({
                message: "Are you sure you want to delete all fill in number of quotas?",
                classes: 'alert-danger',
                duration: 2000
            });
        }
    };

    $scope.deleteIncomeQuotas = function() {
        if ($scope.incomeTempArr.length > 0) {
            notify({
                message: "Are you sure you want to delete all fill in number of quotas?",
                classes: 'alert-danger',
                duration: 2000
            });
        }
    };

    $scope.incomeNumberChange = function(value, index, Flexibility) {
        var num = 0;
        var min = 0;
        var totalNumber = 0;
        if(!Flexibility){
            Flexibility = "0";
        }
        angular.forEach($scope.incomeTempArr, function(income){
            if (value) {
                if (income.minimum != null && income.minimum != undefined) {
                    min = min + (income.number - (income.number * parseInt(Flexibility)) / 100);
                }
                if (income.number != undefined && income.number != null) {
                    totalNumber += parseInt(income.number);
                }
            }
        });
        angular.forEach($scope.incomeTempArr, function(income){
            if(income.hasOwnProperty('number') && income.number != 0 &&
                income.number != undefined && income.number != null) {
                income.per = Math.round((income.number * 100) / $scope.completesNeeded);
                if (angular.element("#inc").is(":checked") == true) {
                    // if number is equal to completes then min=max=completes
                    if(income.number == parseInt($scope.completesNeeded)){
                        income.minimum = parseInt($scope.completesNeeded);
                        income.maximum = parseInt($scope.completesNeeded);
                    }else{
                        income.minimum = Math.round(income.number - (income.number * parseInt(Flexibility)) / 100);
                        income.maximum = Math.min(parseInt(income.number + (income.number * parseInt(Flexibility)) / 100), Math.round($scope.completesNeeded - (min - income.minimum)));
                    }
                    /*------if minimum value = 0 then makes it 1--------*/
                    income.minimum = income.number > 0 && income.minimum == 0 ? 1:income.minimum;
                    /*------if minimum value = 0 then makes it 1--------*/
                } else {
                    income.minimum = income.number;
                    income.maximum = income.number;
                }
                num = isNaN(parseInt(num + income.number))?0:parseInt(num + income.number);
                // Check weather completes are less than achieved values
                if(income.number < income.achieved){
                    notify({
                        message: 'Please change allocation greater than their fielded',
                        classes: 'alert-warning',
                        duration: 2000
                    });
                    $scope.incomeAllocationsLessThanFielded = true;
                }else{
                    $scope.incomeAllocationsLessThanFielded = false;
                }
            }
            else {
                income.per = '';
                income.minimum = '';
                income.maximum = '';
            }
        });
        if(index != 0){
            $scope.incomeTotalRemRace = $scope.completesNeeded - num;
        }
        //If user enters allocations or percentage > completes
        if($scope.incomeTotalRemRace < 0){
            notify({
                message: "The total number of completes allocated in the quotas doesn't equal the total number of completes remaining",
                classes: 'alert-warning',
                duration: 2000
            });
        }
    };
    /*It is used for change quantity and min,max of income quota when enter percentage  */
    $scope.incomePerChange = function(value, index,Flexibility){
        var num = 0;
        var min = 0;
        var totalNumber = 0;
        if(!Flexibility){
            Flexibility = "0";
        }
        for (var j in $scope.incomeTempArr) {
            if (value) {
                $scope.incomeTempArr[j].number = Math.round(($scope.incomeTempArr[j].per * $scope.completesNeeded) / 100);
                if ($scope.incomeTempArr[j].minimum != null && $scope.incomeTempArr[j].minimum != undefined) {
                    min = min + ($scope.incomeTempArr[j].number - ($scope.incomeTempArr[j].number * parseInt(Flexibility)) / 100);
                }
                if($scope.incomeTempArr[j].number != undefined && $scope.incomeTempArr[j].number != null) {
                    totalNumber = parseInt(totalNumber + $scope.incomeTempArr[j].number);
                }
            }
        }
        for (var i in $scope.incomeTempArr) {
            if($scope.incomeTempArr[i].hasOwnProperty('per') && $scope.incomeTempArr[i].per != 0 &&
                $scope.incomeTempArr[i].per != undefined && $scope.incomeTempArr[i].number != null) {
                $scope.incomeTempArr[i].number = Math.round(($scope.incomeTempArr[i].per * $scope.completesNeeded) / 100);
                $scope.incomeTempArr[i].per = parseInt($scope.incomeTempArr[i].per);
               
                if (angular.element("#inc").is(":checked") == true) {
                    // if number is equal to completes then min=max=completes
                    if($scope.incomeTempArr[i].number == parseInt($scope.completesNeeded)){
                        $scope.incomeTempArr[i].minimum = parseInt($scope.completesNeeded);
                        $scope.incomeTempArr[i].maximum = parseInt($scope.completesNeeded);
                    }else{
                        $scope.incomeTempArr[i].minimum = Math.round($scope.incomeTempArr[i].number - ($scope.incomeTempArr[i].number * parseInt(Flexibility)) / 100);
                        $scope.incomeTempArr[i].maximum = Math.min(parseInt($scope.incomeTempArr[i].number + ($scope.incomeTempArr[i].number * parseInt(Flexibility)) / 100), Math.round($scope.completesNeeded - (min - $scope.incomeTempArr[i].minimum)));
                    }
                    /*------if minimum value = 0 then makes it 1--------*/
                    $scope.incomeTempArr[i].minimum = $scope.incomeTempArr[i].number > 0 && $scope.incomeTempArr[i].minimum == 0 ? 1:$scope.incomeTempArr[i].minimum;
                    /*------if minimum value = 0 then makes it 1--------*/
                } else {
                    $scope.incomeTempArr[i].minimum = $scope.incomeTempArr[i].number;
                    $scope.incomeTempArr[i].maximum = $scope.incomeTempArr[i].number;
                }
                num = isNaN(parseInt(num + $scope.incomeTempArr[i].number))?0:parseInt(num + $scope.incomeTempArr[i].number);
                // Check weather completes are less than achieved values
                if($scope.incomeTempArr[i].number < $scope.incomeTempArr[i].achieved){
                    notify({
                        message: 'Please change allocation greater than their fielded',
                        classes: 'alert-warning',
                        duration: 2000
                    });
                    $scope.incomeAllocationsLessThanFielded = true;
                }else{
                    $scope.incomeAllocationsLessThanFielded = false;
                }
            }
            else {
                $scope.incomeTempArr[i].number = '';
                $scope.incomeTempArr[i].minimum = '';
                $scope.incomeTempArr[i].maximum = '';
            }
        }
        if(index != 0){
            $scope.incomeTotalRemRace = $scope.completesNeeded - num;
        }
        //If user enters allocations or percentage > completes
        if($scope.incomeTotalRemRace < 0){
            notify({
                message: "The total number of completes allocated in the quotas doesn't equal the total number of completes remaining",
                classes: 'alert-warning',
                duration: 2000
            });
        }
    }
    $scope.incomePercentageChange = function(dataArr, value) {
        var min = 0;
        var max = 0;
        if(!value){
            value = "0";
        }
        for (var j in dataArr){
            if (value) {
                if ($scope.incomeTempArr[j].minimum != null && $scope.incomeTempArr[j].minimum != undefined) {
                    min = min + ($scope.incomeTempArr[j].number - ($scope.incomeTempArr[j].number * parseInt(value)) / 100);
                }
            }
        }
        for (var i in dataArr) {
            if(value != '' || value != undefined || value != null && !isNaN(value)){
                if($scope.incomeTempArr[i].number == parseInt($scope.completesNeeded)){
                    $scope.incomeTempArr[i].minimum = parseInt($scope.completesNeeded);
                    $scope.incomeTempArr[i].maximum = parseInt($scope.completesNeeded);
                }else{
                    $scope.incomeTempArr[i].minimum = parseInt($scope.incomeTempArr[i].number - ($scope.incomeTempArr[i].number * parseInt(value)) / 100);
                    $scope.incomeTempArr[i].maximum = Math.min(parseInt($scope.incomeTempArr[i].number + ($scope.incomeTempArr[i].number * parseInt(value)) / 100), Math.round($scope.completesNeeded - (min - $scope.incomeTempArr[i].minimum)));
                }
                /*------if minimum value = 0 then makes it 1--------*/
                $scope.incomeTempArr[i].minimum = $scope.incomeTempArr[i].number > 0 && $scope.incomeTempArr[i].minimum == 0 ? 1:$scope.incomeTempArr[i].minimum;
                /*------if minimum value = 0 then makes it 1--------*/
                
                $scope.incomeTempArr[i].flexible = $scope.incFlx;
            } else {
                $scope.incomeTempArr[i].minimum = '';
                $scope.incomeTempArr[i].maximum = '';
            }
            //min = parseInt(min + $scope.incomeTempArr[i].minimum);
            //max = parseInt(max + $scope.incomeTempArr[i].maximum);
            //$scope.incomeTempArr[i].maximum = minMaxForAgeIncome( $scope.incomeTempArr[i].maximum, i,  $scope.incomeTempArr);

        }
       // $scope.incomeFlxValue.vlue = value;
    };

    $scope.setRaceFlex = function(element, race, raceFlxValue) {
        if(angular.element("#raceSw").is(":checked") != true) {
            $scope.raceQuotaFlag.raceFlx = false;
            for (var i in $scope.race) {
                $scope.race[i].maximum = $scope.race[i].number;
                $scope.race[i].minimum = $scope.race[i].number;
                //$scope.raceQuotaFlag.raceFlxValue = '';
            }
        } else {
            $scope.raceQuotaFlag.raceFlx = true;
            $scope.quotaPercentageChange(race, raceFlxValue);
        }
    };

    $scope.setRbFlex = function(element, raceBera, rbFlxValue) {
        if(angular.element("#rbSw").is(":checked") != true) {
            $scope.rbFlx = false;
            for (var i in $scope.raceBera) {
                $scope.raceBera[i].maximum = $scope.raceBera[i].number;
                $scope.raceBera[i].minimum = $scope.raceBera[i].number;
                //$scope.raceQuotaFlag.raceFlxValue = '';
            }
        } else {
            $scope.rbFlx = true;
            $scope.quotaPercentageChange(raceBera, rbFlxValue);
        }
    };

    $scope.setHispanicFlex = function(element, hispanic, hispanicFlxValue) {
        if(angular.element("#hispanicSw").is(":checked") != true) {
            $scope.hisQuotaFlag.hispanicFlx = false;
            for(var i in $scope.hispanic) {
                $scope.hispanic[i].maximum = $scope.hispanic[i].number;
                $scope.hispanic[i].minimum = $scope.hispanic[i].number;
                //$scope.raceQuotaFlag.raceFlxValue = '';
            }
        } else {
            $scope.hisQuotaFlag.hispanicFlx = true;
            $scope.quotaPercentageChange(hispanic, hispanicFlxValue);
        }
    };

    $scope.setGenderFlex = function(element, genderInfo, gndrFlxValue) {
        if (angular.element("#gndr").is(":checked") != true) {
            $scope.gndrQuotaFlag.gndrFlx = false;
            for (var i in $scope.genderInfo) {
                $scope.genderInfo[i].maximum = $scope.genderInfo[i].number;
                $scope.genderInfo[i].minimum = $scope.genderInfo[i].number;
                //$scope.gndrFlxValue = 20;
            }
        } else {
            $scope.gndrQuotaFlag.gndrFlx = true;
            $scope.quotaPercentageChange(genderInfo, gndrFlxValue);
        }
    };

    $scope.setStateFlex = function(element, selectedStates, flxValue) {
        if (angular.element("#stateSw").is(":checked") != true) {
            $scope.stateFlexibility.isFlexible = false;
            for (var i in $scope.selectedStates) {
                $scope.selectedStates[i].maximum = $scope.selectedStates[i].number;
                $scope.selectedStates[i].minimum = $scope.selectedStates[i].number;
                //$scope.gndrFlxValue = 20;
            }
        } else {
            $scope.stateFlexibility.isFlexible = true;
            $scope.quotaPercentageChange(selectedStates, flxValue);
        }
    };
    $scope.setDmaFlex = function(element, selectedDMAs, flxValue) {
        if (angular.element("#dmaSw").is(":checked") != true) {
            $scope.dmaFlexibility.isFlexible = false;
            for (var i in $scope.selectedDMAs) {
                $scope.selectedDMAs[i].maximum = $scope.selectedDMAs[i].number;
                $scope.selectedDMAs[i].minimum = $scope.selectedDMAs[i].number;
                //$scope.gndrFlxValue = 20;
            }
        } else {
            $scope.dmaFlexibility.isFlexible = true;
            $scope.quotaPercentageChange(selectedDMAs, flxValue);
        }
    };
    $scope.setCsaFlex = function(element, selectedCSAs, flxValue) {
        if (angular.element("#csaSw").is(":checked") != true) {
            $scope.csaFlexibility.isFlexible = false;
            for (var i in $scope.selectedCSAs) {
                $scope.selectedCSAs[i].maximum = $scope.selectedCSAs[i].number;
                $scope.selectedCSAs[i].minimum = $scope.selectedCSAs[i].number;
                //$scope.gndrFlxValue = 20;
            }
        } else {
            $scope.csaFlexibility.isFlexible = true;
            $scope.quotaPercentageChange(selectedCSAs, flxValue);
        }
    };
    $scope.setMsaFlex = function(element, selectedMSAs, flxValue) {
        if (angular.element("#msaSw").is(":checked") != true) {
            $scope.msaFlexibility.isFlexible = false;
            for (var i in $scope.selectedMSAs) {
                $scope.selectedMSAs[i].maximum = $scope.selectedMSAs[i].number;
                $scope.selectedMSAs[i].minimum = $scope.selectedMSAs[i].number;
                //$scope.gndrFlxValue = 20;
            }
        } else {
            $scope.msaFlexibility.isFlexible = true;
            $scope.quotaPercentageChange(selectedMSAs, flxValue);
        }
    };
    $scope.setCountyFlex = function(element, selectedCountys, flxValue) {
        if (angular.element("#countySw").is(":checked") != true) {
            $scope.countyFlexibility.isFlexible = false;
            for (var i in $scope.selectedCountys) {
                $scope.selectedCountys[i].maximum = $scope.selectedCountys[i].number;
                $scope.selectedCountys[i].minimum = $scope.selectedCountys[i].number;
                //$scope.gndrFlxValue = 20;
            }
        } else {
            $scope.countyFlexibility.isFlexible = true;
            $scope.quotaPercentageChange(selectedCountys, flxValue);
        }
    };

    $scope.setAgeFlex = function(element, ageTempArr, ageFlxValue) {
        if (angular.element("#age").is(":checked") != true) {
            $scope.ageQuotaFlag.ageFlx = false;
            for (var i in $scope.ageTempArr) {
                $scope.ageTempArr[i].minimum = $scope.ageTempArr[i].number;
                $scope.ageTempArr[i].maximum = $scope.ageTempArr[i].number;
                $scope.ageTempArr[i].flexible = $scope.ageQuotaFlag.ageFlx;
            }
        } else {
            $scope.ageQuotaFlag.ageFlx = true;
            $scope.agePercentageChange(ageTempArr, ageFlxValue);
        }
    };

    $scope.setDivisionFlex = function(element, division, divisionFlxValue) {
        if (angular.element("#divisionSw").is(":checked") != true) {
            $scope.dvsnQuotaFlag.divisionFlx = false;
            for (var i in $scope.division) {
                $scope.division[i].maximum = $scope.division[i].number;
                $scope.division[i].minimum = $scope.division[i].number;
            }
        } else {
            $scope.dvsnQuotaFlag.divisionFlx = true;
            $scope.quotaPercentageChange(division, divisionFlxValue);
        }
    };

    $scope.setRegionFlex = function(element, region, regionFlxValue) {
        if (angular.element("#regionSw").is(":checked") != true) {
            $scope.regQuotaFlag.regionFlx = false;
            for (var i in $scope.region) {
                $scope.region[i].maximum = $scope.region[i].number;
                $scope.region[i].minimum = $scope.region[i].number;
            }
        } else {
            $scope.regQuotaFlag.regionFlx = true;
            $scope.quotaPercentageChange(region, regionFlxValue);
        }
    };

    $scope.setIncomeFlex = function(element, incomeTempArr, incomeFlxValue) {
        if (angular.element("#inc").is(":checked") != true) {
            $scope.incFlx = false;
            for (var i in $scope.incomeTempArr) {
                $scope.incomeTempArr[i].minimum = $scope.incomeTempArr[i].number;
                $scope.incomeTempArr[i].maximum = $scope.incomeTempArr[i].number;
                $scope.incomeTempArr[i].flexible = $scope.incFlx;
            }
        }else{
            $scope.incFlx = true;
            $scope.incomePercentageChange(incomeTempArr, incomeFlxValue);
        }
    };

    $scope.setRelationFlex = function(element, relation, rlnFlxValue) {
        if (angular.element("#rlnSw").is(":checked") != true) {
            $scope.rlnQuotaFlag.rlnFlx = false;
            for (var i in $scope.relation) {
                $scope.relation[i].maximum = $scope.relation[i].number;
                $scope.relation[i].minimum = $scope.relation[i].number;
            }
        } else {
            $scope.rlnQuotaFlag.rlnFlx = true;
            $scope.quotaPercentageChange(relation, rlnFlxValue);
        }
    };

    $scope.setChldFlex = function(element, chldTempArr, chldFlxValue) {
        if (angular.element("#chldSw").is(":checked") != true) {
            $scope.childQuotaFlag.chldFlx = false;
            for (var i in $scope.chldTempArr) {
                $scope.chldTempArr[i].maximum = $scope.chldTempArr[i].number;
                $scope.chldTempArr[i].minimum = $scope.chldTempArr[i].number;
            }
        } else {
            $scope.childQuotaFlag.chldFlx = true;
            $scope.chldPercentageChange(chldTempArr, chldFlxValue);
        }
    };

    $scope.setEmployementFlex = function(element, employement, empFlxValue) {
        if (angular.element("#empSw").is(":checked") != true) {
            $scope.empQuotaFlag.empFlx = false;
            for (var i in $scope.employement) {
                $scope.employement[i].maximum = $scope.employement[i].number;
                $scope.employement[i].minimum = $scope.employement[i].number;
            }
        } else {
            $scope.empQuotaFlag.empFlx = true;
            $scope.quotaPercentageChange(employement, empFlxValue);
        }
    };

    $scope.setEducationFlex = function(element, education, eduFlxValue) {
        if (angular.element("#eduSw").is(":checked") != true) {
            $scope.eduQuotaFlag.eduFlx = false;
            for (var i in $scope.education) {
                $scope.education[i].maximum = $scope.education[i].number;
                $scope.education[i].minimum = $scope.education[i].number;
            }
        } else {
            $scope.eduQuotaFlag.eduFlx = true;
            $scope.quotaPercentageChange(education, eduFlxValue);
        }
    };
    $scope.setDeviceFlex = function(element, deviceInfo, dvcFlxValue) {
        if (angular.element("#devcSw").is(":checked") != true) {
            $scope.dvcQuotaFlag.dvcFlx = false;
            for (var i in $scope.deviceInfo) {
                $scope.deviceInfo[i].maximum = $scope.deviceInfo[i].number;
                $scope.deviceInfo[i].minimum = $scope.deviceInfo[i].number;
            }
        } else {
            $scope.dvcQuotaFlag.dvcFlx = true;
            $scope.quotaPercentageChange(deviceInfo, dvcFlxValue);
        }
    };

    $scope.setAdvFlex = function(element, deviceInfo, dvcFlxValue){
       if (angular.element("#devcSw").is(":checked") != true) {
            $scope.dvcQuotaFlag.dvcFlx = false;
            for (var i in $scope.deviceInfo) {
                $scope.deviceInfo[i].maximum = $scope.deviceInfo[i].number;
                $scope.deviceInfo[i].minimum = $scope.deviceInfo[i].number;
            }
        } else {
            $scope.dvcQuotaFlag.dvcFlx = true;
            $scope.quotaPercentageChange(deviceInfo, dvcFlxValue);
        }  
    }

    $scope.checkAgeMinQuotaModel = function(value, index) {
        for (var i in $scope.ageTempArr) {
            if (parseInt(i) !== index && $scope.ageTempArr[i].max >= value) {
                notify({
                    message: "Please insert value greater than max",
                    classes: 'alert-danger',
                    duration: 2000
                });
            }

            if (parseInt(i) == index && $scope.ageTempArr[i].max < $scope.ageTempArr[i].min) {
                notify({
                    message: "Please insert value greater than min",
                    classes: 'alert-danger',
                    duration: 2000
                });
                $scope.ageTempArr[i].max = '';
            }
        }
    };


    $scope.checkAgeMaxQuotaModel = function(value, index) {
        if(value){
            _.each($scope.ageTempArr, function(age, number){
                if(number == index && age.max < age.min) {
                    notify({
                        message: "Please insert value greater than min",
                        classes: 'alert-danger',
                        duration: 2000
                    });
                    age.max = '';
                }
                if(number != index && age.min >= value) {
                    notify({
                        message: "Please insert value greater than max",
                        classes: 'alert-danger',
                        duration: 2000
                    });
                }
            });
        }
    };

    $scope.checkIncomeMinQuotaModel = function(value, index) {
        for (var i in $scope.incomeTempArr) {
            if (parseInt(i) !== index && $scope.incomeTempArr[i].max >= value) {
                notify({
                    message: "Please insert value greater than max",
                    classes: 'alert-danger',
                    duration: 2000
                });

                $scope.incomeTempArr[index].min = '';

            }

            if (parseInt(i) == index && $scope.incomeTempArr[i].max < $scope.incomeTempArr[i].min) {
                notify({
                    message: "Please insert value greater than min",
                    classes: 'alert-danger',
                    duration: 2000
                })
                $scope.incomeTempArr[i].max = '';
            }

        }

    };


    $scope.checkIncomeMaxQuotaModel = function(value, index) {
        for (var i in $scope.incomeTempArr) {
            if (parseInt(i) !== index && parseInt($scope.incomeTempArr[i].max) > value) {
                notify({
                    message: "Please insert value greater than last max",
                    classes: 'alert-danger',
                    duration: 2000
                });
                return false;
            }

            if (parseInt(i) == index && parseInt($scope.incomeTempArr[i].max) < parseInt($scope.incomeTempArr[i].min)) {
                notify({
                    message: "Please insert value greater than min",
                    classes: 'alert-danger',
                    duration: 2000
                });
                $scope.incomeTempArr[i].max = '';
            }
        }
    };

    function getSurveyDetailsForUpdate(key) {
        $scope.languageValue = '';
        if (key) {
            $scope.loader.show = true;
            createSurvey.getSurveyById(key).success(function(data) {
                if (data.survey) {
                    //PD-1003
                   saveAllThreePageData = data.survey;
                    $scope.checkDirty = true;
                    //Remove fielded on Live clone
                    if($scope.checkLive_pus_Clone) {
                        //Updating Completes Before Update to Autoupdate the nested quotas if completes are increased
                        $scope.totalFielded = 0;
                        if(data.survey[0].supplier){
                            _.each(data.survey[0].supplier, function(suplrFielded){
                                delete suplrFielded.fielded;
                            });
                        }
                        // Delete Achieved values in cloning V2
                        if(data.quotaV2Data.quotas && data.quotaV2Data.quotas.length > 0){
                            _.each(data.quotaV2Data.quotas, function(allQuota){
                                // For Cloning
                                if(allQuota.counter){
                                    allQuota.counter['Buyer_side_In_Progress'] = 0;
                                    allQuota.counter['Buyer_Survey_Starts'] = 0;
                                    allQuota.counter['Buyer_Valid_Clicks'] = 0;
                                }   
                                if(_.has(allQuota, "last_complete_date")) {
                                    allQuota.last_complete_date = "";
                                }
                                if(allQuota.quantities.achieved){
                                    //console.log('allQuota.quantities ',JSON.stringify(allQuota));
                                    allQuota.quantities.achieved = 0;
                                    allQuota.quantities.currently_open = allQuota.quantities.maximum;
                                    allQuota.quantities.remaining = allQuota.quantities.maximum;
                                    allQuota.quantities.current_target = allQuota.quantities.maximum;
                                    allQuota.quantities.sup_currently_open = allQuota.quantities.maximum;
                                    allQuota.quantities.buyer_in_progress = 0;
                                }
                                _.each(_.keys(allQuota.suppliers), function(singleKey){
                                    allQuota.suppliers[singleKey].complete_needed = allQuota.quantities.maximum;
                                    allQuota.suppliers[singleKey].current_target = allQuota.quantities.maximum;
                                    allQuota.suppliers[singleKey].currently_open = allQuota.quantities.maximum;
                                    allQuota.suppliers[singleKey].sup_currently_open = allQuota.quantities.maximum;
                                    allQuota.suppliers[singleKey].complete_fielded = 0;
                                    allQuota.suppliers[singleKey].total_starts = 0;
                                    allQuota.suppliers[singleKey].buyer_valid_clks = 0;
                                    allQuota.suppliers[singleKey].bip = 0;
                                    allQuota.suppliers[singleKey].last_start_date = "";
                                    allQuota.suppliers[singleKey].last_complete_date = "";
                                });
                            });
                        }
                    }
                    setLocationViews(data.survey[0].locale.countryCode);
                    //survey status
                    $scope.surveyStatus = data.survey[0].status;
                    // For checking Survey based on clicks
                    $scope.properties.clickBalance = data.survey[0].clickBalance;
                    $scope.properties.estmClicks = data.survey[0].estmClicks;
                    $scope.completesNeeded = data.survey[0].clickBalance == 0? data.survey[0].number:data.survey[0].estmClicks;
                    
                    //console.log("data.survey[0].currencyFx ",data.survey[0].currencyFx)
                    if(data.survey[0].currencyFx && data.survey[0].currencyFx.symbol) {
                        $scope.currency_symbol = data.survey[0].currencyFx.symbol;
                        $scope.currencyFx = data.survey[0].currencyFx;
                    }
                    // Variable used to check completes less than tofalFielded in Live Edit
                    if(!$scope.checkLive_pus_Clone) {
                        $scope.totalFielded = data.survey[0].fielded;
                    }
                    
                    var ageTempVar = new Array();
                    // To add zipcode data if nested
                    if(data.quotaV2Data && data.quotaV2Data.zipGrpDetail){
                        $scope.properties.zipGrpDetail = angular.copy(data.quotaV2Data.zipGrpDetail);
                        $scope.selectedZipcodes = angular.copy($scope.properties.zipGrpDetail);
                    }
                    
                    //Checking for Qualifications and pushing them in respective array
                    if(data.quotaV2Data && data.quotaV2Data.qualifications && data.quotaV2Data.qualifications.length > 0){
                        // function to put qualifications into particular array
                        var fillQual = function(sourceArr, destArr){
                            if(sourceArr.q_type == 'normal' && (sourceArr.q_name == 'regions' || sourceArr.q_name == 'divisions' || sourceArr.q_name == 'states' || sourceArr.q_name == 'dma' || sourceArr.q_name == 'csa' || sourceArr.q_name == 'msa' || sourceArr.q_name == 'county' || sourceArr.q_name == 'zipcodes')){
                                console.log('sourceArr ',JSON.stringify(sourceArr));
                                _.each(sourceArr.conditions, function(data){
                                    destArr.push({
                                        "id": parseInt(data.id),
                                        "qual_id":sourceArr.qualification_code,
                                        "name": data.name,
                                        "selected":true
                                    });
                                });
                            }else if(sourceArr.q_type == 'normal'){
                                _.each(destArr, function(item, index){
                                    if(_.findWhere(sourceArr.conditions, {"id":item.id.toString()})){
                                        destArr[index].selected = true;
                                    }else{
                                        destArr[index].selected = false;
                                    }
                                });
                                // Removing
                                destArr = _.filter(destArr, function(val){
                                    if(val.selected){
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });
                            }else if(sourceArr.q_type == 'range'){
                                _.each(sourceArr.range_sets, function(data){
                                    // Only push once when its empty otherwise it will create duplicate
                                    if(sourceArr.range_sets.length > destArr.length){
                                        destArr.push({
                                            "hasValidQuotas":false,
                                            "percentage":100,
                                            "flexiblePer":0,
                                            "maximum":"",
                                            "minimum":"",
                                            "number":"",
                                            "flexible":true,
                                            "max":data.to,
                                            "min":data.from,
                                            "achieved":0,
                                            "per":""
                                        });
                                    }
                                });
                            }
                            return destArr;
                        };
                        _.each(data.quotaV2Data.qualifications, function(qualifications){
                            if(qualifications.q_name == 'gender'){
                                $scope.sltGender = fillQual(qualifications, $scope.sltGender);
                                showAddQuotaData($scope.genderInfo, $scope.sltGender, 'gender');
                            }else if(qualifications.q_name == 'race'){
                                $scope.sltRace = fillQual(qualifications, $scope.sltRace);
                                showAddQuotaData($scope.race, $scope.sltRace, 'race');
                            }else if(qualifications.q_name == 'relationships'){
                                $scope.sltRelation = fillQual(qualifications, $scope.sltRelation);
                                showAddQuotaData($scope.relation, $scope.sltRelation, 'relation');
                            }else if(qualifications.q_name == 'children'){
                                $scope.sltChildren = fillQual(qualifications, $scope.sltChildren);
                                showAddQuotaData($scope.children, $scope.sltChildren, 'children');
                            }else if(qualifications.q_name == 'educations'){
                                $scope.sltEducation = fillQual(qualifications, $scope.sltEducation);
                                showAddQuotaData($scope.education, $scope.sltEducation, 'edu');
                            }else if(qualifications.q_name == 'employments'){
                                $scope.sltEmployment = fillQual(qualifications, $scope.sltEmployment);
                                showAddQuotaData($scope.employement, $scope.sltEmployment, 'emp');
                            }else if(qualifications.q_name == 'device'){
                                $scope.sltDevice = fillQual(qualifications, $scope.sltDevice);
                                showAddQuotaData($scope.deviceInfo, $scope.sltDevice, 'dvc');
                            }else if(qualifications.q_name == 'regions'){
                                $scope.sltRegion = fillQual(qualifications, $scope.sltRegion);
                                showAddQuotaData($scope.region, $scope.sltRegion, 'rgn');
                            }else if(qualifications.q_name == 'divisions'){
                                $scope.sltDivision = fillQual(qualifications, $scope.sltDivision);
                                showAddQuotaData($scope.division, $scope.sltDivision, 'dvsn');
                            }else if(qualifications.q_name == 'raceBera'){
                                $scope.sltRaceBera = fillQual(qualifications, $scope.sltRaceBera);
                                showAddQuotaData($scope.raceBera, $scope.sltRaceBera, 'rb');
                            }else if(qualifications.q_name == 'hispanicOrigin'){
                                $scope.hispanicOrigin = fillQual(qualifications, $scope.hispanicOrigin);
                                showAddQuotaData($scope.hispanic, $scope.hispanicOrigin, 'hispanic');
                            }else if(qualifications.q_name == 'states'){
                                $scope.selectedStates = [];
                                $scope.selectedStates = fillQual(qualifications, $scope.selectedStates);
                            }else if(qualifications.q_name == 'csa'){
                                $scope.selectedCSAs = [];
                                $scope.selectedCSAs = fillQual(qualifications, $scope.selectedCSAs);
                            }else if(qualifications.q_name == 'msa'){
                                $scope.selectedMSAs = [];
                                $scope.selectedMSAs = fillQual(qualifications, $scope.selectedMSAs);
                            }else if(qualifications.q_name == 'dma'){
                                $scope.selectedDMAs = [];
                                $scope.selectedDMAs = fillQual(qualifications, $scope.selectedDMAs);
                            }else if(qualifications.q_name == 'county'){
                                $scope.selectedCountys = [];
                                $scope.selectedCountys = fillQual(qualifications, $scope.selectedCountys);
                            }else if(qualifications.q_name == 'age'){
                                $scope.ageTempArr = [];
                                $scope.ageTempArr = fillQual(qualifications, $scope.ageTempArr);
                                ageTempVar = fillQual(qualifications, $scope.ageTempArr);
                            }else if(qualifications.q_name == 'houseHoldIncome'){
                                $scope.incomeTempArr = [];
                                $scope.incomeTempArr = fillQual(qualifications, $scope.incomeTempArr);
                            }else if(qualifications.q_name == 'zipcodes'){
                                // Do Nothing -- Only sending file url from frontend
                            }else{
                                advanceQual.push(qualifications);
                            }
                        });
                    }
                    // Checking if Advance Target exists then disable
                    if(data.quotaV2Data.advance_target && data.quotaV2Data.advance_target.length > 0){

                        var checkGroupedAdvncd = _.where(data.quotaV2Data.quotas, {"isActive": true});

                        _.each(data.quotaV2Data.advance_target, function(singleTarget){
                            if(singleTarget.question_type == 'range'){
                                $scope.tempAdvArray.push({
                                    "respondent_question_id": singleTarget.respondent_question_id,
                                    "stem1": singleTarget.stem1,
                                    "stem1_ui": singleTarget.stem1_ui,
                                    "stem2": singleTarget.stem2,
                                    "selected": singleTarget.selected,
                                    "qualification_id": singleTarget.qualification_id,
                                    "range" : {
                                        'condition': singleTarget.selected[singleTarget.qualification_id[0]].answer_data.condition,
                                        'from': singleTarget.selected[singleTarget.qualification_id[0]].answer_data.from,
                                        'to': singleTarget.selected[singleTarget.qualification_id[0]].answer_data.to,
                                        'orig_value': singleTarget.selected[singleTarget.qualification_id[0]].answer_data.orig_value
                                    },
                                    "question_type" :singleTarget.question_type,
                                    "answers" : singleTarget.answers,
                                    "buyer_text" : singleTarget.buyer_text,
                                    "question_description" : singleTarget.question_description,
                                    "rangeQuesOption": singleTarget.rangeQuesOption,
                                    "units": singleTarget.units
                                });
                                $scope.advanceDataPayload = _.uniq($scope.advanceDataPayload.concat($scope.tempAdvArray), "respondent_question_id");
                            }else{
                                if(checkGroupedAdvncd.length) {
                                    var checkedMessedQuota = _.filter(checkGroupedAdvncd, function(snglQuotaCheck) {
                                        return snglQuotaCheck.quotaCategory == "advance";
                                    });
                                    var groupedAdvncdData = [];
                                    _.filter(checkGroupedAdvncd, function(snglQuotaCheck) {
                                        _.each(snglQuotaCheck.criteria, function(criteriaArr) {
                                            if(criteriaArr.qualification_code == singleTarget.qualification_id && snglQuotaCheck.quotaCategory == "grouped") {
                                                groupedAdvncdData.push(snglQuotaCheck);
                                            }
                                        })
                                    });

                                    if(groupedAdvncdData.length) {
                                        var selectedQuestionArr = [];
                                        angular.copy(singleTarget, selectedQuestionArr);
                                        selectedQuestionArr.selected[selectedQuestionArr.qualification_id].answer_data = new Array();
                                       _.each(groupedAdvncdData, function(groupObj) {
                                           var name = "";
                                           var idArr = [];
                                           var name_arr = []; 
                                           var idenKey = "";
                                           _.each(groupObj.criteria, function(criteriaIter) {
                                                idenKey = criteriaIter.qualification_code;
                                               _.each(criteriaIter.conditions, function(condArr) {
                                                    name = name + condArr.name + " " +"or" + " ";
                                                    idArr.push(condArr.id);
                                                    name_arr.push(condArr.name);
                                                    idenKey = idenKey + '_' + condArr.id;
                                               })
                                    
                                               
                                               if(criteriaIter.qualification_code == selectedQuestionArr.qualification_id) {
                                                   
                                                   var quotaPayLoadObj = {
                                                        iden_key: idenKey,
                                                        id: idArr,
                                                        maximum: groupObj.quantities.number,
                                                        name_arr: name_arr,
                                                        minimum: groupObj.quantities.number,
                                                        name: name.substring(0, name.length - 3),
                                                        number: groupObj.quantities.number,
                                                        per: groupObj.quantities.percentage,
                                                        percentage: groupObj.quantities.percentage,
                                                        selected: true,
                                                        qualification_id: criteriaIter.qualification_code,
                                                        condditionGroup: true,
                                                        "haveAdvGroup": true,
                                                        qual_name: criteriaIter.qualification_name,
                                                        qual_id: criteriaIter.qualification_code
                                                   }
                                                  
                                                   var isExistObject = _.findWhere(selectedQuestionArr.selected[selectedQuestionArr.qualification_id].answer_data, quotaPayLoadObj);
                                                  
                                                   if(!isExistObject) {
                                                    selectedQuestionArr.selected[selectedQuestionArr.qualification_id].answer_data.push(quotaPayLoadObj);
                                                   }
                                               }
                                           })
                                       })

                                       _.each(checkedMessedQuota, function(otherQuotas) {
                                          _.each(otherQuotas.criteria, function(lyrdCritria) {
                                              _.each(lyrdCritria.conditions, function(condCheck){
                                                if(lyrdCritria.qualification_code == selectedQuestionArr.qualification_id) {
                                                    var quotaPayLoadObj = {
                                                        id: condCheck.id,
                                                        maximum: otherQuotas.quantities.number,
                                                        minimum: otherQuotas.quantities.number,
                                                        name: condCheck.name,
                                                        number: otherQuotas.quantities.number,
                                                        per: otherQuotas.quantities.percentage,
                                                        percentage: otherQuotas.quantities.percentage,
                                                        selected: true,
                                                        qual_name: lyrdCritria.qualification_name,
                                                        qual_id: lyrdCritria.qualification_code
                                                    }
                                                    var nextExistObject = _.findWhere(selectedQuestionArr.selected[selectedQuestionArr.qualification_id].answer_data, quotaPayLoadObj);
                                                    if(!nextExistObject) {
                                                        selectedQuestionArr.selected[selectedQuestionArr.qualification_id].answer_data.push(quotaPayLoadObj);
                                                    }
                                                }
                                              })
                                          })
                                       })
                                       _.uniq(selectedQuestionArr.selected[selectedQuestionArr.qualification_id].answer_data, "id"); 

                                        $scope.tempAdvArray.push({
                                            "respondent_question_id": singleTarget.respondent_question_id,
                                            "stem1": singleTarget.stem1,
                                            "stem1_ui": singleTarget.stem1_ui,
                                            "stem2": singleTarget.stem2,
                                            "selected": selectedQuestionArr.selected,
                                            "qualification_id": singleTarget.qualification_id,
                                            "allOptions": singleTarget.answers[singleTarget.qualification_id[0]].answer_data,
                                            "question_type" :singleTarget.question_type,
                                            "answers" : singleTarget.answers,
                                            "buyer_text" : singleTarget.buyer_text,
                                            "question_description" : singleTarget.question_description,
                                            "hasQuota": singleTarget.hasQuota
                                        });

                                        $scope.advanceGoupModel.push({
                                            "respondent_question_id": singleTarget.respondent_question_id,
                                            "stem1": singleTarget.stem1,
                                            "stem1_ui": singleTarget.stem1_ui,
                                            "stem2": singleTarget.stem2,
                                            "selected": singleTarget.selected,
                                            "qualification_id": singleTarget.qualification_id,
                                            "allOptions": singleTarget.answers[singleTarget.qualification_id[0]].answer_data,
                                            "question_type" :singleTarget.question_type,
                                            "answers" : singleTarget.answers,
                                            "buyer_text" : singleTarget.buyer_text,
                                            "question_description" : singleTarget.question_description,
                                            "hasQuota": singleTarget.hasQuota
                                        });

                                        _.each(groupedAdvncdData, function(item){
                                            _.each(item.criteria, function(snglCriteria) {
                                                item['iden_key'] = snglCriteria.qualification_code;
                                                _.each(snglCriteria.conditions, function(snglCond) {
                                                    item['iden_key'] = item['iden_key'] + '_' + snglCond.id;
                                                })
                                            })
                                            advQuota.push(item);
                                        });
                    
                                        $scope.advanceDataPayload = _.uniq($scope.advanceDataPayload.concat($scope.advanceGoupModel), "respondent_question_id");
                                    }
                                    else {
                                        $scope.tempAdvArray.push({
                                            "respondent_question_id": singleTarget.respondent_question_id,
                                            "stem1": singleTarget.stem1,
                                            "stem1_ui": singleTarget.stem1_ui,
                                            "stem2": singleTarget.stem2,
                                            "selected": singleTarget.selected,
                                            "qualification_id": singleTarget.qualification_id,
                                            "allOptions": singleTarget.answers[singleTarget.qualification_id[0]].answer_data,
                                            "question_type" :singleTarget.question_type,
                                            "answers" : singleTarget.answers,
                                            "buyer_text" : singleTarget.buyer_text,
                                            "question_description" : singleTarget.question_description,
                                            "hasQuota": singleTarget.hasQuota
                                        });
                                        $scope.advanceDataPayload = _.uniq($scope.advanceDataPayload.concat($scope.tempAdvArray), "respondent_question_id");
                                    }
                                }
                                else {
                                    $scope.tempAdvArray.push({
                                        "respondent_question_id": singleTarget.respondent_question_id,
                                        "stem1": singleTarget.stem1,
                                        "stem1_ui": singleTarget.stem1_ui,
                                        "stem2": singleTarget.stem2,
                                        "selected": singleTarget.selected,
                                        "qualification_id": singleTarget.qualification_id,
                                        "allOptions": singleTarget.answers[singleTarget.qualification_id[0]].answer_data,
                                        "question_type" :singleTarget.question_type,
                                        "answers" : singleTarget.answers,
                                        "buyer_text" : singleTarget.buyer_text,
                                        "question_description" : singleTarget.question_description,
                                        "hasQuota": singleTarget.hasQuota
                                    });
                                    $scope.advanceDataPayload = _.uniq($scope.advanceDataPayload.concat($scope.tempAdvArray), "respondent_question_id");
                                }
                            }
                            //console.log('$scope.tempAdvArray '+JSON.stringify($scope.tempAdvArray));
                        });
                        // Adding data to temp advance data array
                        advanceData = data.quotaV2Data.advance_target;
                        $scope.diableAdvanceTarget = true;
                    }
                    /*-----------Getting Quotas----------*/
                    if(data.quotaV2Data && data.quotaV2Data.quotas && data.quotaV2Data.quotas.length > 0){
                        /*----------Auto Nesting---------*/
                        var autoNestedQuotas = _.filter(data.quotaV2Data.quotas, function(autoNested){
                            return autoNested.quotaCategory == "autoNested" && autoNested.isActive
                        });
                        // Pushing the data in UI object to show on page
                        if(autoNestedQuotas.length > 0){
                            var zipcodeGroupNo = 0;
                            var zipRefKeyArr = new Array();
                            var tempQualArr = new Array();
                            _.each(autoNestedQuotas, function(nestedQuotas){
                                var combinedKeyArr = new Array();
                                // getting names using qualification keys and qualifications
                                //console.log('nestedQuotas '+JSON.stringify(nestedQuotas));
                                _.each(nestedQuotas.criteria, function(qual){
                                    // Child_gender 220 and and Child_age 230 will not enter in loop because these are children internal qualifications
                                    if(qual.qualification_code != parseInt(config.childMasterQual.gender) && qual.qualification_code != parseInt(config.childMasterQual.age)){
                                        /*-----Child Age and Gender details used in this function----*/
                                            var child_gender_arr = _.findWhere(nestedQuotas.criteria, {"qualification_code":parseInt(config.childMasterQual.gender)});
                                            var child_gender_name = new String();
                                            var child_gender_code = new String();
                                            if(child_gender_arr){
                                                child_gender_name = child_gender_arr.conditions.length > 1? 'Either': child_gender_arr.conditions[0].name;
                                                child_gender_code = (child_gender_arr.conditions.length > 1)? 'both': child_gender_arr.conditions[0].id;
                                            }
                                            var child_age_arr =_.findWhere(nestedQuotas.criteria, {"qualification_code":parseInt(config.childMasterQual.age)});

                                        /*-----Child Age and Gender details used in this function----*/
                                        if(qual.q_type == 'normal'){
                                            //console.log('\n\n qual '+JSON.stringify(qual));
                                            if(qual.qualification_code == config.childMasterQual.id){
                                                if(child_age_arr && child_gender_name){
                                                    $scope.childAgeUnit = {
                                                        'value': child_age_arr.range_sets[0].units,
                                                        'name' : ($scope.childAgeUnit.value == config.childMasterQual.ageUnitYr)? 'year':'month' 
                                                    }
                                                    combinedKeyArr.push(child_gender_name+'_'+child_age_arr.range_sets[0].from+'-'+child_age_arr.range_sets[0].to);
                                                }else{
                                                    combinedKeyArr.push(qual.conditions[0].name);
                                                }
                                            }else if(qual.qualification_code == config.zipcodesQual.id){
                                                //console.log('zipRefKeyArr '+JSON.stringify(zipRefKeyArr));
                                                //console.log('qual.buyer_ziplist_ref '+qual.buyer_ziplist_ref);
                                                if(zipRefKeyArr.indexOf(qual.buyer_ziplist_ref) == -1){
                                                    //console.log('in');
                                                    zipRefKeyArr.push(qual.buyer_ziplist_ref);
                                                    zipcodeGroupNo++;
                                                }
                                                var zipGrpNm = qual.buyer_ziplist_ref.lastIndexOf("_");
                                                    zipGrpNm = qual.buyer_ziplist_ref.substr(0, zipGrpNm);
                                                if(combinedKeyArr.indexOf(zipGrpNm) == -1){
                                                    combinedKeyArr.push(zipGrpNm);
                                                }
                                                _.each(qual.conditions, function(item){
                                                    if(_.findIndex(tempQualArr, {'name':item.name}) == -1){
                                                        tempQualArr.push(item);
                                                    }
                                                });
                                                if(_.isArray(qual.conditions) && qual.conditions.length == 0){
                                                    var missCon =  _.findWhere(tempQualArr, {'name':zipGrpNm});
                                                    console.log('Missed Condition in Zipcode ',JSON.stringify(missCon));
                                                    qual.conditions[0] = angular.copy(missCon);
                                                }else{
                                                    qual.conditions[0]['id'] = qual.buyer_ziplist_ref;
                                                }
                                            }else{
                                                // To show name on UI
                                                var name_arr = _.map(qual.conditions, function(single){ return single.name });
                                                names = name_arr.join('-');
                                                combinedKeyArr.push(names);

                                                // For pushing details on the condition groupinf array
                                                if(qual.conditions.length > 1){
                                                    var ids = _.map(qual.conditions, function(single){ return parseInt(single.id) });
                                                    var name_arr = _.map(qual.conditions, function(single){ return single.name });
                                                    var condditionGroup = false;
                                                }else{
                                                    var ids =  parseInt(qual.conditions[0].id);
                                                    var name_arr =  qual.conditions[0].name;
                                                    var condditionGroup = false;
                                                }
                                                // If key not exist add it in conditiongroupingArray
                                                if(_.has($scope.conditionGroupingArray, [qual.qualification_name]) == false){
                                                    $scope.conditionGroupingArray[qual.qualification_name] = new Array();
                                                }
                                                // Check if pre-exist
                                                if(typeof(ids) == 'object'){
                                                    var preExist = _.find($scope.conditionGroupingArray[qual.qualification_name], function(single){
                                                        if(typeof(single.id) == 'object' && single.id.length == ids.length && _.difference(single.id, ids).length == 0){
                                                            return true;
                                                        }else{
                                                            return false;
                                                        }
                                                    });
                                                    if(!preExist){
                                                        var origNames = name_arr.join(' or ');
                                                        $scope.conditionGroupingArray[qual.qualification_name].push({
                                                            "qual_id" : qual.qualification_code,
                                                            "qual_name" :  qual.qualification_name,
                                                            "per" : qual.layered_percent,
                                                            "percentage" : qual.layered_percent,
                                                            "selected" : true,
                                                            "id" : ids,
                                                            "name_arr" : name_arr,
                                                            "condditionGroup":condditionGroup,
                                                            "name": origNames
                                                        });
                                                    }
                                                }else{
                                                    var preExist = _.findIndex($scope.conditionGroupingArray[qual.qualification_name], {"id":ids});
                                                    if(preExist == -1){
                                                        $scope.conditionGroupingArray[qual.qualification_name].push({
                                                            "qual_id" : qual.qualification_code,
                                                            "qual_name" :  qual.qualification_name,
                                                            "per" : qual.layered_percent,
                                                            "percentage" : qual.layered_percent,
                                                            "selected" : true,
                                                            "id" : ids,
                                                            "name_arr" : name_arr,
                                                            "condditionGroup":condditionGroup,
                                                            "name": name_arr
                                                        });
                                                    }
                                                }
                                                
                                            }
                                            // Also pushing data in raw objects used before nesting to live edit
                                            // if obj is created in first loop then do not create next time
                                            if(!nestingQuotasDetailObj[qual.qualification_name]){
                                                nestingQuotasDetailObj[qual.qualification_name] = [];
                                                if(qual.qualification_code == config.childMasterQual.id){
                                                    if(qual.layered_percent && child_gender_name && child_age_arr){
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+child_age_arr.range_sets[0].from+'-'+child_age_arr.range_sets[0].to+'?range?'+qual.layered_percent+'?'+child_gender_name);
                                                    // For No Children
                                                    }else if(qual.layered_percent && child_gender_name == '' && !child_age_arr){
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+qual.conditions[0].id+'?'+qual.conditions[0].name+'?normal?'+qual.layered_percent);
                                                    }else{
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+child_age_arr.range_sets[0].from+'-'+child_age_arr.range_sets[0].to+'?range?'+nestedQuotas.quantities.percentage+'_'+child_gender_name);
                                                    }
                                                }else if(qual.qualification_code == config.zipcodesQual.id){
                                                    if(qual.layered_percent){
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+qual.conditions[0].name+'?'+qual.conditions[0].name+'?normal?'+qual.layered_percent+'?'+qual.buyer_ziplist_ref);
                                                    }else{
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+qual.conditions[0].name+'?'+qual.conditions[0].name+'?normal?'+nestedQuotas.quantities.percentage+'?'+qual.buyer_ziplist_ref);
                                                    }
                                                }else{
                                                    // For Grouping + Nesting
                                                    var ids = _.map(qual.conditions, function(eachCondition){ return eachCondition.id });
                                                    var names = _.map(qual.conditions, function(eachCondition){ return eachCondition.name });
                                                    ids = ids.join('-');
                                                    names = names.join('-');
                                                    if(qual.layered_percent){
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+ids+'?'+names+'?normal?'+qual.layered_percent);
                                                    }else{
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+ids+'?'+names+'?normal?'+nestedQuotas.quantities.percentage);
                                                    }
                                                }
                                            }
                                            //console.log('nestingQuotasDetailObj[qual.qualification_name]\n\n'+JSON.stringify(nestingQuotasDetailObj[qual.qualification_name]));
                                            if(_.find(nestingQuotasDetailObj[qual.qualification_name], function(item){ if((qual.conditions.length && item.indexOf(qual.conditions[0].name) != -1) || (qual.buyer_ziplist_ref && item.indexOf(qual.buyer_ziplist_ref) != -1)){return true}else{return false} }) == undefined){
                                                if(qual.qualification_name == "children"){
                                                    if(qual.layered_percent && child_gender_name && child_age_arr){
                                                        // To avoid duplicate data
                                                        if(_.indexOf(nestingQuotasDetailObj[qual.qualification_name], (qual.qualification_code+'?'+qual.qualification_name+'?'+child_age_arr.range_sets[0].from+'-'+child_age_arr.range_sets[0].to+'?range?'+qual.layered_percent+'?'+child_gender_name)) == -1){
                                                            //console.log('qual 1 other '+JSON.stringify(qual))
                                                            nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+child_age_arr.range_sets[0].from+'-'+child_age_arr.range_sets[0].to+'?range?'+qual.layered_percent+'?'+child_gender_name);
                                                        }
                                                    }else if(qual.layered_percent && child_gender_name == '' && !child_age_arr){
                                                        if(_.indexOf(nestingQuotasDetailObj[qual.qualification_name], (qual.qualification_code+'?'+qual.qualification_name+'?'+qual.conditions[0].id+'?'+qual.conditions[0].name+'?normal?'+qual.layered_percent)) == -1){
                                                            nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+qual.conditions[0].id+'?'+qual.conditions[0].name+'?normal?'+qual.layered_percent);
                                                        }
                                                    }else if(child_gender_name && child_age_arr){
                                                        // To avoid duplicate data
                                                        if(_.indexOf(nestingQuotasDetailObj[qual.qualification_name], (qual.qualification_code+'?'+qual.qualification_name+'_'+child_age_arr.range_sets[0].from+'-'+child_age_arr.range_sets[0].to+'?range?'+nestedQuotas.quantities.percentage+'?'+child_gender_name)) == -1){
                                                            //console.log('qual 2 other '+JSON.stringify(nestedQuotas))
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+child_age_arr.range_sets[0].from+'-'+child_age_arr.range_sets[0].to+'?range?'+nestedQuotas.quantities.percentage+'?'+child_gender_name);
                                                        }
                                                    }
                                                }else if(qual.qualification_code == config.zipcodesQual.id){
                                                    if(qual.layered_percent){
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+qual.conditions[0].name+'?'+qual.conditions[0].name+'?normal?'+qual.layered_percent+'?'+qual.buyer_ziplist_ref);
                                                    }else{
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+qual.conditions[0].name+'?'+qual.conditions[0].name+'?normal?'+nestedQuotas.quantities.percentage+'?'+qual.buyer_ziplist_ref);
                                                    }
                                                }else{
                                                    var ids = _.map(qual.conditions, function(eachCondition){ return eachCondition.id });
                                                    var names = _.map(qual.conditions, function(eachCondition){ return eachCondition.name });
                                                    ids = ids.join('-');
                                                    names = names.join('-');
                                                    if(qual.layered_percent){
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+ids+'?'+names+'?normal?'+qual.layered_percent);
                                                    }else{
                                                        nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'_'+qual.qualification_name+'_'+ids+'_'+names+'_normal_'+nestedQuotas.quantities.percentage);
                                                    }
                                                }
                                            }
                                        }else if(qual.q_type == 'range_sets'){
                                            combinedKeyArr.push(qual.range_sets[0].from+'-'+qual.range_sets[0].to);
                                            // Also pushing data in raw objects used before nesting to live edit
                                            if(!nestingQuotasDetailObj[qual.qualification_name]){
                                                nestingQuotasDetailObj[qual.qualification_name] = [];
                                                if(qual.layered_percent){
                                                    nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+qual.range_sets[0].from+'-'+qual.range_sets[0].to+'?range?'+qual.layered_percent);
                                                }else{
                                                    nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+qual.range_sets[0].from+'-'+qual.range_sets[0].to+'?range?'+nestedQuotas.quantities.percentage);
                                                }
                                            }
                                            if(_.find(nestingQuotasDetailObj[qual.qualification_name], function(item){ if(item.indexOf(qual.range_sets[0].from+'-'+qual.range_sets[0].to) != -1){return true}else{return false} }) == undefined){
                                                if(qual.layered_percent){
                                                    nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+qual.range_sets[0].from+'-'+qual.range_sets[0].to+'?range?'+qual.layered_percent);
                                                }else{
                                                    nestingQuotasDetailObj[qual.qualification_name].push(qual.qualification_code+'?'+qual.qualification_name+'?'+qual.range_sets[0].from+'-'+qual.range_sets[0].to+'?range?'+nestedQuotas.quantities.percentage);
                                                }
                                            }
                                            // For showing age and income in box
                                            if(qual.qualification_name == 'age'){
                                                $scope.ageData.min = (_.min($scope.ageTempArr, function(elm){ if(elm.min != "" && elm.min != undefined) {
                                                    return elm.min;
                                                } })).min;
                                                $scope.ageData.max = (_.max($scope.ageTempArr, function(elm){ return elm.max; })).max;
                                            }
                                            if(qual.qualification_name == 'houseHoldIncome'){
                                                $scope.houseHoldIncome.min = (_.min($scope.incomeTempArr, function(elm){ 
                                                    parseInt(elm.min);  // For making empty field integer
                                                    return elm.min;
                                                })).min || 0;
                                                $scope.houseHoldIncome.max = (_.max($scope.incomeTempArr, function(elm){ return elm.max; })).max;
                                            }
                                        }
                                        //console.log('nestingQuotasDetailObj '+JSON.stringify(nestingQuotasDetailObj));
                                        //push nested quotas category name in an array to show heading in nesting modal if it not exists
                                        //console.log('\n\n\ nestingQuotasDetailObj '+JSON.stringify(nestingQuotasDetailObj));
                                        if($scope.nestingQuotasArr.indexOf(qual.qualification_name) == -1){
                                            $scope.nestingQuotasArr.push(qual.qualification_name);
                                            //Array used for applied quota
                                            $scope.nestingQuotasArrFinal.push(qual.qualification_name);
                                        }

                                        // Adding layered percent in qualifications array so can be used for nesting at live edit
                                        var addlayeredPercent = function(arr, qual, maximum){
                                            if(qual.qualification_name == "age" || qual.qualification_name == "houseHoldIncome" || qual.qualification_name == "children"){
                                                //Mataching array with same min and max values
                                                if(qual.qualification_name == "children"){
                                                    // To excluse duplicate data
                                                        var num = Math.round((qual.layered_percent * $scope.completesNeeded)/100);
                                                        var flexibility = 0;
                                                        var minimum = Math.round(num - (num * parseInt(flexibility)) / 100);
                                                            var min = new Number();
                                                            _.each(arr, function(item){
                                                                if(item.minimum){
                                                                    min = min + item.minimum;
                                                                } 
                                                            });
                                                        var maximum = Math.min(parseInt(num + (num * parseInt(flexibility)) / 100), Math.round($scope.completesNeeded - (min - minimum)));
                                                        if(child_gender_code && child_age_arr && child_age_arr.range_sets[0].from && _.findIndex(arr.have, {"min":child_age_arr.range_sets[0].from} ) == -1){
                                                            arr.have.push({
                                                                "hasValidQuotas":false,
                                                                "percentage":qual.layered_percent,
                                                                "flexiblePer": flexibility,
                                                                "maximum":maximum,
                                                                "minimum":minimum,
                                                                "number":num,
                                                                "flexible":true,
                                                                "max":child_age_arr.range_sets[0].to,
                                                                "min":child_age_arr.range_sets[0].from,
                                                                "achieved":0,
                                                                "per":qual.layered_percent,
                                                                "id": qual.conditions[0].id,
                                                                "name": qual.conditions[0].name,
                                                                "qual_id":qual.qualification_code,
                                                                "gender":child_gender_code
                                                            });
                                                        }else if(qual.conditions && qual.conditions[0].id == 111 && maximum != '' && minimum != ''){
                                                            arr.no = [{
                                                                "hasValidQuotas" : false,
                                                                "percentage" : qual.layered_percent,
                                                                "flexiblePer": flexibility,
                                                                "maximum":maximum,
                                                                "minimum":minimum,
                                                                "number":num,
                                                                "flexible":true,
                                                                "max":'',
                                                                "min":'',
                                                                "achieved":0,
                                                                "per":qual.layered_percent,
                                                                "id": qual.conditions[0].id,
                                                                "name": qual.conditions[0].name,
                                                                "qual_id":qual.qualification_code,
                                                                "gender":''
                                                            }];
                                                        }else{
                                                            console.log('child_gender_code or child_age_arr are missing');
                                                        }
                                                }else{
                                                    var matchedArr = _.findWhere(arr, {"min":qual.range_sets[0].from});
                                                    //get index of matched Array
                                                    ind = _.indexOf(arr, matchedArr);
                                                    //updating per and maximum values at same index
                                                    if(ind != -1){
                                                        arr[ind].per = qual.layered_percent;
                                                        arr[ind].number = Math.round((arr[ind].per * $scope.completesNeeded)/100);
                                                        arr[ind].minimum = Math.round(arr[ind].number - (arr[ind].number * parseInt(arr[ind].flexiblePer)) / 100);
                                                        // to calculate total minimum to get maximum value
                                                            var min = new Number();
                                                            _.each(arr, function(item){
                                                                if(item.minimum){
                                                                    min = min + item.minimum;
                                                                } 
                                                            });
                                                        arr[ind].maximum = Math.min(parseInt(arr[ind].number + (arr[ind].number * parseInt(arr[ind].flexiblePer)) / 100), Math.round($scope.completesNeeded - (min - arr[ind].minimum)));
                                                    }
                                                }
                                            }else if(qual.qualification_name == "zipcodes"){
                                                _.each(arr, function(item){
                                                    if(item.name == qual.conditions[0].name){
                                                        console.log('matched in');
                                                        console.log('qual.layered_percent ',qual.layered_percent);
                                                        item.per = qual.layered_percent;
                                                        // Activate Nesting Method checks maximum value to auto nesting 
                                                        item.maximum = maximum;
                                                    }
                                                });
                                            }else{
                                                _.each(arr, function(data){
                                                    if(parseInt(data.id) == parseInt(qual.conditions[0].id)){
                                                        data.per = qual.layered_percent;
                                                        // Activate Nesting Method checks maximum value to auto nesting 
                                                        data.maximum = maximum;
                                                    }
                                                });
                                            }
                                            //console.log('data '+JSON.stringify(arr));
                                            return arr;
                                        }

                                        if(qual.qualification_name == 'gender'){
                                            $scope.genderInfo = addlayeredPercent($scope.genderInfo, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'age'){
                                            $scope.ageTempArr = addlayeredPercent($scope.ageTempArr, qual, nestedQuotas.quantities.maximum);
                                            if($scope.ageTempArr[0].number){
                                                $scope.ageTempArr.unshift({
                                                    "min": '',
                                                    "max": '',
                                                    "number": '',
                                                    "per": '',
                                                    "flexiblePer": '0',
                                                    "flexible": $scope.ageTempArr[0].flexible
                                                });
                                            }
                                        }else if(qual.qualification_name == 'houseHoldIncome'){
                                            $scope.incomeTempArr = addlayeredPercent($scope.incomeTempArr, qual, nestedQuotas.quantities.maximum);
                                            if($scope.incomeTempArr[0].number){
                                                $scope.incomeTempArr.unshift({
                                                    "min": '',
                                                    "max": '',
                                                    "number": '',
                                                    "per": '',
                                                    "flexiblePer": '0',
                                                    "flexible": $scope.incomeTempArr[0].flexible
                                                });
                                            }
                                        }else if(qual.qualification_name == 'children'){
                                            $scope.chldTempArr = addlayeredPercent($scope.chldTempArr, qual, nestedQuotas.quantities.maximum);
                                            if($scope.chldTempArr.have[0].number){
                                                $scope.chldTempArr.have.unshift({
                                                    "min": '',
                                                    "max": '',
                                                    "gender":'',
                                                    "number": '',
                                                    "per": '',
                                                    "flexiblePer": '0',
                                                    "flexible": $scope.chldTempArr.have[0].flexible
                                                });
                                            }
                                        }else if(qual.qualification_name == 'race'){
                                            $scope.race = addlayeredPercent($scope.race, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'educations'){
                                            $scope.education = addlayeredPercent($scope.education, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'employments'){
                                            $scope.employement = addlayeredPercent($scope.employement, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'relationships'){
                                            $scope.relation = addlayeredPercent($scope.relation, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'regions'){
                                            $scope.region = addlayeredPercent($scope.region, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'divisions'){
                                            $scope.division = addlayeredPercent($scope.division, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'states'){
                                            $scope.selectedStates = addlayeredPercent($scope.selectedStates, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'csa'){
                                            $scope.selectedCSAs = addlayeredPercent($scope.selectedCSAs, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'msa'){
                                            $scope.selectedMSAs = addlayeredPercent($scope.selectedMSAs, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'county'){
                                            $scope.selectedCountys = addlayeredPercent($scope.selectedCountys, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'dma'){
                                            $scope.selectedDMAs = addlayeredPercent($scope.selectedDMAs, qual, nestedQuotas.quantities.maximum);
                                        }else if(qual.qualification_name == 'zipcodes'){
                                            $scope.selectedZipcodes = addlayeredPercent($scope.selectedZipcodes, qual, nestedQuotas.quantities.maximum);
                                            console.log('$scope.selectedZipcodes >>> ',JSON.stringify($scope.selectedZipcodes));
                                        }
                                    }
                                });
                                $scope.nestedQuotasUiObj.push({
                                    //"nestingkey":elm.join('_'),
                                    "number":nestedQuotas.quantities.number, 
                                    "percentage" : nestedQuotas.quantities.percentage,
                                    "minimum" : nestedQuotas.quantities.minimum,
                                    "maximum" : nestedQuotas.quantities.maximum,
                                    "combinedKey": combinedKeyArr,
                                    "flexible": nestedQuotas.quantities.isFlexible,
                                    "flexiblePer": nestedQuotas.quantities.flexibility,
                                    "fielded": nestedQuotas.quantities.achieved
                                });
                            });
                            //console.log('$scope.nestedQuotasUiObj '+JSON.stringify($scope.nestedQuotasUiObj));
                            $scope.nestedQuota.has = true;
                        }else{
                            $scope.nestedQuota.has = false;
                        }
                        // Pushing data in Original Quota V2 Array In case of Live Survey Edit and Update
                        _.each(autoNestedQuotas, function(item){
                            nestedTempQuotaData.push(item);
                        });

                        // Advance Quotas
                        var advanceQuotas = _.filter(data.quotaV2Data.quotas, function(advance){
                            return advance.quotaCategory == "advance" && advance.isActive
                        });
                        _.each(advanceQuotas, function(item){
                            console.log('item ',JSON.stringify(item));
                            item['iden_key'] = item.criteria[0].qualification_code+'_'+item.criteria[0].conditions[0].id;
                            advQuota.push(item);
                        });
                        
                        /*------------Getting layered Quota---------*/
                        
                        // filter layered quota PD-961
                        var layeredQuotas = _.filter(data.quotaV2Data.quotas, function(layered){
                            return (layered.quotaCategory == "layered" || layered.quotaCategory == "grouped") && layered.isActive
                        });
                        
                        // grouping layered quota on category basis
                        var groupedData = _.groupBy(layeredQuotas, function(quota){
                            return quota.criteria[0].qualification_name
                        });
                        // Function puts the data into particular array after grouping to show on UI
                        var putDataInQuotaModal = function(sourceArr, destArr, layeredKey){
                            var condGroupingArr = [];
                            _.each(sourceArr, function(quota){
                                if(quota.criteria[0].qualification_code == config.childMasterQual.id){   // for children
                                    if(quota.criteria.length > 1){
                                        //destArr['have'] = new Array();
                                        var childQualId = new Number();
                                        var chldCritIndex = new Number();
                                        var gndrCritIndex = new Number();
                                        var ageCritIndex = new Number();
                                        // finding the index of gender, age and original child criteria
                                        childQualId = (_.findWhere(masterData, {"masterKey":layeredKey})).id;
                                        chldCritIndex = _.findIndex(quota.criteria, {"qualification_code": childQualId});
                                        gndrCritIndex = _.findIndex(quota.criteria, {"qualification_code":config.childMasterQual.gender});
                                        ageCritIndex = _.findIndex(quota.criteria, {"qualification_code":config.childMasterQual.age});
                                        var chldGender = new String();
                                        if(quota.criteria[gndrCritIndex].conditions.length == 2){
                                            chldGender = "both";
                                        }else{
                                            chldGender = quota.criteria[gndrCritIndex].conditions[0].id.toString();
                                        }
                                        //console.log('chldGender '+ageCritIndex);

                                        _.each(quota.criteria[ageCritIndex].range_sets, function(range){
                                            destArr.have.push({
                                                "id":quota.criteria[chldCritIndex].conditions[0].id,
                                                "gender":chldGender,
                                                "name":quota.criteria[chldCritIndex].conditions[0].name,
                                                "hasValidQuotas": quota.quantities.hasValidQuotas,
                                                "qual_id":quota.criteria[chldCritIndex].qualification_code,
                                                "percentage": quota.quantities.percentage,
                                                "per":quota.quantities.percentage,
                                                "maximum": quota.quantities.maximum,
                                                "minimum": quota.quantities.minimum,
                                                "number": quota.quantities.number,
                                                "flexiblePer": quota.quantities.flexibility,
                                                "flexible": quota.quantities.isFlexible,
                                                "min": range.from,
                                                "max": range.to,
                                                "achieved": quota.quantities.achieved
                                            });
                                        });
                                        if(quota.criteria[2].range_sets[0].units == config.childMasterQual.ageUnitYr.toString()){
                                            $scope.childAgeUnit.name = 'year';
                                            $scope.childAgeUnit.value = parseInt(quota.criteria[2].range_sets[0].units);
                                        }else{
                                            $scope.childAgeUnit.name = 'month';
                                            $scope.childAgeUnit.value = parseInt(quota.criteria[2].range_sets[0].units);
                                        }
                                    }else{
                                        destArr['no'] = new Array();
                                        destArr.no.push({
                                            "id":quota.criteria[0].conditions[0].id,
                                            "name":quota.criteria[0].conditions[0].name,
                                            "hasValidQuotas": quota.quantities.hasValidQuotas,
                                            "qual_id":quota.criteria[0].qualification_code,
                                            "percentage": quota.quantities.percentage,
                                            "per":quota.quantities.percentage,
                                            "maximum": quota.quantities.maximum,
                                            "minimum": quota.quantities.minimum,
                                            "number": quota.quantities.number,
                                            "flexiblePer": quota.quantities.flexibility,
                                            "flexible": quota.quantities.isFlexible,
                                            "achieved": quota.quantities.achieved
                                        });
                                    }
                                }else if(quota.criteria[0].q_type == "normal"){
                                    if(quota.quotaCategory == "grouped") {
                                        var dynamicName = "";
                                        var dynamicID = [];
                                        var q_nameArr = [];
                                        var qualsArr = ['states', 'csa', 'msa', 'dma', 'county'];
                                        
                                        _.each(quota.criteria[0].conditions, function(mergeCondName) {
                                            dynamicID.push(parseInt(mergeCondName.id));
                                            q_nameArr.push(mergeCondName.name);
                                            dynamicName = dynamicName + mergeCondName.name + " " +"or" + " ";
                                            condGroupingArr.push({"id": parseInt(mergeCondName.id), "name": mergeCondName.name});
                                            var index = _.findIndex(destArr, {"id": parseInt(mergeCondName.id)});
                                            //destArr.splice(index, 1);
                                            if(index != -1){
                                                destArr[index]['hasValidQuotas'] = quota.quantities.hasValidQuotas;
                                                destArr[index]['percentage'] = 0;
                                                destArr[index]['per'] = 0;
                                                destArr[index]['percent'] = 0;
                                                destArr[index]['maximum'] = 0;
                                                destArr[index]['minimum'] = 0;
                                                destArr[index]['number'] = 0;
                                                destArr[index]['flexiblePer'] = quota.quantities.flexibility;
                                                destArr[index]['flexible'] = quota.quantities.isFlexible;
                                                destArr[index]['achieved'] = 0;
                                                destArr[index]['selected'] = quota.quantities.selected || true;
                                                destArr[index]['name'] = mergeCondName.name;
                                            }
                                        });

                                        var groupedRow = {
                                            "hasValidQuotas": quota.quantities.hasValidQuotas,
                                            "percentage": quota.quantities.percentage,
                                             "per": quota.quantities.percentage,
                                             "percent": quota.quantities.percentage,
                                             "maximum": quota.quantities.maximum,
                                             "minimum": quota.quantities.minimum,
                                             "number": quota.quantities.number,
                                             "flexiblePer": quota.quantities.flexibility,
                                             "flexible": quota.quantities.isFlexible,
                                             "achieved": quota.quantities.achieved,
                                             "selected": quota.quantities.selected,
                                             "name": dynamicName.substring(0, dynamicName.length - 3),
                                             "id": parseInt(dynamicID),
                                             "condditionGroup": true,
                                             "name_arr": q_nameArr

                                        }
                                        if(!_.contains(qualsArr, layeredKey)) {
                                            destArr.push(groupedRow);
                                        }
                                    } 
                                    else {
                                        _.each(quota.criteria[0].conditions, function(cond){
                                            var index = _.findIndex(destArr, {"id": parseInt(cond.id)});
                                            if(index != -1){
                                                destArr[index]['hasValidQuotas'] = quota.quantities.hasValidQuotas;
                                                destArr[index]['percentage'] = quota.quantities.percentage;
                                                destArr[index]['per'] = quota.quantities.percentage;
                                                destArr[index]['percent'] = quota.quantities.percentage;
                                                destArr[index]['maximum'] = quota.quantities.maximum;
                                                destArr[index]['minimum'] = quota.quantities.minimum;
                                                destArr[index]['number'] = quota.quantities.number;
                                                destArr[index]['flexiblePer'] = quota.quantities.flexibility;
                                                destArr[index]['flexible'] = quota.quantities.isFlexible;
                                                destArr[index]['achieved'] = quota.quantities.achieved;
                                                destArr[index]['selected'] = quota.quantities.selected;
                                                destArr[index]['name'] = cond.name;
                                                //PD-1130
                                                if(_.has(quota.quantities, "hasCensusRepoQuota")) {
                                                   destArr[index]["hasCensusRepoQuota"] = quota.quantities.hasCensusRepoQuota;
                                                }
                                            }
                                        });
                                    }
                                    
                                }else if(quota.criteria[0].q_type == "range_sets"){
                                    _.each(quota.criteria[0].range_sets, function(range){
                                        var setQuotaObject = {
                                            "hasValidQuotas": quota.quantities.hasValidQuotas,
                                            "qual_id":quota.criteria[0].qualification_code,
                                            "percentage": quota.quantities.percentage,
                                            "per":quota.quantities.percentage,
                                            "maximum": quota.quantities.maximum,
                                            "minimum": quota.quantities.minimum,
                                            "number": quota.quantities.number,
                                            "flexiblePer": quota.quantities.flexibility,
                                            "flexible": quota.quantities.isFlexible,
                                            "min": range.from,
                                            "max": range.to,
                                            "achieved": quota.quantities.achieved
                                        }
                                        //PD-1130
                                        if(_.has(quota.quantities, "hasCensusRepoQuota")) {
                                               setQuotaObject.hasCensusRepoQuota = quota.quantities.hasCensusRepoQuota;
                                            }
                                        destArr.push(setQuotaObject);
                                    });
                                }
                            });
                            return destArr;
                        };
                        
                        //Check Census Repo Applied or not PD-1130
                        var hasCensusRepoApplied = function(quotaDataArr) {
                            var censusRepoFlag = false;
                            _.each(quotaDataArr, function(quota) {
                               if(_.has(quota.quantities, "hasCensusRepoQuota") && quota.quantities.hasCensusRepoQuota) {
                                   censusRepoFlag = true;
                               }
                            });
                            return censusRepoFlag;
                        }

                        //Check Grouped Quota Payload PD-961
                        var hasGroupedQuotas = function(groupData, quotaData, layeredKey) {
                            var tempQuotaObj = _.clone(quotaData);
                            var qualsArr = ['states', 'csa', 'msa', 'dma', 'county'];
                            _.each(groupData, function(sngleQuotas) {
                                if(sngleQuotas.quotaCategory == "grouped") {
                                    var dynamicName = "";
                                    var dynamicID = [];
                                    var q_nameArr = [];
                                    _.each(sngleQuotas.criteria[0].conditions, function(mergeCondName) {
                                        dynamicID.push(parseInt(mergeCondName.id));
                                        dynamicName = dynamicName + mergeCondName.name + " " +"or" + " ";
                                        q_nameArr.push(mergeCondName.name);
                                        var index = _.findIndex(tempQuotaObj, {"id": parseInt(mergeCondName.id)});
                                        tempQuotaObj.splice(index, 1);
                                        var matchedGroupObj = _.findWhere(quotaData, {id: parseInt(mergeCondName.id)});
                                        if(matchedGroupObj) {
                                            var getIndexMatch = _.indexOf(quotaData, matchedGroupObj);
                                            if(getIndexMatch > -1) {
                                                quotaData[getIndexMatch]["setGrupActive"] = true;
                                            }
                                        }

                                    });
                                    var raceObject = {
                                        "name":dynamicName.substring(0, dynamicName.length - 3),
                                        "id":dynamicID,
                                        "selected":true,
                                        "qual_id":sngleQuotas.criteria[0].qualification_code,
                                        "qual_name":sngleQuotas.criteria[0].qualification_name,
                                        "condditionGroup": true,
                                        "percentage": sngleQuotas.quantities.percentage,
                                        "achieved": sngleQuotas.quantities.achieved,
                                        "buyer_in_progress": sngleQuotas.counter.Buyer_side_In_Progress,
                                        "locked": sngleQuotas.locked,
                                        "flexiblePer": sngleQuotas.quantities.flexibility,
                                        "name_arr": q_nameArr,
                                        "number": sngleQuotas.quantities.number,
                                        "minimum": sngleQuotas.quantities.minimum,
                                        "maximum": sngleQuotas.quantities.maximum 
                                    }
                                    if(_.contains(qualsArr, sngleQuotas.criteria[0].qualification_name)) {
                                        raceObject["number"] = sngleQuotas.quantities.number;
                                        raceObject["minimum"] = sngleQuotas.quantities.minimum;
                                        raceObject["maximum"] = sngleQuotas.quantities.maximum;

                                    }
                                    tempQuotaObj.push(raceObject);
                                }
                            })
                            manageCondtitionGroupingArray(layeredKey, tempQuotaObj);

                            return tempQuotaObj;
                        }

                        // Putting data into particular quota
                        var targetLocType = ""; // related to old location Surveys
                        _.each(Object.keys(groupedData), function(layeredKey){
                            if(layeredKey == 'gender'){
                                $scope.sltGender = putDataInQuotaModal(groupedData[layeredKey], $scope.sltGender, layeredKey);
                                // For showing qualifications qualifications
                                showAddQuotaData($scope.genderInfo, $scope.sltGender, 'gender');
                                // Changing Flags
                                //PD-1130
                                var appliedGndrCensus = hasCensusRepoApplied(groupedData[layeredKey]);
                                if($scope.sltGender.length > 0 && $scope.sltGender[0].hasOwnProperty('number') && $scope.sltGender[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.gndrQuotaFlag.resetGen = false;
                                    $scope.gndrQuotaFlag.hasGndrFlag = true;
                                    //PD-1130
                                    if(appliedGndrCensus) {
                                        $scope.censusRepoFlag.hasCensusRepoGndr = true;    
                                    }
                                   
                                    // For toggle Button
                                    $scope.gndrQuotaFlag.editGndrFlag = true;
                                    $scope.gndrQuotaFlag.gndrFlx = $scope.sltGender[0].flexible;
                                    $scope.gndrQuotaFlag.gndrFlxValue = $scope.sltGender[0].flexiblePer;
                                }
                            }else if(layeredKey == 'race'){
                                $scope.sltRace = putDataInQuotaModal(groupedData[layeredKey], $scope.sltRace, layeredKey);
                                // For showing qualifications
                                //showAddQuotaData($scope.race, $scope.sltRace, 'race');
                                var appliedGndrCensus = hasCensusRepoApplied(groupedData[layeredKey]);

                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    raceModelLiveEdit = _.clone($scope.race);

                                    $scope.newraceModal = hasGroupedQuotas(groupedData[layeredKey], $scope.race, layeredKey);
                                    
                                    showAddQuotaData($scope.newraceModal, $scope.sltRace, 'race');
                                }
                                else {
                                    showAddQuotaData($scope.race, $scope.sltRace, 'race');
                                }
                                // Changing Flags
                                if ($scope.sltRace.length > 0 && $scope.sltRace[0].hasOwnProperty('number') && $scope.sltRace[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.raceQuotaFlag = {
                                        resetRace : false,
                                        hasRaceFlag : true,
                                        editRaceFlag : true
                                    }
                                    //PD-1130
                                    if(appliedGndrCensus) {
                                        $scope.censusRepoFlag.hasCensusRepoRace = true; 
                                    }
                                    
                                    // For toggle Button
                                    $scope.raceQuotaFlag.raceFlx = $scope.sltRace[0].flexible;
                                    $scope.raceQuotaFlag.raceFlxValue = $scope.sltRace[0].flexiblePer;
                                }
                            }else if(layeredKey == 'raceBera'){
                                //PD-1402
                                $scope.sltRaceBera = putDataInQuotaModal(groupedData[layeredKey], $scope.sltRaceBera, layeredKey);
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"}); 
                                if(groupedTest) {
                                    raceBeraModelLiveEdit = _.clone($scope.raceBera);

                                    $scope.groupingRaceBeraModel = hasGroupedQuotas(groupedData[layeredKey], $scope.raceBera, layeredKey);
                                    
                                    showAddQuotaData($scope.groupingRaceBeraModel, $scope.sltRaceBera, 'raceBera');
                                }
                                else  {
                                     // For showing qualifications
                                    showAddQuotaData($scope.raceBera, $scope.sltRaceBera, 'raceBera');
                                }
                               
                                // Changing Flags
                                if ($scope.sltRaceBera.length > 0 && $scope.sltRaceBera[0].hasOwnProperty('number') && $scope.sltRaceBera[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.rbQuotaFlag.resetRb = false;
                                    $scope.rbQuotaFlag.hasRbFlag = true;
                                    $scope.rbQuotaFlag.editRbFlag = true;
                                    // For toggle Button
                                    $scope.rbQuotaFlag.rbFlx = $scope.sltRaceBera[0].flexible;
                                    $scope.rbQuotaFlag.rbFlxValue = $scope.sltRaceBera[0].flexiblePer;
                                }
                            }else if(layeredKey == 'hispanicOrigin'){
                                $scope.hispanicOrigin = putDataInQuotaModal(groupedData[layeredKey], $scope.hispanicOrigin, layeredKey);
                                // For showing qualifications
                                showAddQuotaData($scope.hispanic, $scope.hispanicOrigin, 'hispanic');
                                //PD-1130
                                var appliedGndrCensus = hasCensusRepoApplied(groupedData[layeredKey]);
                                // Changing Flags
                                if ($scope.hispanicOrigin.length > 0 && $scope.hispanicOrigin[0].hasOwnProperty('number') && $scope.hispanicOrigin[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.hisQuotaFlag.resetHisOri = false;
                                    $scope.hisQuotaFlag.hasHisOriFlag = true;
                                    //PD-1130
                                    if(appliedGndrCensus) {
                                       $scope.censusRepoFlag.hasCensusRepoHis = true;  
                                    }
                                    $scope.hisQuotaFlag.editHisOriFlag = true;
                                    // For toggle Button
                                    $scope.hisQuotaFlag.hispanicFlx = $scope.hispanicOrigin[0].flexible;
                                    $scope.hisQuotaFlag.hispanicFlxValue = $scope.hispanicOrigin[0].flexiblePer;
                                }
                            }else if(layeredKey == 'educations'){
                                $scope.sltEducation = putDataInQuotaModal(groupedData[layeredKey], $scope.sltEducation, layeredKey);
                                // For showing qualifications qualifications
                                //showAddQuotaData($scope.education, $scope.sltEducation, 'edu');
                                //PD-1130
                                var appliedGndrCensus = hasCensusRepoApplied(groupedData[layeredKey]);
                                //PD-961
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    educationModelLiveEdit = _.clone($scope.education);

                                    $scope.groupingeducationModal = hasGroupedQuotas(groupedData[layeredKey], $scope.education, layeredKey);
                                    
                                    showAddQuotaData($scope.groupingeducationModal, $scope.sltEducation, 'edu');
                                }
                                else {
                                    showAddQuotaData($scope.education, $scope.sltEducation, 'edu');
                                }
                                // Changing Flags
                                if ($scope.sltEducation.length > 0 && $scope.sltEducation[0].hasOwnProperty('number') && $scope.sltEducation[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.eduQuotaFlag.resetEdu = false;
                                    $scope.eduQuotaFlag.hasEduFlag = true;
                                    if(appliedGndrCensus) {
                                        $scope.censusRepoFlag.hasCensusRepoEdu = true;
                                    }
                                    $scope.eduQuotaFlag.editEduFlag = true;
                                    // For toggle Button
                                    $scope.eduQuotaFlag.eduFlx = $scope.sltEducation[0].flexible;
                                    $scope.eduQuotaFlag.eduFlxValue = $scope.sltEducation[0].flexiblePer;
                                }
                            }else if(layeredKey == 'employments'){
                                $scope.sltEmployment = putDataInQuotaModal(groupedData[layeredKey], $scope.sltEmployment, layeredKey);
                                // For showing qualifications qualifications
                                //showAddQuotaData($scope.employement, $scope.sltEmployment, 'emp');
                                var appliedGndrCensus = hasCensusRepoApplied(groupedData[layeredKey]);
                                //PD-961
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    employmentModelLiveEdit = _.clone($scope.employement);

                                    $scope.groupingemploymentModal = hasGroupedQuotas(groupedData[layeredKey], $scope.employement, layeredKey);
                                    
                                    showAddQuotaData($scope.groupingemploymentModal, $scope.sltEmployment, 'emp');
                                }
                                else {
                                    showAddQuotaData($scope.employement, $scope.sltEmployment, 'emp');
                                }
                                // Changing Flags
                                if($scope.sltEmployment.length > 0 && $scope.sltEmployment[0].hasOwnProperty('number') && $scope.sltEmployment[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.empQuotaFlag.resetEmp = false;
                                    $scope.empQuotaFlag.hasEmpFlag = true;
                                    if(appliedGndrCensus) {
                                        $scope.censusRepoFlag.hasCensusRepoEmploy = true;
                                    }
                                    $scope.empQuotaFlag.editEmpFlag = true;
                                    // For toggle Button
                                    $scope.empQuotaFlag.empFlx = $scope.sltEmployment[0].flexible;
                                    $scope.empQuotaFlag.empFlxValue = $scope.sltEmployment[0].flexiblePer;
                                }
                            }else if(layeredKey == 'relationships'){
                                $scope.sltRelation = putDataInQuotaModal(groupedData[layeredKey], $scope.sltRelation, layeredKey);
                                
                                //PD-961
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    relationModelLiveEdit = _.clone($scope.relation);
                                    $scope.newrelationModal = hasGroupedQuotas(groupedData[layeredKey], $scope.relation, layeredKey);
                                    
                                    showAddQuotaData($scope.newrelationModal, $scope.sltRelation, 'relation');
                                }
                                else {
                                    showAddQuotaData($scope.relation, $scope.sltRelation, 'relation');
                                }
                                // Changing Flags
                                if ($scope.sltRelation.length > 0 && $scope.sltRelation[0].hasOwnProperty('number') && $scope.sltRelation[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.rlnQuotaFlag.resetRel = false;
                                    $scope.rlnQuotaFlag.hasRlnFlag = true;
                                    $scope.rlnQuotaFlag.editRlnFlag = true;
                                    // For toggle Button
                                    $scope.rlnQuotaFlag.rlnFlx = $scope.sltRelation[0].flexible;
                                    $scope.rlnQuotaFlag.rlnFlxValue = $scope.sltRelation[0].flexiblePer;
                                }
                            }else if(layeredKey == 'device'){
                                //PD-1402
                                $scope.sltDevice = putDataInQuotaModal(groupedData[layeredKey], $scope.sltDevice, layeredKey);
                                
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    deviceModelLiveEdit = _.clone($scope.deviceInfo);
                                    $scope.groupingDeviceModel = hasGroupedQuotas(groupedData[layeredKey], $scope.deviceInfo, layeredKey);
                                    
                                    showAddQuotaData($scope.groupingDeviceModel, $scope.sltDevice, 'dvc');
                                }
                                else {
                                    showAddQuotaData($scope.deviceInfo, $scope.sltDevice, 'dvc');
                                }
                                
                                // Changing Flags
                                if ($scope.sltDevice.length > 0 && $scope.sltDevice[0].hasOwnProperty('number') && $scope.sltDevice[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.dvcQuotaFlag.resetDev = false;
                                    $scope.dvcQuotaFlag.hasDeviceFlag = true;
                                    $scope.dvcQuotaFlag.editDvcFlag = true;
                                    // For toggle Button
                                    $scope.dvcQuotaFlag.dvcFlx = $scope.sltDevice[0].flexible;
                                    $scope.dvcQuotaFlag.dvcFlxValue = $scope.sltDevice[0].flexiblePer;
                                }
                            }else if(layeredKey == 'regions'){
                    
                                $scope.sltRegion = putDataInQuotaModal(groupedData[layeredKey], $scope.sltRegion, layeredKey);
                                //PD-1402
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    censusRgnModelLiveEdit = _.clone($scope.region);
                                    $scope.groupingCensusRgnModel = hasGroupedQuotas(groupedData[layeredKey], $scope.region, layeredKey);
                                    
                                    // For showing qualifications qualifications
                                    showAddQuotaData($scope.groupingCensusRgnModel, $scope.sltRegion, 'rgn');
                                }
                                else {
                                    // For showing qualifications qualifications
                                    showAddQuotaData($scope.region, $scope.sltRegion, 'rgn');
                                }
                                
                                // Changing Flags
                                if($scope.sltRegion.length > 0 && $scope.sltRegion[0].hasOwnProperty('number') && $scope.sltRegion[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.regQuotaFlag.resetReg = false;
                                    $scope.regQuotaFlag.hasRegionFlag = true;
                                    $scope.regQuotaFlag.editRegionFlag = true;
                                    // For toggle Button
                                    $scope.regQuotaFlag.regionFlx = $scope.sltRegion[0].flexible;
                                    $scope.regQuotaFlag.regionFlxValue = $scope.sltRegion[0].flexiblePer;
                                    if(data.survey[0].locationKey != undefined && data.survey[0].locationKey != null && data.survey[0].locationKey != ""){
                                        targetLocType = 'region';
                                    }
                                }
                            }else if(layeredKey == 'divisions'){
                                $scope.sltDivision = putDataInQuotaModal(groupedData[layeredKey], $scope.sltDivision, layeredKey);
                                //PD-1402
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    divisionModelLiveEdit = _.clone($scope.division);
                                    $scope.groupingDivisionModel = hasGroupedQuotas(groupedData[layeredKey], $scope.division, layeredKey);
                                    
                                    // For showing qualifications qualifications
                                    
                                    showAddQuotaData($scope.groupingDivisionModel, $scope.sltDivision, 'dvsn');
                                }
                                else {
                                     // For showing qualifications qualifications
                                    showAddQuotaData($scope.division, $scope.sltDivision, 'dvsn');
                                }

                                if($scope.sltDivision.length > 0 && $scope.sltDivision[0].hasOwnProperty('number') && $scope.sltDivision[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.dvsnQuotaFlag.resetDivi = false;
                                    $scope.dvsnQuotaFlag.hasDivisionFlag = true;
                                    $scope.dvsnQuotaFlag.editDivisionFlag = true;
                                    // For toggle Button
                                    $scope.dvsnQuotaFlag.divisionFlx = $scope.sltDivision[0].flexible;
                                    $scope.dvsnQuotaFlag.divisionFlxValue = $scope.sltDivision[0].flexiblePer;
                                   
                                    if(data.survey[0].locationKey != undefined && data.survey[0].locationKey != null && data.survey[0].locationKey != ""){
                                        targetLocType = 'division';
                                    }
                                }
                            }else if(layeredKey == 'states'){
                                $scope.selectedStates = putDataInQuotaModal(groupedData[layeredKey], $scope.selectedStates, layeredKey);
                                //PD-1402
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    $scope.groupingStateModel = hasGroupedQuotas(groupedData[layeredKey], $scope.selectedStates, layeredKey);
                                    _.each($scope.groupingStateModel, function(stateQuota){
                                        stateQuota.selected = true;
                                    });
                                    
                                }
                                else {
                                    _.each($scope.selectedStates, function(stateQuota){
                                        stateQuota.selected = true;
                                    });
                                }
                                // Changing Flags and Adding qualifications in location variables
                                
                                if($scope.selectedStates.length > 0 && $scope.selectedStates[0].hasOwnProperty('number') && $scope.selectedStates[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.resetStateQuotas = false;
                                    $scope.editStateFlag = true;
                                    $scope.hasStateFlag = true;
                                    // For Toggle Button
                                    $scope.stateFlexibility.flxValue = $scope.selectedStates[0].flexiblePer;
                                    $scope.stateFlexibility.isFlexible = $scope.selectedStates[0].flexible;
                                    if(data.survey[0].locationKey != undefined && data.survey[0].locationKey != null && data.survey[0].locationKey != ""){
                                        targetLocType = 'state';
                                    }
                                }
                            }else if(layeredKey == 'csa'){
                                $scope.selectedCSAs = putDataInQuotaModal(groupedData[layeredKey], $scope.selectedCSAs, layeredKey);
                                // Changing Flags and Adding qualifications in location variables
                                //PD-1402
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    $scope.groupingCsaModel = hasGroupedQuotas(groupedData[layeredKey], $scope.selectedCSAs, layeredKey);
                                    _.each($scope.groupingCsaModel, function(stateQuota){
                                        stateQuota.selected = true;
                                    });
                                    
                                }
                                else {
                                    _.each($scope.selectedCSAs, function(csaQuota){
                                        csaQuota.selected = true;
                                    });
                                }
                                if($scope.selectedCSAs.length > 0 && $scope.selectedCSAs[0].hasOwnProperty('number') && $scope.selectedCSAs[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.resetCSAQuotas = false;
                                    $scope.editCSAFlag = true;
                                    $scope.hasCSAFlag = true;
                                    // For Toggle Button
                                    $scope.csaFlexibility.flxValue = $scope.selectedCSAs[0].flexiblePer;
                                    $scope.csaFlexibility.isFlexible = $scope.selectedCSAs[0].flexible;
                                    if(data.survey[0].locationKey != undefined && data.survey[0].locationKey != null && data.survey[0].locationKey != ""){
                                        targetLocType = 'csa';
                                    }
                                }
                            }else if(layeredKey == 'msa'){
                                $scope.selectedMSAs = putDataInQuotaModal(groupedData[layeredKey], $scope.selectedMSAs, layeredKey);
                                // Changing Flags and Adding qualifications in location variables
                                //PD-1402
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    $scope.groupingMsaModel = hasGroupedQuotas(groupedData[layeredKey], $scope.selectedMSAs, layeredKey);
                                    _.each($scope.groupingMsaModel, function(stateQuota){
                                        stateQuota.selected = true;
                                    });
                                    
                                }
                                else {
                                    _.each($scope.selectedMSAs, function(msaQuota){
                                        msaQuota.selected = true;
                                    });
                                }
                                if($scope.selectedMSAs.length > 0 && $scope.selectedMSAs[0].hasOwnProperty('number') && $scope.selectedMSAs[0].hasOwnProperty('hasValidQuotas')) {
                                    $scope.resetMSAQuotas = false;
                                    $scope.editMSAFlag = true;
                                    $scope.hasMSAFlag = true;
                                    // For Toggle Button
                                    $scope.msaFlexibility.flxValue = $scope.selectedMSAs[0].flexiblePer;
                                    $scope.msaFlexibility.isFlexible = $scope.selectedMSAs[0].flexible;
                                    if(data.survey[0].locationKey != undefined && data.survey[0].locationKey != null && data.survey[0].locationKey != ""){
                                        targetLocType = 'msa';
                                    }
                                }
                            }else if(layeredKey == 'dma'){
                                $scope.selectedDMAs = putDataInQuotaModal(groupedData[layeredKey], $scope.selectedDMAs, layeredKey);
                                // Changing Flags and Adding qualifications in location variables
                                //PD-1402
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    $scope.groupingDmaModel = hasGroupedQuotas(groupedData[layeredKey], $scope.selectedDMAs, layeredKey);
                                    _.each($scope.groupingDmaModel, function(stateQuota){
                                        stateQuota.selected = true;
                                    });
                                    
                                }
                                else {
                                   _.each($scope.selectedDMAs, function(dmaQuota){
                                        dmaQuota.selected = true;
                                    }); 
                                }
                                
                                if($scope.selectedDMAs.length > 0 && $scope.selectedDMAs[0].hasOwnProperty('number') && $scope.selectedDMAs[0].hasOwnProperty('hasValidQuotas')){
                                    $scope.resetDMAQuotas = false;
                                    $scope.editDMAFlag = true;
                                    $scope.hasDMAFlag = true;
                                    // For Toggle Button
                                    $scope.dmaFlexibility.flxValue = $scope.selectedDMAs[0].flexiblePer;
                                    $scope.dmaFlexibility.isFlexible = $scope.selectedDMAs[0].flexible;
                                    if(data.survey[0].locationKey != undefined && data.survey[0].locationKey != null && data.survey[0].locationKey != ""){
                                        targetLocType = 'dma';
                                    }
                                }
                            }else if(layeredKey == 'county'){
                                $scope.selectedCountys = putDataInQuotaModal(groupedData[layeredKey], $scope.selectedCountys, layeredKey);
                                // Changing Flags and Adding qualifications in location variables
                                //PD-1402
                                var groupedTest = _.findWhere(groupedData[layeredKey], {"quotaCategory" : "grouped"});
                                if(groupedTest) {
                                    $scope.groupingCountyModel = hasGroupedQuotas(groupedData[layeredKey], $scope.selectedCountys, layeredKey);
                                    _.each($scope.groupingCountyModel, function(stateQuota){
                                        stateQuota.selected = true;
                                    });
                                    
                                }
                                else {
                                  _.each($scope.selectedCountys, function(countyQuota){
                                        countyQuota.selected = true;
                                    });  
                                }
                                
                                if($scope.selectedCountys.length > 0 && $scope.selectedCountys[0].hasOwnProperty('number') && $scope.selectedCountys[0].hasOwnProperty('hasValidQuotas')) {
                                    $scope.resetCountyQuotas = false;
                                    $scope.editCountyFlag = true;
                                    $scope.hasCountyFlag = true;
                                    // For Toggle Button
                                    $scope.countyFlexibility.flxValue = $scope.selectedCountys[0].flexiblePer;
                                    $scope.countyFlexibility.isFlexible = $scope.selectedCountys[0].flexible;
                                    if(data.survey[0].locationKey != undefined && data.survey[0].locationKey != null && data.survey[0].locationKey != ""){
                                        targetLocType = 'county';
                                    }
                                }
                            }else if(layeredKey == 'age'){
                                $scope.ageTempArr = [];
                                $scope.ageTempArr = putDataInQuotaModal(groupedData[layeredKey], $scope.ageTempArr, layeredKey);
                                //PD-1130
                                var appliedGndrCensus = hasCensusRepoApplied(groupedData[layeredKey]);
                                //Checking data for Age Array
                                if($scope.ageTempArr.length > 0 && $scope.ageTempArr[0].hasOwnProperty('hasValidQuotas') && $scope.ageTempArr[0].hasOwnProperty('number')){
                                    $scope.ageQuotaFlag.ageFlx = $scope.ageTempArr[0].flexible;
                                    $scope.ageQuotaFlag.ageFlxValue = parseInt($scope.ageTempArr[0].flexiblePer);
                                    $scope.ageData.min = (_.min($scope.ageTempArr, function(elm){ 
                                        return elm.min;
                                    })).min;
                                    $scope.ageData.max = (_.max($scope.ageTempArr, function(elm){ return elm.max; })).max;
                                    $scope.ageTempArr.unshift({
                                        "min": '',
                                        "max": '',
                                        "number": '',
                                        "per": '',
                                        "flexiblePer": '0',
                                        "flexible": $scope.ageTempArr[0].flexible
                                    });
                                    $scope.ageQuotaFlag.resetAge = false;
                                    $scope.ageQuotaFlag.hasAgeFlag = true;
                                    //PD-1130
                                    if(appliedGndrCensus) {
                                        $scope.censusRepoFlag.hasCensusRepoAge = true;
                                    } 
                                    $scope.ageQuotaFlag.editAgeFlag = true;
                                    $scope.ageQuotaFlag.clearAgeFlag = true;
                                }
                            }else if(layeredKey == 'houseHoldIncome'){
                                $scope.incomeTempArr = [];
                                $scope.incomeTempArr = putDataInQuotaModal(groupedData[layeredKey], $scope.incomeTempArr, layeredKey);
                                //PD-1130
                                var appliedGndrCensus = hasCensusRepoApplied(groupedData[layeredKey]);
                                //Checking data for income Array
                                if($scope.incomeTempArr.length > 0 && $scope.incomeTempArr[0].hasOwnProperty('hasValidQuotas') && $scope.incomeTempArr[0].hasOwnProperty('number')){
                                    $scope.incomeQuotaFlag.incomeFlxValue = parseInt($scope.incomeTempArr[0].flexiblePer);
                                    $scope.incFlx = $scope.incomeTempArr[0].flexible;
                                    $scope.houseHoldIncome.min = (_.min($scope.incomeTempArr, function(elm){ 
                                        return elm.min;
                                     })).min;
                                    $scope.houseHoldIncome.max = (_.max($scope.incomeTempArr, function(elm){ return elm.max; })).max;
                                    $scope.incomeTempArr.unshift({
                                        "min": '',
                                        "max": '',
                                        "number": '',
                                        "per": '',
                                        "flexiblePer": '0',
                                        "flexible": $scope.incomeTempArr[0].flexible
                                    });
                                    $scope.incomeQuotaFlag.resetInc = false;
                                    $scope.incomeQuotaFlag.hasIncomeFlag = true;
                                    //PD-1130
                                    if(appliedGndrCensus) {
                                        $scope.censusRepoFlag.hasCensusRepoIncome = true;
                                    }
                                     
                                    $scope.incomeQuotaFlag.editIncomeFlag = true;
                                    $scope.incomeQuotaFlag.clearIncomeFlag = true;
                                };
                            }else if(layeredKey == 'children'){
                                $scope.chldTempArr = putDataInQuotaModal(groupedData[layeredKey], $scope.chldTempArr, layeredKey);
                                //Checking data for income Array
                                if($scope.chldTempArr.no || $scope.chldTempArr.have){
                                    $scope.childQuotaFlag.chldFlxValue = parseInt($scope.chldTempArr.have[0].flexiblePer) ? parseInt($scope.chldTempArr.have[0].flexiblePer): parseInt($scope.chldTempArr.no[0].flexiblePer);
                                    $scope.childQuotaFlag.chldFlx = $scope.chldTempArr.have[0].flexible ? $scope.chldTempArr.have[0].flexible:$scope.chldTempArr.no[0].flexible;
                                    if($scope.chldTempArr.have[0].number){
                                        $scope.chldTempArr.have.unshift({
                                            "id": $scope.chldTempArr.have[0].id,
                                            "min": '',
                                            "max": '',
                                            "gender":'',
                                            "number": '',
                                            "per": '',
                                            "flexiblePer": '0',
                                            "flexible": $scope.childQuotaFlag.chldFlx
                                        });
                                    }
                                    $scope.childQuotaFlag.editChldFlag = true;
                                    $scope.childQuotaFlag.hasChldFlag = true;
                                    $scope.childQuotaFlag.resetChild = false;
                                    $scope.chldTotalRemRace = 0;
                                }
                            }
                            else if(layeredKey == "zipcodes") {
                                
                                _.each(groupedData[layeredKey], function(singleQuota){
                                    var zipCodeQuota = {
                                        'hasValidQuotas': singleQuota.quantities.hasValidQuotas,
                                        'percentage': singleQuota.quantities.percentage,
                                        'per': singleQuota.quantities.percentage,
                                        'percent': singleQuota.quantities.percentage,
                                        'maximum': singleQuota.quantities.maximum,
                                        'minimum': singleQuota.quantities.minimum,
                                        'number': singleQuota.quantities.number,
                                        'flexiblePer': singleQuota.quantities.flexibility,
                                        'flexible': singleQuota.quantities.isFlexible,
                                        'achieved': singleQuota.quantities.achieved,
                                        'selected': true
                                    };
                                    _.each(singleQuota.criteria, function(singleCriteria) {
                                        zipCodeQuota["qual_id"] = singleCriteria.qualification_code;
                                        zipCodeQuota["qual_name"]=  singleCriteria.qualification_name;
                                        zipCodeQuota["name"] = singleCriteria.conditions[0].name;
                                        zipCodeQuota["buyer_ziplist_ref"] = singleCriteria.buyer_ziplist_ref;

                                    })
                                    $scope.selectedZipcodes.push(zipCodeQuota);
                                    $scope.zipcodeFlexibility.isFlexible = singleQuota.quantities.isFlexible;
                                    $scope.zipcodeFlexibility.flxValue = singleQuota.quantities.flexibility
                                });
                                angular.copy($scope.selectedZipcodes, $scope.zipCodeQuotaManage);
                                _.each($scope.zipCodeQuotaManage, function(snglQta) {
                                    snglQta.number = "";
                                    snglQta.percentage = "";
                                    snglQta.per = "";
                                    snglQta.maximum = "";
                                    snglQta.minimum = "";
                                    snglQta.achieved = "";
                                })
                                $scope.zipcodeQuotaFlg.editZipcodeFlag = true;
                                $scope.zipcodeQuotaFlg.resetZipQuotaFlg = false;
                            }
                        });
                        // Changed due to default quota is added in same variable for age
                        // ageTempVar is taken for holding qualifications in case of default quota
                        if(!$scope.ageData.min && !$scope.ageData.max){
                            if($scope.ageTempArr.length > 0){
                                $scope.ageData.min = $scope.ageTempArr[0].min;
                                $scope.ageData.max = $scope.ageTempArr[0].max;
                            }else if(ageTempVar.length > 0){
                                $scope.ageData.min = ageTempVar[0].min;
                                $scope.ageData.max = ageTempVar[0].max;
                            }else{
                                $scope.ageData.min = 13;
                                $scope.ageData.max = 99;
                            }
                        }
                        if(!$scope.houseHoldIncome.min && !$scope.houseHoldIncome.max && $scope.incomeTempArr.length > 0){
                            $scope.houseHoldIncome.min = $scope.incomeTempArr[0].min;
                            $scope.houseHoldIncome.max = $scope.incomeTempArr[0].max;
                        }
                    }else{
                        // fill age and income min and max values if quotas are not present
                        if($scope.ageTempArr.length > 0){
                            $scope.ageData.min = $scope.ageTempArr[0].min;
                            $scope.ageData.max = $scope.ageTempArr[0].max;
                        }else if(ageTempVar.length > 0){
                            $scope.ageData.min = ageTempVar[0].min;
                            $scope.ageData.max = ageTempVar[0].max;
                        }else{
                            $scope.ageData.min = 13;
                            $scope.ageData.max = 99;
                        }
                        if($scope.houseHoldIncome.length > 0){
                            $scope.houseHoldIncome.min = $scope.incomeTempArr[0].min;
                            $scope.houseHoldIncome.max = $scope.incomeTempArr[0].max;
                        }else{
                            $scope.houseHoldIncome.min = 0;
                            $scope.houseHoldIncome.max = 999999;
                        }
                    }
                    //ZiCode Quota Payload for ADD QUota Button enable
                    if(data.zipQuotaArr && data.zipQuotaArr.length > 0) {
                        $scope.selectedZipcodes = [];
                        _.each(data.zipQuotaArr, function(snglZip) {
                            var tempObject = {
                                flexible:true,
                                flexiblePer:0,
                                hasValidQuotas:false,
                                maximum: "",
                                minimum: "",
                                name: snglZip.group_name,
                                number: "",
                                percentage: "",
                                selected:true,
                                zipWithNoQuota: true,
                                buyer_ziplist_ref : snglZip.byr_pst_ref
                            }
                            $scope.selectedZipcodes.push(tempObject);
                        })
                        $scope.zipcodeQuotaFlg.addZipQuotaFlg = true;
                    }
                    //Some Age, Income and Children variables changes in every case to show the default data in boxes
                    $scope.ageSltBoxTlt();
                    $scope.incomeSltBoxTlt();

                    $scope.properties.surveyTitle = data.survey[0].surveyTitle;
                    $scope.properties.oldSurveyTitle = data.survey[0].surveyTitle;
                    // set locale again 
                    $scope.properties.locale = data.survey[0].locale;
                    
                    /*----------For the cloned Survey PD-1549--------------*/ 
                    if($stateParams.id == 'CreateSurveys' && $scope.newId){                                                                                     
                        if(data.survey[0].surveyTitle.substring(0,5) == 'CLONE') {
                            var cloneStrArr = data.survey[0].surveyTitle.split('-');
                            var cloneNum = cloneStrArr[0].split('CLONE');
                
                            if(!isNaN(parseInt(cloneNum[1]))) {
                                var cloneCount = parseInt(cloneNum[1]) + 1;
                            }
                            else {
                                var cloneCount = 1;
                            }
                            var matchIndex = _.indexOf(cloneStrArr, cloneStrArr[0]);

                            cloneStrArr.splice(matchIndex, 1);
                            var tailStr = "";
                            _.each(cloneStrArr, function(str) {
                                tailStr += "-" + str;
                            })
                            $scope.properties.surveyTitle = "CLONE" + cloneCount + tailStr;
                            
                        }
                        else{
                            $scope.properties.surveyTitle = 'CLONE-' + data.survey[0].surveyTitle;  
                            
                        }
                    }
                    /*----------Cloned Surveys Ends----------*/

                    $scope.properties.numberOfCompletes = data.survey[0].number;
                    $scope.properties.currencyFx = data.survey[0].currencyFx || {fx: 321,symbol: '$'};
                    $scope.properties.oldNumberOfCompletes = data.survey[0].number;
                    $scope.completes = data.survey[0].number;
                    $scope.properties.samplesType = data.survey[0].samplesType;
                    $scope.properties.country = data.survey[0].country;
                    $scope.properties.language = data.survey[0].language;
                    $scope.properties.lengthOfSurvey = data.survey[0].lengthOfSurvey;
                    $scope.incidence = data.survey[0].incidence;
                    $scope.properties.field_time = data.survey[0].field_time || 0;    //PD-569
                    $scope.field_time = data.survey[0].field_time || 0;               //PD-569
                    $scope.properties.oldFieldTime = data.survey[0].field_time || 0;
                    $scope.properties.creationDate = data.survey[0].creation_date;
                    $scope.zipCodes = data.survey[0].location.zipcode.values;
                    //$scope.location.zipcode.values = data.survey[0].location.zipcode.values;
                    $scope.cpi = data.survey[0].cpi;
                    $scope.properties.countryCode = data.survey[0].locale.countryCode;
                    $scope.properties.countryName = data.survey[0].locale.countryName;
                    $scope.properties.languageCode = data.survey[0].locale.languageCode;
                    $scope.properties.languageName = data.survey[0].locale.languageName;
                    $scope.properties.languageTranslate = data.survey[0].locale.languageTranslate

                    $scope.blrFld.lang = data.survey[0].language;
                    $scope.blrFld.cntry = data.survey[0].country;
                    $scope.blrFld.LOI = data.survey[0].lengthOfSurvey;
                    $scope.blrFld.incd = data.survey[0].incidence;
                    
                    calculateTotalCost();
                    $scope.samplesValue = getValueOfDropDown($scope.samples, data.survey[0].samplesType);
                    $scope.countryValue = getValueOfDropDown($scope.country, data.survey[0].country);
                    $scope.languageValue = getLanguageDropdownValue(data.survey[0].country, data.survey[0].language);

                    optionsToDisplay(data.survey[0].locale.countryCode);
                    $scope.getCompletes(data.survey[0].number);
                    if (data.survey[0].supplier.length > 0) {
                        $scope.goFinalSurvey = true;
                    }
                    //getting file path of zipcodes 
                    if(data.survey[0].zipcodeFilePath != undefined && data.survey[0].zipcodeFilePath != null && data.survey[0].zipcodeFilePath != "") {
                        $scope.properties.zipcodeFilePath = data.survey[0].zipcodeFilePath;
                        zipcodeFilePath = data.survey[0].zipcodeFilePath;
                    }

                    //PD-321
                    //check for locationKey;
                    if(data.survey[0].locationKey != undefined && data.survey[0].locationKey != null && data.survey[0].locationKey != "") {
                        //assign selected location
                        $scope.locationData.type = data.survey[0].locationKey;
                        $scope.locationData.selected = true;
                        $timeout(function() {
                            //id pattern 'tab-' for tab
                            //to set tab active
                            document.getElementById('tab-'+data.survey[0].locationKey).classList.add("active");
                            angular.element(angular.element('#tab-'+data.survey[0].locationKey)[0].firstChild.getAttribute('href')).addClass('active');
                        },0);
                    }else {
                        //PD-321 
                        //selct tab
                        if(targetLocType != undefined && targetLocType != null && targetLocType != "") {
                            $scope.locationData.type = targetLocType;
                            $scope.locationData.selected = true;
                            $timeout(function() {
                                //id pattern 'tab-' for tab
                                //to set tab active
                                document.getElementById('tab-'+targetLocType).classList.add("active");
                                angular.element(angular.element('#tab-'+targetLocType)[0].firstChild.getAttribute('href')).addClass('active');
                            },0);
                        }
                    }
                    //Check If Clone is Live/pause/closed byPass this function (Added by Amar)
                    if(data.survey[0].status === 11 && $scope.clone) {
                        getTotalAchivedInLocation();
                    }
                    
                    $scope.loader.show = false;
                }
            }).error(function(err) {
                $scope.loader.show = false;
                notify({
                    message: "Error in Update",
                    classes: 'alert-danger',
                    duration: 4000
                });
            })
        }
    };
    
    function getTotalAchivedInLocation(){
        $scope.locationData.achieved = 0;
        /*PD-709*/
       $scope.currLocQuotaFielded = 0;
        if($scope.srvId == undefined) {
            $scope.srvId = $scope.newId;
        }
        createSurvey.getSurveyManagement($scope.srvId, 'buyer', $scope.properties.locale).success(function(data){
            if(data.apiStatus == "Success"){
                $scope.locationData.achieved = (data && data.result && data.result.length > 0 && data.result[0].fielded) ? data.result[0].fielded : 0;
            }
        }).error(function(err){
            notify({message:"Something went wrong in fetching fielded for location",classes:'alert-danger',duration:2000} );
        });
        if($scope.locationData.type == "region") {
            _.each($scope.region , function(value){
                if(value.achieved){
                    $scope.currLocQuotaFielded = $scope.currLocQuotaFielded+ value.achieved;
                }
            })
        }
        if($scope.locationData.type == "division") {
            _.each($scope.division , function(value){
                if(value.achieved){
                    $scope.currLocQuotaFielded = $scope.currLocQuotaFielded+ value.achieved;
                }
            })
        }
        if($scope.locationData.type == "state") {
            _.each($scope.selectedStates , function(value){
                if(value.achieved){
                    $scope.currLocQuotaFielded = $scope.currLocQuotaFielded+ value.achieved;
                }
            })
        }
        if($scope.locationData.type == "dma") {
            _.each($scope.selectedDMAs , function(value){
                if(value.achieved){
                    $scope.currLocQuotaFielded = $scope.currLocQuotaFielded+ value.achieved;
                }
            })
        }
        if($scope.locationData.type == "csa") {
            _.each($scope.selectedCSAs , function(value){
                if(value.achieved){
                    $scope.currLocQuotaFielded = $scope.currLocQuotaFielded+ value.achieved;
                }
            })
        }
        if($scope.locationData.type == "msa") {
            _.each($scope.selectedMSAs , function(value){
                if(value.achieved){
                    $scope.currLocQuotaFielded = $scope.currLocQuotaFielded+ value.achieved;
                }
            })
        }
        if($scope.locationData.type == "county") {
            _.each($scope.selectedCountys , function(value){
                if(value.achieved){
                    $scope.currLocQuotaFielded = $scope.currLocQuotaFielded+ value.achieved;
                }
            })
        }
    }

    $scope.goToSuppliers = function() {
        if ($scope.srvId) {
            $scope.saveSurvey('moveToNext');
        }
    };

    function getValueOfDropDown(arr, id) {
        for (var i in arr) {
            if (arr[i].id == id) {
                return arr[i].name;
            }
        }
    }

    function getLanguageDropdownValue(ctId, lgId) {
        commonApi.getLanguageByCountry(ctId).success(function(dataLang) {
            if (dataLang.languages != null) {
                $scope.lang = dataLang.languages;
                for (var i in dataLang.languages) {
                    if (dataLang.languages[i].id == lgId) {
                        document.getElementById("languagedrop").innerHTML = dataLang.languages[i].name; //update value in UI
                        return $scope.languageValue = dataLang.languages[i].name;
                    }
                }
            }
        });
    }

    function showAddQuotaData(arr, data, msg) {
        for (var i in arr) {
            arr[i].selected = false;
        }
        for (var i in arr) {
            if(arr[i].id && arr[i].id instanceof Array && arr[i].condditionGroup) {
                arr[i].selected = true;
            }
            for (var j in data) {
                if (arr[i].id == data[j].id) {
                    arr[i].selected = true;
                    arr[i].minimum = data[j].minimum;
                    arr[i].maximum = data[j].maximum;
                    arr[i].number = data[j].number;
                    arr[i].per = data[j].percentage;
                    arr[i].achieved = data[j].achieved;
                    data[j].selected = true;
                    //PD-1130
                    if(_.has(data[j], "hasCensusRepoQuota")) {
                        arr[i].hasCensusRepoQuota = data[j].hasCensusRepoQuota;
                    }
                }
                if (msg == 'gender') {
                    $scope.gndrQuotaFlag.gndrFlxValue = data[j].flexiblePer;
                    if ($scope.gndrQuotaFlag.gndrFlxValue == null || $scope.gndrQuotaFlag.gndrFlxValue == undefined) {
                        $scope.gndrQuotaFlag.gndrFlxValue = 0;
                    }
                }

                if (msg == 'race') {
                    $scope.raceQuotaFlag.raceFlxValue = data[j].flexiblePer;
                    if ($scope.raceQuotaFlag.raceFlxValue == null || $scope.raceQuotaFlag.raceFlxValue == undefined) {
                        $scope.raceQuotaFlag.raceFlxValue = 0;
                    }
                }
                if (msg == 'relation') {
                    $scope.rlnQuotaFlag.rlnFlxValue = data[j].flexiblePer;
                    if ($scope.rlnQuotaFlag.rlnFlxValue == null || $scope.rlnQuotaFlag.rlnFlxValue == undefined) {
                        $scope.rlnQuotaFlag.rlnFlxValue = 0;
                    }
                }
                if(msg == 'children'){
                    $scope.childQuotaFlag.chldFlxValue = data[j].flexiblePer;
                    if ($scope.childQuotaFlag.chldFlxValue == null || $scope.childQuotaFlag.chldFlxValue == undefined) {
                        $scope.childQuotaFlag.chldFlxValue = 0;
                    }
                }
                if (msg == 'emp') {
                    $scope.empQuotaFlag.empFlxValue = data[j].flexiblePer;
                    if ($scope.empQuotaFlag.empFlxValue == null || $scope.empQuotaFlag.empFlxValue == undefined) {
                        $scope.empQuotaFlag.empFlxValue = 0;
                    }
                }
                if (msg == 'edu') {
                    $scope.eduQuotaFlag.eduFlxValue = data[j].flexiblePer;
                    if ($scope.eduQuotaFlag.eduFlxValue == null || $scope.eduQuotaFlag.eduFlxValue == undefined) {
                        $scope.eduQuotaFlag.eduFlxValue = 0;
                    }
                }
                if (msg == 'dvc') {
                    $scope.dvcQuotaFlag.dvcFlxValue = data[j].flexiblePer;
                    if ($scope.dvcQuotaFlag.dvcFlxValue == null || $scope.dvcQuotaFlag.dvcFlxValue == undefined) {
                        $scope.dvcQuotaFlag.dvcFlxValue = 0;
                    }
                }
                if (msg == 'dvsn') {
                    $scope.dvsnQuotaFlag.divisionFlxValue = data[j].flexiblePer;
                    if ($scope.dvsnQuotaFlag.divisionFlxValue == null || $scope.dvsnQuotaFlag.divisionFlxValue == undefined) {
                        $scope.dvsnQuotaFlag.divisionFlxValue = 0;
                    }
                }

                if (msg == 'rgn') {
                    $scope.regQuotaFlag.regionFlxValue = data[j].flexiblePer;
                    if ($scope.regQuotaFlag.regionFlxValue == null || $scope.regQuotaFlag.regionFlxValue == undefined) {
                        $scope.regQuotaFlag.regionFlxValue = 0;
                    }
                }

                if (msg == 'rb') {
                    $scope.rbQuotaFlag.rbFlxValue = data[j].flexiblePer;
                    if ($scope.rbQuotaFlag.rbFlxValue == null || $scope.rbQuotaFlag.rbFlxValue == undefined) {
                        $scope.rbQuotaFlag.rbFlxValue = 0;
                    }
                }

                if (msg == 'hispanic') {
                    $scope.hisQuotaFlag.hispanicFlxValue = data[j].flexiblePer;
                    if ($scope.hisQuotaFlag.hispanicFlxValue == null || $scope.hisQuotaFlag.hispanicFlxValue == undefined) {
                        $scope.hisQuotaFlag.hispanicFlxValue = 0;
                    }
                }

            }
        }

    }
    
    function setRegionForNationalRepresentative() {
        if($scope.completesNeeded){
            var complete = $scope.completesNeeded - $scope.locationData.achieved;
        }
        if($scope.completesNeeded > 0) {
            if($scope.properties.countryCode) {
                var total = 0;
                $scope.sltRegion = [];
                _.each($scope.region, function(item){
                    item.selected= true;

                    var regionObj = {
                        id : item.id,
                        flexible : true,
                        flexiblePer : 10
                    };

                     if($scope.properties.countryCode == 'US') {
                        if (item.id == 'Northeast' || item.name == 'Northeast') {
                            regionObj.percentage = 18;
                        }
                        else if (item.id == 'West' || item.name == 'West') {
                            regionObj.percentage = 23;
                        }
                        else if (item.id == 'South' || item.name == 'South') {
                            regionObj.percentage = 37;
                        }
                        else if (item.id == 'Midwest' || item.name == 'Midwest') {
                            regionObj.percentage = 22;
                        }
                    } else if($scope.properties.countryCode == 'CA') {
                        if (item.id == 1 || item.name == 'Atlantic') {
                            regionObj.percentage = 20;
                        }
                        else if (item.id == 2 || item.name == 'Northern') {
                            regionObj.percentage = 20;
                        }
                        else if (item.id == 3 || item.name == 'Ontario') {
                            regionObj.percentage = 20;
                        }
                        else if (item.id == 4 || item.name == 'Quebec') {
                            regionObj.percentage = 20;
                        }
                        else if (item.id == 5 || item.name == 'Western') {
                            regionObj.percentage = 20;
                        }
                    }

                    regionObj.number = Math.round(complete * (regionObj.percentage/100));
                    regionObj.number = (regionObj.number <= 0 && (parseInt(i)+1) <= complete) ? 1 : regionObj.number;
                    item.number = regionObj.number;

                    total = total + regionObj.number;

                    $scope.quotaNumberChange(item.id ,$scope.region, 0, 'regionSw');

                    //item = $scope.region[i];
                    regionObj.minimum = item.minimum || 0;
                    regionObj.maximum = item.maximum || 0;
                    regionObj.name = item.name;
                    regionObj.hasValidQuotas = true;
                    $scope.sltRegion.push(regionObj);
                });
                if(total < complete) {
                    var remainder = complete - total;

                    $scope.region[0].number = $scope.region[0].number + remainder;
                    $scope.quotaNumberChange($scope.region[0].id, $scope.region, 0, 'regionSw');

                    $scope.sltRegion[0].number = $scope.region[0].number || 0;
                    $scope.sltRegion[0].minimum = $scope.region[0].minimum || 0;
                    $scope.sltRegion[0].maximum = $scope.region[0].maximum || 0;
                }else if(total > complete) {
                    var diff = total - complete;

                    for(var j in $scope.region) {
                        if($scope.region[j].number > diff) {
                            $scope.region[j].number = $scope.region[j].number - diff;
                            $scope.quotaNumberChange($scope.region[j].id, $scope.region, 0, 'regionSw');

                            $scope.sltRegion[j].number = $scope.region[j].number || 0;
                            $scope.sltRegion[j].minimum = $scope.region[j].minimum || 0;
                            $scope.sltRegion[j].maximum = $scope.region[j].maximum || 0;

                            break;
                        }
                    }
                }

                //quota added go flags also updated
                $scope.regQuotaFlag.editRegionFlag = true;
                $scope.regQuotaFlag.hasRegionFlag = true;
                $scope.regQuotaFlag.resetReg = false;
            } else {
                $scope.locationData.selected = false;
                $scope.locationData.type = "";
                notify({
                    message: "Please select country and launguage before setting Nattional quotas..",
                    classes: 'alert-warning',
                    duration: 4000
                });
            }

        } else {
            $scope.locationData.selected = false;
            $scope.locationData.type = "";

            notify({
                message: "Please specify total number of completes before setting Nattional quotas.",
                classes: 'alert-warning',
                duration: 4000
            });
        }
        
    }
    //it is remove because when we change the completes and go to final page directly then it is not update the supplier value  
    /*$scope.gotoFinal = function() {
        if ($scope.goFinalSurvey == true) {
            $state.go('launchsurvey', {
                surveyid: $stateParams.key
            });
        }
    };*/

    $scope.languageBeforeCountry = function () {
        if($scope.lngFlag == false){
            notify({message:"You need to pick a country before you can choose a language",classes:'alert-warning',duration:4000} );
        }
    }

    $scope.completesBeforeQuota = function() {
        $scope.checkDirty = true;
        if ($scope.properties.numberOfCompletes == undefined) {
            notify({
                message: "Please specify total number of completes before setting quotas.",
                classes: 'alert-warning',
                duration: 4000
            });
        }
    };

    /*========Reset Modal on Close
    =============================*/

    $scope.raceResetModal = function(element, race, raceFlxValue) {
        if ($scope.raceQuotaFlag.resetRace == true) {
            for (var i in $scope.race) {
                $scope.race[i].number = '';
                $scope.race[i].per = '';
                $scope.race[i].minimum = '';
                $scope.race[i].maximum = '';
            }
            $scope.quotaTotalRemRace = $scope.completesNeeded;
        }
    };

    $scope.rbResetModal = function(element, raceBera, rbFlxValue) {
        if ($scope.rbQuotaFlag.resetRb == true) {
            _.each($scope.raceBera, function(rb){
                rb.number = '';
                rb.per = '';
                rb.minimum = '';
                rb.maximum = '';
            });
            $scope.quotaTotalRemRace = $scope.completesNeeded;
        }
    };

    $scope.hispanicResetModal = function(element, hispanic, hispanicFlxValue) {
        if ($scope.hisQuotaFlag.resetHisOri == true) {
            _.each($scope.hispanic, function(his){
                his.number = '';
                his.per = '';
                his.minimum = '';
                his.maximum = '';
            });
            $scope.quotaTotalRemRace = $scope.completesNeeded;
        }
    };

    $scope.relationResetModal = function(element, relation, rlnFlxValue) {
        if ($scope.rlnQuotaFlag.resetRel == true) {
            for (var i in $scope.relation) {
                $scope.relation[i].number = '';
                $scope.relation[i].per = '';
                $scope.relation[i].minimum = '';
                $scope.relation[i].maximum = '';
            }
            $scope.quotaTotalRemRace = $scope.completesNeeded;
        }
    };
    $scope.empResetModal = function(element, employement, empFlxValue) {
        if ($scope.empQuotaFlag.resetEmp == true) {
            for (var i in $scope.employement) {
                $scope.employement[i].number = '';
                $scope.employement[i].per = '';
                $scope.employement[i].minimum = '';
                $scope.employement[i].maximum = '';
            }
            $scope.quotaTotalRemRace = $scope.completesNeeded;
        }
    };
    $scope.eduResetModal = function(element, education, eduFlxValue) {
        if ($scope.eduQuotaFlag.resetEdu == true) {
            for (var i in $scope.education) {
                $scope.education[i].number = '';
                $scope.education[i].per = '';
                $scope.education[i].minimum = '';
                $scope.education[i].maximum = '';
            }
            $scope.quotaTotalRemRace = $scope.completesNeeded;
        }
    };
    $scope.genderResetModal = function(element, genderInfo, gndrFlxValue) {
        if ($scope.gndrQuotaFlag.resetGen == true) {
            for (var i in $scope.genderInfo) {
                $scope.genderInfo[i].number = '';
                $scope.genderInfo[i].per = '';
                $scope.genderInfo[i].minimum = '';
                $scope.genderInfo[i].maximum = '';
            }
            $scope.quotaTotalRemRace = $scope.completesNeeded;
        }
    };
    $scope.commonResetModal = function(element, dataArr, resetFlag, totalRem, modalName){
        if(modalName == 'houseHoldIncome' || modalName == 'children' || modalName == 'age'){
            if(resetFlag == true && !$scope.isNested(modalName)) {
                if (dataArr[0] == undefined) {
                    // Do Nothing
                } else {
                    dataArr = [];
                    totalRem = $scope.completesNeeded;
                }
            }
        }else{
            if(resetFlag == true) {
                _.each(dataArr, function(item){
                    if(!item.hasCensusRepoQuota) {
                        item.number = '';
                        item.per = '';
                        item.minimum = '';
                        item.maximum = '';
                    }
                });
                totalRem = $scope.completesNeeded;
                if(modalName == 'regions' || modalName == 'divisions'){
                    $scope.currLocQuotaFielded = 0;
                }
            }
        }
    }
    $scope.childResetModal = function(element, chldTempArr, chldFlxValue) {
        if ($scope.childQuotaFlag.resetChild == true && !$scope.isNested('children')) {
            if(Object.keys($scope.chldTempArr).length == 0) {
                // Do Nothing
            } else {
                //clear no-children Quota
                $scope.chldTempArr.no[0]['flexPer'] = 0;
                $scope.chldTempArr.no[0]['minimum'] = '';
                $scope.chldTempArr.no[0]['maximum'] = '';
                $scope.chldTempArr.no[0]['number'] = '';
                $scope.chldTempArr.no[0]['per'] = '';
                $scope.chldTempArr.no[0]['percentage'] = '';
                //clear have-children Quota
               
                $scope.chldTotalRemRace = $scope.completesNeeded;
                _.each($scope.chldTempArr.have, function(item, index){
                    if(index != 0){
                        $scope.chldTempArr.have.splice(index, 1);
                    }else{
                        $scope.chldTempArr.have[0]['number'] = '';
                        $scope.chldTempArr.have[0]['minimum'] = '';
                        $scope.chldTempArr.have[0]['maximum'] = '';
                        $scope.chldTempArr.have[0]['min'] = '';
                        $scope.chldTempArr.have[0]['max'] = '';
                        $scope.chldTempArr.have[0]['per'] = '';
                        $scope.chldTempArr.have[0]['gender'] = '';
                        $scope.chldTempArr.have[0]['percentage'] = '';
                    }
                });
            }
        }
    }
    $scope.ageResetModal = function (element, ageTempArr, ageFlxValue) {
        if ($scope.ageQuotaFlag.resetAge == true && !$scope.isNested('age')) {
            if ($scope.ageTempArr[0] == undefined) {
                // Do Nothing
            } else {
                $scope.ageTempArr = [];
                $scope.ageTotalRemRace = $scope.completesNeeded;
            }
        }
    };

    $scope.incomeResetModal = function (element, incomeTempArr, incomeFlxValue) {
        if ($scope.incomeQuotaFlag.resetInc == true && !$scope.isNested('houseHoldIncome')) {
            if ($scope.incomeTempArr[0] == undefined) {
                // Do Nothing
            } else {
                $scope.incomeTempArr = [];
                $scope.incomeTotalRemRace = $scope.completesNeeded;
            }
        }
    };


    $scope.deviceResetModal = function(element, deviceInfo, dvcFlxValue) {
        if ($scope.dvcQuotaFlag.resetDev == true) {
            for (var i in $scope.genderInfo) {
                $scope.deviceInfo[i].number = '';
                $scope.deviceInfo[i].per = '';
                $scope.deviceInfo[i].minimum = '';
                $scope.deviceInfo[i].maximum = '';
            }
            $scope.quotaTotalRemRace = $scope.completesNeeded;
        }
    };

    $scope.regionResetModal = function(element, region, regionFlxValue) {
        if ($scope.regQuotaFlag.resetReg == true) {
            for (var i in $scope.region) {
                $scope.region[i].number = '';
                $scope.region[i].per = '';
                $scope.region[i].minimum = '';
                $scope.region[i].maximum = '';
            }
            $scope.quotaTotalRemRace = $scope.completesNeeded;
            $scope.currLocQuotaFielded = 0;
        }
    };

    $scope.divisionResetModal = function(element, division, divisionFlxValue) {
        if ($scope.dvsnQuotaFlag.resetDivi == true) {
            for (var i in $scope.division) {
                $scope.division[i].number = '';
                $scope.division[i].per = '';
                $scope.division[i].minimum = '';
                $scope.division[i].maximum = '';
            }
            $scope.quotaTotalRemRace = $scope.completesNeeded;
            $scope.currLocQuotaFielded = 0;
        }
    };
    //reset state quotas
    $scope.stateQuotaResetModal = function() {
        if ($scope.resetStateQuotas == true) {
            for (var i in $scope.selectedStates) {
                delete $scope.selectedStates[i].number;
                delete $scope.selectedStates[i].percentage;
                delete $scope.selectedStates[i].per;
                delete $scope.selectedStates[i].minimum;
                delete $scope.selectedStates[i].maximum;
                delete $scope.selectedStates[i].flexiblePer;
                delete $scope.selectedStates[i].hasValidQuotas;
            }
            $scope.stateFlexibility.isFlexible = true;
            $scope.stateFlexibility.flxValue = 0;
            $scope.quotaTotalRemRace = $scope.completesNeeded;

            $scope.editStateFlag = false;
            $scope.hasStateFlag = false;
            //PD-1402
            if($scope.isGrouped('states')) {
                $scope.groupingStateModel = [];
            }
            removeGroupingOnResetQuota("states");
        }
    };

    //reset DMA quotas
    $scope.dmaQuotaResetModal = function() {
        if ($scope.resetDMAQuotas == true) {
            for (var i in $scope.selectedDMAs) {
                delete $scope.selectedDMAs[i].number;
                delete $scope.selectedDMAs[i].percentage;
                delete $scope.selectedDMAs[i].per;
                delete $scope.selectedDMAs[i].minimum;
                delete $scope.selectedDMAs[i].maximum;
                delete $scope.selectedDMAs[i].flexiblePer;
                delete $scope.selectedDMAs[i].hasValidQuotas;
            }
            $scope.dmaFlexibility.isFlexible = true;
            $scope.dmaFlexibility.flxValue = 0;
            $scope.quotaTotalRemRace = $scope.completesNeeded;

            $scope.editDMAFlag = false;
            $scope.hasDMAFlag = false;
            $scope.currLocQuotaFielded = 0;
            //PD-1402
            if($scope.isGrouped('dma')) {
                $scope.groupingDmaModel = [];
            }
            removeGroupingOnResetQuota("dma");
        }
    };

    //reset CSA quotas
    $scope.csaQuotaResetModal = function() {
        if ($scope.resetCSAQuotas == true) {
            for (var i in $scope.selectedCSAs) {
                delete $scope.selectedCSAs[i].number;
                delete $scope.selectedCSAs[i].percentage;
                delete $scope.selectedCSAs[i].per;
                delete $scope.selectedCSAs[i].minimum;
                delete $scope.selectedCSAs[i].maximum;
                delete $scope.selectedCSAs[i].flexiblePer;
                delete $scope.selectedCSAs[i].hasValidQuotas;
            }
            $scope.csaFlexibility.isFlexible = true;
            $scope.csaFlexibility.flxValue = 0;
            $scope.quotaTotalRemRace = $scope.completesNeeded;

            $scope.editCSAFlag = false;
            $scope.hasCSAFlag = false;
            $scope.currLocQuotaFielded = 0;
            //PD-1402
            if($scope.isGrouped('csa')) {
                $scope.groupingCsaModel = [];
            }
            removeGroupingOnResetQuota("csa");
        }
    };

    //reset MSA quotas 
    $scope.msaQuotaResetModal = function() {
        if ($scope.resetMSAQuotas == true) {
            for (var i in $scope.selectedMSAs) {
                delete $scope.selectedMSAs[i].number;
                delete $scope.selectedMSAs[i].percentage;
                delete $scope.selectedMSAs[i].per;
                delete $scope.selectedMSAs[i].minimum;
                delete $scope.selectedMSAs[i].maximum;
                delete $scope.selectedMSAs[i].flexiblePer;
                delete $scope.selectedMSAs[i].hasValidQuotas;
            }
            $scope.msaFlexibility.isFlexible = true;
            $scope.msaFlexibility.flxValue = 0;
            $scope.quotaTotalRemRace = $scope.completesNeeded;

            $scope.editMSAFlag = false;
            $scope.hasMSAFlag = false;
            $scope.currLocQuotaFielded = 0;
            //PD-1402
            if($scope.isGrouped('msa')) {
                $scope.groupingMsaModel = [];
            }
            
            removeGroupingOnResetQuota("msa");
        }
    };

    //reset county quotas
    $scope.countyQuotaResetModal = function() {
        if ($scope.resetCountyQuotas == true) {
            for (var i in $scope.selectedCountys) {
                delete $scope.selectedCountys[i].number;
                delete $scope.selectedCountys[i].percentage;
                delete $scope.selectedCountys[i].per;
                delete $scope.selectedCountys[i].minimum;
                delete $scope.selectedCountys[i].maximum;
                delete $scope.selectedCountys[i].flexiblePer;
                delete $scope.selectedCountys[i].hasValidQuotas;
            }
            $scope.countyFlexibility.isFlexible = true;
            $scope.countyFlexibility.flxValue = 0;
            $scope.quotaTotalRemRace = $scope.completesNeeded;

            $scope.editCountyFlag = false;
            $scope.hasCountyFlag = false;
            $scope.currLocQuotaFielded = 0;
            //PD-1402
            if($scope.isGrouped('county')) {
                $scope.groupingCountyModel = [];
            }
            removeGroupingOnResetQuota("county");
        }
    };

    /*=========================
    Reset Modal on Close=======*/
    //PD-1303
    $scope.tabbing = function(event, previd, nextid) {
        if (event.shiftKey && event.which == 0) {
            var element = $window.document.getElementById(previd);
        } else if (event.which == 0 || event.which == 9) {
            var element = $window.document.getElementById(nextid);
        }

        if (element)
            element.focus();

    };

    $scope.chldNeedOption = "don't";
    $scope.changeChldNeed = function(option) {
        $scope.chldNeedOption = option;
    };

    /*-----For Closing Live Survey Editing Window-----*/
    $scope.closeManage = function(key){
        $state.go('editSurvey', {key: key});
    };

    //source arrays for state, csa, msa and county autocompletes
    $scope.stateList = [];
    $scope.csaList = [];
    $scope.msaList = [];
    $scope.countyList = [];
    $scope.dmaList = [];

    $scope.clearFields = function() {
        for (var i in $scope.race) {
            $scope.race[i].number = '';
            $scope.race[i].per = '';
            $scope.race[i].minimum = '';
            $scope.race[i].maximum = '';
        }
        for (var i in $scope.relation) {
            $scope.relation[i].number = '';
            $scope.relation[i].per = '';
            $scope.relation[i].minimum = '';
            $scope.relation[i].maximum = '';
        }
        for (var i in $scope.employement) {
            $scope.employement[i].number = '';
            $scope.employement[i].per = '';
            $scope.employement[i].minimum = '';
            $scope.employement[i].maximum = '';
        }
        for (var i in $scope.education) {
            $scope.education[i].number = '';
            $scope.education[i].per = '';
            $scope.education[i].minimum = '';
            $scope.education[i].maximum = '';
        }
        for (var i in $scope.genderInfo) {
            $scope.genderInfo[i].number = '';
            $scope.genderInfo[i].per = '';
            $scope.genderInfo[i].minimum = '';
            $scope.genderInfo[i].maximum = '';
        }
        for (var i in $scope.deviceInfo) {
            $scope.deviceInfo[i].number = '';
            $scope.deviceInfo[i].per = '';
            $scope.deviceInfo[i].minimum = '';
            $scope.deviceInfo[i].maximum = '';
        }
        for (var i in $scope.division) {
            $scope.division[i].number = '';
            $scope.division[i].per = '';
            $scope.division[i].minimum = '';
            $scope.division[i].maximum = '';
        }
    }

    $rootScope.$on("CallMethod", function(){
        $scope.clearFields();
    });

    //for state tab
    $scope.statename = {name: "", id: ""};
    $scope.selectedStates = new Array();
    $scope.stateFlexibility = {
        isFlexible: true,
        flxValue: 0
    };

    //PD-321
    var setSelectedStateData = function(state) {
        var matched = $scope.selectedStates.filter(function(item) {
            return (item.id === state.id)
        });
        if(matched.length === 0){
            state.selected = true;
            $scope.selectedStates.push(state); 
        } 
        
        //clear after selection
        $scope.stateList = [];
        $scope.csaList = [];
        $scope.msaList = [];
        $scope.countyList = [];
        $scope.dmaList = [];
        $scope.statename = {name: "", id: ""};
    };

    //on state selected
    $scope.onStateSelected = function (state) {
        if($scope.hasStateFlag){
            if(confirm('Adding or Removing a qualification will affect the current quotas. Would you like to continue?')){
                _.each($scope.selectedStates, function(item){
                    delete item.number;
                    delete item.percentage;
                    delete item.per;
                    delete item.minimum;
                    delete item.maximum;
                    delete item.flexiblePer;
                    delete item.hasValidQuotas;
                    delete item.percent;
                });
                $scope.editStateFlag = false;
                $scope.hasStateFlag = false;
                $scope.resetStateQuotas = true;
                //check location
                if($scope.locationData.selected) {
                    if($scope.locationData.type != "state") {
                        //warn and wait
                        $timeout(function() {
                            angular.element('#clrmodel').trigger('click');
                            $scope.locationData.currentClickItem = "state";
                            $scope.locationData.currItem = state;
                        },0);
                    }else {
                        setSelectedStateData(state);
                    }
                }else {
                    //set location flags
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "state";
                    setSelectedStateData(state);
                }
            }
        }else{
            //check location
            if($scope.locationData.selected) {
                if($scope.locationData.type != "state") {
                    //warn and wait
                    $timeout(function() {
                        angular.element('#clrmodel').trigger('click');
                        $scope.locationData.currentClickItem = "state";
                        $scope.locationData.currItem = state;
                    },0);
                }else {
                    setSelectedStateData(state);
                }
            }else {
                //set location flags
                $scope.locationData.selected = true;
                $scope.locationData.type = "state";
                setSelectedStateData(state);
            }
        }
    };

    //remove Single Qualification State, Dma, Csa, County, Msa from selected list
    $scope.removeLocation = function (location, index) {
        switch(location){
            case "state":
                if($scope.hasStateFlag){
                    if(confirm('Adding or Removing a qualification will affect the current quotas. Would you like to continue?')){
                        _.each($scope.selectedStates, function(item){
                            delete item.percentage;
                            delete item.per;
                            delete item.percent;
                            delete item.maximum;
                            delete item.minimum;
                            delete item.number;
                        });
                        $scope.editStateFlag = false;
                        $scope.hasStateFlag = false;
                        $scope.resetStateQuotas = true;
                        $scope.selectedStates.splice(index, 1);
                    }
                }else{
                    $scope.selectedStates.splice(index, 1);
                }
                break;
            case "dma":
                if($scope.hasDMAFlag){
                    if(confirm('Adding or Removing a qualification will affect the current quotas. Would you like to continue?')){
                        _.each($scope.selectedDMAs, function(item){
                            delete item.percentage;
                            delete item.per;
                            delete item.percent;
                            delete item.maximum;
                            delete item.minimum;
                            delete item.number;
                        });
                        $scope.editDMAFlag = false;
                        $scope.hasDMAFlag = false;
                        $scope.resetDMAQuotas = true;
                        $scope.selectedDMAs.splice(index, 1);
                    }
                }else{
                    $scope.selectedDMAs.splice(index, 1);
                }
                break;
            case "csa":
                if($scope.hasCSAFlag){
                    if(confirm('Adding or Removing a qualification will affect the current quotas. Would you like to continue?')){
                        _.each($scope.selectedCSAs, function(item){
                            delete item.percentage;
                            delete item.per;
                            delete item.percent;
                            delete item.maximum;
                            delete item.minimum;
                            delete item.number;
                        });
                        $scope.selectedCSAs.splice(index, 1);
                        $scope.editCSAFlag = false;
                        $scope.hasCSAFlag = false;
                        $scope.resetCSAQuotas = true;
                    }
                }else{
                    $scope.selectedCSAs.splice(index, 1);
                }
                break;
            case "msa":
                if($scope.hasMSAFlag){
                    if(confirm('Adding or Removing a qualification will affect the current quotas. Would you like to continue?')){
                        _.each($scope.selectedMSAs, function(item){
                            delete item.percentage;
                            delete item.per;
                            delete item.percent;
                            delete item.maximum;
                            delete item.minimum;
                            delete item.number;
                        });
                        $scope.editMSAFlag = false;
                        $scope.hasMSAFlag = false;
                        $scope.resetMSAQuotas = true;
                        $scope.selectedMSAs.splice(index, 1);
                    }
                }else{
                    $scope.selectedMSAs.splice(index, 1);
                }
                break;
            case "county":
                if($scope.hasCountyFlag){
                    if(confirm('Adding or Removing a qualification will affect the current quotas. Would you like to continue?')){
                        _.each($scope.selectedCountys, function(item){
                            delete item.percentage;
                            delete item.per;
                            delete item.percent;
                            delete item.maximum;
                            delete item.minimum;
                            delete item.number;
                        });
                        $scope.editCountyFlag = false;
                        $scope.hasCountyFlag = false;
                        $scope.resetCountyQuotas = true;
                        $scope.selectedCountys.splice(index, 1);
                    }
                }else{
                    $scope.selectedCountys.splice(index, 1);
                }
                break;
        }
    };

    //for dma tab
    $scope.selectedDMAName = "";
    $scope.selectedDMAs = [];
    $scope.dmaFlexibility = {
        isFlexible: true,
        flxValue: 0
    };

    $scope.selectionDMA = true;
    $scope.resetDMAQuotas = true;

    //PD-321
    var setSelectedDmaData = function(dma) {
        var matched = $scope.selectedDMAs.filter(function(item) {
            return (item.id === dma.id)
        });
        if(matched.length === 0){
            dma.selected = true;
            $scope.selectedDMAs.push(dma); 
        } 
        
        //clear after selection
        $scope.stateList = [];
        $scope.csaList = [];
        $scope.msaList = [];
        $scope.countyList = [];
        $scope.dmaList = [];
        $scope.selectedDMAName = "";
    };

    //on dma selected
    $scope.onDMASelected = function (dma) {
        if($scope.hasDMAFlag){
            if(confirm('Adding or Removing a qualification will affect the current quotas. Would you like to continue?')){
                _.each($scope.selectedDMAs, function(item){
                    delete item.number;
                    delete item.percentage;
                    delete item.per;
                    delete item.minimum;
                    delete item.maximum;
                    delete item.flexiblePer;
                    delete item.hasValidQuotas;
                    delete item.percent;
                });
                $scope.editDMAFlag = false;
                $scope.hasDMAFlag = false;
                $scope.resetDMAQuotas = true;
                //check location
                if($scope.locationData.selected) {
                    if($scope.locationData.type != "dma") {
                        //warn and wait
                        $timeout(function() {
                            angular.element('#clrmodel').trigger('click');
                            $scope.locationData.currentClickItem = "dma";
                            $scope.locationData.currItem = dma;
                        },0);
                    }else {
                        setSelectedDmaData(dma);
                    }
                }else{
                    //set location flags
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "dma";
                    setSelectedDmaData(dma);
                }
            }
        }else{
            //check location
            if($scope.locationData.selected) {
                if($scope.locationData.type != "dma") {
                    //warn and wait
                    $timeout(function() {
                        angular.element('#clrmodel').trigger('click');
                        $scope.locationData.currentClickItem = "dma";
                        $scope.locationData.currItem = dma;
                    },0);
                }else {
                    setSelectedDmaData(dma);
                }
            }else{
                //set location flags
                $scope.locationData.selected = true;
                $scope.locationData.type = "dma";
                setSelectedDmaData(dma);
            }
        }
        
    };

    
    //dma tab end

    //for csa tab
    $scope.selectedCSAName = "";
    $scope.selectedCSAs = [];
    $scope.csaFlexibility = {
        isFlexible: true,
        flxValue: 0
    };

    $scope.selectionCSA = true;
    $scope.resetCSAQuotas = true;

    //PD-321
    var setSelectedCsaData = function(csa) {
        var matched = $scope.selectedCSAs.filter(function(item) {
            return (item.id === csa.id)
        });
        if(matched.length === 0){
            csa.selected = true;
            $scope.selectedCSAs.push(csa); 
        } 

        //clear after selection
        $scope.stateList = [];
        $scope.csaList = [];
        $scope.msaList = [];
        $scope.countyList = [];
        $scope.dmaList = [];
        $scope.selectedCSAName = "";
    };

    //on csa selected
    $scope.onCSASelected = function (csa) {
        if($scope.hasCSAFlag){
            if(confirm('Adding or Removing a qualification will affect the current quotas. Would you like to continue?')){
                _.each($scope.selectedCSAs, function(item){
                    delete item.number;
                    delete item.percentage;
                    delete item.per;
                    delete item.minimum;
                    delete item.maximum;
                    delete item.flexiblePer;
                    delete item.hasValidQuotas;
                    delete item.percent;
                });
                $scope.editCSAFlag = false;
                $scope.hasCSAFlag = false;
                $scope.resetCSAQuotas = true;
                //check location
                if($scope.locationData.selected) {
                    if($scope.locationData.type != "csa") {
                        //warn and wait
                        $timeout(function() {
                            angular.element('#clrmodel').trigger('click');
                            $scope.locationData.currentClickItem = "csa";
                            $scope.locationData.currItem = csa;
                        },0);

                    }else {
                        setSelectedCsaData(csa);
                    }
                }else {
                    //set location flags
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "csa";

                    setSelectedCsaData(csa);
                }
            }
        }else{
            //check location
            if($scope.locationData.selected) {
                if($scope.locationData.type != "csa") {
                    //warn and wait
                    $timeout(function() {
                        angular.element('#clrmodel').trigger('click');
                        $scope.locationData.currentClickItem = "csa";
                        $scope.locationData.currItem = csa;
                    },0);

                }else {
                    setSelectedCsaData(csa);
                }
            }else {
                //set location flags
                $scope.locationData.selected = true;
                $scope.locationData.type = "csa";

                setSelectedCsaData(csa);
            }
        }
    };
    //csa tab end

    //for msa tab
    $scope.selectedMSAName = "";
    $scope.selectedMSAs = [];
    $scope.msaFlexibility = {
        isFlexible: true,
        flxValue: 0
    };

    $scope.selectionMSA = true;
    $scope.resetMSAQuotas = true;

    //PD-321
    var setSelectedMsaData = function(msa) {
        var matched = $scope.selectedMSAs.filter(function(item) {
            return (item.id === msa.id)
        });
        if(matched.length === 0){
            msa.selected = true;
            $scope.selectedMSAs.push(msa); 
        } 
        
        //clear after selection
        $scope.stateList = [];
        $scope.csaList = [];
        $scope.msaList = [];
        $scope.countyList = [];
        $scope.dmaList = [];
        $scope.selectedMSAName = "";
    };

    //on msa selected
    $scope.onMSASelected = function (msa) {
        if($scope.hasMSAFlag){
            if(confirm('Adding or Removing a qualification will affect the current quotas. Would you like to continue?')){
                _.each($scope.selectedMSAs, function(item){
                    delete item.number;
                    delete item.percentage;
                    delete item.per;
                    delete item.minimum;
                    delete item.maximum;
                    delete item.flexiblePer;
                    delete item.hasValidQuotas;
                    delete item.percent;
                });
                $scope.editMSAFlag = false;
                $scope.hasMSAFlag = false;
                $scope.resetMSAQuotas = true;
                //check location
                if($scope.locationData.selected) {
                    if($scope.locationData.type != "msa") {
                        //warn and wait
                        $timeout(function() {
                            angular.element('#clrmodel').trigger('click');
                            $scope.locationData.currentClickItem = "msa";
                            $scope.locationData.currItem = msa;
                        },0);
                    }else {
                        setSelectedMsaData(msa);
                    }
                }else {
                    //set location flags
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "msa";
                    setSelectedMsaData(msa);
                }
            }
        }else{
            //check location
            if($scope.locationData.selected) {
                if($scope.locationData.type != "msa") {
                    //warn and wait
                    $timeout(function() {
                        angular.element('#clrmodel').trigger('click');
                        $scope.locationData.currentClickItem = "msa";
                        $scope.locationData.currItem = msa;
                    },0);

                }else {
                    setSelectedMsaData(msa);
                }
            }else {
                //set location flags
                $scope.locationData.selected = true;
                $scope.locationData.type = "msa";

                setSelectedMsaData(msa);
            }
        }
    };

    //for county tab
    $scope.selectedCountyName = "";
    $scope.selectedCountys = [];
    $scope.countyFlexibility = {
        isFlexible: true,
        flxValue: 0
    };

    $scope.selectionCounty = true;
    $scope.resetCountyQuotas = true;

    //PD-321
    var setSelectedCountyData = function(county) {
        var matched = $scope.selectedCountys.filter(function(item) {
            return (item.id === county.id)
        });
        if(matched.length === 0){
            county.selected = true;
            $scope.selectedCountys.push(county); 
        } 
        //clear after selection
        $scope.stateList = [];
        $scope.csaList = [];
        $scope.msaList = [];
        $scope.countyList = [];
        $scope.dmaList = [];
        $scope.selectedCountyName = "";
    };

    //on county selected
    $scope.onCountySelected = function (county) {
        if($scope.hasCountyFlag){
            if(confirm('Adding or Removing a qualification will affect the current quotas. Would you like to continue?')){
                _.each($scope.selectedCountys, function(item){
                    delete item.number;
                    delete item.percentage;
                    delete item.per;
                    delete item.minimum;
                    delete item.maximum;
                    delete item.flexiblePer;
                    delete item.hasValidQuotas;
                    delete item.percent;
                });
                $scope.editCountyFlag = false;
                $scope.hasCountyFlag = false;
                $scope.resetCountyQuotas = true;
                //check location
                if($scope.locationData.selected) {
                    if($scope.locationData.type != "county") {
                        //warn and wait
                        $timeout(function() {
                            angular.element('#clrmodel').trigger('click');
                            $scope.locationData.currentClickItem = "county";
                            $scope.locationData.currItem = county;
                        },0);
                    }else {
                        setSelectedCountyData(county);
                    }
                }else {
                    //set location flags
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "county";
                    setSelectedCountyData(county);
                }
            }
        }else{
            //check location
            if($scope.locationData.selected) {
                if($scope.locationData.type != "county") {
                    //warn and wait
                    $timeout(function() {
                        angular.element('#clrmodel').trigger('click');
                        $scope.locationData.currentClickItem = "county";
                        $scope.locationData.currItem = county;
                    },0);
                }else {
                    setSelectedCountyData(county);
                }
            }else {
                //set location flags
                $scope.locationData.selected = true;
                $scope.locationData.type = "county";
                setSelectedCountyData(county);
            }
        }
        

    };

    $scope.clearDataFunc = function() {
        $state.reload();
    }

    //for Zipcode tab
    //$scope.selectedZipcodeName = "";
    $scope.selectedZipcodes = [];
    $scope.zipCodeQuotaManage = [];
    $scope.zipcodeQuotaFlg = {
        editZipcodeFlag: false,
        addZipQuotaFlg: false,
        resetZipQuotaFlg: true
    }
    
    $scope.zipcodeFlexibility = {
        isFlexible: true,
        flxValue: 0
    };

    $scope.selectionZipcode = true;
    $scope.resetZipcodeQuotas = true;

    var setSelectedZipData = function(file) {
        $scope.showLoader = 'DataLoading';
        if(file != null && file != undefined && file.name && (file.name.indexOf('.csv') > 0 || file.name.indexOf('.xlsx') > 0 || file.name.indexOf('.xls')) > 0) {
            //call the upload method of the lib
            createSurvey.uploadZipcodesFile($scope.properties.countryCode, file).then(
                function(response) {
                    /*$scope.location.zipcode.values = response.data.validZipcodes;
                    $scope.selectedZipcodes = response.data.validZipcodes;*/
                    //zipcodesDataArr = response.data.validZipcodes;
                    zipcodeFilePath = response.data.zipcodeFilePath;
                    $scope.showLoader = "";
                    //Grouped Zipcode
                             
                    $scope.selectedZipcodes = [];
                    $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
                    if(_.keys(response.data.zipcodes.groupedZipCodes).length > 0) {
                        _.each(response.data.zipcodes.groupedZipCodes, function(val, key) {
                            var tempObject = {
                                flexible:true,
                                flexiblePer:0,
                                hasValidQuotas:false,
                                maximum: "",
                                minimum: "",
                                name: key,
                                number: "",
                                percentage: "",
                                selected:true
                            }
                            $scope.selectedZipcodes.push(tempObject);
                        })
                        $scope.zipcodeQuotaFlg.addZipQuotaFlg = true;
                        angular.copy($scope.selectedZipcodes, $scope.zipCodeQuotaManage)
                    }

                    //notif messages
                    //if all are correct
                    if(response.data.zipcodes.validZipcodes.length > 0 && response.data.zipcodes.duplicateZipcodes == 0 && response.data.zipcodes.modifiedZipcodes == 0 && response.data.zipcodes.incorrectZipcodes == 0) {
                        notify({
                            message: response.data.zipcodes.totalZipcodes +" out of " +  response.data.zipcodes.totalZipcodes + " zipcodes successfully uploaded",
                            classes: 'alert-success',
                            duration: 5000
                        });
                    }

                    //if not all correct but some modifications made and no duplicate and no incorrect
                    if(response.data.zipcodes.validZipcodes.length > 0 && response.data.zipcodes.modifiedZipcodes != 0 && response.data.zipcodes.incorrectZipcodes == 0 && response.data.zipcodes.duplicateZipcodes == 0) {
                        notify({
                            message: response.data.zipcodes.totalZipcodes +" out of " +  response.data.zipcodes.totalZipcodes + " zipcodes successfully uploaded. Some Lines Were Modified Because They Were Only 4 or 3 Digits Long",
                            classes: 'alert-success',
                            duration: 5000
                        });
                    }

                    //if not all valid and some zipcodes are skipped, incorrect zipcodes and duplicates
                    if(response.data.zipcodes.validZipcodes.length > 0 && response.data.zipcodes.incorrectZipcodes != 0 || response.data.zipcodes.duplicateZipcodes != 0) {
                        if(response.data.zipcodes.incorrectZipcodes != 0) {
                            notify({
                                message: response.data.zipcodes.validZipcodes.length +" out of " +  response.data.zipcodes.totalZipcodes + " zipcodes successfully uploaded. " + response.data.zipcodes.incorrectZipcodes +" incorrect zipcode(s) skipped",
                                classes: 'alert-success',
                                duration: 5000
                            });
                        } else{
                            notify({
                                message: response.data.zipcodes.validZipcodes.length +" out of " +  response.data.zipcodes.totalZipcodes + " zipcodes successfully uploaded." + response.data.zipcodes.duplicateZipcodes + " duplicate zipcodes skipped",
                                classes: 'alert-success',
                                duration: 5000
                            });
                        }
                    }

                    //no zipcodes found
                    if(response.data.zipcodes.validZipcodes.length == 0) {
                        notify({
                            message: "Your Upload Failed. Please Check Your File And Try Again",
                            classes: 'alert-danger',
                            duration: 5000
                        });
                    }  
                },
                function(error) {
                    $scope.showLoader = "";
                    notify({
                        message: error.data.msg,
                        classes: 'alert-danger',
                        duration: 5000
                    });
            });
        }else {
            $scope.showLoader = "";
            notify({
                message: "Your Upload Failed. Please Check Your File And Try Again",
                classes: 'alert-danger',
                duration: 5000
            });
        }
    };

    //zipcode upload
    $scope.uploadZipcodes = function(file, event) {
        //check for location
        if (file && file.name != null && file.name !="") {
            var validExts = new Array(".xlsx", ".xls", ".csv");
            var fileExt = file.name;
            fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
            if (validExts.indexOf(fileExt) < 0) {
                notify({
                        message: "Only csv, xlsx, xls files are valid. Please upload a valid file.",
                        classes: 'alert-danger',
                        duration: 5000
                    });
                return false;
            }
          } 
        if($scope.locationData.selected) {
            //check already zip or not
            if($scope.locationData.type != "zip" && file != null) {
                $timeout(function() {
                    $scope.locationData.currentClickItem = "zip";
                    $scope.locationData.currItem = file;
                    angular.element('#clrmodel').trigger('click');
                    angular.element('#clickOkModel').trigger('click');
                    $scope.locationData.currItem = file;
                    setSelectedZipData(file);
                    event.preventDefault();
                },0);
            }else if(file != null && file != undefined && file != ""){
                $scope.locationData.selected = true;
                $scope.locationData.type = "zip";
                $scope.locationData.currentClickItem = "zip";
                setSelectedZipData(file);
            } 
        }else {
            //set location flags
            if(file != null && file != undefined && file != "") {
                $scope.locationData.selected = true;
                $scope.locationData.type = "zip";
                $scope.locationData.currentClickItem = "zip";
                setSelectedZipData(file); 
            }
        }
    }; 

   //clear zipcodes
    $scope.clearZipcodes = function() {
        zipcodesDataArr = [];
        zipcodeFilePath = "";
        $scope.selectedZipcodes = [];
        $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
        $scope.locationData.selected = false;
        $scope.locationData.type = "";
        notify({
            message: "zipcodes cleared successfully",
            classes: 'alert-success',
            duration: 2000
        });
    };

    //view latest upload zipcodes
    $scope.viewLatestZipcodes = function() {
        //Cleaning the p tag before appending zipcode data
        var myEl = angular.element( document.querySelector( '#view-zipcodes' ) );
        myEl.empty();

        if(zipcodeFilePath != undefined && zipcodeFilePath != null && zipcodeFilePath != "") {

            var file = {
                filePath: zipcodeFilePath
            };
            //read zipcodes from the path in the file
            createSurvey.viewLatestUploadZip(file, $scope.properties.countryCode).then(
                function(response) {
                    //show zipcodes in regular js way
                    // not use $scope 
                    //because lots of data in return in the response will crash $scope 
                    var divel = document.getElementById('view-zipcodes');
                    divel.appendChild(document.createTextNode(response.data.zipcodesArr));
                },
                function(error) {
                    notify({
                        message: "error getting zipcodes",
                        classes: 'alert-success',
                        duration: 2000
                    });
                });
        }else {
            notify({
                message: "No zipcodes uploaded.",
                classes: 'alert-success',
                duration: 2000
            });
        }
    };

    $scope.addZipcodeQuota = function() {
        _.each($scope.selectedZipcodes, function(zipQuota){
            if(zipQuota.number != undefined && zipQuota.number != null && zipQuota.number != "") {
                zipQuota.flexiblePer = $scope.zipcodeFlexibility.flxValue;
                zipQuota.flexible = $scope.zipcodeFlexibility.isFlexible;
                zipQuota.hasValidQuotas = true;
    
                var zipMasterData = _.findWhere(masterData, {"masterKey" : "zipcodes"});
                zipQuota["qual_id"] = zipMasterData.id;
                zipQuota["qual_name"] = zipMasterData.masterKey;
            }
        });
        var originalCloneDate  = new Array();
        angular.copy($scope.selectedZipcodes, originalCloneDate);
        _.each(originalCloneDate, function(zipQuota){
            if(_.has(zipQuota, "number") && (zipQuota.number == "" || zipQuota.number == null || zipQuota.number == 0 || zipQuota.number == undefined)) {
                var getObjectOfZip = _.findWhere($scope.selectedZipcodes, {name: zipQuota.name});
                if(getObjectOfZip) {
                    var getDelIndex = _.indexOf($scope.selectedZipcodes, getObjectOfZip);
                    if(getDelIndex > -1) {
                        $scope.selectedZipcodes.splice(getDelIndex, 1);
                    }
                }
            }
        })
    
        $scope.zipcodeQuotaFlg.editZipcodeFlag = true;
        $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
        $scope.zipcodeQuotaFlg.resetZipQuotaFlg = false;
        notify({
            message: 'Quotas applied',
            classes: 'alert-success',
            duration: 2000
        });
        console.log('$scope.selectedZipcodes ',JSON.stringify($scope.selectedZipcodes));
    }

    $scope.zipcodeQuotaResetModal = function(resetZipQuotaFlg) {
        if(resetZipQuotaFlg) {
            _.each($scope.selectedZipcodes, function(zipGroup) {
                zipGroup.number = "";
                zipGroup.percentage = "";
                zipGroup.minimum = "";
                zipGroup.maximum = "";
                zipGroup.per = "";
                zipGroup.totalRem = "";
            })
            angular.copy($scope.zipCodeQuotaManage, $scope.selectedZipcodes);
            $scope.zipcodeQuotaFlg.editZipcodeFlag = false;
            $scope.zipcodeQuotaFlg.resetZipQuotaFlg = true;
            $scope.zipcodeQuotaFlg.addZipQuotaFlg = true;
        }
         console.log("clear Zip Quota", $scope.selectedZipcodes)
    }
   
    //national representative selected
    $scope.nationalRepSelected = false;

    //national representative
    $scope.setNationalRep = function() {
        console.log('$scope.locationData ',JSON.stringify($scope.locationData));
        if($scope.locationData.selected) {
            if($scope.locationData.type == "natrep") {
                notify({
                    message: "National Representative is already applied",
                    classes: 'alert-warning',
                    duration: 2000
                });
            }else {
                $timeout(function() {
                    angular.element('#clrmodel').trigger('click');
                    $scope.locationData.currentClickItem = "natrep";
                },0);
            }  
        }else {

            if($scope.completesNeeded > 0) {

                $scope.locationData.type = "natrep";
                $scope.locationData.selected = true;
                //call fun to set nat rep
                setRegionForNationalRepresentative();

            }else {
                $scope.locationData.selected = false;
                $scope.locationData.type = "";

                notify({
                    message: "Please specify total number of completes before setting National quotas.",
                    classes: 'alert-warning',
                    duration: 4000
                });
            }
        } 
    };

    //edit quota clicked when natrep selected
    $scope.editNatRepQuota = function() {
        if($scope.locationData.selected && $scope.locationData.type == "natrep") {
            //alert for clear natrep and set to region
            $timeout(function() {
                angular.element('#clrmodel').trigger('click');
                $scope.locationData.currentClickItem = "regionquotaedit";
            },0);
        }
    };

    //data for anyother location is selected or not
    $scope.locationData = {
        type: "",
        selected: false,
        currentClickItem: "",
        currIndex: 0, //this is for region and division PD-321
        currItem: {}, //this is for state csa msa and county PD-321
        achieved:0    //PD-505
    };

   
    $scope.cancelClearLocation = function() {
        //$scope.locationData.currentClickItem = "";
        //$scope.locationData.currIndex = 0;
        if($scope.locationData.type == "natrep") {
            $scope.sltRegion = [];
            setRegionForNationalRepresentative();
        }
        if($scope.locationData.currentClickItem != "" && $scope.locationData.currentClickItem == "region") {
            $scope.region[$scope.locationData.currIndex].selected = false;
        }
        if($scope.locationData.currentClickItem != "" && $scope.locationData.currentClickItem == "division") {
            $scope.division[$scope.locationData.currIndex].selected = false;
        }

        $scope.locationData.currentClickItem = "";
        $scope.locationData.currIndex = 0;
    };

    //clear location link clicked
    $scope.clearCompleteLocation = function() {
        if($scope.locationData.selected) {
            $timeout(function() {
                $scope.locationData.currentClickItem = "";
                $scope.locationData.currItem = {};
                angular.element('#clrmodel1').trigger('click');
            },0);
        }else {
            notify({
                message: "No location qualifications/quotas to clear",
                classes: 'alert-warning',
                duration: 2000
            });
        }
    };

   //clear all location qualification and quotas
    $scope.clearAllLocation = function($event) {
        /*-----Remove other AutoNested Location Quota First-----*/
            if(($scope.locationData.type == 'region' || $scope.locationData.type == 'natrep') && $scope.isNested('regions')){
                $timeout(function() {
                    angular.element('button[key-name = "regions"]').triggerHandler('click');
                    $scope.applyNesting();
                }, 0);
            }else if($scope.locationData.type == 'division' && $scope.isNested('divisions')){
                $timeout(function() {
                    angular.element('button[key-name = "divisions"]').triggerHandler('click');
                    $scope.applyNesting();
                }, 0);
            }else if($scope.locationData.type == 'state' && $scope.isNested('states')){
                console.log('in state remove');
                $timeout(function() {
                    angular.element('button[key-name = "states"]').triggerHandler('click');
                    $scope.applyNesting();
                }, 0);
            }else if($scope.locationData.type == 'dma' && $scope.isNested('dma')){
                $timeout(function() {
                    angular.element('button[key-name = "dma"]').triggerHandler('click');
                    $scope.applyNesting();
                }, 0);
            }else if($scope.locationData.type == 'csa' && $scope.isNested('csa')){
                $timeout(function() {
                    angular.element('button[key-name = "csa"]').triggerHandler('click');
                    $scope.applyNesting();
                }, 0);
            }else if($scope.locationData.type == 'msa' && $scope.isNested('msa')){
                $timeout(function() {
                    angular.element('button[key-name = "msa"]').triggerHandler('click');
                    $scope.applyNesting();
                }, 0);
            }else if($scope.locationData.type == 'county' && $scope.isNested('county')){
                $timeout(function() {
                    angular.element('button[key-name = "county"]').triggerHandler('click');
                    $scope.applyNesting();
                }, 0);
            }else if(($scope.locationData.type == 'zipcodes' || $scope.locationData.type == 'zip') && $scope.isNested('zipcodes')){
                console.log('in zip');
                $timeout(function() {
                    angular.element('button[key-name = "zipcodes"]').triggerHandler('click');
                    $scope.applyNesting();
                }, 0);
            }
        // Timeout added so that the location detail array will not get empty till nesting gets reset
        $timeout(function(){
            /*-----------------------------------------------------*/
            if($scope.locationData.currentClickItem === "regionquotaedit"){
                _.each($scope.region , function(value){
                    if(value.achieved){
                        $scope.currLocQuotaFielded = $scope.currLocQuotaFielded+ value.achieved;
                    }
                })
            }else{
              $scope.currLocQuotaFielded = 0;
            }
            if($scope.locationData.currentClickItem == "regionquota") {
                //clear only region quota and set region as selected
                $scope.clearCensusRegion();
                $scope.locationData.type = "region";
                $scope.locationData.selected = true;
                $scope.locationData.currentClickItem = "";

            }else if($scope.locationData.currentClickItem == "regionquotaedit") {
                //set region as selected and open edit box
                $scope.locationData.type = "region";
                $scope.locationData.selected = true;
                $scope.locationData.currentClickItem = "";
                $timeout(function() {
                    angular.element('#regeditquota').trigger('click');
                },100);

            }else {
                $scope.locationData.type = "";
                $scope.locationData.selected = false;
                //also clear data
                _.each($scope.region, function(region){
                    region.selected = false;
                });
                _.each($scope.division, function(division){
                    division.selected = false;
                });

                $scope.clearCensusRegion();
                $scope.clearCensusDivision();

                $scope.sltRegion = [];
                $scope.sltDivision = [];
                $scope.resetStateQuotas = true;
                $scope.resetDMAQuotas = true;
                $scope.resetCSAQuotas = true;
                $scope.resetMSAQuotas = true;
                $scope.resetCountyQuotas = true;

                $scope.stateQuotaResetModal();
                $scope.dmaQuotaResetModal();
                $scope.csaQuotaResetModal(); 
                $scope.msaQuotaResetModal();
                $scope.countyQuotaResetModal();

                // For Clearing Zips
                zipcodesDataArr = [];
                zipcodeFilePath = "";
                $scope.selectedZipcodes = [];
                $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
                $scope.locationData.selected = false;
                $scope.locationData.type = "";
                $scope.zipcodeQuotaFlg.editZipcodeFlag = false;
                $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
                $scope.zipcodeQuotaFlg.resetZipQuotaFlg = false;
                // For Clearing Zips

                $scope.selectedStates = new Array();
                $scope.selectedDMAs = new Array();
                $scope.selectedCSAs = new Array();
                $scope.selectedMSAs = new Array();
                $scope.selectedCountys = new Array();
                $scope.selectedZipcodes = new Array();

                //select back the item selected

                if($scope.locationData.currentClickItem != "" && $scope.locationData.currentClickItem == "region") {
                    $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
                    $scope.zipcodeQuotaFlg.editZipcodeFlag = false;
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "region";
                    $scope.region[$scope.locationData.currIndex].selected = true;
                    //call select fun
                    setSelectedRegionData($scope.region[$scope.locationData.currIndex].id, $scope.region[$scope.locationData.currIndex].selected, $scope.region, $scope.locationData.currIndex);

                }else if($scope.locationData.currentClickItem != "" && $scope.locationData.currentClickItem == "division") {
                    $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
                    $scope.zipcodeQuotaFlg.editZipcodeFlag = false;
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "division";
                    $scope.division[$scope.locationData.currIndex].selected = true;

                    //call select fun
                    setSelectedDivisonData($scope.division[$scope.locationData.currIndex].id, $scope.division[$scope.locationData.currIndex].selected, $scope.division, $scope.locationData.currIndex);

                } else if($scope.locationData.currentClickItem != "" && $scope.locationData.currentClickItem == "natrep") {
                    if($scope.completesNeeded > 0) {
                        $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
                        $scope.zipcodeQuotaFlg.editZipcodeFlag = false;
                        $scope.locationData.selected = true;
                        $scope.locationData.type = "natrep";
                        //call fun to set quota
                        setRegionForNationalRepresentative();
                    }else {
                        $scope.locationData.selected = false;
                        $scope.locationData.type = "";
                        notify({
                            message: "Please specify total number of completes before setting Nattional quotas.",
                            classes: 'alert-warning',
                            duration: 4000
                        });
                    }
                    
                }else if($scope.locationData.currentClickItem != "" && $scope.locationData.currentClickItem == "state") {
                    //set location flags
                    $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
                    $scope.zipcodeQuotaFlg.editZipcodeFlag = false;
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "state";
                    setSelectedStateData($scope.locationData.currItem);
                }else if($scope.locationData.currentClickItem != "" && $scope.locationData.currentClickItem == "dma") {
                    //set location flags
                    $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
                    $scope.zipcodeQuotaFlg.editZipcodeFlag = false;
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "dma";
                    setSelectedDmaData($scope.locationData.currItem);
                }else if($scope.locationData.currentClickItem != "" && $scope.locationData.currentClickItem == "csa") {
                    //set location flags
                    $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
                    $scope.zipcodeQuotaFlg.editZipcodeFlag = false;
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "csa";
                    setSelectedCsaData($scope.locationData.currItem);
                }else if($scope.locationData.currentClickItem != "" && $scope.locationData.currentClickItem == "msa") {
                    //set location flags
                    $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
                    $scope.zipcodeQuotaFlg.editZipcodeFlag = false;
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "msa";
                    setSelectedMsaData($scope.locationData.currItem);
                }else if($scope.locationData.currentClickItem != "" && $scope.locationData.currentClickItem == "county") {
                    //set location flags
                    $scope.zipcodeQuotaFlg.addZipQuotaFlg = false;
                    $scope.zipcodeQuotaFlg.editZipcodeFlag = false;
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "county";
                    setSelectedCountyData($scope.locationData.currItem);
                }else if($scope.locationData.currentClickItem != "" && $scope.locationData.currentClickItem == "zip"){
                    //set location flags
                    $scope.locationData.selected = true;
                    $scope.locationData.type = "zip";
                    setSelectedZipData($scope.locationData.currItem);
                }else{
                    $scope.locationData.currentClickItem = "";
                    $scope.locationData.currIndex = 0;
                }
            }
        }, 0);
    };
    $scope.getAchievedForAgeIncome = function(srvId, modalName, minRange, maxRange, index){
        if($stateParams.edit == 'editStep1' && maxRange > minRange && (minRange != undefined || minRange != null || minRange != '')){
            createSurvey.getAchievedForAgeIncome(srvId, modalName, minRange, maxRange).success(function(data) {
                if(data.apiStatus == 'success'){
                    if(modalName == 'age'){
                        $scope.ageTempArr[index].achieved = data.achieved;
                    }else if(modalName == 'hhi'){
                        $scope.incomeTempArr[index].achieved = data.achieved;
                    }
                }
            }).error(function(err){
                console.log(err);
            })
        }
    };

    /*-----------------Auto Nesting Quotas-------------------*/

    $scope.activateNesting = function(arrName, arrDetails, $event, questionType){
        console.log('arrDetails ',JSON.stringify(arrDetails));
        $scope.loader.show = true;
        if(questionType){
            arrName = $filter('lowercase')(arrName);
            arrName = arrName.trim();
            arrName = arrName.replace(/ /g,'_');
            console.log('arrName ',arrName);
            //console.log('arrDetails 2 ',JSON.stringify(arrDetails));
        }
        // Checking the key pre exists in nesting Quotas
        if(arrDetails.length > 0 || _.keys(arrDetails).length > 0){
            //Check if location Array have percent or not
            if(arrName == 'states' || arrName == 'dma' || arrName == 'csa' || arrName == 'msa' || arrName == 'county'){
                _.each(arrDetails, function(item){
                    if(item.percentage){
                        item.per = item.percentage;
                    }else if(item.percent){
                        item.per = item.percent;
                    }
                });
            }
            if($scope.nestingQuotasArr.indexOf(arrName) == -1){
                // Checking the nesting quotas length doesn't exceed 4
                if($scope.nestingQuotasArr.length == 4){
                    $scope.loader.show = false;
                    notify({
                        message: 'You may only nest a maximum of 4 qualifications at a time',
                        classes: 'alert-warning',
                        duration: 2000
                    });
                }else{
                    $scope.nestingQuotasArr.push(arrName);
                    $($event.target).addClass('active');
                    var curr_arr = new Array();
                    if(arrName == 'children'){
                        var childMasterData = _.findWhere(masterData, {"masterKey" : "children"});
                        _.each(_.keys(arrDetails), function(singleKey){
                            _.each(arrDetails[singleKey], function(elm){
                                elm.qual_id = childMasterData.id;
                                elm.qual_name = childMasterData.masterKey;
                            });
                        });
                        _.each(_.keys(arrDetails), function(singleKey){
                            _.each(arrDetails[singleKey], function(elm){
                                if(singleKey == 'have' && elm.min != undefined && elm.min !== '' && elm.max != undefined && elm.max != ''){
                                    var gender_name = new String();
                                    if(elm.gender == "both"){
                                        gender_name = "Either";
                                    }else{
                                        gender_name = (elm.gender == "111")? "Boy" : "Girl";
                                    }
                                    curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+elm.min+'-'+elm.max+'?range?'+elm.per+'?'+gender_name);
                                }else if(singleKey == 'no' && elm.number != undefined && elm.number != '' && elm.number != null && !isNaN(elm.number)){
                                    curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+elm.id+'?'+elm.name+'?normal?'+elm.per);
                                }
                            });
                        });
                        _.each(arrDetails, function(elm){
                            if(elm.min != undefined && elm.min !== '' && elm.max != undefined && elm.max != ''){
                                var gender_name = new String();
                                if(elm.gender == "both"){
                                    gender_name = "Either";
                                }else{
                                    gender_name = (elm.gender == "111")? "Boy" : "Girl";
                                }
                                curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+elm.min+'-'+elm.max+'?range?'+elm.per+'?'+gender_name);
                            }
                        });
                    }else if(arrName == 'age' || arrName == 'houseHoldIncome'){
                        // Adding Qual Id in Ranges if you are directly autonesting it from modal
                        if(arrName == 'age'){
                            var ageMasterData = _.findWhere(masterData, {"masterKey" : "age"});
                            _.each(arrDetails, function(age){
                                age.qual_id = ageMasterData.id;
                                age.qual_name = ageMasterData.masterKey;
                            });
                        }else if(arrName == 'houseHoldIncome'){
                            var incomeMasterData = _.findWhere(masterData, {"masterKey" : "houseHoldIncome"});
                            _.each(arrDetails, function(income){
                                income.qual_id = incomeMasterData.id;
                                income.qual_name = incomeMasterData.masterKey;
                            });
                        }
                        _.each(arrDetails, function(elm){
                            if(elm.min != undefined && elm.min !== '' && elm.max != undefined && elm.max != ''){
                                curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+elm.min+'-'+elm.max+'?range?'+elm.per);
                            }
                        });
                        // Removing the first empty row from the ranges array
                        //curr_arr.splice(0, 1);
                    }else{
                        // Have to add Qual Id and Qual Name for States and other locations 
                        var addQualId = function(arrName, arrDetails){
                            var arrMasterData = _.findWhere(masterData, {"masterKey" : arrName});
                            _.each(arrDetails, function(item){
                                item.qual_id = arrMasterData.id;
                                item.qual_name = arrMasterData.masterKey;
                            });
                        };
                        if(arrName == 'states' || arrName == 'csa' || arrName == 'dma' || arrName == 'msa' || arrName == 'county'){
                            addQualId(arrName, arrDetails);
                        }
                        // adding qual ends
                        _.each(arrDetails, function(elm){
                            if(elm.selected){
                                if(elm.per == undefined || elm.per == '' || elm.per == null){
                                    elm.per = 0;
                                }
                                // For grouping + Nesting
                                /*elm.id = [111, 112, 113];
                                elm.name = ['abc', 'cde', 'fgh'];*/
                                console.log('elm ',JSON.stringify(elm));
                                if(elm.qual_id == config.zipcodesQual.id){
                                    curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+elm.id+'?'+elm.name+'?normal?'+elm.per+'?'+elm.buyer_ziplist_ref);
                                }else{
                                    if(elm.id  && typeof(elm.id) === "object"){
                                        if(elm.per < elm.percentage){
                                            elm.per = angular.copy(elm.percentage);
                                        }
                                        eleId = elm.id.join('-');
                                        eleName = elm.name_arr.join('-');
                                        curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+eleId+'?'+eleName+'?normal?'+elm.per);
                                        //console.log('curr_arr grouped ',curr_arr);
                                    }else{
                                        console.log('\n\n elm ',JSON.stringify(elm));
                                        //console.log('curr_arr layered ',curr_arr);
                                        curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+elm.id+'?'+elm.name+'?normal?'+elm.per);
                                        console.log('curr_arr ',curr_arr);
                                    }
                                }
                                
                            }
                        });
                    }
                    //PD-711 Creating same nesting Array but with qualification codes and condition codes
                    //var currCodeArray = new Array(); j!8Di%3Pg1

                    //for adding key of pre saved nested array
                    nestingQuotasDetailObj[arrName] = curr_arr;
                    nestingResults = cartesianProductOf(nestingQuotasDetailObj);
                    console.log('nestingResults ',nestingResults) // For holding nested array results
                    /*nestingCodesRawObject[arrName] = currCodeArray;
                    nestingCodesResults = cartesianProductOf(nestingCodesRawObject);*/
                }
            }else{
                // if clicked quotas exists in nesting quotas
                $scope.nestingQuotasArr.splice($scope.nestingQuotasArr.indexOf(arrName), 1);
                $($event.target).removeClass('active');
                var curr_arr = new Array();
                if(arrName == 'children'){
                    var childMasterData = _.findWhere(masterData, {"masterKey" : "children"});
                    _.each(_.keys(arrDetails), function(singleKey){
                        _.each(arrDetails[singleKey], function(elm){
                            elm.qual_id = childMasterData.id;
                            elm.qual_name = childMasterData.masterKey;
                        });
                    });
                    _.each(_.keys(arrDetails), function(singleKey){
                        _.each(arrDetails[singleKey], function(elm){
                            if(singleKey == 'have' && elm.min != undefined && elm.min !== '' && elm.max != undefined && elm.max != ''){
                                var gender_name = new String();
                                if(elm.gender == "both"){
                                    gender_name = "Either";
                                }else{
                                    gender_name = (elm.gender == "111")? "Boy" : "Girl";
                                }
                                curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+elm.min+'-'+elm.max+'?range?'+elm.per+'?'+gender_name);
                            }else if(singleKey == 'no' && elm.number != undefined && elm.number != ''){
                                curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+elm.id+'?'+elm.name+'?normal?'+elm.per);
                            }
                        });
                    });
                }else if(arrName == 'age' || arrName == 'houseHoldIncome'){
                    // Adding Qual Id in Ranges if you are directly autonesting it from modal
                    if(arrName == 'age'){
                        var ageMasterData = _.findWhere(masterData, {"masterKey" : "age"});
                        _.each(arrDetails, function(age){
                            age.qual_id = ageMasterData.id;
                            age.qual_name = ageMasterData.masterKey;
                        });
                    }else if(arrName == 'houseHoldIncome'){
                        var incomeMasterData = _.findWhere(masterData, {"masterKey" : "houseHoldIncome"});
                        _.each(arrDetails, function(income){
                            income.qual_id = incomeMasterData.id;
                            income.qual_name = incomeMasterData.masterKey;
                        });
                    }
                    _.each(arrDetails, function(elm){
                        if(elm.min != undefined && elm.min !== '' && elm.max != undefined && elm.max != ''){
                            curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+elm.min+'-'+elm.max+'?range?'+elm.per);
                        }
                    });
                    // Removing the first empty row from the ranges array
                    //curr_arr.splice(0, 1);
                }else{
                    // Have to add Qual Id and Qual Name for States and other locations 
                    var addQualId = function(arrName, arrDetails){
                        var arrMasterData = _.findWhere(masterData, {"masterKey" : arrName});
                        _.each(arrDetails, function(item){
                            item.qual_id = arrMasterData.id;
                            item.qual_name = arrMasterData.masterKey;
                        });
                    };
                    if(arrName == 'states' || arrName == 'csa' || arrName == 'dma' || arrName == 'msa' || arrName == 'county'){
                        addQualId(arrName, arrDetails);
                    }
                    // adding qual ends
                    _.each(arrDetails, function(elm){
                        if(elm.selected && elm.maximum != '' && elm.maximum != undefined){
                            if(elm.per == undefined || elm.per == '' || elm.per == null){
                                elm.per = 0;
                            }
                            console.log('elm ',JSON.stringify(elm));
                            console.log('curr_arr ',curr_arr);
                            if(elm.qual_id == config.zipcodesQual.id){
                                curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+elm.id+'?'+elm.name+'?normal?'+elm.per+'?'+elm.buyer_ziplist_ref);
                            }else{
                                if(elm.id  && typeof(elm.id) === "object"){
                                    if(elm.per < elm.percentage){
                                        elm.per = angular.copy(elm.percentage);
                                    }
                                    eleId = elm.id.join('-');
                                    eleName = elm.name_arr.join('-');
                                    curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+eleId+'?'+eleName+'?normal?'+elm.per);
                                }else{
                                    curr_arr.push(elm.qual_id+'?'+elm.qual_name+'?'+elm.id+'?'+elm.name+'?normal?'+elm.per);
                                }
                            }
                        }
                    });
                }
                //for deleting key of pre saved nested array
                delete nestingQuotasDetailObj[arrName];
                nestingResults = cartesianProductOf(nestingQuotasDetailObj);
                /*delete nestingCodesRawObject[arrName];
                nestingCodesResults = cartesianProductOf(nestingCodesRawObject);
                }*/
            }
            //console.log('$scope.nestedQuotasUiObj \n '+JSON.stringify($scope.nestedQuotasUiObj));
            // if we are removing the last key from nested array then we will trigger clear nesting
            if(_.isEmpty(nestingQuotasDetailObj) == true){
                $scope.clearNesting();
            }else{
                // Calculation for Quotas to show on UI
                //Inserting values in UI object
                if(nestingResults.length > 0){
                    $scope.nestedQuotasUiObj = [];   // Clearing the old values inserted on previous click
                    _.each(nestingResults, function(item){
                        //Hold the values of nested elements to use in further calculations
                        var combinedKey = new Array(); // 
                        var combinedPer = new Array();
                        _.each(item, function(singleCode){
                            var nestedData = singleCode.split("?");
                            if(nestedData[1] == 'children'){
                                if(nestedData[2] == 111){
                                    combinedKey.push(nestedData[3]);
                                    combinedPer.push(parseFloat(nestedData[5])/100);
                                }else{
                                    combinedKey.push(nestedData[5]+'_'+nestedData[2]);
                                    combinedPer.push(parseFloat(nestedData[4])/100);
                                }
                            }else if(nestedData[1] == 'age' || nestedData[1] == 'houseHoldIncome'){
                                combinedKey.push(nestedData[2]);
                                combinedPer.push(parseFloat(nestedData[4])/100);
                            }else{
                                combinedKey.push(nestedData[3]);
                                combinedPer.push(parseFloat(nestedData[5])/100);
                            }
                        });
                        // Multiplying each percentage of array and multiply by 100 to get nesting percentage
                        combinedPer = parseFloat(_.reduce(combinedPer, function(memo, num){return memo * num}, 1) * 100);

                        var nestingPer =  parseFloat($filter('number')(combinedPer, 2));
                        var nestingAllocation = Math.round(($scope.completesNeeded * nestingPer)/100);

                        var nestingMin = Math.round(nestingAllocation - (nestingAllocation * 20/100));
                        var totalMin = Math.round($scope.completesNeeded - ($scope.completesNeeded * 20/100));
                        var nestingMax = Math.min(Math.round(nestingAllocation + (nestingAllocation * 20/100)), Math.round($scope.completesNeeded - (totalMin - nestingMin)));

                        var tempObj = new Object();
                        
                        tempObj.number = isNaN(nestingAllocation)? 0: nestingAllocation;
                        tempObj.percentage = isNaN(nestingPer)? 0: nestingPer;
                        tempObj.minimum = isNaN(nestingAllocation)? 0: nestingAllocation;
                        tempObj.maximum = isNaN(nestingAllocation)? 0: nestingAllocation;
                        tempObj.combinedKey = combinedKey;
                        tempObj.flexible =  true;
                        tempObj.flexiblePer =  0;
                        tempObj.fielded =  0;
                        $scope.nestedQuotasUiObj.push(tempObj);
                    });
                }
                // Checking wheather allocation are more than or less than with total Completes and fixes them
                correctNestedUiAllocation($scope.nestedQuotasUiObj);
            }
        }else{
            notify({message:'Please define the ranges/qualifications',classes:'alert-warning',duration:3000} );
        }
        $scope.loader.show = false;
    };
    function cartesianProductOf(nestingData){
        return _.reduce(nestingData, function(a, b) {
            return _.flatten(_.map(a, function(x) {
                return _.map(b, function(y) {
                    return x.concat([y]);
                });
            }), true);
        }, [ [] ]);
    };

    $scope.applyNesting = function(){
        var criteria_data = [];
        //Hold the values of nested elements to use in further calculations
        // Checking if the nesting Results array is empty
        if(nestingResults.length > 0){
            $scope.nestingQuotasArrFinal = [];  // Hold Key Names for which nesting has applied
            nestedTempQuotaData = [];    // Temp Array used to take quota data from here to Save Survey
            // Pushing Data as Quota V2
            _.each(nestingResults, function(item){
                var combinedPer = new Array(); // Hold value of percent from layered quota
                _.each(item, function(singlecode){
                    var itemSplit = singlecode.split("?");
                    //check the item is a range or condition
                    if(itemSplit[3] == 'range'){
                        var rangeSplit = itemSplit[2].split("-");
                        var childGndrMaster = _.findWhere(masterData, {"id":parseInt(config.childMasterQual.gender)});
                        if(itemSplit[1] == 'children'){
                                // Gender Conditions
                                var gender_conditions = new Array();
                                if(itemSplit[5] == 'Either'){
                                    gender_conditions = [{
                                            "id": "111",
                                            "name": "Boy"
                                        },
                                        {
                                            "id": "112",
                                            "name": "Girl"
                                    }];  // Both boy and girl 
                                }else{
                                    gender_conditions = [{
                                        "id":(_.findWhere(childGndrMaster.values, {"name":itemSplit[5]})).id.toString(),
                                        "name": itemSplit[5]
                                    }]
                                }
                            criteria_data.push({
                                "qualification_code":itemSplit[0],
                                "qualification_name":itemSplit[1],
                                "q_type":"normal",
                                "layered_percent":parseInt(itemSplit[4]),
                                "conditions": [{
                                    "id":'112',
                                    "name": "Have Children"
                                }]
                            },
                            {
                                "qualification_code": parseInt(config.childMasterQual.gender),
                                "qualification_name":(_.findWhere(masterData, {"id":parseInt(config.childMasterQual.gender)})).masterKey,
                                "q_type":"normal",
                                "layered_percent":parseInt(itemSplit[4]),
                                "conditions": gender_conditions
                            },
                            {
                                "qualification_code":parseInt(config.childMasterQual.age),
                                "qualification_name":(_.findWhere(masterData, {"id":parseInt(config.childMasterQual.age)})).masterKey,
                                "q_type":"range_sets",
                                "layered_percent":parseInt(itemSplit[4]),
                                "range_sets": [{"from":parseInt(rangeSplit[0]), "to":parseInt(rangeSplit[1]), "units": $scope.childAgeUnit.value}]
                            });
                        }else{
                            criteria_data.push({
                                "qualification_code":itemSplit[0],
                                "qualification_name":itemSplit[1],
                                "q_type":"range_sets",
                                "layered_percent":parseInt(itemSplit[4]),
                                "range_sets": [{"from":parseInt(rangeSplit[0]), "to":parseInt(rangeSplit[1]), "units": (itemSplit[1] == 'age'? age_units.year : currency_units)}]
                            });
                        }
                    }else{
                        var codes = itemSplit[2].split('-');
                        var names = itemSplit[3].split('-');
                        var newGrpCondition = new Array();
                        _.each(codes, function(eachCode, index){
                            var tmpObj = new Object();
                            tmpObj['id'] = eachCode.toString();
                            tmpObj['name'] = names[index];
                            newGrpCondition.push(tmpObj);
                        });
                        criteria_data.push({
                            "qualification_code":parseInt(itemSplit[0]),
                            "qualification_name":itemSplit[1],
                            "q_type":"normal",
                            "layered_percent":parseInt(itemSplit[5]),
                            "conditions": parseInt(itemSplit[0]) == 229?[]:newGrpCondition,
                            'group_qtaNm': itemSplit[3],
                            "buyer_ziplist_ref" : itemSplit[6]?itemSplit[6]:""
                        });
                    }
                    // For calculation Allocations details
                    var nestedData = singlecode.split("?");
                    if(nestedData[1] == 'age' || nestedData[1] == 'houseHoldIncome' || nestedData[1] == 'children'){
                        // For No Children Quota
                        if(nestedData[0] == config.childMasterQual.id && nestedData[2] == config.childMasterQual.noChildren){
                            combinedPer.push(parseFloat(nestedData[5])/100);
                        }else{
                            combinedPer.push(parseFloat(nestedData[4])/100);
                        }
                    }else{
                        combinedPer.push(parseFloat(nestedData[5])/100);
                    }
                });
                
                
                
                // Multiplying each percentage of array and multiply by 100 to get nesting percentage
                combinedPer = parseFloat(_.reduce(combinedPer, function(memo, num){return memo * num}, 1) * 100);
                var nestingPer =  parseFloat($filter('number')(combinedPer, 2));
                var nestingAllocation = Math.round(($scope.completesNeeded * nestingPer)/100);
                var nestingMin = Math.round(nestingAllocation - (nestingAllocation * 20/100));
                //console.log('nestingMin '+nestingMin);
                var totalMin = Math.round($scope.completesNeeded - ($scope.completesNeeded * 20/100));
                var nestingMax = Math.min(Math.round(nestingAllocation + (nestingAllocation * 20/100)), Math.round($scope.completesNeeded - (totalMin - nestingMin)));

                nestedTempQuotaData.push({
                    "type": 0,
                    "isActive":true,
                    "quotaCategory":"autoNested",
                    "locked": false,
                    "criteria":criteria_data,
                    "quantities":{
                        "minimum":nestingAllocation,
                        "maximum":nestingAllocation,
                        "flexibility":0,
                        "isFlexible":true,
                        "number":nestingAllocation,
                        "percentage":nestingPer,
                        "hasValidQuotas": true,
                        "achieved": 0,
                        "remaining":nestingAllocation,
                        "currently_open":nestingAllocation,
                        "sup_currently_open": nestingAllocation,
                        "current_target":nestingAllocation
                    }
                });
                criteria_data = []; // Clearing criteria data before making new Quota
            });
            // Function to correct the allocations of nested quotas if they are less or more than total completed
            correctNestedAllocation(nestedTempQuotaData);
            // Filling the keys in an Array for Nested Quotas
            _.each($scope.nestingQuotasArr, function(item){
                $scope.nestingQuotasArrFinal.push(item);
            });
            if(nestedTempQuotaData.length > 0){
                $scope.nestedQuota.has = true;
            }else{
                $scope.nestedQuota.has = false; 
            }
            console.log('nestedTempQuotaData ',JSON.stringify(nestedTempQuotaData));
        }else if($scope.nestedQuota.has){
            notify({
                message: "Already Applied",
                classes: 'alert-success',
                duration: 2000
            });
        }
        console.log('$scope.nestingQuotasArrFinal ',JSON.stringify($scope.nestingQuotasArrFinal));
        // Saving Zipcode Layered Data to live edit zipcode nesting
        $scope.properties.zipGrpDetail = new Array();
        if(_.indexOf($scope.nestingQuotasArrFinal, 'zipcodes') != -1){
            $scope.properties.zipGrpDetail = angular.copy($scope.selectedZipcodes);
            _.each($scope.properties.zipGrpDetail, function(item){
                delete item.minimum;
                delete item.maximum;
                delete item.number;
                delete item.percentage;
                delete item.per;
                delete item.hasValidQuotas;
            });
            console.log('$scope.properties.zipGrpDetail ',JSON.stringify($scope.properties.zipGrpDetail));
        }else{
            $scope.properties.zipGrpDetail = [];
        }
    };
    // Event on closing the nesting modal
    $scope.clearUnappliedNesting =  function($event){
        if(!$scope.nestedQuota.has){
            $scope.clearNesting();
        }else{
            // Check wheather Nested Keys final array is same as temp nested keys array
            if($scope.nestingQuotasArrFinal.length > $scope.nestingQuotasArr.length){
                var nestingArrDiff = _.difference($scope.nestingQuotasArrFinal, $scope.nestingQuotasArr); 
            }else{
                var nestingArrDiff = _.difference($scope.nestingQuotasArr, $scope.nestingQuotasArrFinal);
            }
            
            if(nestingArrDiff == null || nestingArrDiff == undefined || nestingArrDiff == ''){
                console.log(JSON.stringify(nestingArrDiff)+'Both are equal-----Do Nothing');
            }else{
                console.log(JSON.stringify(nestingArrDiff)+'Not Equal --- Remove the unapplied keys from the view');
                _.each(nestingArrDiff, function(extraKey){
                    $timeout(function() {
                        angular.element('button[key-name = "'+extraKey+'"]').triggerHandler('click');
                    }, 0);
                });
            }
        }
    };
    // Event on Clear Nesting Button
    $scope.clearNesting = function(){
        //$scope.properties.nested_quotas = [];
        $scope.nestedQuotasUiObj = [];  // To clear table Data on UI

        $scope.nestingQuotasArr = [];   // To clear heading data
        $scope.nestingQuotasArrFinal = [] // Clear the final array of keyNames for Nested Quotas

        //Raw Object used to hold data before nesting
        nestingResults = [];

        nestingQuotasDetailObj = {};    // Clear object which contains raw arrays before nesting
        nestedTempQuotaData = [];     // Clearing the temp variable whcich stores all the nested Quotas
        angular.element('.nesting-quotas-button button').removeClass('active');
        $scope.nestedQuota.has = false;
        $scope.applyNesting();
    };

    $scope.isNested = function(keyName){
        keyName = $filter('lowercase')(keyName);
        keyName = keyName.trim();
        keyName = keyName.replace(/ /g,'_');
        if(_.indexOf($scope.nestingQuotasArrFinal, keyName) != -1){
            return true;
        }else{
            return false;
        }
    };

    $scope.addToNesting = function(arrName, arrDetails, $event){
        $scope.activateNesting(arrName, arrDetails, $event);
        $scope.applyNesting();
    };

    // Function to manage the allocation always equal to total completes after updating the completes
    var correctNestedAllocation = function(nestedTempQuotaData){
        
        var totalNestingAllocations = new Number();
        var diffNesting = new Number();
        _.each(nestedTempQuotaData, function(data){
            totalNestingAllocations += data.quantities.number;
        });
        if(totalNestingAllocations != $scope.completesNeeded){
            diffNesting = $scope.completesNeeded - totalNestingAllocations;
        }
        if(diffNesting > 0){
            _.each(nestedTempQuotaData, function(nestedQuota){
                if(diffNesting > 0){
                    nestedQuota.quantities.number = nestedQuota.quantities.number+1;
                    nestedQuota.quantities.percentage = Math.round((nestedQuota.quantities.number * 100)/$scope.completesNeeded);
                    nestedQuota.quantities.minimum = nestedQuota.quantities.number;
                    nestedQuota.quantities.maximum = nestedQuota.quantities.number;
                    nestedQuota.quantities.currently_open = nestedQuota.quantities.number;
                    nestedQuota.quantities.remaining = nestedQuota.quantities.number;
                    nestedQuota.quantities.current_target = nestedQuota.quantities.number;
                    nestedQuota.quantities.sup_currently_open = nestedQuota.quantities.number;
                    diffNesting--;
                }
            });
        }else if(diffNesting < 0){
            diffNesting = -diffNesting;
            _.each(nestedTempQuotaData, function(nestedQuota){
                if(diffNesting > 0){
                    nestedQuota.quantities.number = nestedQuota.quantities.number-1;
                    nestedQuota.quantities.percentage = Math.round((nestedQuota.quantities.number * 100)/$scope.completesNeeded);
                    nestedQuota.quantities.minimum = nestedQuota.quantities.number;
                    nestedQuota.quantities.maximum = nestedQuota.quantities.number;
                    nestedQuota.quantities.currently_open = nestedQuota.quantities.number;
                    nestedQuota.quantities.remaining = nestedQuota.quantities.number;
                    nestedQuota.quantities.current_target = nestedQuota.quantities.number;
                    nestedQuota.quantities.sup_currently_open = nestedQuota.quantities.number;
                    diffNesting--;
                }
            });
        }
    }

    var correctNestedUiAllocation = function(nestedQuotasUiObj){
        var totalAllocation = new Number();
        _.each(nestedQuotasUiObj, function(item){
            if(item.number){
                totalAllocation += item.number;
            }
        });
        if(totalAllocation != $scope.completesNeeded){
            var diff = $scope.completesNeeded - totalAllocation;
            if(diff > 0){
                _.each(nestedQuotasUiObj, function(nestedQuota){
                    if(diff > 0){
                        nestedQuota.number = nestedQuota.number + 1;
                        nestedQuota.percentage = parseFloat($filter('number')((nestedQuota.number * 100)/$scope.completesNeeded, 2));
                        nestedQuota.minimum = nestedQuota.number;
                        nestedQuota.maximum = nestedQuota.number;
                        diff--;
                    }
                });
            }else if(diff < 0){
                diff = -diff;
                if(diff > 0){
                    _.each(nestedQuotasUiObj, function(nestedQuota){
                        if(diff > 0){
                            nestedQuota.number = (nestedQuota.number - 1) < 0 ? 0:(nestedQuota.number - 1);
                            nestedQuota.percentage = parseFloat($filter('number')((nestedQuota.number * 100)/$scope.completesNeeded, 2));
                            nestedQuota.minimum = nestedQuota.number;
                            nestedQuota.maximum = nestedQuota.number;
                            diff--;
                        }
                    });
                }
            }
        }
    }

    //Function to Update the Quotas as the completes are increased or decreased
    $scope.updateQuotasOnChange = function(){
        $scope.showLoader = 'DataLoading'; 
        $scope.loader.show = true;
        if($scope.liveSurveyEditingStep == 'editStep1' && $scope.completesNeeded > 0 && $scope.totalFielded > $scope.completesNeeded){
            notify({
                message: "You can't set completes less than total fielded",
                classes: 'alert-warning',
                duration: 2000
            });
        }else{
            /*-------------Updating the Nested Quotas----
            --------------------------------------------*/
            if(nestedTempQuotaData.length > 0){
                _.each(nestedTempQuotaData, function(data, index){
                    var updatedAllocation = Math.round((data.quantities.percentage * $scope.completesNeeded)/100);
                    var updatedMin = Math.round(updatedAllocation - (updatedAllocation * 20/100));
                    var totalMin = Math.round($scope.completesNeeded - ($scope.completesNeeded * 20/100));
                    var updatedMax = Math.min(Math.round(updatedAllocation + (updatedAllocation * 20/100)), Math.round($scope.completesNeeded - (totalMin - updatedMin)));
                    var updatedPer =  $filter('number')(((updatedAllocation * 100)/$scope.completesNeeded), 2);
                    
                    data.quantities.number = isNaN(updatedAllocation)? 0: updatedAllocation;
                    data.quantities.minimum = isNaN(updatedAllocation)? 0: updatedAllocation;
                    data.quantities.maximum = isNaN(updatedAllocation)? 0: updatedAllocation;
                    data.quantities.percentage = isNaN(updatedPer)? 0: updatedPer;
                    data.quantities.currently_open = isNaN(updatedAllocation)? 0: updatedAllocation;
                    data.quantities.remaining = isNaN(updatedAllocation)? 0: updatedAllocation;
                    data.quantities.current_target = isNaN(updatedAllocation)? 0: updatedAllocation;
                    data.quantities.sup_currently_open = isNaN(updatedAllocation)? 0: updatedAllocation;
                });
                // Checking wheather allocation are more than or less than with total Completes and fixes them
                correctNestedAllocation(nestedTempQuotaData);
                // Updating Ui Nesting Data
            }
            // For Nested Ui only
            if($scope.nestedQuotasUiObj){
                _.each($scope.nestedQuotasUiObj, function(nestedUI){
                    var updatedAllocation = Math.round((nestedUI.percentage * $scope.completesNeeded)/100);
                    var updatedMin = Math.round(updatedAllocation - (updatedAllocation * 20/100));
                    var totalMin = Math.round($scope.completesNeeded - ($scope.completesNeeded * 20/100));
                    var updatedMax = Math.min(Math.round(updatedAllocation + (updatedAllocation * 20/100)), Math.round($scope.completesNeeded - (totalMin - updatedMin)));
                    var updatedPer =  $filter('number')(((updatedAllocation * 100)/$scope.completesNeeded), 2);
                    nestedUI.number = isNaN(updatedAllocation)? 0: updatedAllocation;
                    nestedUI.minimum = isNaN(updatedAllocation)? 0: updatedAllocation;
                    nestedUI.maximum = isNaN(updatedAllocation)? 0: updatedAllocation;
                    nestedUI.percentage = isNaN(updatedPer)? 0: updatedPer;
                    nestedUI.currently_open = isNaN(updatedAllocation)? 0: updatedAllocation;
                    nestedUI.remaining = isNaN(updatedAllocation)? 0: updatedAllocation;
                    nestedUI.current_target = isNaN(updatedAllocation)? 0: updatedAllocation;
                    nestedUI.sup_currently_open = isNaN(updatedAllocation)? 0: updatedAllocation;
                });
                // Checking wheather allocation are more than or less than with total Completes and fixes them
                correctNestedUiAllocation($scope.nestedQuotasUiObj);
            }
            /*-----------------Nesting Update Ends------------*/

            //Function to autoIncrement the Layered Quotas according to percentages
            var updateAllLayeredQuota =  function(eachQuota){
                var min = new Number();
                var totalAllocation = new Number();
                // to calculate total min first
                //console.log('\n\n eachQuota starting '+JSON.stringify(eachQuota));
                _.each(eachQuota, function(item){
                    if(!item.per){
                        item.per = item.percentage;
                    }
                    var number = Math.round((item.per * $scope.completesNeeded)/100);
                    //console.log('number '+number);
                    if(number){
                        min += Math.round(number - (number * parseInt(item.flexiblePer)) / 100);
                        totalAllocation += number;
                    }
                });
                //console.log('totalAllocation '+totalAllocation);
                //updating the number, minimum and maximum value
                _.each(eachQuota, function(item){
                    if(!item.per){
                        item.per = item.percentage;
                    }
                    item.number = Math.round((item.per * $scope.completesNeeded)/100);
                    //console.log('\n\n\n ****** item.number '+item.number+' '+isNaN(item.number));
                    if(isNaN(item.number)){
                        item.number = 0;
                    }
                    //console.log('\n\n\n ****** item.number final '+item.number+' '+isNaN(item.number));
                    //if flexbility is on and number is less than total completes
                    if(item.flexible && item.number < $scope.completesNeeded){
                        item.minimum = Math.round(item.number - (item.number * parseInt(item.flexiblePer)) / 100);
                        item.maximum = Math.min(parseInt(item.number + (item.number * parseInt(item.flexiblePer)) / 100), Math.round($scope.completesNeeded - (min - item.minimum)));

                    }//if flexbility is on and number is same as completes or flexbility is off 
                    else if((item.flexible && item.number == $scope.completesNeeded) || !item.flexible){
                        item.minimum = item.number;
                        item.maximum = item.number;
                    }
                });
                if(totalAllocation != $scope.completesNeeded && totalAllocation != 0){
                    var diff = $scope.completesNeeded - totalAllocation;
                    //console.log('diff '+diff);
                    if(diff > 0){
                        var ind = 0;
                        //console.log('eachQuota ', JSON.stringify(eachQuota));
                        eachQuota[ind].number = eachQuota[ind].number + diff;
                        eachQuota[ind].minimum = Math.round(eachQuota[ind].number - (eachQuota[ind].number * parseInt(eachQuota[ind].flexiblePer)) / 100);
                        eachQuota[ind].maximum = Math.min(parseInt(eachQuota[ind].number + (eachQuota[ind].number * parseInt(eachQuota[ind].flexiblePer)) / 100), Math.round($scope.completesNeeded - (min - eachQuota[ind].minimum)));
                    }else if(diff < 0){
                        diff = -diff;
                        var ind = 0;
                        //console.log('ind 2 ', ind);
                        eachQuota[ind].number = (eachQuota[ind].number - diff) < 0 ? 0:(eachQuota[ind].number - diff);
                        eachQuota[ind].minimum = Math.round(eachQuota[ind].number - (eachQuota[ind].number * parseInt(eachQuota[ind].flexiblePer)) / 100);
                        eachQuota[ind].maximum = Math.min(parseInt(eachQuota[ind].number + (eachQuota[ind].number * parseInt(eachQuota[ind].flexiblePer)) / 100), Math.round($scope.completesNeeded - (min - eachQuota[ind].minimum)));
                    }
                }
            }
            // Made an array to run a common loop for updating all the arrays
            var allQuotasArr = [['gender', $scope.sltGender, $scope.genderInfo], ['age', $scope.ageTempArr], ['houseHoldIncome', $scope.incomeTempArr], ['race', $scope.sltRace, $scope.race], ['relationships', $scope.sltRelation, $scope.relation], ['educations', $scope.sltEducation, $scope.education], ['employments', $scope.sltEmployment, $scope.employement], ['device', $scope.sltDevice, $scope.deviceInfo], ['regions', $scope.sltRegion, $scope.region], ['divisons', $scope.sltDivision, $scope.division], ['states', $scope.selectedStates], ['csa', $scope.selectedCSAs], ['msa', $scope.selectedMSAs], ['dma', $scope.selectedDMAs], ['county', $scope.selectedCountys], ['raceBera', $scope.sltRaceBera, $scope.raceBera], ['hispanicOrigin', $scope.hispanicOrigin, $scope.hispanic], ['children', $scope.chldTempArr, $scope.children], ['race', $scope.sltRace, $scope.newraceModal], ['relationships', $scope.sltRelation, $scope.newrelationModal], ['educations', $scope.sltEducation, $scope.groupingeducationModal], ['employments', $scope.sltEmployment, $scope.groupingemploymentModal], ['raceBera', $scope.sltRaceBera, $scope.groupingRaceBeraModel], ['device', $scope.sltDevice, $scope.groupingDeviceModel], ['regions', $scope.sltRegion, $scope.groupingCensusRgnModel], ['divisons', $scope.sltDivision, $scope.groupingDivisionModel], ['states', $scope.groupingStateModel], ['csa', $scope.groupingCsaModel], ['msa', $scope.groupingMsaModel], ['dma', $scope.groupingDmaModel], ['county', $scope.groupingCountyModel], ['zipcode', $scope.selectedZipcodes]];

            //Made an array to run a common loop for updating all grouped Quota Array
            //var allGroupedQuotaArr = [['race', $scope.sltRace, $scope.newraceModal], ['relationships', $scope.sltRelation, $scope.newrelationModal], ['educations', $scope.sltEducation, $scope.groupingeducationModal], ['employments', $scope.sltEmployment, $scope.groupingemploymentModal]]
            //Updating the Layered Quotas
            _.each(allQuotasArr, function(singleQuota){
                //console.log('singleQuota starting '+JSON.stringify(singleQuota));
                // Removing an extra row for age and income to ignore it from updating the quotas
                if((singleQuota[0] == 'age' && singleQuota[1].length > 0 && !singleQuota[1][0].max) || (singleQuota[0] == 'houseHoldIncome' && singleQuota[1].length > 0 &&  !singleQuota[1][0].max)){
                    singleQuota[1].splice(0, 1);
                    //Update Age and Income model on completes changes
                    updateAllLayeredQuota(singleQuota[1]);
                    //console.log('singleQuota 1 '+JSON.stringify(singleQuota[1]));
                }
                //Handle the children Model auto update on complete change
                if(singleQuota[0] == 'children') {
                    var children_TempArr = [];
                    _.each(_.keys(singleQuota[1]), function(singlekey) {
                        _.each(singleQuota[1][singlekey], function(checkSnglQl) {
                            if(checkSnglQl.number || checkSnglQl.number != "") {
                                children_TempArr.push(checkSnglQl);
                            }
                        })
                    })
                    updateAllLayeredQuota(children_TempArr); 
                    _.each(_.keys(singleQuota[1]), function(chld_qual){
                        var matchCommn = _.intersection(singleQuota[1][chld_qual], children_TempArr);
                        var unmatched = _.difference(singleQuota[1][chld_qual], children_TempArr);
                        var margeArry = _.union(matchCommn, unmatched);
                        singleQuota[1][chld_qual]  = matchCommn;
                        _.each(unmatched, function(sgglQuotaTop) {
                            singleQuota[1][chld_qual].unshift(sgglQuotaTop);
                        })
                    })
                }
                if(singleQuota[1] && singleQuota[1].length > 0){
                    if(!$scope.isNested(singleQuota[0])){
                        updateAllLayeredQuota(singleQuota[1]);
                        
                        //Updating the other arrays used to show on UI for some quotas
                        if(singleQuota[2]){
                            var gruopedAvailblFlg = false;
                            _.each(singleQuota[2], function(item){
                                //PD-961 condition grouping on completes change
                                if(_.has(item, "condditionGroup") && item.condditionGroup) {
                                    gruopedAvailblFlg = true;
   
                                    item.number = Math.round(($scope.completesNeeded * item.percentage) / 100);
                                    item.minimum = item.number;
                                    item.maximum = item.number;
                                } else {
                                    var row_num =  _.findIndex(singleQuota[1], {"id":item.id});
                                    //console.log('index '+row_num);
                                    if(row_num != -1){
                                        item.number = singleQuota[1][row_num].number;
                                        item.minimum = singleQuota[1][row_num].minimum;
                                        item.maximum = singleQuota[1][row_num].maximum;
                                        item.per = singleQuota[1][row_num].percentage;
                                        item.percentage = singleQuota[1][row_num].percentage;
                                    }
                                }
                            });
                            
                            if(gruopedAvailblFlg) { 
                               updateAllLayeredQuota(singleQuota[2]); 
                                singleQuota[1] = reAssignCompletesInGrouping(singleQuota[2], singleQuota[1]);
                            }
                        }
                    }
                }
                //Again adding the empty removed row from age and income
                if((singleQuota[0] == 'age' && singleQuota[1].length > 0 && singleQuota[1][0].max) || (singleQuota[0] == 'houseHoldIncome' && singleQuota[1].length > 0 && singleQuota[1][0].max)){
                    singleQuota[1].unshift({
                        "min": '',
                        "max": '',
                        "number": '',
                        "per": '',
                        "flexiblePer": singleQuota[1][0].flexiblePer,
                        "flexible": singleQuota[1][0].flexible
                    });
                    //console.log('singleQuota 1 '+JSON.stringify(singleQuota[1]));
                }
            });
            // For Recalculating NatRep Quotas when completes are updated if applied
            /*if($scope.locationData.selected && $scope.locationData.type == "natrep"){
                $timeout(function(){
                    setRegionForNationalRepresentative();
                }, 0);
            }*/
            // For updating Advance Quotas
            /*_.each(advQuota, function(singleQuota){
                var updatedAllcoation = Math.round((singleQuota.quantities.percentage * $scope.completesNeeded)/100);
                singleQuota.quantities['number'] = updatedAllcoation;
                singleQuota.quantities['percentage'] = singleQuota.quantities.percentage;
                singleQuota.quantities['minimum'] = Math.round(updatedAllcoation - (updatedAllcoation * singleQuota.quantities.flexibility/100));
                singleQuota.quantities['maximum'] = Math.round(updatedAllcoation + (updatedAllcoation * singleQuota.quantities.flexibility/100));
                console.log('\n\n singleQuota ',JSON.stringify(singleQuota))
            });
            _.each(advanceData, function(item){
                console.log('\n\n item ',JSON.stringify(item))
                _.each(item.selected[item.qualification_id[0]].answer_data, function(singleQuota){
                    var updatedAllcoation = Math.round((singleQuota.percentage * $scope.completesNeeded)/100);
                    singleQuota['number'] = updatedAllcoation;
                    singleQuota['percentage'] = singleQuota.percentage;
                    singleQuota['per'] = singleQuota.per;
                    singleQuota['minimum'] = Math.round(updatedAllcoation - (updatedAllcoation * singleQuota.flexibility/100));
                    singleQuota['maximum'] = Math.round(updatedAllcoation + (updatedAllcoation * singleQuota.flexibility/100));
                });
                console.log('\n\n item ',JSON.stringify(item))
            });*/
        }
        $scope.showLoader = ''; 
        $scope.loader.show = false;
    }
     /*PD-961*/
    function reAssignCompletesInGrouping(sourceQuotaData, destQuotaData) {
        _.each(destQuotaData, function(snglQuota) {
            var findQuota = _.findWhere(sourceQuotaData, {"name": snglQuota.name});
            if(findQuota) {
               snglQuota.number =  findQuota.number;
               snglQuota.minimum = findQuota.minimum || findQuota.number;
               snglQuota.maximum = findQuota.maximum || findQuota.number;
            }
            else {
               snglQuota.number =  0;
               snglQuota.minimum = 0;
               snglQuota.maximum = 0; 
            }
        })
        return destQuotaData;
    }
    /*--- Advance Targeting----*/
    $scope.advRange = {'condition':'less_than', 'max':0 , 'min': 0, 'orig_value': '' };
    $scope.saveAdvTarget = function(questionDetail){
        if(((questionDetail.question_type == 'multipunch' || questionDetail.question_type == 'singlepunch') && $scope.selectedOptions.length > 0 && angular.element( document.querySelector( '#advDays' ) ).val() != '') || (questionDetail.question_type == 'range' && $scope.advRange.orig_value != '' && $scope.advRange.orig_value != undefined && angular.element( document.querySelector( '#advDays' ) ).val() != '')){
            // Checking value should not be greater than 999
            if(questionDetail.question_type == 'range' && ($scope.advRange.orig_value <= 0 || $scope.advRange.orig_value >= 999)){
                notify({
                    message: "Value can't be less than or equal to 0 and greater than or equal to 999",
                    classes: 'alert-warning',
                    duration: 2000
                });
                return false;
            }

            var quotaExistIndex = _.findIndex(advanceData, {"respondent_question_id": questionDetail.respondent_question_id});
            // If question doesn't exists then push it otherwise update it
            if(quotaExistIndex == -1){
                var singleTarget = new Object();
                singleTarget = questionDetail;   // Adding whole response in payload
                //Creating data for selected answers for dropdown
                    singleTarget["selected"] = new Object();
                    singleTarget.selected[questionDetail.qualification_id[0]] = new Object();
                    if(questionDetail.stem2.indexOf('%%period%%') != -1){
                        singleTarget.selected['period'] = new Object();
                    }
                    var selected_answers = new Array();
                    if(questionDetail.question_type == 'range'){
                        selected_answers = {'condition':$scope.advRange.condition, 'from':$scope.advRange.min, 'to': $scope.advRange.max, 'orig_value':$scope.advRange.orig_value, 'units':singleTarget.units}
                        singleTarget["rangeQuesOption"] = $scope.rangeQuesOption;
                    }else{
                        _.each($scope.selectedOptions, function(answerId){
                            var ansObj = new Object();
                            ansObj["id"] = answerId;
                            ansObj["name"] = (_.findWhere(singleTarget.answers[questionDetail.qualification_id[0]].answer_data, {'id':parseInt(answerId)})).text;
                            ansObj["selected"] = true;
                            selected_answers.push(ansObj);
                        });
                    }
                // dropdown answers
                singleTarget.selected[questionDetail.qualification_id[0]]["answer_type"] = questionDetail.answers[questionDetail.qualification_id[0]].answer_type;
                singleTarget.selected[questionDetail.qualification_id[0]]["answer_data"] = selected_answers;
                singleTarget['hasQuota'] = false;
                // days value
                if(questionDetail.stem2.indexOf('%%period%%') != -1){
                    singleTarget.selected['period'] = new Object();
                    singleTarget.selected['period']["answer_type"] = "input";
                    singleTarget.selected['period']["answer_data"] = angular.element( document.querySelector( '#advDays' ) ).val();
                }
                advanceData.push(singleTarget);
                var tempCopyVal = {};
                angular.copy(singleTarget, tempCopyVal);
                $scope.advanceDataPayload.push(tempCopyVal);
            }else{
                // Updating the Advance Data Array
                    var selected_answers_update = new Array();
                    if(questionDetail.question_type == 'range'){
                        selected_answers_update = {'condition':$scope.advRange.condition, 'from':$scope.advRange.min, 'to':$scope.advRange.max, 'orig_value':$scope.advRange.orig_value, 'units':questionDetail.units}
                    }else{
                        _.each($scope.selectedOptions, function(answerId){
                            var ansObj = new Object();
                            ansObj["id"] = answerId;
                            ansObj["name"] = (_.findWhere(questionDetail.answers[questionDetail.qualification_id[0]].answer_data, {'id':parseInt(answerId)})).text;
                            ansObj["selected"] = true;
                            selected_answers_update.push(ansObj);
                        });
                    }
                advanceData[quotaExistIndex].selected[advanceData[quotaExistIndex].qualification_id[0]].answer_data = selected_answers_update;
                if(advanceData[quotaExistIndex].stem2.indexOf('%%period%%') != -1){
                    advanceData[quotaExistIndex].selected['period'].answer_data = angular.element( document.querySelector( '#advDays' ) ).val();
                }
                $scope.advanceDataPayload[quotaExistIndex].selected[$scope.advanceDataPayload[quotaExistIndex].qualification_id[0]].answer_data = selected_answers_update;
                if($scope.advanceDataPayload[quotaExistIndex].stem2.indexOf('%%period%%') != -1){
                    $scope.advanceDataPayload[quotaExistIndex].selected['period'].answer_data = angular.element( document.querySelector( '#advDays' ) ).val();
                }
            }

            // For Button Data Array
            var buttonExistIndex = _.findIndex($scope.tempAdvArray, {"respondent_question_id": questionDetail.respondent_question_id});
            if(buttonExistIndex == -1){ // if not in the array then add it
                if(singleTarget.question_type == 'range'){
                    $scope.tempAdvArray.push({
                        "respondent_question_id": singleTarget.respondent_question_id,
                        "stem1": singleTarget.stem1,
                        "stem1_ui": singleTarget.stem1_ui,
                        "stem2": singleTarget.stem2,
                        "selected": singleTarget.selected,
                        "qualification_id": singleTarget.qualification_id,
                        "range" : {
                            'condition': singleTarget.selected[singleTarget.qualification_id[0]].answer_data.condition,
                            'from': singleTarget.selected[singleTarget.qualification_id[0]].answer_data.from,
                            'to': singleTarget.selected[singleTarget.qualification_id[0]].answer_data.to,
                            'orig_value': singleTarget.selected[singleTarget.qualification_id[0]].answer_data.orig_value
                        },
                        "question_type" :singleTarget.question_type,
                        "answers" : singleTarget.answers,
                        "buyer_text" : singleTarget.buyer_text,
                        "question_description" : singleTarget.question_description,
                        "rangeQuesOption": $scope.rangeQuesOption
                    });
                }else{
                    $scope.tempAdvArray.push({
                        "respondent_question_id": singleTarget.respondent_question_id,
                        "stem1": singleTarget.stem1,
                        "stem1_ui": singleTarget.stem1_ui,
                        "stem2": singleTarget.stem2,
                        "selected": singleTarget.selected,
                        "qualification_id": singleTarget.qualification_id,
                        "allOptions": singleTarget.answers[singleTarget.qualification_id[0]].answer_data,
                        "question_type" :singleTarget.question_type,
                        "answers" : singleTarget.answers,
                        "buyer_text" : singleTarget.buyer_text,
                        "question_description" : singleTarget.question_description,
                        "hasQuota":false
                    });
                }
                notify({
                    message: 'Successfully Added',
                    classes: 'alert-success',
                    duration: 2000
                });
            }else{
                $scope.tempAdvArray[buttonExistIndex].stem1 = questionDetail.stem1;
                $scope.tempAdvArray[buttonExistIndex].stem2 = questionDetail.stem2;
                $scope.tempAdvArray[buttonExistIndex].selected = questionDetail.selected;
                if(questionDetail.question_type == 'range'){
                    $scope.tempAdvArray[buttonExistIndex].range = {
                        'condition': $scope.advRange.condition,
                        'from': $scope.advRange.min,
                        'to': $scope.advRange.max,
                        'orig_value': $scope.advRange.orig_value,
                        'units':questionDetail.units
                    }
                }else{
                    $scope.tempAdvArray[buttonExistIndex].allOptions = questionDetail.allOptions;
                }
                //console.log('$scope.tempAdvArray '+JSON.stringify($scope.tempAdvArray));
                notify({
                    message: 'Details Successfully Updated',
                    classes: 'alert-success',
                    duration: 2000
                });
            }
            // For Qualifications
            var qualExistIndex = _.findIndex(advanceQual, {"qualification_code": questionDetail.qualification_id[0]});
            if(qualExistIndex == -1){
                // If Qual doesn't exist then push it
                if(singleTarget.question_type == 'range'){
                    var period = angular.element( document.querySelector( '#advDays' ) ).val();
                    advanceQual.push({
                        "qualification_code": singleTarget.qualification_id[0],
                        "q_type": "range",
                        "q_category": "advance",
                        "q_name": (_.findWhere(masterData, {"id":parseInt(singleTarget.qualification_id[0])})).masterKey,
                        "range_sets":{'from':$scope.advRange.min, 'to':$scope.advRange.max, 'units': singleTarget.units, "period":parseInt(period) ? parseInt(period): ''}
                    });
                }else{
                    var adv_conditions = new Array();
                    _.each(singleTarget.selected[singleTarget.qualification_id[0]].answer_data, function(answer){
                        adv_conditions.push({
                            "id":  answer.id,
                            "name": answer.name
                        });
                    });
                    advanceQual.push({
                        "qualification_code": singleTarget.qualification_id[0],
                        "q_type": "normal", 
                        "q_category": "advance",
                        "q_name": (_.findWhere(masterData, {"id":parseInt(singleTarget.qualification_id[0])})).masterKey,
                        "conditions":adv_conditions
                    });
                }
                //console.log('advanceQual '+JSON.stringify(advanceQual));
            }else{
                // If Qual id pushed then update the data
                var period = angular.element( document.querySelector( '#advDays' ) ).val();
                advanceQual[qualExistIndex].qualification_code = questionDetail.qualification_id[0];
                advanceQual[qualExistIndex].q_name = (_.findWhere(masterData, {"id":parseInt(questionDetail.qualification_id[0])})).masterKey;
                if(questionDetail.question_type == 'range'){
                    advanceQual[qualExistIndex].q_type = "range";
                    advanceQual[qualExistIndex].range_sets = {'from':$scope.advRange.min, 'to':$scope.advRange.max, 'units':questionDetail.selected[questionDetail.qualification_id[0]].answer_data.units, "period": parseInt(period) ? parseInt(period): ''};
                }else{
                    var adv_conditions = new Array();
                    _.each(questionDetail.selected[questionDetail.qualification_id[0]].answer_data, function(answer){
                        adv_conditions.push({
                            "id":  answer.id,
                            "name": answer.name
                        });
                    });
                    advanceQual[qualExistIndex].conditions = adv_conditions;
                    advanceQual[qualExistIndex].q_type = "normal";
                }
            }
            //For clearing modal fields
            $timeout(function(){
                angular.element('#advanceTargetingModal button.advclose').trigger('click');
            }, 0);
            $scope.clearAdvModal();
            if(questionDetail.hasQuota){
                $scope.delAdvQuota(questionDetail.qualification_id[0], $scope.tempAdvArray);
            }
        }else{
            notify({
                message: "Please enter all the fields",
                classes: 'alert-warning',
                duration: 2000
            });
        }
        
    }

    $scope.lockQuestion =  false;
    $scope.openAdvTargetModal = function(quesData){
        $scope.selectedOptions = [];
        $scope.myOptions = [];
        if(quesData.question_type == "range"){
            $scope.advRange.condition = quesData.range.condition;
            $scope.advRange.orig_value = quesData.range.orig_value;
            $scope.advRange.min = quesData.range.from;
            $scope.advRange.max = quesData.range.to;
            $scope.rangeQuesOption = quesData.rangeQuesOption;
        }else{
            $scope.myOptions = quesData.allOptions;
            _.each(quesData.selected[quesData.qualification_id[0]].answer_data, function(item){
                $scope.selectedOptions.push(item.id);
            });
        }
        // Question Text variable from directive
        $scope.questionText = quesData.question_description;
        // Filling Question details in QuestionDetail Obj
        $scope.questionDetail = quesData;
        // Appending the days row html
        var stem2 = quesData.stem2;
        // Check if stem 2 have qualificaiton id or not, if exist then split otherwise directly update
        if(quesData.stem2.indexOf('%%period%%') != -1){
            stem2 = stem2.split('%%period%%');
            angular.element( document.querySelector( '#days_row' ) ).html(stem2[0]+'<input type="number" id="advDays" ng-model="advDays" value="'+quesData.selected['period'].answer_data+'">'+stem2[1]);
        }else{
            angular.element( document.querySelector( '#days_row' ) ).html(stem2);
        }
        // Function fires only on the applied advance targeting button
        $scope.lockQuestion =  true;
    }

    $scope.optionConfig = {
        create: true,
        valueField: 'id',
        labelField: 'text',
        delimiter: '|',
        placeholder: 'Pick something',
        sortField: false, 
        onInitialize: function(selectize){
            // receives the selectize object as an argument
            console.log('onInitialize');
        },
        onChange : function(selectize){
            //Adding Id's in selected options
            //var selectedlength = $scope.selectedOptions.length;
            $scope.selectedOptions = selectize;
            
        },
        onOptionAdd : function(selectize){
            console.log('onOptionAdd');
        }
      // maxItems: 1
    };

    $scope.calculateAdvRange = function(){
        // Calculating min max for less than greater than condition
        if($scope.advRange.orig_value != undefined && ($scope.advRange.condition == 'less_than' || $scope.advRange.condition == 'less than')){
            $scope.advRange.max = $scope.advRange.orig_value - 1;
            $scope.advRange.min = 0;
        }else if($scope.advRange.orig_value != undefined && ($scope.advRange.condition == 'more_than' || $scope.advRange.condition == 'more than')){
            $scope.advRange.max = 999;
            $scope.advRange.min = $scope.advRange.orig_value + 1;
        }
    }

    $scope.clearAdvModal =  function(){
        $scope.selectedOptions = [];
        $scope.myOptions = [];
        angular.element( document.querySelector( '#days_row' ) ).html('');
        $scope.questionText = "";
        $scope.advRange = {'condition':'less_than', 'max': 0, 'min': 0, 'orig_value': '' };
        $scope.questionDetail = {};
        // For unlocking the Question Selection Box
        $scope.lockQuestion =  false;
    };

    $scope.deleteAdvTarget = function(resp_id, qual_id){
        // remove from button showing temp array
        var buttonIndex = _.findIndex($scope.tempAdvArray, {'respondent_question_id':resp_id});
        // Removing from advance Data
        var dataIndex = _.findIndex(advanceData, {'respondent_question_id':resp_id});
        if(buttonIndex != -1 && dataIndex != -1){
            $scope.tempAdvArray.splice(buttonIndex, 1);
            advanceData.splice(dataIndex, 1);
            //Remove From qual array if exist
            var qualIndex = _.findIndex(advanceQual, {'qualification_code':qual_id});
            if(qualIndex != -1){
                advanceQual.splice(qualIndex, 1);
            }

            $timeout(function(){
                angular.element('#advanceTargetingModal button.advclose').trigger('click');
            }, 0);

            $scope.delAdvQuota(qual_id, $scope.tempAdvArray);

            notify({
                message: "Target successfully removed",
                classes: 'alert-success',
                duration: 2000
            });
        }else{
            notify({
                message: "Target doesn't exist",
                classes: 'alert-warning',
                duration: 2000
            });
        }
    }

    $scope.removeAllAdvTarget = function(){
        $scope.selectedOptions = [];  // Hold selected Options
        advanceQual = [];       // Used for the advance qualifications
        advanceData = [];      // Using for creating payload
        $scope.tempAdvArray = [];   // Using for showing buttons and their data
        advQuota = [];
    }

    /*
    *Function to apply Census Repo on Quotas PD-1130
    */
    $scope.applyCensusRepo = function(quotaName) {
        var QualId = "";
        var tmpCensusArrQuta = new Array();
        var censusRepData = _.findWhere(masterData, {"masterKey":"census_rep"});
        if(quotaName == "genderModal") {
            if($scope.gndrQuotaFlag.editGndrFlag) {
                if(!confirm("Setting Census Rep for this Qualification will reset your selections. Do you wish to continue?")) {
                    return;
                }
            }
            QualId = genderQual[0].qualification_code;
            $scope.censusRepoFlag.hasCensusRepoGndr = true;
        }
        else if(quotaName == "raceModal") {
            if($scope.raceQuotaFlag.editRaceFlag) {
                if(!confirm("Setting Census Rep for this Qualification will reset your selections. Do you wish to continue?")) {
                    return;
                }
            }
            QualId = raceQual[0].qualification_code;
            $scope.censusRepoFlag.hasCensusRepoRace = true;
        }
        else if(quotaName == "hispanicModal") {
            if($scope.hisQuotaFlag.editHisOriFlag) {
                if(!confirm("Setting Census Rep for this Qualification will reset your selections. Do you wish to continue?")) {
                    return;
                }
            }
            QualId = hispanicQual[0].qualification_code;
            $scope.censusRepoFlag.hasCensusRepoHis = true;
        }
        else if(quotaName == 'age') {
            if($scope.ageQuotaFlag.editAgeFlag) {
                if(!confirm("Setting Census Rep for this Qualification will reset your selections. Do you wish to continue?")) {
                    return;
                }
            }
            QualId = ageQual[0].qualification_code;
            $scope.censusRepoFlag.hasCensusRepoAge = true;
        }
        else if(quotaName == "income") {
            if($scope.incomeQuotaFlag.editIncomeFlag) {
                if(!confirm("Setting Census Rep for this Qualification will reset your selections. Do you wish to continue?")) {
                    return;
                }
            }
            QualId = incomeQual[0].qualification_code; 
            $scope.censusRepoFlag.hasCensusRepoIncome = true;
        }
        else if(quotaName == "empModal") {
            if($scope.empQuotaFlag.editEmpFlag) {
                if(!confirm("Setting Census Rep for this Qualification will reset your selections. Do you wish to continue?")) {
                    return;
                }
            }
            QualId = empQual[0].qualification_code;
            $scope.censusRepoFlag.hasCensusRepoEmploy = true;
        }
        else {
            if(quotaName == "eduModal") {
                if($scope.eduQuotaFlag.editEduFlag) {
                    if(!confirm("Setting Census Rep for this Qualification will reset your selections. Do you wish to continue?")) {
                        return;
                    }
                }
                QualId = eduQual[0].qualification_code; 
                $scope.censusRepoFlag.hasCensusRepoEdu = true;
            }
        }
        _.each(censusRepData.data.US.eng, function(repoData){
            var repoDataKey = _.keys(repoData);
            if(parseInt(repoDataKey[0]) == parseInt(QualId)) {
                var assignedTotalCmplt = 0;

                _.each(repoData[parseInt(QualId)], function(itrRepoData) {
                    if(itrRepoData.rep_value < 1) {
                        itrRepoData.rep_value = 1;
                    }
                    var tempNumber = Math.round(($scope.completesNeeded * itrRepoData.rep_value) / 100);
                    if(tempNumber <= 0) {
                        tempNumber += 1;
                    }
                    assignedTotalCmplt += tempNumber;

                    var minimum = Math.round(tempNumber - (tempNumber * parseInt(0)) / 100);

                    var setTmpObject = {
                        flexible:true,
                        flexiblePer:0,
                        hasValidQuotas:true,
                        maximum:minimum,
                        minimum:minimum,
                        number:tempNumber,
                        percentage:itrRepoData.rep_value,
                        hasCensusRepoQuota: true
                    }
                    if(quotaName == 'age' || quotaName == "income") {
                      setTmpObject.achieved = 0;
                      setTmpObject.flexPer = 0;
                      setTmpObject.max = itrRepoData.max;
                      setTmpObject.min = itrRepoData.min;
                      setTmpObject.per = itrRepoData.rep_value;
                      setTmpObject.qual_id = parseInt(QualId);
                    }

                    if(quotaName == "genderModal" || quotaName == "raceModal" || quotaName == "hispanicModal" || quotaName == "eduModal" || quotaName == "empModal") {
                        setTmpObject.id = itrRepoData.condition_code;
                        setTmpObject.name = itrRepoData.name;
                        setTmpObject.selected = true;
                    }

                    tmpCensusArrQuta.push(setTmpObject);
                })
                /******************Adjust Completes Number*******************/
                var finMaxNumber = _.max(tmpCensusArrQuta, function(rtnNmber){ return rtnNmber.number; });
                var indexOfMaxNumber = _.indexOf(tmpCensusArrQuta, finMaxNumber);

                if(assignedTotalCmplt > $scope.completesNeeded) {
                    tmpCensusArrQuta[indexOfMaxNumber].number = tmpCensusArrQuta[indexOfMaxNumber].number - (assignedTotalCmplt - $scope.completesNeeded);
                        tmpCensusArrQuta[indexOfMaxNumber].maximum = tmpCensusArrQuta[indexOfMaxNumber].number;
                        tmpCensusArrQuta[indexOfMaxNumber].minimum = tmpCensusArrQuta[indexOfMaxNumber].number;
                        tmpCensusArrQuta[indexOfMaxNumber].percentage = Math.round((tmpCensusArrQuta[indexOfMaxNumber].number * 100) / $scope.completesNeeded);
                }
                else {
                     tmpCensusArrQuta[indexOfMaxNumber].number = tmpCensusArrQuta[indexOfMaxNumber].number + ($scope.completesNeeded - assignedTotalCmplt);
                        tmpCensusArrQuta[indexOfMaxNumber].maximum = tmpCensusArrQuta[indexOfMaxNumber].number;
                        tmpCensusArrQuta[indexOfMaxNumber].minimum = tmpCensusArrQuta[indexOfMaxNumber].number;
                        tmpCensusArrQuta[indexOfMaxNumber].percentage = Math.round((tmpCensusArrQuta[indexOfMaxNumber].number * 100) / $scope.completesNeeded);
                }


                var setExtraObj = {
                    "min": '',
                    "max": '',
                    "number": '',
                    "per": '',
                    "flexPer": '',
                    "flexible": $scope.ageQuotaFlag.ageFlx
                }
                if(quotaName == 'age') {
                    $scope.ageTempArr = tmpCensusArrQuta;
                    $scope.ageQuotaFlag.hasAgeFlag = true;
                    $scope.ageQuotaFlag.editAgeFlag = true;
                    $scope.ageQuotaFlag.clearAgeFlag = true;
                    var minAge = _.min($scope.ageTempArr, function(snglIncm){ return snglIncm.min });
                    var maxAge = _.max($scope.ageTempArr, function(snglIncm){ return snglIncm.max });
                    $scope.ageData.min = minAge.min;
                    $scope.ageData.max = maxAge.max;
                    $scope.ageTempArr.unshift(setExtraObj);
                } 
                if(quotaName == "income") {
                    $scope.incomeTempArr = tmpCensusArrQuta;
                    var minmumIncm = _.min($scope.incomeTempArr, function(snglIncm){ return snglIncm.min; });
                    var maximIncm = _.max($scope.incomeTempArr, function(snglIncm){ return snglIncm.max; });
                    $scope.houseHoldIncome.min = minmumIncm.min;
                    $scope.houseHoldIncome.max = maximIncm.max;
                    $scope.incomeQuotaFlag.hasIncomeFlag = true;
                    $scope.incomeQuotaFlag.editIncomeFlag = true;
                    $scope.incomeQuotaFlag.clearIncomeFlag = true;
                    $scope.incomeTempArr.unshift(setExtraObj);
                }
                if(quotaName == "genderModal") {
                    $scope.genderInfo = addCensusRepoFlagQuotas($scope.genderInfo);
                    $scope.sltGender = tmpCensusArrQuta;
                    $scope.genderInfo = updateQuotaModelsProps($scope.sltGender, $scope.genderInfo);
                    $scope.gndrQuotaFlag.hasGndrFlag = true;
                    $scope.gndrQuotaFlag.editGndrFlag = true;
                }
                if(quotaName == "raceModal") {
                    //PD-961
                    if($scope.isGrouped('race')) {
                        $scope.race = resetGroupingQuotaOnCensusApply($scope.newraceModal, tmpCensusArrQuta);
                    }
                    $scope.race = addCensusRepoFlagQuotas($scope.race);
                    $scope.sltRace = tmpCensusArrQuta;
                    $scope.race = updateQuotaModelsProps($scope.sltRace, $scope.race);
                    $scope.raceQuotaFlag.editRaceFlag = true; 
                    $scope.raceQuotaFlag.hasRaceFlag = true;
                    //PD-961
                    $scope.newraceModal = [];
                    raceModelLiveEdit = [];
                    removeGroupingOnResetQuota('race');

                }
                if(quotaName == "empModal") {
                     if($scope.isGrouped('employments')) {
                        $scope.employement = resetGroupingQuotaOnCensusApply($scope.groupingemploymentModal, tmpCensusArrQuta);
                    }
                    $scope.employement = addCensusRepoFlagQuotas($scope.employement);
                    $scope.sltEmployment = tmpCensusArrQuta;
                    console.log("$scope.employement>>>>>>>", JSON.stringify($scope.employement))
                    $scope.employement = updateQuotaModelsProps($scope.sltEmployment, $scope.employement);
                    console.log("$scope.sltEmployment>>>>>>>", JSON.stringify($scope.sltEmployment))
                    $scope.empQuotaFlag.editEmpFlag = true;
                    $scope.empQuotaFlag.hasEmpFlag = true;
                    $scope.groupingemploymentModal = [];
                    employmentModelLiveEdit = [];
                    removeGroupingOnResetQuota('employments');
                }
                if(quotaName == "hispanicModal") {
                    $scope.hispanic = addCensusRepoFlagQuotas($scope.hispanic);
                    $scope.hispanicOrigin = tmpCensusArrQuta;
                    $scope.hispanic = updateQuotaModelsProps($scope.hispanicOrigin, $scope.hispanic);
                    $scope.hisQuotaFlag.editHisOriFlag = true;
                    $scope.hisQuotaFlag.hasHisOriFlag = true;
                }
                if(quotaName == "eduModal") {
                    if($scope.isGrouped('educations')) {
                        $scope.education = resetGroupingQuotaOnCensusApply($scope.groupingeducationModal, tmpCensusArrQuta);
                    }
                    
                    $scope.education = addCensusRepoFlagQuotas($scope.education);
                    $scope.sltEducation = tmpCensusArrQuta;
                    $scope.education = updateQuotaModelsProps($scope.sltEducation, $scope.education);
                    $scope.eduQuotaFlag.editEduFlag = true;
                    $scope.eduQuotaFlag.hasEduFlag = true;
                    //PD-961
                    $scope.groupingeducationModal = [];
                    educationModelLiveEdit = [];
                    removeGroupingOnResetQuota('educations');
                }
            }
        });   
    }

    //Function to set census Repo flag in race, education, gender and hispanic models
    function addCensusRepoFlagQuotas(respectiveQuotas) {
        _.each(respectiveQuotas, function(quota){
            quota.hasCensusRepoQuota = true;
        });
        return respectiveQuotas;
    }

    //Function to re_Structure Quota Models On Census Apply on Condition Grouping PD-961
    function resetGroupingQuotaOnCensusApply(QuotaModel, propsUpdtArray) {
        var getgroupedQuotas = _.where(QuotaModel, {"condditionGroup": true});
        if(getgroupedQuotas.length > 0) {
            _.each(getgroupedQuotas, function(grpQuota) {
                var quota_NameArr = grpQuota.name.split(' or ');
                _.each(quota_NameArr, function(snglName) {
                    var temSwapObj = _.clone(grpQuota);
                    var findCensQta = _.findWhere(propsUpdtArray, {"name": snglName.trim()});

                    if(findCensQta) {
                        temSwapObj.id = findCensQta.id;
                        temSwapObj.number = findCensQta.number;
                        temSwapObj.minimum = findCensQta.minimum;
                        temSwapObj.maximum = findCensQta.maximum;
                        temSwapObj.name = findCensQta.name;
                        temSwapObj.percentage = findCensQta.percentage;
                        temSwapObj.per = findCensQta.percentage;
                        delete temSwapObj.condditionGroup;
                        delete temSwapObj.$$hashKey;
                        QuotaModel.push(temSwapObj);
                    }
                });
                var findIndex = _.indexOf(QuotaModel, grpQuota);
                if(findIndex > -1) {
                    QuotaModel.splice(findIndex, 1);
                }
            });
        }
        return QuotaModel;
    }

    function updateQuotaModelsProps(sourceArr, destArr) {
        _.each(destArr, function(singleDst) {
            var findCensusQta = _.findWhere(sourceArr, {"id" : singleDst.id});
            if(findCensusQta) {
               singleDst.minimum =  findCensusQta.minimum,
               singleDst.maximum =  findCensusQta.maximum,
               singleDst.number =  findCensusQta.number,
               singleDst.per =  findCensusQta.per,
               singleDst.selected =  findCensusQta.selected
            }
        });
        return destArr;
    }

    $scope.showChildrenRow = function(id){
        if($scope.children && _.findWhere($scope.children, {'id':parseInt(id)}).selected){
            return true;
        }else{
            return false;
        }
    }

    //Function to group All Quota PD-961
    $scope.selectedQuotaGrouping = function(modelname, groupingModelData) {
        var newRow = "";
        var tempraceModal = new Array();
        var setGroupingModal = new Array();
        var mapHasQuotaFlg = false;
        var totalNumber = 0;
        var temp_id = [];
        var tempname_arr = [];
        var temp_Qual_id = 0;
        if(modelname == "race") {
            if($scope.censusRepoFlag.hasCensusRepoRace) {
                notify({message:'Quota Grouping is not allowed over Census Repo',classes:'alert-warning',duration:3000} );
                return false;
            }
            if(!$scope.isGrouped('race')) {
              $scope.newraceModal = [];  
              removeGroupingOnResetQuota("race"); 
            }
            setGroupingModal = $scope.newraceModal;
        }
        else if(modelname == "relationships") {
            if(!$scope.isGrouped('relationships')) {
              $scope.newrelationModal = []; 
               removeGroupingOnResetQuota("relationships"); 
            }
            setGroupingModal = $scope.newrelationModal;
        } 
        else if(modelname == "employments") {
            if($scope.censusRepoFlag.hasCensusRepoEmploy) {
                notify({message:'Quota Grouping is not allowed over Census Repo',classes:'alert-warning',duration:3000} );
                return false;
            }
            if(!$scope.isGrouped('employments')) {
              $scope.groupingemploymentModal = []; 
              
               removeGroupingOnResetQuota("employments"); 
            }
            setGroupingModal = $scope.groupingemploymentModal;
        }
        else if(modelname == "educations") {
                if($scope.censusRepoFlag.hasCensusRepoEdu) {
                    notify({message:'Quota Grouping is not allowed over Census',classes:'alert-warning',duration:3000} );
                    return false;
                }
                if(!$scope.isGrouped('educations')) {
                  $scope.groupingeducationModal = [];
                  removeGroupingOnResetQuota("educations");  
                }
                setGroupingModal = $scope.groupingeducationModal;
        }
        else if(modelname == "raceBera") {
            if(!$scope.isGrouped('raceBera')) {
              $scope.groupingRaceBeraModel = [];
              removeGroupingOnResetQuota("raceBera");      
            }
            setGroupingModal = $scope.groupingRaceBeraModel;
        }
        else if(modelname == "device") {
            if(!$scope.isGrouped('device')) {
              $scope.groupingDeviceModel = [];
              removeGroupingOnResetQuota("device");  
            }
            setGroupingModal = $scope.groupingDeviceModel;
        }
        else if(modelname == "regions") {
            if(!$scope.isGrouped('regions')) {
              $scope.groupingCensusRgnModel = [];
              removeGroupingOnResetQuota("regions");   
            }
            setGroupingModal = $scope.groupingCensusRgnModel;
        }
        else if(modelname == "divisions") {
            if(!$scope.isGrouped('divisions')) {
              $scope.groupingDivisionModel = [];
              removeGroupingOnResetQuota("divisions"); 
            }
            setGroupingModal = $scope.groupingDivisionModel;
        }
        else if(modelname == "states") {
            if(!$scope.isGrouped('states')) {
              $scope.groupingStateModel = [];
             removeGroupingOnResetQuota("states");  
            }
            setGroupingModal = $scope.groupingStateModel;
        }
        else if(modelname == "csa") {
           if(!$scope.isGrouped('csa')) {
              $scope.groupingCsaModel = [];
              removeGroupingOnResetQuota("csa");   
            }
            setGroupingModal = $scope.groupingCsaModel; 
        }
        else if(modelname == "dma") {
            if(!$scope.isGrouped('dma')) {
              $scope.groupingDmaModel = [];
               removeGroupingOnResetQuota("dma");    
            }
            setGroupingModal = $scope.groupingDmaModel;
        }
        else if(modelname == "msa") {
            if(!$scope.isGrouped('msa')) {
              $scope.groupingMsaModel = [];
              removeGroupingOnResetQuota("msa"); 
            }
            setGroupingModal = $scope.groupingMsaModel;
        }
        else {
            if(modelname == "county") {
                if(!$scope.isGrouped('county')) {
                  $scope.groupingCountyModel = [];
                  removeGroupingOnResetQuota("county");
                }
                setGroupingModal = $scope.groupingCountyModel;
            }
        }
        // Single grouping not allowed
        if(setGroupingModal.length > 0) {
            var matchCount =  _.countBy(setGroupingModal, function(countQuota) {
              return countQuota.condditionGroup == true ? 'groupQuotaCount': 'singleQuota';
            });
            if(matchCount.singleQuota == 1) {
                notify({message:'Grouping for single Quota not allowed',classes:'alert-warning',duration:3000} );
                return false;
            }

            var matchCountOther =  _.countBy(setGroupingModal, function(countQuota) {
              return (countQuota.setGrupActive == true && countQuota.condditionGroup != true) ? 'groupQuotaCount': 'singleQuota';
            });
            if(matchCountOther.groupQuotaCount == 1) {
                notify({message:'Grouping for single Quota not allowed',classes:'alert-warning',duration:3000} );
                return false;
            }
        }
        else {
           var matchCountOther =  _.countBy(groupingModelData, function(countQuota) {
              return (countQuota.setGrupActive == true && countQuota.condditionGroup != true) ? 'groupQuotaCount': 'singleQuota';
            });
            if(matchCountOther.groupQuotaCount == 1) {
                notify({message:'Grouping for single Quota not allowed',classes:'alert-warning',duration:3000} );
                return false;
            }
        }
        

        if(setGroupingModal.length <= 0) {
            _.each(groupingModelData, function(raceProps, index) {
                if(raceProps.setGrupActive) {
                    if(raceProps.condditionGroup != true) {
                        newRow = newRow + raceProps.name + " " +"or" + " ";
                        raceProps.id = raceProps.id;
                        temp_id.push(raceProps.id);
                        tempname_arr.push(raceProps.name);
                    } 
                    else {
                        setGroupingModal.push(raceProps);
                    } 
                    if(raceProps.number) {
                        totalNumber += raceProps.number
                    }
                    temp_Qual_id = raceProps.qual_id;
                }
                else {
                    setGroupingModal.push(raceProps);
                }
            });
            if(newRow != "" && newRow.length > 0) {
                var obj = {
                    maximum:"",
                    minimum:"",
                    name:newRow.substring(0, newRow.length - 3),
                    number:"",
                    per:"",
                    qual_name:modelname,
                    selected:true,
                    condditionGroup: true,
                    flexiblePer:0,
                    name_arr: tempname_arr,
                    id:temp_id,
                    qual_id: temp_Qual_id
                }
                setGroupingModal.push(obj);
            }
            _.each(setGroupingModal, function(addFlex) {
                addFlex.flexiblePer = 0;
            })
            if(modelname == "race") {
                manageCondtitionGroupingArray("race", setGroupingModal);
                $scope.newraceModal = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);
            }
            else if(modelname == "relationships") {
                    manageCondtitionGroupingArray("relationships", setGroupingModal);
                    $scope.newrelationModal = setGroupingModal;
                    $scope.quotaTotalRemRace += parseInt(totalNumber);
            }
            else if(modelname == "employments") {
                    manageCondtitionGroupingArray("employments", setGroupingModal);
                    $scope.groupingemploymentModal = setGroupingModal;
                    $scope.quotaTotalRemRace += parseInt(totalNumber);
            }
            else if(modelname == "educations") {
                manageCondtitionGroupingArray("educations", setGroupingModal);
                $scope.groupingeducationModal = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);
            }
            else if(modelname == "raceBera") {
                manageCondtitionGroupingArray("raceBera", setGroupingModal);
                $scope.groupingRaceBeraModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);
            }
            else if(modelname == "device") {
                manageCondtitionGroupingArray("device", setGroupingModal);
                $scope.groupingDeviceModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber); 
            }
            else if(modelname == "regions") {
                manageCondtitionGroupingArray("regions", setGroupingModal);
                $scope.groupingCensusRgnModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber); 
            }
            else if(modelname == "divisions") {
                manageCondtitionGroupingArray("divisions", setGroupingModal);
                $scope.groupingDivisionModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber); 
            } 
            else if(modelname == "states") {
                manageCondtitionGroupingArray("states", setGroupingModal);
                $scope.groupingStateModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber); 
            }
            else if(modelname == "csa") {
               manageCondtitionGroupingArray("csa", setGroupingModal);
                $scope.groupingCsaModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);  
            }
            else if(modelname == "dma") {
                manageCondtitionGroupingArray("dma", setGroupingModal);
                $scope.groupingDmaModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);  
            }
            else if(modelname == "msa") {
                manageCondtitionGroupingArray("msa", setGroupingModal);
                $scope.groupingMsaModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);  
            }
            else {
                if(modelname == "county") {
                    manageCondtitionGroupingArray("county", setGroupingModal);
                    $scope.groupingCountyModel = setGroupingModal;
                    $scope.quotaTotalRemRace += parseInt(totalNumber);  
                }
            }
        }
        else {
            _.each(setGroupingModal, function(raceProps, index) {
                if(raceProps.setGrupActive) {
                    if(raceProps.condditionGroup != true) {
                        newRow = newRow + raceProps.name + " " +"or" + " ";
                        raceProps.id = raceProps.id;
                        temp_id.push(raceProps.id);
                        tempname_arr.push(raceProps.name);
                    }
                     else {
                        tempraceModal.push(raceProps);
                    } 
                    if(raceProps.number) {
                        totalNumber += raceProps.number
                    }
                    temp_Qual_id = raceProps.qual_id;

                }
                else {
                    tempraceModal.push(raceProps);
                }
            });
            if(newRow != "" && newRow.length > 0) {
                var obj = {
                    maximum:"",
                    minimum:"",
                    name:newRow.substring(0, newRow.length - 3),
                    number:"",
                    per:"",
                    qual_name:modelname,
                    selected:true,
                    condditionGroup: true,
                    flexiblePer:0,
                    name_arr: tempname_arr,
                    id:temp_id,
                    qual_id: temp_Qual_id
                }
                tempraceModal.push(obj);
            }
            setGroupingModal = tempraceModal;
            _.each(setGroupingModal, function(addFlex) {
                addFlex.flexiblePer = 0;
            })
            
            if(modelname == "race") {
                manageCondtitionGroupingArray("race", setGroupingModal);
                $scope.newraceModal = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);
            }
            else if(modelname == "relationships") {
                    manageCondtitionGroupingArray("relationships", setGroupingModal);
                    $scope.newrelationModal = setGroupingModal;
                    $scope.quotaTotalRemRace += parseInt(totalNumber);
            }
            else if(modelname == "employments") {
                    manageCondtitionGroupingArray("employments", setGroupingModal);
                    $scope.groupingemploymentModal = setGroupingModal;
                    $scope.quotaTotalRemRace += parseInt(totalNumber);
            }
            else if(modelname == "educations") {
                manageCondtitionGroupingArray("educations", setGroupingModal);
                $scope.groupingeducationModal = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);
            }
            else if(modelname == "raceBera") {
                manageCondtitionGroupingArray("raceBera", setGroupingModal);
                $scope.groupingRaceBeraModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);
            }
            else if(modelname == "device") {
                manageCondtitionGroupingArray("device", setGroupingModal);
                $scope.groupingDeviceModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);
            }
            else if(modelname == "regions") {
                manageCondtitionGroupingArray("regions", setGroupingModal);
                $scope.groupingCensusRgnModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber); 
            }
            else if(modelname == "divisions") {
                manageCondtitionGroupingArray("divisions", setGroupingModal);
                $scope.groupingDivisionModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber); 
            } 
            else if(modelname == "states") {
                manageCondtitionGroupingArray("states", setGroupingModal);
                $scope.groupingStateModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber); 
            }
            else if(modelname == "csa") {
               manageCondtitionGroupingArray("csa", setGroupingModal);
                $scope.groupingCsaModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);  
            }
            else if(modelname == "dma") {
                manageCondtitionGroupingArray("dma", setGroupingModal);
                $scope.groupingDmaModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);  
            }
            else if(modelname == "msa") {
                manageCondtitionGroupingArray("msa", setGroupingModal);
                $scope.groupingMsaModel = setGroupingModal;
                $scope.quotaTotalRemRace += parseInt(totalNumber);  
            }
            else {
                if(modelname == "county") {
                    manageCondtitionGroupingArray("county", setGroupingModal);
                    $scope.groupingCountyModel = setGroupingModal;
                    $scope.quotaTotalRemRace += parseInt(totalNumber);  
                }
            }
        }
        
    }


    /************Comprasion between two array of objects***********/
    var difference = function(array){
       var rest = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));

       var containsEquals = function(obj, target) {
        if (obj == null) return false;
        return _.any(obj, function(value) {
          return _.isEqual(value, target);
        });
      };

      return _.filter(array, function(value){ return ! containsEquals(rest, value); });
    };

    //function to handle condition grouping Array data
    function manageCondtitionGroupingArray(quotaName, setGroupingModal) {
        if(_.keys($scope.conditionGroupingArray).length > 0) {
            if(_.has($scope.conditionGroupingArray, quotaName)) {
               $scope.conditionGroupingArray[quotaName] = setGroupingModal;
            }
            else  {
               $scope.conditionGroupingArray[quotaName] = setGroupingModal; 
            }
        }
        else {
            $scope.conditionGroupingArray[quotaName] = setGroupingModal;
        }
    }

    function removeGroupedIndex(modelDataArr, quotaId) {
        var findGroup = _.findWhere(modelDataArr, {"id": quotaId});
        if(findGroup) {
            var findIndex = _.indexOf(modelDataArr, findGroup);
            if(findIndex > -1) {
               modelDataArr.splice(findIndex, 1); 
            }
        }
        return modelDataArr;
    }

    function removeGroupedIndexByName(modelDataArr, quotaId) {
        var findGroup = _.findWhere(modelDataArr, {"name": quotaId});
        if(findGroup) {
            var findIndex = _.indexOf(modelDataArr, findGroup);
            if(findIndex > -1) {
               modelDataArr.splice(findIndex, 1); 
            }
        }
        return modelDataArr;
    }

    function reStructureSltData(newQuotaData, quotaData, destArr) {
        if(quotaData.id.length > 0) {
            _.each(quotaData.id, function(snglID) {
                destArr = removeGroupedIndex(destArr, snglID);
            })
            if(quotaData instanceof Object && _.has(quotaData, "name_arr")) {
                destArr = removeGroupedIndexByName(destArr, quotaData.name);
            }
            else {
                destArr = removeGroupedIndex(destArr, quotaData.id);
            }
            _.each(quotaData.id, function(snglID) {
                var matchNameQuta = _.findWhere(newQuotaData, {"id": snglID});
                if(matchNameQuta) {
                    matchNameQuta.maximum = '';
                    matchNameQuta.minimum = '';
                    matchNameQuta.number = '';
                    matchNameQuta.per = '';
                    matchNameQuta.percent = '';
                    matchNameQuta.percentage = 0;
                    matchNameQuta.selected = true;
                    destArr.push(matchNameQuta);
                }
            });
            
            return destArr;
        }
        else {
            
            return destArr
        }
    }

    //Funtion for ungrouped the condition grouping PD-961
    $scope.ungroupedConditionGrouping = function(QuotaName, quotaData) {
        var quotaHandlerArray = new Array();
        var quotaModifierArray = new Array();
        var modifiedQuotaArr = new Array();
        var twoArryOfObj_isEqual = false;
        var totalNumber = 0;
        if(QuotaName == "race") {
            if($stateParams.edit == 'editStep1'){
                quotaHandlerArray = raceModelLiveEdit;
                $scope.newraceModal = removeGroupedIndex($scope.newraceModal, quotaData.id);
                $scope.race = removeGroupedIndex($scope.race, quotaData.id);
            }
            else {
                quotaHandlerArray = $scope.race;
            }
            quotaModifierArray = $scope.newraceModal;
        }
        else if(QuotaName == "relationships") {
            if($stateParams.edit == 'editStep1') {
                quotaHandlerArray = relationModelLiveEdit;
                $scope.newrelationModal = removeGroupedIndexByName($scope.newrelationModal, quotaData.name);
                $scope.relation = removeGroupedIndexByName($scope.relation, quotaData.name);
            }
            else {
                quotaHandlerArray = $scope.relation;
            }
            quotaModifierArray = $scope.newrelationModal;
        }
        else if(QuotaName == "employments") {
            if($stateParams.edit == 'editStep1') {
                quotaHandlerArray = employmentModelLiveEdit;
                $scope.groupingemploymentModal = removeGroupedIndexByName($scope.groupingemploymentModal, quotaData.name);
                $scope.employement = removeGroupedIndexByName($scope.employement, quotaData.name);
            }
            else {
                quotaHandlerArray = $scope.employement;
            }
            quotaModifierArray = $scope.groupingemploymentModal;
        }
        else if(QuotaName == "educations") {
            if($stateParams.edit == 'editStep1') {
                quotaHandlerArray = educationModelLiveEdit;
                $scope.groupingeducationModal = removeGroupedIndexByName($scope.groupingeducationModal, quotaData.name);
                $scope.education = removeGroupedIndexByName($scope.education, quotaData.name);

            }
            else {
                quotaHandlerArray = $scope.education;
            }
           quotaModifierArray = $scope.groupingeducationModal; 
        }
        else if(QuotaName == "raceBera") {
            if($stateParams.edit == 'editStep1') {
                quotaHandlerArray = raceBeraModelLiveEdit;
                $scope.groupingRaceBeraModel = removeGroupedIndexByName($scope.groupingRaceBeraModel, quotaData.name);
                $scope.raceBera = removeGroupedIndexByName($scope.raceBera, quotaData.name);

            }
            else {
                quotaHandlerArray = $scope.raceBera;
            }
           quotaModifierArray = $scope.groupingRaceBeraModel;
        }
        else if(QuotaName == "device") {
            if($stateParams.edit == 'editStep1') {
                quotaHandlerArray = deviceModelLiveEdit;
                $scope.groupingDeviceModel = removeGroupedIndexByName($scope.groupingDeviceModel, quotaData.name);
                $scope.deviceInfo = removeGroupedIndexByName($scope.deviceInfo, quotaData.name);

            }
            else {
                quotaHandlerArray = $scope.deviceInfo;
            }
           quotaModifierArray = $scope.groupingDeviceModel; 
        }  
        else if(QuotaName == "regions") {
            if($stateParams.edit == 'editStep1') {
                quotaHandlerArray = censusRgnModelLiveEdit;
                $scope.groupingCensusRgnModel = removeGroupedIndexByName($scope.groupingCensusRgnModel, quotaData.name);
                $scope.region = removeGroupedIndexByName($scope.region, quotaData.name);

            }
            else {
                quotaHandlerArray = $scope.region;
            }
           quotaModifierArray = $scope.groupingCensusRgnModel; 
        }
        else if(QuotaName == "divisions") {
            if($stateParams.edit == 'editStep1') {
                quotaHandlerArray = divisionModelLiveEdit;
                $scope.groupingDivisionModel = removeGroupedIndexByName($scope.groupingDivisionModel, quotaData.name);
                $scope.division = removeGroupedIndexByName($scope.division, quotaData.name);

            }
            else {
                quotaHandlerArray = $scope.division;
            }
           quotaModifierArray = $scope.groupingDivisionModel; 
        }
        else if(QuotaName == "states") {
            if($stateParams.edit == 'editStep1') {
                $scope.groupingStateModel = removeGroupedIndexByName($scope.groupingStateModel, quotaData.name);
                $scope.selectedStates = removeGroupedIndexByName($scope.selectedStates, quotaData.name);

            }
            quotaHandlerArray = $scope.selectedStates;
           quotaModifierArray = $scope.groupingStateModel;
        }
        else if(QuotaName == "csa") {
           if($stateParams.edit == 'editStep1') {
                $scope.groupingCsaModel = removeGroupedIndexByName($scope.groupingCsaModel, quotaData.name);
                $scope.selectedCSAs = removeGroupedIndexByName($scope.selectedCSAs, quotaData.name);

            }
            quotaHandlerArray = $scope.selectedCSAs;
           quotaModifierArray = $scope.groupingCsaModel; 
        }
        else if(QuotaName == "dma") {
           if($stateParams.edit == 'editStep1') {
                $scope.groupingDmaModel = removeGroupedIndexByName($scope.groupingDmaModel, quotaData.name);
                $scope.selectedDMAs = removeGroupedIndexByName($scope.selectedDMAs, quotaData.name);

            }
            quotaHandlerArray = $scope.selectedDMAs;
           quotaModifierArray = $scope.groupingDmaModel;  
        }
        else if(QuotaName == "msa") {
            if($stateParams.edit == 'editStep1') {
                $scope.groupingMsaModel = removeGroupedIndexByName($scope.groupingMsaModel, quotaData.name);
                $scope.selectedMSAs = removeGroupedIndexByName($scope.selectedMSAs, quotaData.name);

            }
            quotaHandlerArray = $scope.selectedMSAs;
           quotaModifierArray = $scope.groupingMsaModel;  
        }
        else {
            if(QuotaName == "county") {
               if($stateParams.edit == 'editStep1') {
                    $scope.groupingCountyModel = removeGroupedIndexByName($scope.groupingCountyModel, quotaData.name);
                    $scope.selectedCountys = removeGroupedIndexByName($scope.selectedCountys, quotaData.name);

                }
                quotaHandlerArray = $scope.selectedCountys;
               quotaModifierArray = $scope.groupingCountyModel;   
            }
        }

        if(quotaData.id.length > 0) {
            _.each(quotaData.id, function(snglId) {
               var matchedObj = _.findWhere(quotaHandlerArray, {"id": snglId});
                if(matchedObj){
                    if(matchedObj.setGrupActive) {
                       matchedObj.setGrupActive = false;
                       matchedObj.maximum = "";
                       matchedObj.minimum = "";
                       matchedObj.number = "";
                       matchedObj.per = "";
                       matchedObj.percentage = "";
                    }
                    quotaModifierArray.push(matchedObj);
                }
            })

            var modifiedQuotaArr = _.without(quotaModifierArray, _.findWhere(quotaModifierArray, quotaData));
            var comparedTwoObjResult = difference(quotaHandlerArray, modifiedQuotaArr);
            if(comparedTwoObjResult.length == 0) {
                twoArryOfObj_isEqual = true;
            }
        }
        _.each(modifiedQuotaArr, function(totalCalc){
            if(totalCalc.number != undefined && totalCalc.number != null
                 && totalCalc.number != "") {
                totalNumber = totalNumber + parseInt(totalCalc.number);
            }
        });

        if(QuotaName == "race") {
            $scope.sltRace = reStructureSltData($scope.race, quotaData, $scope.sltRace);
            $scope.newraceModal = modifiedQuotaArr;
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
            if(twoArryOfObj_isEqual) {
                $scope.raceQuotaFlag.hasRaceFlag = false;
                $scope.raceQuotaFlag.hasRaceFlag = false;
                if($stateParams.edit == 'editStep1' && raceModelLiveEdit.length > 0) {
                    $scope.race = raceModelLiveEdit;
                }
                
            }
            removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName);                
        }
        else if(QuotaName == "relationships") {
            $scope.sltRelation = reStructureSltData($scope.relation, quotaData, $scope.sltRelation);
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
            $scope.newrelationModal = modifiedQuotaArr;
            if(twoArryOfObj_isEqual) {
                $scope.rlnQuotaFlag.hasRlnFlag = false;
                $scope.rlnQuotaFlag.editRlnFlag = false;
                if($stateParams.edit == 'editStep1' && relationModelLiveEdit.length > 0) {
                    $scope.relation = relationModelLiveEdit
                }
               
            }
            removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName);
        }
        else if(QuotaName == "employments") {
            $scope.sltEmployment = reStructureSltData($scope.employement, quotaData, $scope.sltEmployment);
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
            $scope.groupingemploymentModal = modifiedQuotaArr;
            if(twoArryOfObj_isEqual) {
                $scope.empQuotaFlag.hasEmpFlag = false;
                $scope.empQuotaFlag.editEmpFlag = false;
                if($stateParams.edit == 'editStep1' && employmentModelLiveEdit.length > 0) {
                    $scope.employement = employmentModelLiveEdit;
                }
                
            }
            removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName);
        }
        else if(QuotaName == "educations") {
            $scope.sltEducation = reStructureSltData($scope.education, quotaData, $scope.sltEducation);
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
           $scope.groupingeducationModal = modifiedQuotaArr; 
           if(twoArryOfObj_isEqual) {
            $scope.eduQuotaFlag.hasEduFlag = false;
            $scope.eduQuotaFlag.editEduFlag = false;
              if($stateParams.edit == 'editStep1' && educationModelLiveEdit.length > 0) {
                $scope.education = educationModelLiveEdit;
              }                 
              
           }
           removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName);
        }
        else if(QuotaName == "raceBera") {
            $scope.sltRaceBera = reStructureSltData($scope.raceBera, quotaData, $scope.sltRaceBera);
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
           $scope.groupingRaceBeraModel = modifiedQuotaArr; 
           if(twoArryOfObj_isEqual) {
            $scope.rbQuotaFlag.hasRbFlag = false;
            $scope.rbQuotaFlag.editRbFlag = false;
              if($stateParams.edit == 'editStep1' && raceBeraModelLiveEdit.length >0) {
                $scope.raceBera = raceBeraModelLiveEdit;
              }                 
              
           }
           removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName);
        }
        else if(QuotaName == "device") {
            $scope.sltDevice = reStructureSltData($scope.deviceInfo, quotaData, $scope.sltDevice);
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
            $scope.groupingDeviceModel = modifiedQuotaArr;
            if(twoArryOfObj_isEqual) {
                $scope.dvcQuotaFlag.hasDeviceFlag = false;
                $scope.dvcQuotaFlag.editDvcFlag = false;
                if($stateParams.edit == 'editStep1' && deviceModelLiveEdit.length > 0) {
                    $scope.deviceInfo = deviceModelLiveEdit;
                }               
            }
            removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName);
        }
        else if(QuotaName == "regions") {
            $scope.sltRegion = reStructureSltData($scope.region, quotaData, $scope.sltRegion);
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
            $scope.groupingCensusRgnModel = modifiedQuotaArr;
            if(twoArryOfObj_isEqual) {
                $scope.regQuotaFlag.hasRegionFlag = false;
                $scope.regQuotaFlag.editRegionFlag = false;
                if($stateParams.edit == 'editStep1' && censusRgnModelLiveEdit.length > 0) {
                    $scope.region = censusRgnModelLiveEdit;
                }
               
            }
            removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName);
        }
        else if(QuotaName == "divisions") {
            $scope.sltDivision = reStructureSltData($scope.division, quotaData, $scope.sltDivision);
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
            $scope.groupingDivisionModel = modifiedQuotaArr;
            if(twoArryOfObj_isEqual) {
                $scope.dvsnQuotaFlag.hasDivisionFlag = false;
                $scope.dvsnQuotaFlag.editDivisionFlag = false;
                if($stateParams.edit == 'editStep1' && divisionModelLiveEdit.length > 0) {
                    $scope.division = divisionModelLiveEdit;
                }
            }
            removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName); 
        }
        else if(QuotaName == "states") {
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
            $scope.groupingStateModel = modifiedQuotaArr;
            if(twoArryOfObj_isEqual) {
                $scope.editStateFlag = false;
                $scope.hasStateFlag = false;
                if($stateParams.edit == 'editStep1') {
                    $scope.selectedStates = modifiedQuotaArr;
                }
            }
            removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName); 
        }
        else if(QuotaName == "csa") {
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
            $scope.groupingCsaModel = modifiedQuotaArr;
            if(twoArryOfObj_isEqual) {
                $scope.editCSAFlag = false;
                $scope.hasCSAFlag = false;
                if($stateParams.edit == 'editStep1') {
                    $scope.selectedCSAs = modifiedQuotaArr;
                }
            }
            removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName);  
        }
        else if(QuotaName == "dma") {
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
            $scope.groupingDmaModel = modifiedQuotaArr;
            if(twoArryOfObj_isEqual) {
                $scope.editDMAFlag = false;
                $scope.hasDMAFlag = false;
                if($stateParams.edit == 'editStep1') {
                    $scope.selectedDMAs = modifiedQuotaArr;
                }
            }
            removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName); 
        }
        else if(QuotaName == "msa") {
            
            $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
            $scope.groupingMsaModel = modifiedQuotaArr;
            if(twoArryOfObj_isEqual) {
                 $scope.editMSAFlag = false;
                $scope.hasMSAFlag = false;
                if($stateParams.edit == 'editStep1') {
                    $scope.selectedMSAs = modifiedQuotaArr;
                }
            }
            removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName); 
        }
        else{
            if(QuotaName == "county") {
                
                $scope.quotaTotalRemRace = $scope.completesNeeded - parseInt(totalNumber);
                $scope.groupingCountyModel = modifiedQuotaArr;
                if(twoArryOfObj_isEqual) {
                    $scope.editCountyFlag = false;
                    $scope.hasCountyFlag = false;
                    if($stateParams.edit == 'editStep1') {
                        $scope.selectedCountys = modifiedQuotaArr;
                    }
                }
                removeUngroupedQuotaFromConditionArray(quotaData.id, QuotaName); 
            }
        }
    }
/*
* Function to remove ungrouped Quota from conditionGrouping Array of each Slt Quota model
*@ QuotaModel {Array Object} Grouping Array
*@ ungroupedData {Array} arry of ungrouped data name
*/
    function removeUngroupedQuotaFromConditionArray(ungroupedData, QuotaName) {
        if(_.has($scope.conditionGroupingArray, QuotaName)) {
              var matchedNameData = _.findWhere($scope.conditionGroupingArray[QuotaName], {"id": ungroupedData});
              if(matchedNameData != undefined) {
                 $scope.conditionGroupingArray[QuotaName] = _.without($scope.conditionGroupingArray[QuotaName], matchedNameData);
              }  
        }
    }

  /*PD-961
  * Function to set grouping for save Data into DB
  */ 
  function setConditionGroupedPropes(conditionMatch, qual_id ,qual_name, allProperties, quotakey, QuotaModelData) {

    var groupingList = [];
    if(_.has($scope.conditionGroupingArray, quotakey)) {
       var findGroupData = _.findWhere($scope.conditionGroupingArray[quotakey], {id: conditionMatch.id});
       if(findGroupData) {
          groupingList =  findGroupData;
       }
       else {
        groupingList = conditionMatch;
       }
    }

     var groupCondition = new Array();
    
    _.each(groupingList.id, function(qualIDs) {
        var createCondition = _.findWhere(QuotaModelData, {"id" : qualIDs});
        if(createCondition) {
            groupCondition.push({"id": createCondition.id, "name":createCondition.name});
            var groupeFilter = _.filter($scope.properties.quotas, function(snglQuota){
                 
                var filterList = _.filter(snglQuota.criteria, function(itrCriteria) {
                    if(_.has(itrCriteria, "conditions") &&  itrCriteria.conditions.length > 0) {
                       var rejectList =  _.reject(itrCriteria.conditions, function(itemObj) {
                         return (itemObj.id == qualIDs && qual_id == itrCriteria.qualification_code);
                       });
                       return rejectList.length > 0;
                    }else {
                        if(_.has(itrCriteria, "range_sets") &&  itrCriteria.range_sets.length > 0){
                          return itrCriteria;
                        }
                    }
                });
               return filterList.length > 0;
            })
            $scope.properties.quotas = groupeFilter;   
        }
    })
    _.each(groupCondition, function(item) {
        item.id = item.id.toString();
    })

    var conditionObject = {
        "type": 0,
        "isActive":true,
        "quotaCategory":"grouped",
        "locked": conditionMatch.locked || false,
        "criteria":[
            {
                "qualification_code":qual_id,
                "qualification_name":qual_name,
                "q_type":"normal",
                "layered_percent":0,
                "conditions": groupCondition
            }
        ],
        "quantities":{
            "minimum":conditionMatch.minimum,
            "maximum":conditionMatch.maximum,
            "flexibility":allProperties.flexiblePer,
            "isFlexible":allProperties.flexible,
            "number": conditionMatch.number,
            "percentage": Math.round((conditionMatch.number * 100)/$scope.completesNeeded),
            "hasValidQuotas": true,
            "achieved": conditionMatch.achieved || 0,
            "remaining":conditionMatch.maximum,
            "currently_open":conditionMatch.maximum,
            "sup_currently_open":conditionMatch.maximum,
            "current_target": conditionMatch.maximum
        },
        "counter": {
            "Buyer_side_In_Progress" : conditionMatch.buyer_in_progress || 0
        }
    }
    return conditionObject;
  }

  /*Function to deselect the Group Quals on cancel
  *@param QuotaDatas{Object} , quota array
  *@param quota_name {String} Name of the Quota Like Race, etc.
  */
  $scope.removeSelectedQualOnCancel = function(QuotaDatas, quota_name) {
     var tempQuotaData = [];
     if(quota_name == "race") {
        tempQuotaData = $scope.newraceModal;
     }
     if(quota_name == "relation") {
        tempQuotaData = $scope.newrelationModal;
     }
     if(quota_name == "education") {
        tempQuotaData = $scope.groupingeducationModal;
     }
     if(quota_name == "employment") {
        tempQuotaData = $scope.groupingemploymentModal;
     }
     if(quota_name == "raceBera") {
        tempQuotaData = $scope.groupingRaceBeraModel;
     }
     if(quota_name == "device") {
        tempQuotaData = $scope.groupingDeviceModel;
     }
     if(quota_name == "regions") {
        tempQuotaData = $scope.groupingCensusRgnModel;
     }
     if(quota_name == "divisions") {
        tempQuotaData = $scope.groupingDivisionModel;
     }
     if(quota_name == "states") {
        tempQuotaData = $scope.groupingStateModel;
     }
     if(quota_name == "csa") {
        tempQuotaData = $scope.groupingCsaModel;     
     }
     if(quota_name == "dma") {
        tempQuotaData = $scope.groupingDmaModel;        
     }
     if(quota_name == "msa") {
        tempQuotaData = $scope.groupingMsaModel;
     }
     if(quota_name == "county") {
        tempQuotaData = $scope.groupingCountyModel;
     }

     if(tempQuotaData.length > 0) {
        _.each(QuotaDatas, function(quota_sngl) {
            var matchSeletGrp = _.findWhere(tempQuotaData, {"id": quota_sngl.id});
            if(matchSeletGrp && matchSeletGrp.setGrupActive && quota_sngl.setGrupActive) {
                quota_sngl.setGrupActive = false;
                var findIndex = _.indexOf(tempQuotaData, matchSeletGrp);
                if(findIndex > -1) {
                    tempQuotaData[findIndex].setGrupActive = false;
                }
            }
        });
     }
     else {
        _.each(QuotaDatas, function(quota_sngl) {
            if(quota_sngl.setGrupActive) {
                quota_sngl.setGrupActive = false;
            }
        });
     }
  }

  /*Function Remove Quals if Group Created but Quota not assigned*/
  function removeGroupedUnallocatedQuals(matchedForBlankGroupQuota, QuotaSltArr, quotaArrs, groupQualArr) {
    _.each(matchedForBlankGroupQuota, function(snglGrup) {
        if(snglGrup.number == "" || snglGrup.number == 0) {
            if($stateParams.edit == 'editStep1') {
                var findGrupOnEdit = _.findWhere(QuotaSltArr, {"name": snglGrup.name});
                if(findGrupOnEdit) {
                    var findIndex = _.indexOf(QuotaSltArr, findGrupOnEdit);
                    if(findIndex) {
                        QuotaSltArr.splice(findIndex, 1);
                    }
                }
            }
            var nameArray = new Array();
            if(_.has(snglGrup, "name_arr")) {
                nameArray = snglGrup.name_arr;
            }
            else {
                nameArray = snglGrup.name.split(' or ');
            }
            _.each(nameArray, function(q_name) {
                var findGroupQta = _.findWhere(QuotaSltArr, {"name": q_name.trim()});
                if(findGroupQta) {
                    var findIndex = _.indexOf(QuotaSltArr, findGroupQta);
                    if(findIndex > -1) {
                       QuotaSltArr.splice(findIndex, 1); 
                    }
                }
                var matchRaceQual = _.findWhere(quotaArrs, {"name": q_name.trim()});
                if(matchRaceQual) {
                    var findIndex = _.indexOf(quotaArrs, matchRaceQual);
                    if(findIndex > -1) {
                       quotaArrs[findIndex].selected = false; 
                    }
                }
            })
            var matchedGroupQual = _.findWhere(groupQualArr, {"name": snglGrup.name});
            if(matchedGroupQual) {
                var qualIndex = _.indexOf(groupQualArr, matchedGroupQual);
                if (qualIndex > -1) {
                    groupQualArr.splice(qualIndex, 1);
                }
            }
        }
    });
  }

  /*Function to add new propertie for grouping and exclude from Slt Arrays*/
  function excludeGroupingFromSlt(quotaModelArray) {
    _.each(quotaModelArray, function(QuotaVal){
        if(QuotaVal.number == "" || !QuotaVal.number) {
            QuotaVal['condditionGroup'] = true;
            QuotaVal.number = 0;
            QuotaVal.maximum = 0;
            QuotaVal.minimum = 0;
        }
    })
  }
  
   /*Function to check is Quota Grouped or not*/
    $scope.isGrouped = function(keyName){
        if(_.has($scope.conditionGroupingArray, keyName)) {
            var findGrouyp = _.findWhere($scope.conditionGroupingArray[keyName],{"condditionGroup": true});
            if(findGrouyp) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    /*Function to Remove Grouping Quota*/
    function removeGroupingOnResetQuota(quotaname) {
        if(_.has($scope.conditionGroupingArray, quotaname)) {
            delete $scope.conditionGroupingArray[quotaname];
        }
    }

    /*Function to handle MIN/MAX auto update on Flexiability change*/
    $scope.groupingUpdateFleaxibility = function(quota_key, QuotaDataArr, flex_value) {
        if($scope.isGrouped(quota_key)) {
            _.each(QuotaDataArr, function(snglQual) {
                snglQual["flexiblePer"] = parseInt(flex_value);
            })
            _.each($scope.conditionGroupingArray[quota_key], function(groupQual) {
                groupQual["flexiblePer"] = parseInt(flex_value);
            })
            $scope.quotaPercentageChange(QuotaDataArr, flex_value);
            $scope.quotaPercentageChange($scope.conditionGroupingArray[quota_key], flex_value);
        }
    }

    /*PD-132 to check remaning and completes with proper message*/
    function checkQuotaExceedCmplts(quotaModel) {
        var totalAllocationNum = 0;
        _.each(quotaModel, function(snglNum) {
            if(_.has(snglNum, "number") && snglNum.number && !isNaN(snglNum.number)) {
                totalAllocationNum += snglNum.number;
            }
        });

       

        if($scope.completesNeeded - totalAllocationNum < 0) {
            notify({
                message: "Quota Allocations don't add up to Available Completes",
                classes: 'alert-warning',
                duration: 2000
            });
            return false;
        }
    }

    $scope.addAdvanceQuota = function(item, $event){
        _.each(item.selected[item.qualification_id[0]].answer_data, function(singleQuota){
            if(singleQuota.number && singleQuota.minimum && singleQuota.maximum){
                var idenKeyStr = item.qualification_id[0];
                if(singleQuota.id instanceof Array) {
                    _.each(singleQuota.id, function(snglId) {
                        idenKeyStr = idenKeyStr +'_'+snglId;
                    })
                }
                else {
                    idenKeyStr = idenKeyStr +'_'+singleQuota.id;
                }

                var findIndexOfAdv = _.findWhere(advQuota, {iden_key: idenKeyStr})
                var existing_index = _.indexOf(advQuota, findIndexOfAdv);
                var qual_name = $filter('lowercase')(item.question_description);
                qual_name = qual_name.trim();
                qual_name = qual_name.replace(/ /g,'_');
                //Add Qual details in original Array
                singleQuota['qual_id'] = item.qualification_id[0];
                singleQuota['qual_name'] = qual_name;

                if(_.has(singleQuota, "condditionGroup") && singleQuota.condditionGroup) {
                    if(!_.has(singleQuota, "haveAdvGroup")) {
                        
                        var categoryIs = "grouped";
                        var conditionArr = [];
                        var iden_key = item.qualification_id[0];
                           var findByQualId =  _.find($scope.advanceGoupModel, function(matchQual){ 
                                if(_.intersection(matchQual.qualification_id, item.qualification_id).length)
                                {
                                    return matchQual;
                                } 
                            });
                        if(findByQualId) {
                            _.each(singleQuota.id, function(qualId) {
                                var findQuota = _.findWhere(findByQualId.selected[findByQualId.qualification_id[0]].answer_data, {id: qualId});
                                if(findQuota) {
                                    iden_key = iden_key +'_'+qualId;
                                    conditionArr.push({id: findQuota.id, name: findQuota.name});

                                    if($scope.advanceDataPayload.length) {
                                        _.each($scope.advanceDataPayload, function(snglMatchQual) {
                        
                                            if(snglMatchQual.qualification_id[0] == item.qualification_id[0]) {
                                                _.each(snglMatchQual.selected[snglMatchQual.qualification_id[0]].answer_data, function(updateNumQual) {
                                                    if(updateNumQual.id == qualId) {
                                                        updateNumQual["qual_name"] = singleQuota.qual_name;
                                                        updateNumQual["qual_id"] = singleQuota.qual_id;
                                                        updateNumQual["percentage"] = singleQuota.percentage;
                                                        updateNumQual["number"] = singleQuota.number;
                                                        updateNumQual["maximum"] = singleQuota.maximum;
                                                        updateNumQual["minimum"] = singleQuota.maximum;
                                                        updateNumQual["per"] = singleQuota.percentage;
                                                    }
                                                })
                                                snglMatchQual["hasQuota"] = true;
                                            }
                                        })
                                        angular.copy($scope.advanceDataPayload, advanceData);
                                    }
                                    if($scope.advanceGoupModel.length) {
                                        _.each($scope.advanceGoupModel, function(snglMatchQual) {
                        
                                            if(snglMatchQual.qualification_id[0] == item.qualification_id[0]) {
                                                snglMatchQual["hasQuota"] = true;
                                                _.each(snglMatchQual.selected[snglMatchQual.qualification_id[0]].answer_data, function(updateNumQual) {
                                                    if(updateNumQual.id == qualId) {
                                                        updateNumQual["qual_name"] = singleQuota.qual_name;
                                                        updateNumQual["qual_id"] = singleQuota.qual_id;
                                                        updateNumQual["percentage"] = singleQuota.percentage;
                                                        updateNumQual["number"] = singleQuota.number;
                                                        updateNumQual["maximum"] = singleQuota.maximum;
                                                        updateNumQual["minimum"] = singleQuota.maximum;
                                                        updateNumQual["per"] = singleQuota.percentage;
                                                    }
                                                })

                                            }
                                        })
                                    }

                                }
                            });
                        }
                        if(existing_index == -1){
                            advQuota.push({
                                "iden_key":iden_key,
                                "type": 0,
                                "isActive":true,
                                "quotaCategory":categoryIs,
                                "locked": false,
                                "criteria":[
                                    {
                                        "qualification_code":item.qualification_id[0],
                                        "qualification_name":qual_name,
                                        "q_type":"normal",
                                        "layered_percent":parseInt(singleQuota.percentage),
                                        "conditions": conditionArr
                                    }
                                ],
                                "quantities":{
                                    "minimum": singleQuota.minimum,
                                    "maximum": singleQuota.maximum,
                                    "flexibility": item.flxValue,
                                    "isFlexible":item.flx,
                                    "number": singleQuota.number,
                                    "percentage":singleQuota.percentage,
                                    "hasValidQuotas": true,
                                    "achieved": 0,
                                    "remaining": singleQuota.maximum,
                                    "currently_open":singleQuota.maximum,
                                    "sup_currently_open":singleQuota.maximum,
                                    "current_target": singleQuota.maximum
                                }
                            });
                        }else{
                            console.log('updating the existing data');
                            advQuota[existing_index] = {
                                "iden_key":iden_key,
                                "type": 0,
                                "isActive":true,
                                "quotaCategory":categoryIs,
                                "locked": false,
                                "criteria":[
                                    {
                                        "qualification_code":item.qualification_id[0],
                                        "qualification_name":qual_name,
                                        "q_type":"normal",
                                        "layered_percent":parseInt(singleQuota.percentage),
                                        "conditions": conditionArr
                                    }
                                ],
                                "quantities":{
                                    "minimum": singleQuota.minimum,
                                    "maximum": singleQuota.maximum,
                                    "flexibility": item.flxValue,
                                    "isFlexible":item.flx,
                                    "number": singleQuota.number,
                                    "percentage":singleQuota.percentage,
                                    "hasValidQuotas": true,
                                    "achieved": 0,
                                    "remaining": singleQuota.maximum,
                                    "currently_open":singleQuota.maximum,
                                    "sup_currently_open":singleQuota.maximum,
                                    "current_target": singleQuota.maximum
                                }
                            };
                        }
                    }
                }
                else {
                    var conditionArr = [{id: singleQuota.id, name: singleQuota.name}];
                    var iden_key = item.qualification_id[0]+'_'+singleQuota.id;
                    if($scope.advanceDataPayload.length) {
                        _.each($scope.advanceDataPayload, function(snglMatchQual) {
        
                            if(snglMatchQual.qualification_id[0] == item.qualification_id[0]) {
                                _.each(snglMatchQual.selected[snglMatchQual.qualification_id[0]].answer_data, function(updateNumQual) {
                                    var qualId = _.findWhere(item.selected[item.qualification_id[0]].answer_data, {id: updateNumQual.id});
                                    if(qualId) {
                                        updateNumQual["qual_name"] = qualId.qual_name;
                                        updateNumQual["qual_id"] = qualId.qual_id;
                                        updateNumQual["percentage"] = qualId.percentage;
                                        updateNumQual["number"] = qualId.number;
                                        updateNumQual["maximum"] = qualId.maximum;
                                        updateNumQual["minimum"] = qualId.maximum;
                                        updateNumQual["per"] = qualId.percentage;
                                    }
                                })
                                snglMatchQual["hasQuota"] = true;
                            }
                        })
                        angular.copy($scope.advanceDataPayload, advanceData);
                    }
                    if(existing_index == -1){
                        advQuota.push({
                            "iden_key":iden_key,
                            "type": 0,
                            "isActive":true,
                            "quotaCategory":"advance",
                            "locked": false,
                            "criteria":[
                                {
                                    "qualification_code":item.qualification_id[0],
                                    "qualification_name":qual_name,
                                    "q_type":"normal",
                                    "layered_percent":parseInt(singleQuota.percentage),
                                    "conditions": conditionArr
                                }
                            ],
                            "quantities":{
                                "minimum": singleQuota.minimum,
                                "maximum": singleQuota.maximum,
                                "flexibility": item.flxValue,
                                "isFlexible":item.flx,
                                "number": singleQuota.number,
                                "percentage":singleQuota.percentage,
                                "hasValidQuotas": true,
                                "achieved": 0,
                                "remaining": singleQuota.maximum,
                                "currently_open":singleQuota.maximum,
                                "sup_currently_open":singleQuota.maximum,
                                "current_target": singleQuota.maximum
                            }
                        });
                    }else{
                        console.log('updating the existing data');
                        advQuota[existing_index] = {
                            "iden_key":iden_key,
                            "type": 0,
                            "isActive":true,
                            "quotaCategory":categoryIs,
                            "locked": false,
                            "criteria":[
                                {
                                    "qualification_code":item.qualification_id[0],
                                    "qualification_name":qual_name,
                                    "q_type":"normal",
                                    "layered_percent":parseInt(singleQuota.percentage),
                                    "conditions": conditionArr
                                }
                            ],
                            "quantities":{
                                "minimum": singleQuota.minimum,
                                "maximum": singleQuota.maximum,
                                "flexibility": item.flxValue,
                                "isFlexible":item.flx,
                                "number": singleQuota.number,
                                "percentage":singleQuota.percentage,
                                "hasValidQuotas": true,
                                "achieved": 0,
                                "remaining": singleQuota.maximum,
                                "currently_open":singleQuota.maximum,
                                "sup_currently_open":singleQuota.maximum,
                                "current_target": singleQuota.maximum
                            }
                        };
                    }
                    
                    var findIndexQual = _.findIndex($scope.advanceGoupModel, {"respondent_question_id":item.respondent_question_id});
                    if(findIndexQual < 0) {
                        $scope.advanceGoupModel.push(item);
                    }

                    var findIndexQualAdvance = _.findIndex($scope.advanceDataPayload, {"respondent_question_id":item.respondent_question_id});
                    if(findIndexQualAdvance < 0) {
                        $scope.advanceDataPayload.push(item);
                    }
                }
            }else{
                notify({
                    message: "Please enter valid data",
                    classes: 'alert-danger',
                    duration: 2000
                }); 
                return false;
            }
        }); 
        item.hasQuota = true; 
        // Update in advanceData
        var advIndex = _.findIndex(advanceData, {"respondent_question_id":item.respondent_question_id});
        if(advIndex != -1){
            advanceData[advIndex]['hasQuota'] = true;
        }
        // to check wheather it is nested or not
        var key = $filter('lowercase')(item.question_description);
        key = key.trim();
        key = key.replace(/ /g,'_');
        if($scope.isNested(key)){
            $scope.activateNesting(key, item.selected[item.qualification_id[0]].answer_data, $event);
            $scope.applyNesting();
        }
        notify({
            message: item.question_description+" Quota Added",
            classes: 'alert-success',
            duration: 2000
        });
    }

    $scope.delAdvQuota = function(qual_id, item){
        advQuota = advQuota.filter(function(singleQuota){
            var qualification = singleQuota.iden_key.split('_');
            qualification = parseInt(qualification[0]);
            if(qualification == qual_id){
                return false; 
            }else{
                return true;
            }
        });
        var question_id;
        console.log('item.length ',item.length);
        // Index of quota in item
        if(item.length){ // checking the item is an array or a single object
            _.each(item , function(singleData){
                if(qual_id == singleData.qualification_id[0]){
                    _.each(singleData.selected[qual_id].answer_data, function(singleQuota){
                        delete singleQuota.per;
                        delete singleQuota.minimum;
                        delete singleQuota.maximum;
                        delete singleQuota.number;
                        delete singleQuota.percentage;
                    });
                    singleData['hasQuota'] = false;
                    question_id = singleData.respondent_question_id
                }else{
                    console.log('Item not found Advance Target data to delete');
                }
                console.log('singleData final ',JSON.stringify(singleData));
            });
        }else{
           if(qual_id == item.qualification_id[0]){
                _.each(item.selected[qual_id].answer_data, function(singleQuota){
                    delete singleQuota.per;
                    delete singleQuota.minimum;
                    delete singleQuota.maximum;
                    delete singleQuota.number;
                    delete singleQuota.percentage;
                });
                item['hasQuota'] = false;
                question_id = item.respondent_question_id
            }else{
                console.log('Item not found Advance Target data to delete');
            } 
        }
        console.log('question_id ',question_id);
        // Update in advanceData
        var advIndex = _.findIndex(advanceData, {"respondent_question_id":question_id});
        console.log('advIndex ',advIndex);
        if(advIndex != -1){
             advanceData[advIndex]['hasQuota'] = false;
             _.each(advanceData[advIndex].selected[advanceData[advIndex].qualification_id[0]].answer_data, function(delProps) {
                console.log('delProps ',JSON.stringify(delProps));
                delete delProps.per;
                delete delProps.minimum;
                delete delProps.maximum;
                delete delProps.number;
                delete delProps.percentage; 
             })
        };
        /*notify({
            message: "Quota Deleted Successfully",
            classes: 'alert-success',
            duration: 2000
        });*/
    }

    $scope.resetAdvModal = function(item){
        if(!item.hasQuota){
            _.each(item.selected[item.qualification_id[0]].answer_data, function(singleQuota){
                delete singleQuota.per;
                delete singleQuota.minimum;
                delete singleQuota.maximum;
                delete singleQuota.number;
                delete singleQuota.percentage;
            });
        }
    }

    $scope.getAdvRemaning = function(quota , hasQuota){
        if(hasQuota){
            $scope.quotaTotalRemRace = 0;
        }else{
            $scope.quotaTotalRemRace = $scope.completesNeeded;
        }
    }

    $scope.advanceGoupModel =  new Array();
    $scope.advanceDataPayload = new Array();
    $scope.readyAdvGroupPayload = function(item) {
       
        if($scope.advanceDataPayload.length) {
            var existAdvQuotaObj =  _.find($scope.advanceDataPayload, function(matchAdvQual){ 
                if(_.intersection(matchAdvQual.qualification_id, item.qualification_id).length)
                {
                    return matchAdvQual;
                } 
            });
            if(!existAdvQuotaObj){
                var advanceDataObj =  _.find(advanceData, function(existAdvQual){ 
                    if(_.intersection(existAdvQual.qualification_id, item.qualification_id).length)
                    {
                        return existAdvQual;
                    } 
                });
                
                var foundExistAdvData = {};
                if(advanceDataObj){
                    angular.copy(advanceDataObj, foundExistAdvData);
                    $scope.advanceDataPayload.push(foundExistAdvData);
                }
            }

        }
        else {
            var existAdvQuotaObj =  _.find($scope.advanceDataPayload, function(matchAdvQual){ 
            if(_.intersection(matchAdvQual.qualification_id, item.qualification_id).length)
                {
                    return matchAdvQual;
                } 
            });

            if(!existAdvQuotaObj) {
                var advanceDataObj =  _.find(advanceData, function(existAdvQual){ 
                    if(_.intersection(existAdvQual.qualification_id, item.qualification_id).length)
                    {
                        return existAdvQual;
                    } 
                });
                
                var foundExistAdvData = {};
                if(advanceDataObj){
                    angular.copy(advanceDataObj, foundExistAdvData);
                    $scope.advanceDataPayload.push(foundExistAdvData);
                }
            }
        }
        

        var existAdvTargetObj =  _.find($scope.advanceGoupModel, function(matchQual){ 
            if(_.intersection(matchQual.qualification_id, item.qualification_id).length)
            {
                return matchQual;
            } 
        });

        if(!existAdvTargetObj) {
            var cloneAdvQuota = {};
            angular.copy(item, cloneAdvQuota);
            $scope.advanceGoupModel.push(cloneAdvQuota);
        }
        
    }

    $scope.advanceGrouping = function(model, item) {
        var totalRemOnLiveEdit = 0;
        
        var getGroupedArr = _.where(item.selected[item.qualification_id[0]].answer_data, {setGrupActive: true});
        if(getGroupedArr.length > 1) {
            var idArr = _.pluck(getGroupedArr, "id");
            var nameArr = _.pluck(getGroupedArr, "name"); 
            var labelName = "";
            _.each(getGroupedArr, function(delAdvQ) {
                var findId = _.findWhere(item.selected[item.qualification_id[0]].answer_data, {id: delAdvQ.id});
                if(findId) {
                    var matchIdIndex = _.indexOf(item.selected[item.qualification_id[0]].answer_data, findId);
                    if(matchIdIndex > -1) {
                        labelName = labelName + delAdvQ.name + " " +"or" + " ";
                        var initCheckNumber = item.selected[item.qualification_id[0]].answer_data[matchIdIndex];
                            if(_.has(initCheckNumber, "number") && !isNaN(initCheckNumber.number) && !_.isUndefined(initCheckNumber.number) && !_.isNull(initCheckNumber.number) && initCheckNumber.number != "") {
                                totalRemOnLiveEdit += parseInt(initCheckNumber.number);
                            }
                        item.selected[item.qualification_id[0]].answer_data.splice(matchIdIndex, 1);
                    }
                }
            })
            if(advQuota.length > 0) {
                var RemovedQuotas = new Array();
                _.each(advQuota, function(snglAdvQuota) {
                    if(snglAdvQuota.quotaCategory == "advance") {
                        _.each(snglAdvQuota.criteria, function(iterateCriteria) {
                            if(iterateCriteria.qualification_code == item.qualification_id[0]) {
                                var quotaIdsArr = _.pluck(iterateCriteria.conditions, "id");
                                if(quotaIdsArr.length > 0 && _.intersection(idArr, quotaIdsArr).length) {
                                    RemovedQuotas.push(snglAdvQuota);
                                }
                            }
                        })
                    }
                })
                if(RemovedQuotas.length) {
                   advQuota = _.difference(advQuota, RemovedQuotas);
                }
            }
            
            $scope.quotaTotalRemRace = parseInt($scope.quotaTotalRemRace) + parseInt(totalRemOnLiveEdit);
            var tempObject = {
                id : idArr,
                name: labelName.substring(0, labelName.length - 3),
                name_arr:nameArr,
                condditionGroup: true,
                selected: true,
                qualification_id: item.qualification_id[0]
            }
            item.selected[item.qualification_id[0]].answer_data.push(tempObject);
        }
        else if(getGroupedArr.length == 1) {
            notify({message:'Grouping for single Quota not allowed',classes:'alert-warning',duration:3000} );
                return false;
        }
        else {
            notify({message:'First Select Quota Before Grouping',classes:'alert-warning',duration:3000} );
                return false;
        }
    }

    $scope.ungroupedAdvanceQuota = function(data) {
        var remTotalNumberUngroup = 0;
        if(data && _.keys(data).length) {
            _.each(data.id, function(itrIds) {
                var existAdvQuota =  _.find($scope.advanceGoupModel, function(matchQual){ 
                    if(matchQual.qualification_id[0] == data.qualification_id)
                    {
                        return matchQual;
                    } 
                });
    
                if(existAdvQuota) {
                    var getMatchedQuota = _.findWhere(existAdvQuota.selected[existAdvQuota.qualification_id[0]].answer_data, {id: itrIds});
                    
                    if(getMatchedQuota) {
                        //var updateInExistQuota = _.findWhere($scope.tempAdvArray, {respondent_question_id: data.qualification_id});
                        var updateInExistQuota = _.find($scope.tempAdvArray, function(findQual){ 
                            if(findQual.qualification_id[0] == data.qualification_id)
                            {
                                return findQual;
                            } 
                        });
                        
                        if(updateInExistQuota) {
                            var updateIndex = _.indexOf($scope.tempAdvArray, updateInExistQuota);
                            
                            if(updateIndex > -1) {
                                if(getMatchedQuota.number){
                                    getMatchedQuota.number = "";
                                    getMatchedQuota.percentage = "";
                                    getMatchedQuota.per = "";
                                    getMatchedQuota.maximun = "";
                                    getMatchedQuota.minimum = "";
                                }
                                $scope.tempAdvArray[updateIndex].selected[$scope.tempAdvArray[updateIndex].qualification_id[0]].answer_data.push(getMatchedQuota);

                                 var deletedIndex = _.indexOf($scope.tempAdvArray[updateIndex].selected[$scope.tempAdvArray[updateIndex].qualification_id[0]].answer_data, data);
                                 
                                 if(deletedIndex > -1) {
                                    var initCheckNumber = $scope.tempAdvArray[updateIndex].selected[$scope.tempAdvArray[updateIndex].qualification_id[0]].answer_data[deletedIndex];
                                    if(_.has(initCheckNumber, "number") && !isNaN(initCheckNumber.number) && !_.isUndefined(initCheckNumber.number) && !_.isNull(initCheckNumber.number) && initCheckNumber.number != "") {
                                        remTotalNumberUngroup += parseInt(initCheckNumber.number);
                    
                                    } 
                                    $scope.tempAdvArray[updateIndex].selected[$scope.tempAdvArray[updateIndex].qualification_id[0]].answer_data.splice(deletedIndex, 1); 
                                }

                                if(advQuota.length > 0) {
                                    var findRemovedObj = _.findWhere(advQuota, {iden_key: data.iden_key});
                                    if(findRemovedObj) {
                                        var matchedObjIndex = _.indexOf(advQuota, findRemovedObj);
                                        if(matchedObjIndex > -1) {
                                            advQuota.splice(matchedObjIndex, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            $scope.quotaTotalRemRace = parseInt($scope.quotaTotalRemRace) + parseInt(remTotalNumberUngroup);

        }
    }

    $scope.checkAdvancedata  = function(objData) {
        if(objData instanceof Object) {
            return true;
        }
        else {
            return false;
        }
    }
    
}]);
