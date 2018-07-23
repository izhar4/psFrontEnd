/**
 * Created by Parveen on 4/4/2016.
 */

angular.module('pureSpectrumApp')

.directive('ngDropdownMultiselect', ['$filter', '$document', '$compile', '$parse', '$state', '$timeout',

    function ($filter, $document, $compile, $parse, $state, $timeout) {

        return {
            restrict: 'AE',
            scope: {
                selectedModel: '=',
                options: '=',
                extraSettings: '=',
                events: '=',
                searchFilter: '=?',
                translationTexts: '=',
                groupBy: '@',
                openModal:'=',
                numberCompletes:'=',
                editFlag: '=',
                raceQuota: '=',
                genderQuota: '=',
                relationQuota: '=',
                childrenQuota: '=',
                employmentQuota: '=',
                educationQuota: '=',
                deviceQuota: '=',
                childrenModel: '=',
                rbQuota: '=',
                hispanicQuota: '=',
                childQuotaData: '=',
                categoryName: '@',
                childDataClear: '&',
                censusrepoapply: '&',
                censusGender: '=',
                censusRace: '=',
                censusEducation: '=',
                censusHispanic: '=',
                censusEmployment: '=',
                disableCensus: '=',
                deleteRace: '=',
                deleteEducation: '=',
                deleteEmployment: '=',
                deleteRelation: '=',
                deleteRacebera: '=',
                deleteDevice: '=',
                removeGrouping: '='
            },

            template: function (element, attrs) {
                var checkboxes = attrs.checkboxes ? true : false;
                var groups = attrs.groupBy ? true : false;
                /*PD-658 button issue set width= 100% in templaet 1st & 2nd line*/

                var template = '<div class="multiselect-parent btn-group dropdown-multiselect" style="width: 100%;"><span>';
                template += '<button id="{{modalId}}" type="button" class="dropdown-toggle" style="height: 64px;width: 100%; text-align: left; font-size: 13px;color:#565a5c;font-family:OpenSans-Semibold;" ng-class="settings.buttonClasses" ng-click="toggleDropdown()">{{getButtonText()}}&nbsp;<span  style=" border-left: 4px solid transparent;border-right: 3px solid transparent; border-top: 4px solid #000000;display: inline-block;height: 0;opacity:0.6;vertical-align: middle;width:7px; position: absolute;left: 90%; top: 50%;" ></span></button>';
                template += '<ul class="dropdown-menu dropdown-menu-form" ng-style="{display: open ? \'block\' : \'none\'}" style="overflow-y: scroll;overflow-x: hidden; width: 100%;">'; /*PD-658 width=100%*/
                template += '<li><button type="button" ng-disabled="categoryName != \'gender\' && categoryName != \'children\' && selectedModel.length <= 1" class="btn btn-primary btn-link btn-xs pull-left" data-toggle="modal" data-target="{{modalId}}" id="drop_qId" ng-keydown ="tabbing($event,\'gender_qmodel\',\'age_qmodel\');"> <span data-ng-click="checkAll();" ng-show="!editFlag">Add Quotas </span><span ng-show="editFlag == true">Edit Quota</span></button> <button ng-if="quotaName == \'genderModal\' || quotaName == \'raceModal\' || quotaName == \'hispanicModal\' || quotaName == \'eduModal\' || quotaName == \'empModal\'"  type="button" class="btn btn-primary btn-link btn-xs pull-left" ng-click="censusrepoapply({nameArgs: quotaName});" ng-disabled="(censusGender || censusRace || censusEducation || censusHispanic || censusEmployment)" ng-show="disableCensus">Census</button> <button type="button" class="btn btn-primary btn-link btn-xs pull-right" ng-click="clearQuotas()" >  <span ng-show="editFlag == true">Delete Quota</span></button></li>';
                template += '<li ng-hide="!settings.showCheckAll || settings.selectionLimit > 0"><a data-ng-click="selectAll()"><span class="glyphicon glyphicon-ok"></span>  {{texts.checkAll}}</a>';
                template += '<li ng-show="settings.showUncheckAll"><a data-ng-click="deselectAll();"><span class="glyphicon glyphicon-remove"></span>   {{texts.uncheckAll}}</a></li>';
                template += '<li ng-hide="(!settings.showCheckAll || settings.selectionLimit > 0) && !settings.showUncheckAll" class="divider"></li>';
                template += '<li ng-show="settings.enableSearch"><div class="dropdown-header"><input type="text" class="form-control" style="width: 100%;" ng-model="searchFilter" placeholder="{{texts.searchPlaceholder}}" /></li>';
                template += '<li ng-show="settings.enableSearch" class="divider"></li>';


                if (groups) {
                    template += '<li ng-repeat-star t="option in orderedItems | filter: searchFilter" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupTitle(getPropertyForObject(option, settings.groupBy)) }}</li>';
                    template += '<li ng-repeat-end role="presentation">';
                } else {
                    template += '<li role="presentation" ng-repeat="option in options | filter: searchFilter">';
                }

                template += '<a role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp)); handleCensusAndGrouping(quotaName)">';

                if (checkboxes) {
                    template += '<div class="checkbox"><input class="checkboxInput" type="checkbox" ng-click="checkboxClick($event, getPropertyForObject(option,settings.idProp))" ng-checked="isChecked(getPropertyForObject(option,settings.idProp))" /><label ng-click="handleCensusAndGrouping(quotaName)">{{getPropertyForObject(option, settings.displayProp)}}</label></div></a>';
                } else {
                    template += '<span data-ng-class="{\'glyphicon glyphicon-ok\': isChecked(getPropertyForObject(option,settings.idProp))}"></span> {{getPropertyForObject(option, settings.displayProp)}}</a>';
                }

                template += '</li>';

                template += '<li class="divider" ng-show="settings.selectionLimit > 0"></li>';
                template += '<li role="presentation" ng-show="settings.selectionLimit > 0"><a role="menuitem">{{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></li>';

                template += '</ul>';
                template += '</div>';

                element.html(template);
            },
            link: function ($scope, $element, $attrs) {
                //$scope.chldrnFlag = true;
                var $dropdownTrigger = $element.children()[0];
                $scope.toggleDropdown = function () {
                    $scope.open = !$scope.open;

                };
                $attrs.$observe('openModal', function(value){
                    $scope.modalId = "#"+value;
                    $scope.quotaName = value; //PD-1130
                });


                $scope.checkboxClick = function ($event, id) {
                    $scope.setSelectedItem(id);
                    $event.stopImmediatePropagation();
                };


                $scope.liveSurveyEditingStep = $state.params.edit;

                $scope.externalEvents = {
                    onItemSelect: angular.noop,
                    onItemDeselect: angular.noop,
                    onSelectAll: angular.noop,
                    onDeselectAll: angular.noop,
                    onInitDone: angular.noop,
                    onMaxSelectionReached: angular.noop
                };

                $scope.clearQuotas = function() {
                    if(!confirm("Are you sure you want to clear Quota")) {
                    }else{
                        angular.forEach($scope.options, function (value) {
                            if(_.has(value, "hasCensusRepoQuota")) {
                                delete value.hasCensusRepoQuota;
                            }
                            value.number = '';
                            value.per = '';
                            value.minimum = '';
                            value.maximum = '';
                            //{"flexiblePer":20,"flexible":true,"id":111,"number":50,"minimum":40,"maximum":60,"percentage":50}
                            if(value.fieldName == "Children"){
                                $scope.childQuotaData.no[0]['flexPer'] = 0;
                                $scope.childQuotaData.no[0]['minimum'] = '';
                                $scope.childQuotaData.no[0]['maximum'] = '';
                                $scope.childQuotaData.no[0]['number'] = '';
                                $scope.childQuotaData.no[0]['per'] = '';
                                $scope.childQuotaData.no[0]['percentage'] = '';
                                _.each($scope.childQuotaData.have, function(item, index){
                                    if(index != 0){
                                        $scope.childQuotaData.have.splice(index, 1);
                                    }
                                });
                                $scope.childDataClear();
                               
                                $scope.childrenQuota = false;
                            }else{
                                _.each($scope.selectedModel, function(item, index){
                                    delete item;
                                });

                                if(value.fieldName == "Race"){
                                    $scope.raceQuota = false;
                                    $scope.censusRace = false;
                                    //PD-961
                                    $scope.deleteGroupingQuotas();
                                    
                                }else if(value.fieldName == "Gender"){
                                    $scope.genderQuota = false;
                                    $scope.censusGender = false;
                                }else if(value.fieldName == "Relationship"){
                                     //PD-961
                                    $scope.deleteGroupingQuotas();

                                    $scope.relationQuota = false;
                                }else if(value.fieldName == "Employment"){
                                    //PD-961
                                    $scope.deleteGroupingQuotas();

                                    $scope.employmentQuota = false;
                                    $scope.censusEmployment = false;
                                }else if(value.fieldName == "Education"){
                                     //PD-961
                                    $scope.deleteGroupingQuotas();
                                    

                                    $scope.educationQuota = false;
                                    $scope.censusEducation = false;
                                }else if(value.fieldName == "raceBera"){
                                    //PD-961
                                    $scope.deleteGroupingQuotas();

                                    $scope.rbQuota = false;
                                }else if(value.fieldName == "hispanic"){
                                    $scope.hispanicQuota = false;
                                    $scope.censusHispanic = false;
                                }else if(value.fieldName == "Device"){
                                    //PD-961
                                    $scope.deleteGroupingQuotas();

                                    $scope.deviceQuota = false;
                                }if(value.fieldName == "Children"){
                                    $scope.childrenQuota = false;
                                }
                            }
                        });
                        $scope.editFlag = false;
                    }
                }

                $scope.settings = {
                    dynamicTitle: true,
                    scrollable: false,
                    scrollableHeight: '300px',
                    closeOnBlur: true,
                    displayProp: 'name',
                    idProp: 'id',
                    externalIdProp: 'id',
                    enableSearch: false,
                    selectionLimit: 0,
                    showCheckAll: false,
                    showUncheckAll: true,
                    closeOnSelect: false,
                    buttonClasses: 'btn btn-default',
                    closeOnDeselect: false,
                    groupBy: $attrs.groupBy || undefined,
                    groupByTextProvider: null,
                    smartButtonMaxItems: 0,
                    smartButtonTextConverter: angular.noop
                };

                $scope.texts = {
                    checkAll: 'Select All',
                    uncheckAll: 'Deselect All',
                    selectionCount: 'selected',
                    selectionOf: '/',
                    buttonDefaultText: 'All',
                    searchPlaceholder: 'Search...',
                    dynamicButtonTextSuffix: 'All'
                };

                $scope.searchFilter = $scope.searchFilter || '';

                if (angular.isDefined($scope.settings.groupBy)) {
                    $scope.$watch('options', function (newValue) {
                        if (angular.isDefined(newValue)) {
                            $scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
                        }
                    });
                }
                angular.extend($scope.settings, $scope.extraSettings || []);
                angular.extend($scope.externalEvents, $scope.events || []);
                angular.extend($scope.texts, $scope.translationTexts);

                $scope.singleSelection = $scope.settings.selectionLimit === 1;

                function getFindObj(id) {
                    var findObj = {};

                    if ($scope.settings.externalIdProp === '') {
                        findObj[$scope.settings.idProp] = id;
                    } else {
                        findObj[$scope.settings.externalIdProp] = id;
                    }

                    return findObj;
                }

                function clearObject(object) {
                    for (var prop in object) {
                        delete object[prop];
                    }
                }

                if ($scope.singleSelection) {
                    if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0) {
                        clearObject($scope.selectedModel);
                    }
                }

                if($scope.settings.closeOnBlur) {
                    $document.on('click', function (e) {
                        var target = e.target.parentElement;
                        var parentFound = false;

                        while (angular.isDefined(target) && target !== null && !parentFound) {
                            if (_.contains(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                                if (target === $dropdownTrigger) {
                                    parentFound = true;
                                }
                            }
                            target = target.parentElement;
                        }

                        if (!parentFound) {
                            $scope.$apply(function () {
                                $scope.open = false;
                            });
                        }
                    });
                }

                $scope.getGroupTitle = function (groupValue) {
                    if ($scope.settings.groupByTextProvider !== null) {
                        return $scope.settings.groupByTextProvider(groupValue);
                    }

                    return groupValue;
                };

                $scope.getButtonText = function () {
                    if ($scope.settings.dynamicTitle && ($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) && _.keys($scope.selectedModel).length > 0))) {
                        if ($scope.settings.smartButtonMaxItems > 0) {
                            var itemsText = [];

                            angular.forEach($scope.options, function (optionItem) {
                                if ($scope.isChecked($scope.getPropertyForObject(optionItem, $scope.settings.idProp))) {
                                    var displayText = $scope.getPropertyForObject(optionItem, $scope.settings.displayProp);
                                    var converterResponse = $scope.settings.smartButtonTextConverter(displayText, optionItem);
                                    itemsText.push(converterResponse ? converterResponse : displayText);
                                }
                            });

                            if ($scope.selectedModel.length > $scope.settings.smartButtonMaxItems) {
                                itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
                                itemsText.push('...');
                            }

                            return itemsText.join(', ');
                        } else {
                            var totalSelected;

                            if ($scope.singleSelection) {
                                totalSelected = ($scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
                            } else {
                                //Handle Grouping Count show for selected PD-961
                                var findSltGrouped = _.where($scope.selectedModel, {"condditionGroup": true});
                                if(findSltGrouped.length > 0) {
                                    _.each(findSltGrouped, function(sltGrup) {
                                        var findIndex = _.indexOf($scope.selectedModel, sltGrup);
                                        if(findIndex > -1) {
                                            $scope.selectedModel.splice(findIndex, 1);
                                        }
                                    })
                                }
                                totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;
                            }
                            if($scope.selectedModel && $scope.options && $scope.selectedModel.length < $scope.options.length){
                                $scope.texts.dynamicButtonTextSuffix = 'selected';
                                return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix
                            }


                            if (totalSelected === 0) {
                                $scope.settings.showCheckAll = true;
                                return $scope.texts.buttonDefaultText;
                            }

                            else {
                                $scope.texts.dynamicButtonTextSuffix = 'All';
                                $scope.settings.showCheckAll = false;
                                $scope.settings.showUncheckAll = true;
                                return  $scope.texts.dynamicButtonTextSuffix;
                            }

                        }

                    } else {
                        $scope.texts.dynamicButtonTextSuffix = 'All';
                        $scope.settings.showCheckAll = true;
                        $scope.settings.showUncheckAll = false;
                        return $scope.texts.buttonDefaultText;
                    }
                };


                $scope.getPropertyForObject = function (object, property) {
                    if (angular.isDefined(object) && object.hasOwnProperty(property)) {
                        return object[property];
                    }

                    return '';
                };

                $scope.selectAll = function () {
                    $scope.deselectAll(false);
                    var tmpRem = 0;
                    $scope.settings.showUncheckAll = true;
                    $scope.settings.showCheckAll = false;
                    $scope.externalEvents.onSelectAll();
                    angular.forEach($scope.options, function (value) {
                        value.selected = true;
                        // value.number = parseInt($scope.numberCompletes/$scope.options.length);
                        // value.per = parseInt((value.number * 100)/$scope.numberCompletes);
                        tmpRem = parseInt(tmpRem + parseInt($scope.numberCompletes/$scope.options.length));
                        value.totalRem = $scope.numberCompletes - tmpRem;
                        $scope.setSelectedItem(value[$scope.settings.idProp], true);

                    });
                    if($scope.censusGender) {
                        $scope.censusGender = false;
                    }
                    if($scope.censusRace) {
                        $scope.censusRace = false;
                    }
                    if($scope.censusEducation) {
                        $scope.censusEducation = false;
                    }
                    if($scope.censusHispanic) {
                        $scope.censusHispanic = false;
                    }
                    if($scope.censusEmployment) {
                        $scope.censusEmployment = false;
                    }
                };

                $scope.deselectAll = function (sendEvent) {
                    if(!sendEvent){
                        $scope.editFlag = false;
                    }
                    sendEvent = sendEvent || true;
                    $scope.settings.showCheckAll = true;
                    $scope.settings.showUncheckAll = false;
                    if (sendEvent) {
                        $scope.externalEvents.onDeselectAll();
                    }

                    if ($scope.singleSelection) {
                        clearObject($scope.selectedModel);
                    } else {
                        $scope.selectedModel.splice(0, $scope.selectedModel.length);
                    }
                    //PD-961
                    $scope.deleteGroupingQuotas();

                    _.each($scope.options, function (value) {
                        resetQuotaFlag(value);
                        value.selected = false;
                        value.number = '';
                        value.per = '';
                        value.minimum = '';
                        value.maximum = '';
                        value.totalRem = '';
                    });
                    
                    $scope.texts.buttonDefaultText =  'Select';
                };
                function resetQuotaFlag(value){
                    if(value.fieldName == "Race"){
                        $scope.raceQuota = false;
                    }
                    if(value.fieldName == "Gender"){
                        $scope.genderQuota = false;
                    }
                    if(value.fieldName == "Relationship"){
                        $scope.relationQuota = false;
                    }
                    if(value.fieldName == "Children"){
                        $scope.childrenQuota = false;
                    }
                    if(value.fieldName == "Employment") {
                            $scope.employmentQuota = false;
                     }
                    if(value.fieldName == "Education") {
                            $scope.educationQuota = false;
                        }
                    if(value.fieldName == "Device") {
                        $scope.deviceQuota = false;
                    }
                    if(value.fieldName == "raceBera") {
                        $scope.rbQuota = false;
                    }
                    if(value.fieldName == "hispanic") {
                        $scope.hispanicQuota = false;
                    }
                }
                $scope.setSelectedItem = function (id, dontRemove) {
                    var uncheckconfirm = false;
                    var findObj = getFindObj(id);
                    var finalObj = null;
                    var tmpSl = 0;
                    angular.forEach($scope.options, function (value) {
                     if(value.number !== ""){
                            if(value.id == id){
                            value.selected = true;
                            }
                        }
                        if(value.selected == true){
                            var lth = $scope.selectedModel.length+1;
                           // value.number = parseInt($scope.numberCompletes/lth);
                           // value.per = parseInt((value.number * 100)/$scope.numberCompletes);
                            tmpSl = parseInt(tmpSl + parseInt($scope.numberCompletes/lth));
                           value.totalRem = $scope.numberCompletes - tmpSl;
                        }
                        if(value.id == 112 && value.name == "Have Children"  && value.selected == true){
                            $scope.chldrnFlag = true;
                           }
                    });


                    if ($scope.settings.externalIdProp === '') {
                        finalObj = _.find($scope.options, findObj);
                    } else {
                        finalObj = findObj;
                    }
                    if ($scope.singleSelection) {
                        clearObject($scope.selectedModel);
                        angular.extend($scope.selectedModel, finalObj);
                        $scope.externalEvents.onItemSelect(finalObj);
                        if ($scope.settings.closeOnSelect) $scope.open = false;

                        return;
                    }

                    dontRemove = dontRemove || false;

                    var exists = _.findIndex($scope.selectedModel, findObj) !== -1;
                    if (!dontRemove && exists) {
                        var tmp = 0;
                        //PD - 374
                        var stopAngularForEachLoop = false;
                        var total_Qty = 0; 
                        if($scope.liveSurveyEditingStep == 'editStep1'){
                                if($scope.options[0].fieldName == 'Children'){
                                    _.each(_.keys($scope.childQuotaData), function(eachKey){
                                        _.each($scope.childQuotaData[eachKey], function(singleQuotaRow){
                                            if(singleQuotaRow.number && singleQuotaRow.number != undefined && singleQuotaRow.number!= ''){
                                                total_Qty += singleQuotaRow.number;
                                            }
                                        });
                                    });
                                }else{
                                    _.each($scope.options, function(singleRow){
                                        if(singleRow.number != undefined && singleRow.number != null && singleRow.number != ''){
                                            total_Qty = total_Qty + singleRow.number;
                                        }
                                    });
                                    //PD-961
                                    var findGrouping = _.findWhere($scope.selectedModel, {"condditionGroup": true});
                                    if(findGrouping) {
                                       total_Qty += findGrouping.number; 
                                    }
                                }
                                angular.forEach($scope.options, function(value){
                                    if(stopAngularForEachLoop == false){
                                        if((total_Qty === $scope.numberCompletes)){
                                            if(!confirm("Modifying the qualifications will delete the current quotas")) {
                                                stopAngularForEachLoop = true;
                                                uncheckconfirm = true;
                                                return true;
                                            }else{
                                                value.number = '';
                                                value.per = '';
                                                value.minimum = '';
                                                value.maximum = '';
                                                //{"flexiblePer":20,"flexible":true,"id":111,"number":50,"minimum":40,"maximum":60,"percentage":50}
                                                if(value.fieldName == "Race" || value.fieldName == "Gender" || value.fieldName == "Relationship" || value.fieldName == "Employment" || value.fieldName == "Education" || value.fieldName == "Device" || value.fieldName == "raceBera" || value.fieldName == "hispanic") {
                                                    for(var i in $scope.selectedModel){
                                                        delete($scope.selectedModel[i].number);
                                                        delete($scope.selectedModel[i].percentage);
                                                        delete($scope.selectedModel[i].minimum);
                                                        delete($scope.selectedModel[i].maximum);
                                                        delete($scope.selectedModel[i].flexiblePer);
                                                        delete($scope.selectedModel[i].flexible);
                                                        delete($scope.selectedModel[i].hasValidQuotas);
                                                
                                                        //PD-961
                                                        if(_.has($scope.selectedModel[i], "condditionGroup")) {
                                                            $scope.selectedModel.splice(i, 1);
                                                        }
                                                    }
                                                    for(var i in $scope.options){
                                                        $scope.options[i].number = '';
                                                        $scope.options[i].percentage = '';
                                                        $scope.options[i].minimum = '';
                                                        $scope.options[i].maximum = '';
                                                        $scope.options[i].flexiblePer = '';
                                                        $scope.options[i].flexible = '';
                                                        $scope.options[i].per = '';
                                                    }
                                                    resetQuotaFlag(value);
                                                    $scope.deleteGroupingQuotas();
                                                }
                                                if(value.fieldName == "Children") {
                                                    $scope.childDataClear();
                                                    // For sltChildren
                                                    for(var i in $scope.options){
                                                        $scope.options[i].number = '';
                                                        $scope.options[i].percentage = '';
                                                        $scope.options[i].minimum = '';
                                                        $scope.options[i].maximum = '';
                                                        $scope.options[i].flexiblePer = '';
                                                        $scope.options[i].flexible = '';
                                                        $scope.options[i].per = '';
                                                    }
                                                    // For ChildTempArr
                                                    $scope.childQuotaData.no[0]['flexPer'] = 0;
                                                    $scope.childQuotaData.no[0]['minimum'] = '';
                                                    $scope.childQuotaData.no[0]['maximum'] = '';
                                                    $scope.childQuotaData.no[0]['number'] = '';
                                                    $scope.childQuotaData.no[0]['per'] = '';
                                                    $scope.childQuotaData.no[0]['percentage'] = '';
                                                    _.each($scope.childQuotaData.have, function(item, index){
                                                        if(index != 0){
                                                            $scope.childQuotaData.have.splice(index, 1);
                                                        }
                                                    });
                                                    $scope.childrenQuota = false;
                                                    
                                                }
                                                $scope.editFlag = false;
                                            }
                                            stopAngularForEachLoop = true;
                                        }else{
                                            stopAngularForEachLoop = true;
                                        }
                                    }
                                });
                               
                        }
                        //PD - 374 end
                        angular.forEach($scope.options, function (value) {
                             if(uncheckconfirm === false){
                                    if(value.id == id){
                                       value.selected = false; 
                                    }
                                       value.number = '';
                                       value.per = '';
                                       value.minimum = '';
                                       value.maximum = '';
                                       $scope.editFlag = false;
                                       resetQuotaFlag(value);
                                        for(var i in $scope.selectedModel){
                                            delete($scope.selectedModel[i].number);
                                            delete($scope.selectedModel[i].percentage);
                                            delete($scope.selectedModel[i].minimum);
                                            delete($scope.selectedModel[i].maximum);
                                            delete($scope.selectedModel[i].flexiblePer);
                                            delete($scope.selectedModel[i].flexible);
                                            delete($scope.selectedModel[i].hasValidQuotas);
                                        }
                             }
                           if(value.id == 112 && value.name == "Have Children" && value.selected == false){
                            $scope.chldrnFlag = false;
                           }
                           
                            if(value.selected == true){
                               var lth = $scope.selectedModel.length-1;
                           //     value.number = parseInt($scope.numberCompletes/lth);
                           //     value.per = parseInt((value.number * 100)/$scope.numberCompletes);
                               tmp = parseInt(tmp + parseInt($scope.numberCompletes/lth));
                                value.totalRem = $scope.numberCompletes - tmp;
                            }
                        });
                        if(uncheckconfirm == false){
                            $scope.selectedModel.splice(_.findIndex($scope.selectedModel, findObj), 1);
                            $scope.externalEvents.onItemDeselect(findObj);
                        }
                    } else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
                        //PD - 374
                         if($scope.liveSurveyEditingStep !== 'editStep1'){
                            _.each($scope.options, function(value){
                                if(value.id === id){
                                    value.selected = true;
                                }
                            })
                         }
                        var stopAngularForEachLoop = false;
                        var total_Qty = 0; 
                        if($scope.liveSurveyEditingStep == 'editStep1'){
                                for(var i in $scope.options){
                                    if($scope.options[i].number != undefined && $scope.options[i].number != null && $scope.options[i].number != ''){
                                        total_Qty = total_Qty + $scope.options[i].number;
                                    }
                                }
                                
                                angular.forEach($scope.options, function(value){
                                    if(stopAngularForEachLoop == false){
                                        if (total_Qty !== $scope.numberCompletes){ 
                                            _.each($scope.options , function(value){
                                                if(value.id == id){
                                                    value.selected = true;
                                                }
                                            })
                                        }    
                                        if(total_Qty === $scope.numberCompletes){
                                            if(!confirm("Modifying the qualifications will delete the current quotas")) {
                                                uncheckconfirm = true;
                                                stopAngularForEachLoop = true;
                                                return false;
                                            }else{
                                              
                                                value.number = '';
                                                value.per = '';
                                                value.minimum = '';
                                                value.maximum = '';
                                               
                                                //{"flexiblePer":20,"flexible":true,"id":111,"number":50,"minimum":40,"maximum":60,"percentage":50}
                                                if(value.fieldName == "Race" || value.fieldName == "Gender" || value.fieldName == "Relationship" || value.fieldName == "Employment" || value.fieldName == "Education" || value.fieldName == "Device" || value.fieldName == "raceBera" || value.fieldName == "hispanic") {
                                                    for(var i in $scope.selectedModel){
                                                        delete($scope.selectedModel[i].number);
                                                        delete($scope.selectedModel[i].percentage);
                                                        delete($scope.selectedModel[i].minimum);
                                                        delete($scope.selectedModel[i].maximum);
                                                        delete($scope.selectedModel[i].flexiblePer);
                                                        delete($scope.selectedModel[i].flexible);
                                                        delete($scope.selectedModel[i].hasValidQuotas);
                                                    }
                                                    for(var i in $scope.options){
                                                        $scope.options[i].number = '';
                                                        $scope.options[i].percentage = '';
                                                        $scope.options[i].minimum = '';
                                                        $scope.options[i].maximum = '';
                                                        $scope.options[i].flexiblePer = '';
                                                        $scope.options[i].flexible = '';
                                                        $scope.options[i].per = '';
                                                        if($scope.options[i].id == id){
                                                           $scope.options[i].selected = true; 
                                                        }
                                                    }
                                                    /*used to set has quota flag false*/
                                                    resetQuotaFlag(value);
                                                    //$scope.raceQuota = false;
                                                }
                                                
                                                if(value.fieldName == "Children") {
                                                    for(var i in $scope.childrenModel){
                                                        delete($scope.childrenModel[i].number);
                                                        delete($scope.childrenModel[i].percentage);
                                                        delete($scope.childrenModel[i].minimum);
                                                        delete($scope.childrenModel[i].maximum);
                                                        delete($scope.childrenModel[i].flexiblePer);
                                                        delete($scope.childrenModel[i].flexible);
                                                        delete($scope.selectedModel[i].hasValidQuotas);
                                                    }
                                                    for(var i in $scope.options){
                                                        $scope.options[i].number = '';
                                                        $scope.options[i].percentage = '';
                                                        $scope.options[i].minimum = '';
                                                        $scope.options[i].maximum = '';
                                                        $scope.options[i].flexiblePer = '';
                                                        $scope.options[i].flexible = '';
                                                        $scope.options[i].per = '';
                                                    }
                                                    $scope.childrenQuota = false;
                                                    
                                                }
                                                $scope.editFlag = false;
                                            }
                                            stopAngularForEachLoop = true;
                                        }else{
                                            stopAngularForEachLoop = true;
                                        }
                                    }
                                });
                                
                        }
                        //PD - 374 end
                        if(uncheckconfirm === false){
                            if(_.findWhere($scope.selectedModel ,{'hasValidQuotas': true})){
                                for(var i in $scope.selectedModel){
                                    delete($scope.selectedModel[i].number);
                                    delete($scope.selectedModel[i].percentage);
                                    delete($scope.selectedModel[i].minimum);
                                    delete($scope.selectedModel[i].maximum);
                                    delete($scope.selectedModel[i].flexiblePer);
                                    delete($scope.selectedModel[i].flexible);
                                    delete($scope.selectedModel[i].hasValidQuotas);
                                }
                                _.each($scope.options, function(value){
                                    if(value.id == id){
                                        value.selected = true;
                                    }
                                    value.number = '';
                                    value.per = '';
                                    value.minimum = '';
                                    value.maximum = '';
                                    $scope.editFlag = false;
                                    resetQuotaFlag(value);
                                });
                            }
                            $scope.selectedModel.push(finalObj);
                            $scope.externalEvents.onItemSelect(finalObj);

                        }
                    }
                    if ($scope.settings.closeOnSelect) $scope.open = false;
                };

                $scope.isChecked = function (id) {
                    if ($scope.singleSelection) {
                        return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp]) && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
                    }

                    return _.findIndex($scope.selectedModel, getFindObj(id)) !== -1;
                };


                $scope.externalEvents.onInitDone();


                $scope.checkAll = function(){
                    var flag= false;
                     angular.forEach($scope.options, function (value) {
                        if( value.selected == false){
                            flag=true;
                        } 
                        //PD-1130
                        if(_.has(value, "hasCensusRepoQuota") && value.hasCensusRepoQuota) {
                            flag=true;
                        }  
                     });
                     if(flag == false){
                        $scope.options.totalRem = $scope.numberCompletes;
                        $scope.selectAll();
                     }   

                };
                //PD-961
                $scope.deleteGroupingQuotas = function() {
                    if($scope.deleteRace) {
                        if($scope.removeGrouping && _.has($scope.removeGrouping, "race")) {
                          delete $scope.removeGrouping.race;  
                        }
                        
                        removeGroupSelection();
                    }

                     if($scope.deleteRelation) {
                        if($scope.removeGrouping && _.has($scope.removeGrouping, "relationships")) {
                          delete $scope.removeGrouping.relationships;  
                        }
                        removeGroupSelection();
                    }

                    if($scope.deleteEmployment) {
                         if($scope.removeGrouping && _.has($scope.removeGrouping, "employments")) {
                          delete $scope.removeGrouping.employments;  
                        }
                        removeGroupSelection();
                    }

                    if($scope.deleteEducation) {
                        if($scope.removeGrouping && _.has($scope.removeGrouping, "educations")) {
                          delete $scope.removeGrouping.educations;  
                        }
                        removeGroupSelection();
                    }
                    if($scope.deleteRacebera) {
                        if($scope.removeGrouping && _.has($scope.removeGrouping, "raceBera")) {
                          delete $scope.removeGrouping.raceBera;  
                        }
                        removeGroupSelection();
                    }

                    if($scope.deleteDevice) {
                        if($scope.removeGrouping && _.has($scope.removeGrouping, "device")) {
                          delete $scope.removeGrouping.device;  
                        }
                        removeGroupSelection();
                    }
                    //End Delete Grouping on Deselect
                }

                function removeGroupSelection() {
                    _.each($scope.options, function(value) {
                        if(_.has(value, "setGrupActive")) {
                            value.setGrupActive = false;
                        }
                    })
                }
                /*Function to Enable Census Repo on check/Unceck and Remove Grouping*/
                $scope.handleCensusAndGrouping = function(quota_name) {
                    if(quota_name == "raceModal") {
                        $scope.censusRace = false;
                        $scope.deleteGroupingQuotas();
                    }
                    else if(quota_name == "genderModal") {
                        $scope.censusGender = false;
                    }
                    else if(quota_name == "rbModal") {
                        $scope.deleteGroupingQuotas();
                    }
                    else if(quota_name == "hispanicModal") {
                       $scope.censusHispanic = false; 
                    }
                    else if(quota_name == "rlnModal") {
                      $scope.deleteGroupingQuotas();  
                    }
                    else if(quota_name == "empModal") {
                      $scope.deleteGroupingQuotas();  
                      $scope.censusEmployment = false;
                    }
                    else if(quota_name == "eduModal") {
                        $scope.censusEducation = false;
                        $scope.deleteGroupingQuotas();
                    }
                    else if(quota_name == "empModal") {
                        $scope.censusEmployment = false;
                    }
                    else {
                        if(quota_name =="dvcModal") {
                            $scope.deleteGroupingQuotas();
                        }
                    }
                }
            }
        };
    }]);
