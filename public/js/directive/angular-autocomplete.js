
angular.module('pureSpectrumApp')

.directive('ngAutocomplete', ['$filter', '$document', '$compile', '$parse', '$timeout', 'createSurvey',

    function ($filter, $document, $compile, $parse, $timeout, createSurvey) {

        return {
            restrict: 'AE',
            scope: {
              items: '=',
              prompt: '@',
              id: '@',
              country: '@',
              title: '@',
              subtitle: '@',
              model: '=',
              onSelect: '&?',
              onChange: '&?'
            },

            template: '<input type="text" id="{{id}}" id="{{country}}" class="form-control" ng-model="model" placeholder="{{prompt}}" ng-keydown="selected=false" ng-change="handleSearch()" /><div class="items" ng-hide="!model.length || selected"><div class="item" ng-repeat="item in items | filter:filterData  track by $index" ng-click="handleSelection(item)" style="cursor:pointer" ng-class="{active:isCurrent($index)}" ng-mouseenter="setCurrent($index)">{{item[title]}}</div></div>',
            link: function ($scope, $element, $attrs) {

                $scope.handleSelection = function(selectedItem) {
                  $scope.current = 0;
                  $scope.selected = true;
                  $timeout(function() {
                    $scope.onSelect({state : selectedItem});
                  }, 100);
                };
                $scope.current = 0;
                $scope.selected = true; /* hides the list initially*/
                $scope.isCurrent = function(index) {
                    return $scope.current == index;
                };
                $scope.setCurrent = function(index) {
                    $scope.current = index;
                };

                $scope.filterData = function (obj) {
                  
                  return filterFunction (obj.name, $scope.model);
                };

                $scope.handleSearch = function(id) {
                  var countryCode = $scope.country || 'US';
                  if($scope.model != undefined && $scope.model != null && $scope.model != "" && $scope.model.length >= 3) {
                    createSurvey.searchAutoComplete(countryCode, $scope.id, $scope.model).then(
                      function(res) {
                        $timeout(function() {
                          if($scope.id == 'state') {
                            $scope.items = res.data.stData;
                          }
                          if($scope.id == 'csa') {
                            $scope.items = res.data.csaData;
                          }
                          if($scope.id == 'msa') {
                            $scope.items = res.data.msaData;
                          }
                          if($scope.id == 'county') {
                            $scope.items = res.data.countyData;
                          }
                          if($scope.id == 'dma') {
                            $scope.items = res.data.dmaList;
                          }
                          
                        },100);
                        
                      },
                      function(err) {

                      });
                  }else {
                    $scope.items = [];
                  }
                };

                function filterFunction(name, search) {
                  

                  //validate if name is null or not a string if needed
                  if (search != undefined && search != null && search != "" && search.length >= 3){
                    var delimeterRegex = /[ -]+/;
                    var names = name.split(delimeterRegex);
                    //do any of the names in the array start with the search string
                    /*return names.some(function(name) {
                        return name.toLowerCase().indexOf(search.toLowerCase()) === 0;
                    });*/
                      
                      var evens = _.some(names, function(obj) {
                          if(obj.toLowerCase().indexOf(search.toLowerCase()) === 0) {
                            return obj;
                          }  
                      });

                      return evens;
                      

                    
                  }else {
                    return true;
                  }
                  

                };
            }
        };
    }]);
