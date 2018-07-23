
angular.module('pureSpectrumApp')

.directive('ngAdvanceAutocomplete', ['$filter', '$document', '$compile', '$parse', '$timeout', 'createSurvey',

    function ($filter, $document, $compile, $parse, $timeout, createSurvey) {

        return {
            restrict: 'AE',
            scope: {
              items: '=',
              prompt: '@',
              model: '=',
              selectedQuestion :'=',
              answerOption: '=?',
              selectedOptions: '=?',
              choosedQuestion: "=?",
              lockQuestion : '=?',
              languageCode : '=?',
              countryCode : '=?',
              rangeQuesOption : "=?",
              defaultRange : "=?"
            },

            template: '<span>Question Description:</span><div class="advAutoCover"><input type="text" class="form-control" ng-model="model" placeholder="{{prompt}}" ng-keydown="selected=false" ng-change="handleSearch()" ng-focus="handleSearch()" ng-blur="clearItems()" ng-disabled="lockQuestion" />'+
              '<i class="fa fa-search" aria-hidden="true"></i>'+
              '<span class="browse-span">Browse</span>'+
              '<div class="items" ng-show="items.length > 0">'+
                '<div class="item" ng-click="handleSelection(item)" style="cursor:pointer" ng-class="{active:isCurrent($index)}" ng-mouseenter="setCurrent($index)" ng-repeat="item in items track by $index">'+
                    '{{items.length > 0 ? item.question_description : "No Data Found"}}'+
                  '</div>'+
              '</div></div>',
            link: function ($scope, $element, $attrs) {
                $scope.handleSelection = function(selectedItem) {
                    //console.log('selectedItem '+JSON.stringify(selectedItem));
                    $scope.current = 0;
                    $scope.selected = true;
                    $timeout(function() {
                      //console.log('selectedItem '+JSON.stringify(selectedItem));
                      // taking into another variable because operations performed on original text modifies it
                      $scope.model = selectedItem.question_description;
                      // adding answers option in dropdown
                      $scope.answerOption = selectedItem.answers[selectedItem.qualification_id[0]].answer_data;
                      // For using the selection question data on controller
                      $scope.selectedQuestion = selectedItem;
                      /*----Removing %%qualification id from stem 1 ------*/
                      var stem1 = $scope.selectedQuestion.stem1;
                      stem1 = stem1.replace($scope.selectedQuestion.stem1, "I'm looking for people "+$scope.selectedQuestion.stem1);
                      $scope.selectedQuestion["stem1_ui"] = stem1.replace('%%'+$scope.selectedQuestion.qualification_id[0]+'%%','');
                      if($scope.selectedQuestion.question_type == 'range'){
                        var rangeOption = $scope.selectedQuestion.stem1_ui;
                        // Get [] square bracket text
                        rangeOption = rangeOption.match(/\[[^\]]*?\]/g)[0];
                        // remove [] square bracket
                        if(rangeOption){
                          rangeOption = rangeOption.replace(/[\[\]']+/g,'');
                          rangeOption = rangeOption.split('/');
                          // Adding options in option object
                          $scope.rangeQuesOption = {
                            "first": rangeOption[0],
                            "second": rangeOption[1]
                          }
                        }
                        // Updating the default Option
                        $scope.defaultRange = $scope.rangeQuesOption.first;
                        $scope.selectedQuestion.stem1_ui = $scope.selectedQuestion.stem1_ui.replace(/\[[^\]]*?\]/g,'');
                      }
                      // Showing Stem 2
                      if(!$scope.lockQuestion){
                        if($scope.selectedQuestion.stem2.indexOf('%%period%%') != -1) {
                            var stem2 = $scope.selectedQuestion.stem2;
                            stem2 = stem2.split('%%period%%');
                            var day_row = angular.element( document.querySelector( '#days_row' ) );
                            day_row.html(stem2[0]+'<input type="number" id="advDays" ng-model="advDays" value="">'+stem2[1]);
                        }else{
                            var stem2 = $scope.selectedQuestion.stem2;
                            var day_row = angular.element( document.querySelector( '#days_row' ) );
                            day_row.html(stem2);
                        }
                      }
                      //angular.element( document.querySelector( '#days_row' ) ).html('');
                    }, 0);
                };

                $scope.handleSearch = function(id) {
                  var searchQuestion = new Object();
                  var removeQues = _.pluck($scope.choosedQuestion, 'respondent_question_id');

                  searchQuestion["phrase"] = $scope.model;
                  searchQuestion["notIds"] = removeQues;
                    if($scope.languageCode && $scope.countryCode){
                      searchQuestion["locale"] = $scope.languageCode+"_"+$scope.countryCode;
                    }else{
                      searchQuestion["locale"] = "eng_US";
                    }
                  
                  if(searchQuestion["phrase"] == ''){
                    $scope.selectedQuestion = {};
                    var day_row = angular.element( document.querySelector( '#days_row' ) );
                    day_row.html('');
                  }
                  createSurvey.getAdvTargetingQues(searchQuestion).then(
                    function(res) {
                      //console.log("res---------", JSON.stringify(res));
                      if(res.data.apiStatus == 'success'){
                        $scope.items = res.data.questions;
                      }
                      else {
                        $scope.items = [];
                      }
                      
                    },function(err) {
                      console.log('Error in Question search '+JSON.stringify(err));
                    });

                };

                $scope.clearItems = function(){
                  $timeout(function(){
                    $scope.items = [];
                  }, 200);
                }
            }
        };
    }]);
