
angular.module('pureSpectrumApp')
.directive('decimalPlaces',function(){
    return {
        link:function(scope,ele,attrs){
            ele.bind('keypress',function(e){
                var oldVal=$(this).val()+(e.charCode!==0?String.fromCharCode(e.charCode):'');
                var newVal = ele[0].innerText + oldVal;
                var splitArray = newVal.split(".");
                if(newVal.search(/(.*)\.[0-9][0-9]/)===0 && splitArray[1].length > 2){
                    e.preventDefault();
                }
            });
        }
    };
});