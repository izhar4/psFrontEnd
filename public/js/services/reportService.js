angular.module('pureSpectrumApp')
.factory('reportService',['$http','config', function($http, config) {
    var base_url = config.pureSpecturm.url;
    return {
    	downloadReport: function (user_id, cmp, stDt, endDt, st) {
            return $http.get(base_url + '/reports/dashboardReport?u=' + user_id + '&c=' + cmp + '&stDt=' + stDt + '&endDt=' + endDt + '&st=' + st );
        },
        downloadLoginReport: function () {
            return $http.get(base_url + '/reports/userLoginReport');
        },
        downloadFile: function (fileName) {
            return base_url + '/reports/download-report/' + fileName;
        },
        downloadSTR: function (cmp, survey_id, user_type) {
            return $http.get(base_url + '/reports/surveytrafficreport?user_id='+cmp+'&survey_id='+survey_id+'&type='+user_type);
        },
        getPsidTransIdreport: function(reportType, transValues) {
            var queryStr = "";
            _.each(transValues, function(val, key) {
                if(val != "") {
                    queryStr += '&' + key + '=' + val;
                }
            })
            return $http.get(base_url + '/reports/psidReport?reportTypes=' + reportType + queryStr);
        },
        getSurveyTransReport : function(transValues) {
            var queryStr = "";
             _.each(transValues, function(val, key) {
                if(val != "") {
                    queryStr += '&' + key + '=' + val;
                }
            })
            return $http.get(base_url + '/reports/surveystcReport?' + queryStr);
        },

        getTransactionStatusReport : function(payload) {
            return $http.post(base_url + '/reports/surveys/transactionStatus', payload);
        }
    }
}]);