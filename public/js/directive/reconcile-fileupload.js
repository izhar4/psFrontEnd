/**
 * Reconciliation file upload module
 */


 angular.module('pureSpectrumApp')

.directive('fileUpload', ['$parse', function ($parse) {
    return {
        restrict: 'AE',
    
        scope: {
            file: '='
        },
        link: function(scope, el, attrs){
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];
                scope.file = file ? file.name : undefined;
                scope.$apply();
            });
        }
    };
}]);