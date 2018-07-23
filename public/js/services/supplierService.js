

angular.module('pureSpectrumApp')
    .factory('supplierService',['$http','config', function($http, config) {
        var base_url = config.pureSpecturm.url;
        return {
            /*getCompany: function (cmpId) {
                return $http.get(base_url + '/company/'+cmpId);
            },*/

            getAllSuppliersData : function(id){
                return $http.get(base_url + '/getSupplier/'+id);
            },
            
            getNonBlockedSuppliers: function(id, countryId ,languageId) {
                return $http.get(base_url + '/getSupplier/unblock/'+id+'?countryId='+countryId+'&languageId='+languageId);
            },

            setPrfBlkSuppliers: function(data) {
                return $http.post(base_url+'/preferedSupplierList', data)
            },

            getFlexibilityPricesParams: function(id) {
                return $http.get(base_url+'/supplier/getFlexibilityPricesParams/'+id)
            }
        }
    }]);
