/**
 * Created by Parveen on 3/9/2016.
 */

angular.module('pureSpectrumApp')
    .factory('pricingService',['$http','config','$window','localStorageService', function($http,config, $window, localStorageService) {
        var base_url = config.pureSpecturm.url;
        var userInfo=localStorageService.get('logedInUser');

        return {
            addPriceCard : function(priceData) {
                return $http.post( base_url + '/supplierPriceCard',priceData);
            },

            deactivateSupplier: function(prcCardData){
                return $http.put(base_url + '/supplierPriceCard',prcCardData);
            },

            getSupplier: function(lng, cntry, byr){
                return $http.get(base_url + '/supplierPriceCard?language='+lng+'&country='+cntry+'&buyerCounterParty='+byr);
            },

            supplierFileUpload: function(lng, cntry, manualPriceCard) {
                return $http.post(base_url + '/supplier/manualPriceCard?language='+lng+'&country='+cntry, manualPriceCard);
            },

            getSupplierManualRateCard: function(lng, cntry, byr) {
                return $http.post(base_url + '/supplier/getSupplierPriceCard?language='+lng+'&country='+cntry+'&buyerCounterParty='+byr);
            },

            downloadSupplierManualCard: function(lng, cntry, byr) {
                return $http.get(base_url + '/supplier/downloadSupplierManualCard?language='+lng+'&country='+cntry+'&buyerCounterParty='+byr);
            }
        }

    }]);

