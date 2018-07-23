/**
 * Created by Jaspreet Singh on 12/04/2017.
 */

angular.module('pureSpectrumApp')
    .factory('feasibilityService', ['$http', 'config', function($http, config) {
        var base_url = config.pureSpecturm.url;
        var feasibility_url = config.feasibility.url;
        return {
            saveFeasibility: function(feasibilityData) {
                return $http.post(base_url + '/feasibilitySetting/', feasibilityData);
            },
            getFeasibilityById: function(suppliers) {
                return $http.get(base_url + '/getFeasibilitySetting/'+suppliers);
            },
            getFeasibilityForSuppliers: function(suppliers) {
                return $http.post(base_url + '/getFeasibilityForSuppliers',suppliers);
            },
            getFeasibility: function(data) {
                return $http.post(feasibility_url + '/feasibility/v1/', data);
            },
            savePricingMargin: function(data) {
                return $http.post(base_url + '/pricing/margin/save', data);
            },
            getPricingMargin: function(buyer_id, supplier_id) {
                return $http.get(base_url + '/pricing/margin/fetch?buyer_id=' + buyer_id + '&supplier_id=' + supplier_id);
            }
         }
    }]);