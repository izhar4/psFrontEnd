/**
 * Created by Sanjiv on 02/02/2017
 */

angular.module('pureSpectrumApp')
.factory('invoiceService',['$http','config', function($http, config) {
    var base_url = config.pureSpecturm.url;
    return {
        fetchInvoiceFile: function (id, name, period) {

            if(parseInt(period) < 201708){
                return $http.get(base_url + '/survey/finance/V1?company_id=' + id + '&company_name=' + name + '&period=' + period);
            }else{

                return $http.get(base_url + '/survey/finance?company_id=' + id + '&company_name=' + name + '&period=' + period);
            }
        },
        downloadInvoice: function (fileName) {
            return base_url + '/survey/download-invoice/' + fileName;
        },
        downloadPdfInvoiceFile: function (data) {
           

            if(data.period && parseInt(data.period) < 201708){

                return $http.post(base_url + '/survey/pdfinvoice/finance/V1',data, {responseType:'arraybuffer'});
                
            }else{
                return $http.post(base_url + '/survey/pdfinvoice/finance',data, {responseType:'arraybuffer'});
            }
            
        }


    }
}]);
