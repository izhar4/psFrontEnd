angular.module('pureSpectrumApp')
    .factory('currencyService', ['$http', 'config', function($http, config) {
        var base_url = config.pureSpecturm.url;
        return {
            getCurrencyDataForCompanies: function () {
                return $http.get(base_url + '/international_currency/companies');
            },

            getAllCurrencies: function () {
                return $http.get(base_url + '/international_currency');
            },

            updateCurrencyDetails: function (curencyData) {
                return $http.put(base_url + '/international_currency/' + curencyData.currencyShortCode, curencyData);
            }

            /*getAllCompaniesData : function(){
                return $http.get(base_url + '/companies');
            },

            saveCompanyDetails : function(cmpData){
                return $http.post(base_url + '/company', cmpData);
            },

            deleteCompany : function(cmpId){
                return $http.delete(base_url + '/company/'+cmpId);
            }*/
        }
    }]);
