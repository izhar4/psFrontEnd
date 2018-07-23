/**
 * Created by Parveen on 3/11/2016.
 */

angular.module('pureSpectrumApp')
    .factory('companyService',['$http','config', function($http, config) {
        var base_url = config.pureSpecturm.url;
        return {
            getCompany: function (cmpId) {
                return $http.get(base_url + '/company/'+cmpId);
            },

            getAllCompaniesData : function(){
                return $http.get(base_url + '/companies');
            },

            updateCompanyDetails : function(cmpData){
                return $http.put(base_url + '/company/'+cmpData.id,cmpData);
            },

            saveCompanyDetails : function(cmpData){
                return $http.post(base_url + '/company', cmpData);
            },

            deleteCompany : function(cmpId){
                return $http.delete(base_url + '/company/'+cmpId);
            },
            getInvoiceCompaniesData : function(){
                return $http.get(base_url + '/invoice/companies');
            },
            getBuyerCompany: function () {
                return $http.get(base_url + '/getBuyers');
            },
            getAllSuppliersData : function(bodyObj){
                return $http.get(base_url + '/invoice/companies?supplier_type='+bodyObj.supplier_type+'&isBuyr='+bodyObj.isBuyr);
            },
            getAllBuyersData : function(bodyObj){
                return $http.get(base_url + '/invoice/companies?isSpplr='+bodyObj.isSpplr+'&isBuyr='+bodyObj.isBuyr);
            }
        }
    }]);
