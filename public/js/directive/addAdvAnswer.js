angular.module('pureSpectrumApp')

.directive('addAdvAnswer', ['$document', '$compile', '$parse', 'notify',

    function ($document, $compile, $parse, notify) {

        return {
            restrict: 'AE',
            scope: {
                advQuestionArr: '=',
                countries: '=',
                localeQues : '=',
                rangeMode : '='
            },
            template:   '<div class="countries-inner coutry-box-outer">'+
                            '<div class="form-group col-md-6">'+
                                '<label for="units">Placeholder<span>*</span></label>'+
                                '<input type="placeholder" class="form-control" id="placeholder" placeholder="Placeholder" ng-model="tempOptions.placeholder">'+
                            '</div>'+
                            '<div class="form-group col-md-6">'+
                                '<label for="quesType">Country<span>*</span>'+
                                '</label>'+
                                '<select class="form-control" id="country" ng-change="tempOptions.language = ((countries | filter:{\'short_Code\':tempOptions.country})[0].lang[0].short_code)" ng-model="tempOptions.country" ng-options="country.short_Code  as country.name for country in countries"> '+
                                '</select>'+
                            '</div>'+
                            '<div class="form-group col-md-6">'+
                                '<label for="quesType">Language<span>*</span>'+
                                '</label>'+
                                '<select class="form-control" ng-init="tempOptions.language = countries[0].short_Code" ng-model="tempOptions.language" ng-options="language.short_code as language.name for language in ((countries | filter:{\'short_Code\':tempOptions.country})[0].lang)">'+
                                '</select>'+
                            '</div>'+
                            '<div class="form-group col-md-6">'+
                                '<label for="screener_text">Question Screener Text<span>*</span><p>Qualification Format : "%%respId%%"</p></label>'+
                                '<input type="text" class="form-control" id="screener_text" placeholder="Screener Text" ng-model="tempOptions.screener_text">'+
                            '</div>'+
                            '<div class="add-multi-option-inner" ng-if ="!rangeMode">'+
                                '<input type="number" class="form-control" placeholder="id" ng-model="addOption.id">'+
                                '<input type="text" class="form-control" placeholder="text" ng-model="addOption.text">'+
                                '<input type="text" ng-if="tempOptions.language!= \'eng\'" class="form-control" placeholder="translation" ng-model="addOption.translation">'+
                                '<a class= "btn btn-default submit-btn ng-scope glyphicon glyphicon-plus add-option-btn " style="cursor:pointer;" ng-click="addOptionRow(addOption.id, addOption.text, addOption.translation)"></a>'+
                            '</div>'+
                            '<div class="add-multi-option-inner" ng-repeat="option in tempOptions.multiOptions" ng-if ="!rangeMode">'+
                                '<input type="number" class="form-control" placeholder="id" ng-model="option.id" ng-disabled = "true">'+
                                '<input type="text" class="form-control" placeholder="text" ng-model="option.text">'+
                                '<input type="text" ng-if="tempOptions.language!= \'eng\'" class="form-control" placeholder="translation" ng-model="option.translation">'+
                                '<a style="cursor:pointer;" ng-click="deleteOptionRow(option.id)">Delete</a>'+
                            '</div>'+
                            '<a class="btn btn-default submit-btn ng-scope" style="cursor:pointer;" ng-click="addLocaleQues(tempOptions)">Add More</a>'+

                            '<p>{{advQuestionArr.length}} added</p>'+
                            '<div class="clearfix"></div>'+
                        '</div>'+


                        '<div class="countries-inner coutry-box-outer" ng-repeat="question in advQuestionArr">'+
                            '<div class="form-group col-md-6">'+
                                '<label for="units">Placeholder<span>*</span></label>'+
                                '<input type="placeholder" class="form-control" id="placeholder" placeholder="Placeholder" ng-model="question.placeholder">'+
                            '</div>'+
                            '<div class="form-group col-md-6">'+
                                '<label for="quesType">Country<span>*</span>'+
                                '</label>'+
                                '<select class="form-control" id="country" ng-model="question.country" ng-options="country.short_Code  as country.name for country in countries"> '+
                                '</select>'+
                            '</div>'+
                            '<div class="form-group col-md-6">'+
                                '<label for="quesType">Language<span>*</span>'+
                                '</label>'+
                                '<select class="form-control" ng-model="question.language" ng-options="language.short_code as language.name for language in ((countries | filter:{\'short_Code\':question.country})[0].lang)">'+
                                '</select>'+
                            '</div>'+
                            '<div class="form-group col-md-6">'+
                                '<label for="screener_text">Question Screener Text<span>*</span><p>Qualification Format : "%%respId%%"</p></label>'+
                                '<input type="text" class="form-control" id="screener_text" placeholder="Screener Text" ng-model="question.screener_text">'+
                            '</div>'+
                            '<div class="add-multi-option-inner" ng-repeat="option in question.multiOptions" ng-if ="!rangeMode">'+
                                '<input type="number" class="form-control" placeholder="id" ng-model="option.id" ng-disabled = "true">'+
                                '<input type="text" class="form-control" placeholder="text" ng-model="option.text">'+
                                '<input type="text" ng-if="question.language!= \'eng\'" class="form-control" placeholder="translation" ng-model="option.translation">'+
                            '</div>'+
                            '<a class="btn btn-default ng-scope btn-danger" style="cursor:pointer;" ng-click="deleteLocaleQues($index)">Delete</a>'+
                            '<div class="clearfix"></div>'+
                        '</div>',
            link: function ($scope, $element, $attrs) {
                $scope.addOption = {
                    'id': '',
                    'text': '',
                    'translation': ''
                };
                $scope.tempOptions = {
                    'country': ($scope.countries && $scope.countries.length) ? $scope.countries[0].short_Code : "",
                    'language': ($scope.countries && $scope.countries.length) ? $scope.countries[0].lang[0].short_code : "",
                    'screener_text': "",
                    'placeholder': "",
                    'multiOptions': []
                };
                if(!$scope.advQuestionArr){
                    $scope.advQuestionArr = new Array()
                }
                //console.log('$scope.advQuestionArr '+JSON.stringify($scope.advQuestionArr));

                $scope.multiOptions = new Array();
                $scope.addOptionRow = function(id, text, translation){
                    if($scope.tempOptions.language && $scope.tempOptions.language != 'eng' && !translation){
                        return notify({
                            message: 'Add translation for text',
                            classes: 'alert-warning',
                            duration: 2000
                        });
                    }
                    if(id && text){
                        if(_.findIndex($scope.tempOptions.multiOptions, {'id':id}) == -1){
                            var multiOptObj = {'id': id, 'text': text};
                            if($scope.tempOptions.language != 'eng' && translation){
                                multiOptObj['translation'] = translation;
                            }
                            $scope.tempOptions.multiOptions.push(multiOptObj);
                            notify({
                                message: $scope.tempOptions.multiOptions.length+' options added',
                                classes: 'alert-success',
                                duration: 2000
                            });
                            //console.log(multiOptObj)
                            // Clearing the adding fields
                            $scope.addOption = {
                                'id': '',
                                'text': '',
                                'translation': ''
                            };
                        }else{
                            notify({
                                message: 'Option id already exist',
                                classes: 'alert-warning',
                                duration: 2000
                            }); 
                        }
                    }else{
                        notify({
                            message: 'Please enter option id and option text',
                            classes: 'alert-warning',
                            duration: 2000
                        });
                    }
                }

                $scope.addLocaleQues = function(tempOptions){

                    if(tempOptions.country && tempOptions.language && tempOptions.screener_text && tempOptions.placeholder && tempOptions.multiOptions){
                        if(_.findIndex($scope.advQuestionArr, {'country':tempOptions.country, 'language': tempOptions.language}) == -1){

                            var locale = tempOptions.language+'_'+tempOptions.country;
                            $scope.advQuestionArr.push({
                                'country': tempOptions.country,
                                'language': tempOptions.language,
                                'screener_text': tempOptions.screener_text,
                                'placeholder': tempOptions.placeholder,
                                'multiOptions': tempOptions.multiOptions
                            });

                            notify({
                                message: $scope.advQuestionArr.length+' Screener question added',
                                classes: 'alert-success',
                                duration: 2000
                            });
                            // Reset the adding fields
                            $scope.tempOptions = {
                                'country': ($scope.countries && $scope.countries.length) ? $scope.countries[0].short_Code : "",
                                'language': $($scope.countries && $scope.countries.length) ? $scope.countries[0].lang[0].short_code : "",
                                'screener_text': "",
                                'placeholder': "",
                                'multiOptions': []
                            };
                        }else{
                            notify({
                                message: 'Screener question already exist',
                                classes: 'alert-warning',
                                duration: 2000
                            }); 
                        }
                    }else{
                        notify({
                            message: 'Please enter all field',
                            classes: 'alert-warning',
                            duration: 2000
                        });
                    }
                }

                $scope.deleteOptionRow = function(id){
                    if(id){
                        var optionIndex = _.findIndex($scope.tempOptions.multiOptions, {'id':id});
                        if(optionIndex == -1){
                            notify({
                                message: "Option id doesn't exist",
                                classes: 'alert-warning',
                                duration: 2000
                            });
                        }else{
                            $scope.tempOptions.multiOptions.splice(optionIndex, 1);
                            notify({
                                message: "Option deleted",
                                classes: 'alert-warning',
                                duration: 2000
                            });
                        }
                    }
                }

                $scope.deleteLocaleQues = function(index){
                    if($scope.advQuestionArr.length && $scope.advQuestionArr[index]){
                        if(index == -1){
                            notify({
                                message: "Screener question doesn't exist",
                                classes: 'alert-warning',
                                duration: 2000
                            });
                        }else{
                            $scope.advQuestionArr.splice(index, 1);
                            notify({
                                message: "Screener question deleted",
                                classes: 'alert-warning',
                                duration: 2000
                            });
                        }
                    }
                }
            }
        };
    }]);



    