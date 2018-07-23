/**
 * Created by Parveen on 3/8/2016.
 */


angular.module('pureSpectrumApp')
    .factory('createSurvey',['$http','config','$window','localStorageService', function($http,config, $window, localStorageService) {
        
        var base_url = config.pureSpecturm.url;
        var activity_url = config.pureSpecturm.activityUrl;

        return {
            saveSurveyData : function(data) {
                var userInfo=localStorageService.get('logedInUser');
                return $http.post(base_url + '/survey',data, {
                    headers: {
                        'usr_id': userInfo.id,
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                });
            },
            getSurveyHeaderValue : function(lang,ctry,LOI,incd, id){
                var survey = '';
                if(id != undefined)
                    survey = '&survey='+id;
                return $http.get(base_url + '/pricingService?language='+lang+'&country='+ctry+'&LOI='+LOI+'&incidence='+incd+survey);
            },

            getSurveyById : function(surveyId){
                return $http.get(base_url + '/surveys/' + surveyId );
            },

            answerByUser :  function(data){
                return $http.post(base_url + '/respondentProfile', data);
            },

            updateSurveyById : function (data) {
                return $http.post(base_url + '/surveySuppliers', data);
            },

            updateSurveyLaunch : function (data) {
                return $http.post(base_url + '/surveyLaunch' ,data);
            },

            updateSurvey : function(id ,data){
                return $http.put(base_url + '/survey/' + id, data);
            },

            updateSurveyStatus : function(id ,data){
                return $http.put(base_url + '/survey/status/' + id, data);
            },

            getSurveyTid : function(id){
                return $http.get(base_url + '/survey/tid/' + id);
            },

            saveTraffic : function(data){
                return $http.post(base_url + '/survey/traffic', data );
            },

            getBuyerCPI : function(id){
                return $http.get(base_url + '/buyerCPI/' + id);
            },

            getAllocationCPI : function (data) {
                return $http.post(base_url + '/getAllocationCPI', data);
            },

            getSurveyManagement : function(surveyId, q, locale){
                 return $http.get(base_url + '/survey/management/' + surveyId + '?q=' + q+'&countryCode='+locale.countryCode+'&languageCode='+locale.languageCode);
            },

            getSurveyQuotaManagement : function(surveyId, locale){
                 return $http.get(base_url + '/survey/quota/management/' + surveyId+ '?countryCode='+locale.countryCode+'&languageCode='+locale.languageCode);
            },

            getSurveyAudience : function(surveyId, locale){
                return $http.get(base_url + '/survey/getAudience/' + surveyId+ '?countryCode='+locale.countryCode+'&languageCode='+locale.languageCode);
            },

            getSupplierSurveyManagement : function(id,sup_id){
                return $http.get(base_url + '/surveymanagementsupplier?survey_id='+id+'&supplier_id='+sup_id );
            },

            updateSurveyFromManageStep1 : function(id ,data){
                return $http.put(base_url + '/survey/updateLiveSurveyStep1/' + id, data);
            },

            updateSurveyFromManageStep2 : function(id ,data){
                return $http.put(base_url + '/survey/updateLiveSurveyStep2/' + id, data);
            },

            updateSurveyFromManageStep3 : function(id ,data){
                return $http.put(base_url + '/survey/updateLiveSurveyStep3/' + id, data);
            },

            lockQuota :function(survey_id, quotaName, unique_id, flag, option_id, quotaDetails){
                return $http.put(base_url + '/updatequotastatus?survey_id='+survey_id+'&option_id='+option_id+'&quota='+quotaName+'&id='+unique_id+'&flag='+flag+'', quotaDetails);
            }, 

            lockQuotaAgeIncome :function(survey_id, quotaName, min, max, flag){
                return $http.put(base_url + '/updatequotastatus?survey_id='+survey_id+'&quota='+quotaName+'&min='+min+'&max='+max+'&flag='+flag+'');
            },

            getMasterDataByCountryLang: function(country, languange) {
                return $http.get(base_url + '/getMasterDataByCountryLang/'+country+'/'+languange);
            },

            deleteDraftSurvey: function(surveyEncId){
                return $http.delete(base_url + '/deleteSurvey/'+surveyEncId);
            },

            validateZipcodes: function(zipcodes) {
                return $http.post(base_url + '/validate/zipcodes', zipcodes);
            },

            uploadZipcodesFile: function(countryCode, file) {
                var fdata = new FormData();
                fdata.append("zipcodes", file);
                return $http.post(base_url + '/survey/uploadZipCode/'+countryCode, fdata);
            },
            getPaginatedSurveys: function(pageno, surveyType, userType, search) {
                var userInfo=localStorageService.get('logedInUser');
                return $http.get(base_url + '/paginatedSurvey/' + userInfo.cmp + "/" + pageno + "/" + surveyType + '?q=' + userType + '&search=' + search);
            },
            getSurveysCount: function(type, search) {
                var userInfo=localStorageService.get('logedInUser');
                return $http.get(base_url + '/getSurveyCount/' + userInfo.cmp + '?q=' + type + '&search=' + search);
            },
            viewLatestUploadZip: function(file, country) {
                return $http.post(base_url + '/viewLatestUpload/zipcodes/' + country, file);
            },
            //include exclude 
            uploadPSIDRefFile: function(srvId, file) {
                var fdata = new FormData();
                fdata.append("psid_ref_file", file);
                return $http.post(base_url + '/inclexcl/uploadPSIDListFromUI/'+srvId, fdata);
            },
            viewLatestUploadedPSID: function(srvId, incl_excl) {
                return $http.get(base_url + '/inclexcl/getBuyerUploadedList/'+srvId+"?incl_excl="+incl_excl);
            },
            clearUploadedPSIDs: function(srvId) {
                return $http.delete(base_url + '/inclexcl/clearUploadedPSIDs/'+srvId);
            },
            searchAutoComplete: function(country, field, search) {
                return $http.get(base_url + '/searchAutocomplete/' +country+'/'+field + '/' + search);
            },

            createNewPriceBlock: function(srvId) {
                return $http.get(base_url + '/surveys/createBlock/' + srvId);
            },

            getAchievedForAgeIncome: function(srvId, modalName, minRange, maxRange){
                return $http.get(base_url + '/getAchievedForAgeIncome/' + srvId +'?catname='+modalName+'&min='+minRange+'&max='+maxRange);
            },

            getSurveyDetails : function(surveyId, q, locale){ 
                return $http.get(base_url + '/surveyDetail/' + surveyId + '?q=' + q+'&countryCode='+locale.countryCode+'&languageCode='+locale.languageCode); 
            },             

            getSurveyDetailforSupplier : function(surveyId, q, locale,supp_id){
                return $http.get(base_url + '/getSurveyDetailforSupplier/' + surveyId + '?q=' + q+'&countryCode='+locale.countryCode+'&languageCode='+locale.languageCode+'&supplier_id='+supp_id);
            },

            uploadReconciliationFile: function(file) {
                var fdata = new FormData();
                fdata.append("reconcile", file);
                return $http.post(base_url + '/survey/reconciliation/', fdata);
            },

            confirmForReconcile: function(surveyID) {
                return $http.get(base_url + '/survey/confirm/reconciliation/');
            },

            declineReconciliationProcess : function(surveyID) {
                return $http.get(base_url + '/survey/decline/reconciliation/');
            },

            approveReconciliationProcess : function(approvParms) {
                return $http.post(base_url + '/survey/aproveall/reconciliation', approvParms);
            },

            getReconcileCount : function(countParms) {
               
                return $http.post(base_url + '/reconciliation/counts', countParms);
            },
            //PD-821
            updateCurrentlyOpenQuota : function(quotaData) {
                return $http.put(base_url + '/survey/update/currentlyopenquota', quotaData);
            },
            updateAllCurrentlyOpenQuota : function(quotaData) {
                return $http.put(base_url + '/survey/update/allcurrentlyopenquota', quotaData);
            },
            getAdvTargetingQues : function(searchQuestion){
                return $http.post(base_url + '/survey/search_adv_questions', searchQuestion);
            },
            lockUnlockGroupQuota :function(lockUnlockGroupData){
                return $http.put(base_url + '/update/group/quotastatus', lockUnlockGroupData);
            },
            getSurveyBasicDetails: function(survey_id){
                return $http.get(base_url+'/surveyBasicDetails/'+survey_id);
            },
            getSurveyStatus: function(survey_id){
                return $http.get(base_url+'/getSurveyStatus/'+survey_id);
            },
            getBuyerSalesReport: function(dataRange, country_code, supplrId){
                return $http.get(base_url+'/getBuyerSalesReport?startDate='+dataRange.startDate+'&endDate='+dataRange.endDate + '&country_code=' + country_code + '&supplrId=' + supplrId);
            },
            getSurveyTransReport: function(dataRange, country_code){
                return $http.get(base_url+'/getSurveyTransReport?startDate='+dataRange.startDate+'&endDate='+dataRange.endDate + '&country_code=' + country_code);
            },
            getDailyStatsReport: function(dataRange, country_code){
                return $http.get(base_url+'/getDailyStatsReport?startDate='+dataRange.startDate+'&endDate='+dataRange.endDate + '&country_code=' + country_code);
            },
            getPerformanceReport: function(dataRange, country_code, performanceObj){
                return $http.post(base_url+'/getPerformanceReport?startDate='+dataRange.startDate+'&endDate='+dataRange.endDate + '&country_code=' + country_code, performanceObj);
            },
            getSuppliersReport: function(dataRange, country_code, buyerId){
                return $http.get(base_url+'/getSuppliersReport?startDate='+dataRange.startDate+'&endDate='+dataRange.endDate + '&country_code=' + country_code + '&buyerId=' + buyerId);
            },
            getSurveyActivityLogs: function(surveyId){
                return $http.get(activity_url+'/surveys?surveyId='+surveyId);
            },
            addActivityNote: function(activityPayload) {
                return $http.post(activity_url+'/postLogs', activityPayload);
            }
        }

    }]);
